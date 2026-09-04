import Link from 'next/link'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { SoraLogo } from '@/components/sora-logo'
import { EmployerDashboard } from '@/components/employer/employer-dashboard'
import { AccessibilityToolbar } from '@/components/accessibility-toolbar'
import { getCurrentProfile } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Employer Dashboard — Sora',
  description:
    'Browse verified Persons with Disabilities talent by skill and disability type. Profiles stay anonymous until an employer expresses interest.',
}

export default async function EmployerPage() {
  const profile = await getCurrentProfile()
  if (!profile || profile.role !== 'employer') redirect('/login')
  if (profile.status !== 'approved') redirect('/account')

  return (
    <>
      <a
        href="#talent-pool"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-orange focus:px-4 focus:py-2 focus:font-semibold focus:text-orange-foreground"
      >
        Skip to talent pool
      </a>

      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            aria-label="Sora home"
          >
            <SoraLogo className="h-8 w-8 text-orange" />
            <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
              Sora
            </span>
            <span className="ml-1 hidden rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground sm:inline">
              Employers
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden flex-col text-right sm:flex">
              <span className="text-sm font-semibold leading-tight text-foreground">
                {profile.full_name}
              </span>
              <span className="text-xs text-muted-foreground">
                {profile.email}
              </span>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </Link>
          </div>
        </div>
      </header>
      <AccessibilityToolbar />

      <main id="talent-pool">
        <EmployerDashboard employerName={profile.full_name} />
      </main>
    </>
  )
}
