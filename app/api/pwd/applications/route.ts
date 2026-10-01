import { NextResponse } from 'next/server'
import { sendApplicationStatusEmail, sendEmployerApplicationEmail } from '@/lib/resend'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })

  const { data: account } = await supabase.from('profiles').select('role, status').eq('id', user.id).single()
  if (account?.role !== 'pwd' || account.status !== 'approved') {
    return NextResponse.json({ error: 'An approved PWD profile is required.' }, { status: 403 })
  }

  const admin = createSupabaseAdminClient()
  const { data: applications, error } = await admin
    .from('pwd_applications')
    .select('id, employer_id, role, status, created_at')
    .eq('pwd_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('PWD application list error:', error)
    return NextResponse.json({ error: 'Unable to load your applications.' }, { status: 500 })
  }

  const employerIds = [...new Set((applications ?? []).map((application) => application.employer_id))]
  if (employerIds.length === 0) return NextResponse.json({ applications: [] })

  const [{ data: employers }, { data: details }] = await Promise.all([
    admin.from('profiles').select('id, full_name, state').in('id', employerIds),
    admin.from('employer_profiles').select('user_id, organization_name, organization_type').in('user_id', employerIds),
  ])
  const employerById = new Map((employers ?? []).map((employer) => [employer.id, employer]))
  const detailById = new Map((details ?? []).map((detail) => [detail.user_id, detail]))

  return NextResponse.json({
    applications: (applications ?? []).map((application) => ({
      ...application,
      employer: employerById.get(application.employer_id) ?? null,
      organization: detailById.get(application.employer_id) ?? null,
    })),
  })
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })

  const { data: account } = await supabase.from('profiles').select('role, status, full_name').eq('id', user.id).single()
  if (account?.role !== 'pwd' || account.status !== 'approved') {
    return NextResponse.json({ error: 'An approved PWD profile is required.' }, { status: 403 })
  }

  const body = await request.json() as { employerId?: string; role?: string }
  if (!body.employerId || !body.role?.trim()) {
    return NextResponse.json({ error: 'An employer and role are required.' }, { status: 400 })
  }

  const admin = createSupabaseAdminClient()
  const { data: employer } = await admin
    .from('profiles')
    .select('id, email, full_name')
    .eq('id', body.employerId)
    .eq('role', 'employer')
    .eq('status', 'approved')
    .maybeSingle()

  if (!employer) return NextResponse.json({ error: 'Verified employer not found.' }, { status: 404 })

  const { error } = await admin.from('pwd_applications').insert({
    pwd_id: user.id,
    employer_id: employer.id,
    role: body.role.trim(),
    status: 'submitted',
  })
  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'You have already applied for this opportunity.' }, { status: 409 })
    }
    console.error('PWD application error:', error)
    return NextResponse.json({ error: 'Unable to submit your application.' }, { status: 500 })
  }

  let emailSent = true
  try {
    await sendEmployerApplicationEmail(employer.email, employer.full_name, account.full_name, body.role.trim())
  } catch (emailError) {
    emailSent = false
    console.error('Employer application notification error:', emailError)
  }
  return NextResponse.json({ success: true, emailSent })
}

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })

  const { data: account } = await supabase.from('profiles').select('role, status').eq('id', user.id).single()
  if (account?.role !== 'employer' || account.status !== 'approved') {
    return NextResponse.json({ error: 'An approved employer account is required.' }, { status: 403 })
  }

  const body = await request.json() as { applicationId?: string; status?: 'reviewing' | 'closed' }
  if (!body.applicationId || (body.status !== 'reviewing' && body.status !== 'closed')) {
    return NextResponse.json({ error: 'A valid application and status are required.' }, { status: 400 })
  }

  const admin = createSupabaseAdminClient()
  const { data: application, error } = await admin
    .from('pwd_applications')
    .update({ status: body.status })
    .eq('id', body.applicationId)
    .eq('employer_id', user.id)
    .select('id, pwd_id, role, status')
    .maybeSingle()

  if (error || !application) {
    if (error) console.error('Employer application update error:', error)
    return NextResponse.json({ error: 'Application not found or could not be updated.' }, { status: 404 })
  }

  const [{ data: candidate }, { data: employer }] = await Promise.all([
    admin.from('profiles').select('full_name, email').eq('id', application.pwd_id).maybeSingle(),
    admin.from('employer_profiles').select('organization_name').eq('user_id', user.id).maybeSingle(),
  ])
  let emailSent = true
  if (candidate && employer) {
    try {
      await sendApplicationStatusEmail(candidate.email, candidate.full_name, employer.organization_name, application.role, application.status as 'reviewing' | 'closed')
    } catch (emailError) {
      emailSent = false
      console.error('PWD application status email error:', emailError)
    }
  }

  return NextResponse.json({ success: true, status: application.status, emailSent })
}