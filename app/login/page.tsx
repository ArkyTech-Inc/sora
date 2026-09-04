import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Log in — Sora',
  description: 'Log in to your Sora employer or PWD profile.',
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-mint px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl sm:p-8">
        <Link href="/" className="text-sm font-semibold text-orange hover:underline">
          Back to Sora
        </Link>
        <h1 className="mt-6 font-display text-3xl font-extrabold text-foreground">Welcome back</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Log in to manage your profile and access your Sora workspace.</p>
        <LoginForm />
      </div>
    </main>
  )
}