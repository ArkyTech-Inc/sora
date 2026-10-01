import { Resend } from 'resend'

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]!)
}

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) throw new Error('Resend email configuration is missing.')

  const { error } = await new Resend(apiKey).emails.send({ from, to: [to], subject, html })
  if (error) throw new Error(`Resend delivery failed: ${error.message}`)
}

export async function sendWelcomeEmail(email: string, fullName: string, role: 'pwd' | 'employer') {
  const subject = role === 'employer'
    ? 'Your employer account has been submitted to Sora'
    : 'Welcome to Sora — your profile is ready'

  const message = role === 'employer'
    ? 'Your employer application has been received and is now awaiting approval from the Sora admin team.'
    : 'Your profile has been created and is awaiting verification by the Sora team. You can log in, complete your documents, and track your profile status.'

  await sendEmail({
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
        <h2 style="margin-bottom: 16px;">Hi ${escapeHtml(fullName)},</h2>
        <p style="line-height: 1.6;">${message}</p>
        <p style="line-height: 1.6;">Thank you for choosing Sora.</p>
        <p style="line-height: 1.6;">The Sora team will be in touch as needed.</p>
      </div>
    `,
  })
}

export async function sendEmployerStatusEmail(email: string, fullName: string, status: 'approved' | 'rejected') {
  const subject = status === 'approved'
    ? 'Your Sora employer account has been approved'
    : 'Your Sora employer account was not approved'

  const message = status === 'approved'
    ? 'Your employer account has been approved. You can now log in and access the verified talent pool.'
    : 'Your employer application has been reviewed, and it was not approved at this time. Please contact the Sora admin team if you need guidance.'

  await sendEmail({
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
        <h2 style="margin-bottom: 16px;">Hi ${escapeHtml(fullName)},</h2>
        <p style="line-height: 1.6;">${message}</p>
      </div>
    `,
  })
}

export async function sendPwdStatusEmail(email: string, fullName: string, status: 'approved' | 'rejected') {
  const message = status === 'approved'
    ? 'Your Sora profile has been verified. You can now apply to verified employers and use the full PWD workspace.'
    : 'Your Sora profile was not verified at this time. Sign in to review your profile and contact the Sora team for guidance.'
  await sendEmail({
    to: email,
    subject: status === 'approved' ? 'Your Sora profile is verified' : 'An update about your Sora profile',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
        <h2 style="margin-bottom: 16px;">Hi ${escapeHtml(fullName)},</h2>
        <p style="line-height: 1.6;">${escapeHtml(message)}</p>
      </div>
    `,
  })
}

export async function sendAdminReviewNotification(email: string, fullName: string, organizationName: string) {
  await sendEmail({
    to: email,
    subject: 'New employer account pending review',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
        <h2 style="margin-bottom: 16px;">New employer application</h2>
        <p style="line-height: 1.6;">${escapeHtml(fullName)} has submitted a new employer account for ${escapeHtml(organizationName)}.</p>
        <p style="line-height: 1.6;">Please review and approve or reject the account from the admin dashboard.</p>
      </div>
    `,
  })
}

export async function sendAdminPwdReviewNotification(email: string, fullName: string) {
  await sendEmail({
    to: email,
    subject: 'New PWD profile pending verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
        <h2 style="margin-bottom: 16px;">PWD verification review</h2>
        <p style="line-height: 1.6;">${escapeHtml(fullName)} has created a PWD profile and is waiting for verification.</p>
        <p style="line-height: 1.6;">Review the profile in the Sora admin dashboard.</p>
      </div>
    `,
  })
}

export async function sendEmployerApplicationEmail(
  email: string,
  employerName: string,
  candidateName: string,
  role: string,
) {
  await sendEmail({
    to: email,
    subject: `${candidateName} applied for ${role} through Sora`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
        <h2 style="margin-bottom: 16px;">New application for ${escapeHtml(employerName)}</h2>
        <p style="line-height: 1.6;"><strong>${escapeHtml(candidateName)}</strong> has applied for the <strong>${escapeHtml(role)}</strong> opportunity through Sora.</p>
        <p style="line-height: 1.6;">Sign in to your approved employer workspace to review the candidate profile and follow up.</p>
      </div>
    `,
  })
}

export async function sendPwdInterestEmail(email: string, candidateName: string, employerName: string) {
  await sendEmail({
    to: email,
    subject: `${employerName} is interested in your Sora profile`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
        <h2 style="margin-bottom: 16px;">Your profile received interest</h2>
        <p style="line-height: 1.6;">Hi ${escapeHtml(candidateName)}, ${escapeHtml(employerName)} has expressed interest in your profile.</p>
        <p style="line-height: 1.6;">Sign in to Sora to review your dashboard and follow up with the verified employer.</p>
      </div>
    `,
  })
}

export async function sendApplicationStatusEmail(
  email: string,
  candidateName: string,
  employerName: string,
  role: string,
  status: 'reviewing' | 'closed',
) {
  const message = status === 'reviewing'
    ? `${employerName} is reviewing your application for ${role}.`
    : `${employerName} has closed your application for ${role}.`
  await sendEmail({
    to: email,
    subject: `Application update from ${employerName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
        <h2 style="margin-bottom: 16px;">Application update</h2>
        <p style="line-height: 1.6;">Hi ${escapeHtml(candidateName)}, ${escapeHtml(message)}</p>
        <p style="line-height: 1.6;">Sign in to Sora to see the latest status.</p>
      </div>
    `,
  })
}

export async function sendWaitlistEmail(email: string, name: string) {
  await sendEmail({
    to: email,
    subject: "You're on the Sora waitlist",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0f172a;">
        <h2>Welcome to Sora, ${escapeHtml(name)}!</h2>
        <p>Your profile has been recorded and you have secured a place on our waitlist.</p>
        <p>We will email you when priority access opens.</p>
        <p style="font-size: 12px; color: #64748b;">Sora Platform — Inclusive jobs and adaptive skills for PWDs in Nigeria.</p>
      </div>
    `,
  })
}
