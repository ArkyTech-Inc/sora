import { NextResponse } from 'next/server'
import { sendEmployerStatusEmail, sendPwdStatusEmail } from '@/lib/resend'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .maybeSingle()

  if (!adminProfile || adminProfile.role !== 'admin' || adminProfile.status !== 'approved') {
    return NextResponse.json({ error: 'Forbidden: admin access required.' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select(
      'id, role, full_name, email, phone, state, status, created_at, employer_profiles(*), pwd_profiles(*)',
    )
    .in('role', ['employer', 'pwd'])
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Admin approval list error:', error)
    return NextResponse.json({ error: 'Unable to load employer review queue.' }, { status: 500 })
  }

  return NextResponse.json({ applications: data ?? [] })
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .maybeSingle()

  if (!adminProfile || adminProfile.role !== 'admin' || adminProfile.status !== 'approved') {
    return NextResponse.json({ error: 'Forbidden: admin access required.' }, { status: 403 })
  }

  const body = (await request.json()) as { userId?: string; decision?: 'approved' | 'rejected' }
  const decision = body.decision
  const targetId = body.userId

  if (!targetId || (decision !== 'approved' && decision !== 'rejected')) {
    return NextResponse.json({ error: 'A valid user ID and decision are required.' }, { status: 400 })
  }

  const { data: targetProfile, error: lookupError } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('id', targetId)
    .maybeSingle()

  if (lookupError || !targetProfile) {
    return NextResponse.json({ error: 'Target profile not found.' }, { status: 404 })
  }

  if (targetProfile.role !== 'employer' && targetProfile.role !== 'pwd') {
    return NextResponse.json({ error: 'Only employer and PWD accounts can be reviewed here.' }, { status: 400 })
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ status: decision })
    .eq('id', targetId)

  if (updateError) {
    console.error('Approval update error:', updateError)
    return NextResponse.json({ error: 'Unable to update employer status.' }, { status: 500 })
  }

  let emailSent = true
  try {
    if (targetProfile.role === 'employer') {
      await sendEmployerStatusEmail(targetProfile.email, targetProfile.full_name, decision)
    } else {
      await sendPwdStatusEmail(targetProfile.email, targetProfile.full_name, decision)
    }
  } catch (emailError) {
    emailSent = false
    console.error('Employer status email delivery error:', emailError)
  }

  return NextResponse.json({ success: true, status: decision, emailSent })
}
