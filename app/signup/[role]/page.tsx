import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = {
  title: 'Create your Sora profile',
  description: 'Join Sora as an inclusive employer or PWD professional.',
}

export default async function SignupPage({
  params,
}: {
  params: Promise<{ role: string }>
}) {
  const { role } = await params
  if (role !== 'pwd' && role !== 'employer') notFound()

  const isEmployer = role === 'employer'

  return (
    <main className="min-h-screen bg-mint px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-background p-6 shadow-xl sm:p-10">
        <Link href="/" className="text-sm font-semibold text-orange hover:underline">
          Back to Sora
        </Link>
        <div className="mt-6 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange">
            {isEmployer ? 'Employer registration' : 'PWD and graduate registration'}
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {isEmployer ? 'Build an inclusive talent pipeline.' : 'Create a profile that shows what you can do.'}
          </h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {isEmployer
              ? 'Tell us about your organization. Employer accounts are reviewed before they can access the verified talent pool.'
              : 'Share your professional strengths and accessibility needs. You can add your CV and qualifications from your profile workspace.'}
          </p>
        </div>
        <SignupForm role={role} />
      </div>
    </main>
  )
}