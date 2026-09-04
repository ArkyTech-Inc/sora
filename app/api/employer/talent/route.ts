import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })

  const { data: account } = await supabase.from('profiles').select('role, status').eq('id', user.id).single()
  if (account?.role !== 'employer' || account.status !== 'approved') {
    return NextResponse.json({ error: 'An approved employer account is required.' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('pwd_directory')
    .select('user_id, headline, category, skills, disability, accommodations, work_mode, experience_years, availability, summary, state')

  if (error) {
    console.error('Talent directory error:', error)
    return NextResponse.json({ error: 'Unable to load the talent directory.' }, { status: 500 })
  }

  return NextResponse.json({ candidates: data || [] })
}