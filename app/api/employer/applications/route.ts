import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })

  const { data: account } = await supabase.from('profiles').select('role, status').eq('id', user.id).single()
  if (account?.role !== 'employer' || account.status !== 'approved') {
    return NextResponse.json({ error: 'An approved employer account is required.' }, { status: 403 })
  }

  const admin = createSupabaseAdminClient()
  const { data: applications, error } = await admin
    .from('pwd_applications')
    .select('id, pwd_id, role, status, created_at')
    .eq('employer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Employer application list error:', error)
    return NextResponse.json({ error: 'Unable to load applications.' }, { status: 500 })
  }

  const pwdIds = [...new Set((applications ?? []).map((application) => application.pwd_id))]
  if (pwdIds.length === 0) return NextResponse.json({ applications: [] })

  const [{ data: profiles }, { data: pwdProfiles }] = await Promise.all([
    admin.from('profiles').select('id, full_name, email, phone, state').in('id', pwdIds),
    admin.from('pwd_profiles').select('user_id, headline, category, skills, summary, work_mode, experience_years, availability').in('user_id', pwdIds),
  ])
  const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]))
  const pwdById = new Map((pwdProfiles ?? []).map((profile) => [profile.user_id, profile]))

  return NextResponse.json({
    applications: (applications ?? []).map((application) => ({
      ...application,
      candidate: profileById.get(application.pwd_id) ?? null,
      profile: pwdById.get(application.pwd_id) ?? null,
    })),
  })
}