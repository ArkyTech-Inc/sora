import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendWaitlistEmail } from '@/lib/resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

    let emailSent = true
    try {
      await sendWaitlistEmail(email, name)
    } catch (emailError) {
      emailSent = false
      console.error('Waitlist email delivery error:', emailError)
    }

    return NextResponse.json({ success: true, emailSent })
  } catch (err: any) {
    console.error('Waitlist submission error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to submit registration.' },
      { status: 500 }
    )
  }
}