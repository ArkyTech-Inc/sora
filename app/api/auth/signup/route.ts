import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

type SignupBody = {
  role: 'pwd' | 'employer'
  email?: string
  password?: string
  fullName?: string
  phone?: string
  state?: string
  organizationName?: string
  organizationType?: string
  website?: string
  recruiterJobTitle?: string
  accessibilitySupport?: string
  headline?: string
  category?: string
  skills?: string[]
  disability?: string
  accommodations?: string[]
  workMode?: string
  experienceYears?: number
  availability?: string
  summary?: string
  pwdId?: string
}

function required(value: string | undefined) {
  return typeof value === 'string' && value.trim().length > 0
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignupBody
    const email = body.email?.trim().toLowerCase()

    if (
      !email ||
      !body.password ||
      body.password.length < 8 ||
      !required(body.fullName) ||
      !required(body.state) ||
      (body.role !== 'pwd' && body.role !== 'employer')
    ) {
      return NextResponse.json(
        { error: 'Complete all required fields. Passwords must be at least 8 characters.' },
        { status: 400 },
      )
    }

    if (body.role === 'employer' && (!required(body.organizationName) || !required(body.organizationType))) {
      return NextResponse.json(
        { error: 'Organization name and type are required for employer accounts.' },
        { status: 400 },
      )
    }

    if (
      body.role === 'pwd' &&
      (!required(body.headline) ||
        !required(body.category) ||
        !required(body.disability) ||
        !required(body.workMode) ||
        !required(body.availability) ||
        !required(body.summary))
    ) {
      return NextResponse.json(
        { error: 'Complete the professional and accessibility profile fields.' },
        { status: 400 },
      )
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anonKey) throw new Error('Supabase environment variables are missing.')

    const authClient = createClient(url, anonKey)
    const { data: authData, error: authError } = await authClient.auth.signUp({
      email,
      password: body.password,
    })

    if (authError || !authData.user) {
      const duplicate = authError?.message.toLowerCase().includes('already')
      return NextResponse.json(
        { error: duplicate ? 'An account with this email already exists.' : authError?.message || 'Could not create account.' },
        { status: duplicate ? 409 : 400 },
      )
    }

    const userId = authData.user.id
    const supabase = createSupabaseAdminClient()
    const status = body.role === 'employer' ? 'pending' : 'approved'
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      role: body.role,
      status,
      full_name: body.fullName!.trim(),
      email,
      phone: body.phone?.trim() || null,
      state: body.state!.trim(),
    })

    if (profileError) throw profileError

    if (body.role === 'employer') {
      const { error } = await supabase.from('employer_profiles').insert({
        user_id: userId,
        organization_name: body.organizationName!.trim(),
        organization_type: body.organizationType!.trim(),
        website: body.website?.trim() || null,
        organization_state: body.state!.trim(),
        recruiter_job_title: body.recruiterJobTitle?.trim() || null,
        accessibility_support: body.accessibilitySupport?.trim() || null,
      })
      if (error) throw error
    } else {
      const { error } = await supabase.from('pwd_profiles').insert({
        user_id: userId,
        headline: body.headline!.trim(),
        category: body.category!.trim(),
        skills: body.skills || [],
        disability: body.disability!.trim(),
        accommodations: body.accommodations || [],
        work_mode: body.workMode!.trim(),
        experience_years: Math.max(0, Number(body.experienceYears) || 0),
        availability: body.availability!.trim(),
        summary: body.summary!.trim(),
        pwd_id: body.pwdId?.trim() || null,
      })
      if (error) throw error
    }

    return NextResponse.json({ success: true, requiresEmailConfirmation: true })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Unable to create the account right now.' },
      { status: 500 },
    )
  }
}