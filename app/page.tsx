import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { LearnSection } from '@/components/learn-section'
import { JobBoard } from '@/components/job-board'
import { Testimonials } from '@/components/testimonials'
import { CtaBanner } from '@/components/cta-banner'
import { SiteFooter } from '@/components/site-footer'
import { AccessibilityToolbar } from '@/components/accessibility-toolbar'

export default function Page() {
  return (
    <>
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-orange focus:px-4 focus:py-2 focus:font-semibold focus:text-orange-foreground"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <LearnSection />
        <JobBoard />
        <Testimonials />
        <CtaBanner />
      </main>
      <SiteFooter />
      <AccessibilityToolbar />
    </>
  )
}
