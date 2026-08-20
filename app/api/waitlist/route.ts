import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { name, email, support, pwdId } = await req.json()

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Name and email are required.' },
        { status: 400 }
      )
    }

    // 1. Insert profile into Supabase
    const { error: dbError } = await supabase.from('waitlist').insert([
      {
        full_name: name,
        email: email.toLowerCase().trim(),
        accessibility_support: support || null,
        pwd_id: pwdId || null,
      },
    ])

    if (dbError) {
      if (dbError.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already registered on the waitlist!' },
          { status: 400 }
        )
      }
      throw dbError
    }

    // 2. Send Priority Access Email via Resend
    await resend.emails.send({
      from: 'Sora <onboarding@sora.com.ng>',
      to: [email],
      subject: "You're on the Sora Waitlist — Priority Access Granted! 🚀",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0F172A;">
          <h2 style="color: #0F172A; font-size: 24px;">Welcome to Sora, ${name}! 🎉</h2>
          <p>Thank you for creating your profile with us.</p>
          <p>You have officially secured your place on our waitlist. As a registered waitlist member, you will receive <strong>priority access</strong> as soon as our platform goes live.</p>
          <div style="background-color: #F8FAFC; border-left: 4px solid #EA580C; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <p style="margin: 0; font-weight: 600;">What's next?</p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #475569;">
              We are actively matching inclusive employers with PWD talent and preparing adaptive learning modules. We will notify you directly at this email address when access opens.
            </p>
          </div>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #64748B;">Sora Platform — Inclusive Jobs & Adaptive Skills for PWDs in Nigeria.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Waitlist submission error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to submit registration.' },
      { status: 500 }
    )
  }
}