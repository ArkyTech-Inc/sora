'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SoraLogo } from '@/components/sora-logo'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#how-it-works' },
  { label: 'Learn', href: '#learn' },
  { label: 'Jobs', href: '#jobs' },
  { label: 'Support', href: '#support' },
]

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="#home"
          className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label="Sora home"
        >
          <SoraLogo className="h-8 w-8 text-orange" />
          <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
            Sora
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            className="text-foreground"
            nativeButton={false}
            render={<Link href="/employer" />}
          >
            Employer portal
          </Button>
          <Button className="bg-orange font-semibold text-orange-foreground hover:bg-orange/90" nativeButton={false} render={<Link href="/login" />}>Create PWD profile</Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-background md:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-1 p-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/login" />}
                onClick={() => setMobileOpen(false)}
              >
                Log in
              </Button>
              <Button className="w-full bg-orange font-semibold text-orange-foreground hover:bg-orange/90" nativeButton={false} render={<Link href="/signup/pwd" />} onClick={() => setMobileOpen(false)}>Create PWD profile</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
