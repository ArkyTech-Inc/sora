import { NextResponse } from 'next/server'
import { sendPwdInterestEmail } from '@/lib/resend'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'

async function getApprovedEmployer() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: NextResponse.json({ error: 'You must be logged in.' }, { status: 401 }) }

  const { data: account } = await supabase.from('profiles').select('role, status').eq('id', user.id).single()
  if (account?.role !== 'employer' || account.status !== 'approved') {
    return { error: NextResponse.json({ error: 'An approved employer account is required.' }, { status: 403 }) }
  }

  return { user }
}

export async function GET() {
  const auth = await getApprovedEmployer()
  if ('error' in auth) return auth.error

  const admin = createSupabaseAdminClient()
  const { data: interests, error } = await admin
    .from('employer_interests')
    .select('id, pwd_id, created_at')
    .eq('employer_id', auth.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Employer interest list error:', error)
    return NextResponse.json({ error: 'Unable to load expressed interest.' }, { status: 500 })
  }

  const pwdIds = [...new Set((interests ?? []).map((interest) => interest.pwd_id))]
  if (pwdIds.length === 0) return NextResponse.json({ interests: [] })

  const [{ data: profiles }, { data: pwdProfiles }] = await Promise.all([
    admin.from('profiles').select('id, full_name, email, phone, state').in('id', pwdIds),
    admin.from('pwd_profiles').select('user_id, headline, category, skills, summary').in('user_id', pwdIds),
  ])
  const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]))
  const pwdById = new Map((pwdProfiles ?? []).map((profile) => [profile.user_id, profile]))

  return NextResponse.json({
    interests: (interests ?? []).map((interest) => ({
      ...interest,
      candidate: profileById.get(interest.pwd_id) ?? null,
      profile: pwdById.get(interest.pwd_id) ?? null,
    })),
  })
}

export async function POST(request: Request) {
  const auth = await getApprovedEmployer()
  if ('error' in auth) return auth.error

  const body = await request.json() as { pwdId?: string }
  if (!body.pwdId) return NextResponse.json({ error: 'Candidate ID is required.' }, { status: 400 })

  const admin = createSupabaseAdminClient()
  const [{ data: candidate }, { data: existing }] = await Promise.all([
    admin.from('profiles').select('id, full_name, email').eq('id', body.pwdId).eq('role', 'pwd').eq('status', 'approved').maybeSingle(),
    admin.from('employer_interests').select('id').eq('employer_id', auth.user.id).eq('pwd_id', body.pwdId).maybeSingle(),
  ])
  if (!candidate) return NextResponse.json({ error: 'Verified PWD profile not found.' }, { status: 404 })
  if (existing) return NextResponse.json({ success: true, alreadyInterested: true, emailSent: true })

  const { error } = await admin.from('employer_interests').insert({ employer_id: auth.user.id, pwd_id: body.pwdId })
  if (error && error.code !== '23505') {
    console.error('Employer interest insert error:', error)
    return NextResponse.json({ error: 'Unable to record interest.' }, { status: 500 })
  }

  if (error?.code === '23505') return NextResponse.json({ success: true, alreadyInterested: true, emailSent: true })

  const { data: employer } = await admin.from('employer_profiles').select('organization_name').eq('user_id', auth.user.id).maybeSingle()
  let emailSent = true
  try {
    await sendPwdInterestEmail(candidate.email, candidate.full_name, employer?.organization_name || 'A verified employer')
  } catch (emailError) {
    emailSent = false
    console.error('PWD interest notification error:', emailError)
  }

  return NextResponse.json({ success: true, emailSent })
}