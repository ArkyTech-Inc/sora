import { NextResponse } from 'next/server'
import { sendAdminPwdReviewNotification, sendAdminReviewNotification, sendWelcomeEmail } from '@/lib/resend'
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
  let adminClient: ReturnType<typeof createSupabaseAdminClient> | undefined
  let createdUserId: string | undefined
  let accountProvisioned = false

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

    adminClient = createSupabaseAdminClient()
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password: body.password,
      email_confirm: true,
    })

    if (authError || !authData.user) {
      const duplicate = authError?.message.toLowerCase().includes('already')
      return NextResponse.json(
        { error: duplicate ? 'An account with this email already exists.' : authError?.message || 'Could not create account.' },
        { status: duplicate ? 409 : 400 },
      )
    }

    const userId = authData.user.id
    createdUserId = userId
    const status = 'pending'
    const { error: profileError } = await adminClient.from('profiles').insert({
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
      const { error } = await adminClient.from('employer_profiles').insert({
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
      const { error } = await adminClient.from('pwd_profiles').insert({
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

    accountProvisioned = true
    const emailJobs = [sendWelcomeEmail(email, body.fullName!.trim(), body.role)]
    const adminEmail = process.env.SUPER_ADMIN_EMAIL
    if (adminEmail) {
      emailJobs.push(body.role === 'employer'
        ? sendAdminReviewNotification(adminEmail, body.fullName!.trim(), body.organizationName!.trim())
        : sendAdminPwdReviewNotification(adminEmail, body.fullName!.trim()))
    }
    const emailResults = await Promise.allSettled(emailJobs)
    const emailSent = emailResults.every((result) => result.status === 'fulfilled')
    emailResults.forEach((result) => {
      if (result.status === 'rejected') console.error('Signup email delivery error:', result.reason)
    })

    return NextResponse.json({ success: true, emailSent })
  } catch (error) {
    if (createdUserId && !accountProvisioned && adminClient) {
      const { error: cleanupError } = await adminClient.auth.admin.deleteUser(createdUserId)
      if (cleanupError) console.error('Signup rollback error:', cleanupError)
    }
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Unable to create the account right now.' },
      { status: 500 },
    )
  }
}