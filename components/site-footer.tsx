import { SoraLogo } from '@/components/sora-logo'

const FOOTER_LINKS = [
  { label: 'Legal', href: '#' },
  { label: 'Accessibility Policy', href: '#' },
  { label: 'Learning Modules', href: '#learn' },
  { label: 'Contact Support', href: '#support' },
]

const SOCIALS = [
  { label: 'Facebook', icon: '/icons/facebook.svg', href: '#' },
  { label: 'Instagram', icon: '/icons/instagram.svg', href: '#' },
  { label: 'X (Twitter)', icon: '/icons/x.svg', href: '#' },
  { label: 'LinkedIn', icon: '/icons/linkedin.svg', href: '#' },
  { label: 'YouTube', icon: '/icons/youtube.svg', href: '#' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-navy text-navy-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <SoraLogo className="h-8 w-8 text-orange" />
              <span className="font-display text-xl font-extrabold">Sora</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-foreground/70">
              Inclusive job-matching and adaptive skills for Persons with
              Disabilities in Nigeria.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-foreground/60">
              Links
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-navy-foreground/80 transition-colors hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-foreground/60">
              Social Media
            </h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="group flex h-10 w-10 items-center justify-center rounded-full bg-navy-foreground/10 transition-colors hover:bg-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                  >
                    <span
                      aria-hidden="true"
                      className="h-5 w-5 bg-navy-foreground transition-colors group-hover:bg-orange-foreground"
                      style={{
                        maskImage: `url(${social.icon})`,
                        WebkitMaskImage: `url(${social.icon})`,
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                      }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-navy-foreground/10 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-navy-foreground/70">
            Proudly aligned with the Nigerian Communications Commission (NCC)
            Hackathon 2026 — Technology Without Barriers.
          </p>
          <p className="text-sm text-navy-foreground/60">
            &copy; {new Date().getFullYear()} Sora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
