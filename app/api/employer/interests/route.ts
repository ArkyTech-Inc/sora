import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })

  const { data: account } = await supabase.from('profiles').select('role, status').eq('id', user.id).single()
  if (account?.role !== 'employer' || account.status !== 'approved') {
    return NextResponse.json({ error: 'An approved employer account is required.' }, { status: 403 })
  }

  const body = await request.json() as { pwdId?: string }
  if (!body.pwdId) return NextResponse.json({ error: 'Candidate ID is required.' }, { status: 400 })

  const { error } = await supabase.from('employer_interests').insert({ employer_id: user.id, pwd_id: body.pwdId })
  if (error && error.code !== '23505') {
    return NextResponse.json({ error: 'Unable to record interest.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}