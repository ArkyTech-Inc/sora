import { NextResponse } from 'next/server'
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
  const { data, error } = await admin
    .from('profiles')
    .select('id, full_name, state, employer_profiles(organization_name, organization_type, website, accessibility_support)')
    .eq('role', 'employer')
    .eq('status', 'approved')
    .order('full_name')

  if (error) {
    console.error('PWD employer list error:', error)
    return NextResponse.json({ error: 'Unable to load verified employers.' }, { status: 500 })
  }

  return NextResponse.json({ employers: data ?? [] })
}