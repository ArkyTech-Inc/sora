import { Accessibility, BookOpenCheck, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const STEPS = [
  {
    icon: Accessibility,
    title: 'Disability-Aware Profiling',
    body: 'A personalized onboarding assessment captures your unique accessibility needs and skills—so every recommendation fits how you work.',
  },
  {
    icon: BookOpenCheck,
    title: 'Adaptive Learning',
    body: 'Curriculum is dynamically formatted for screen readers, captions, and sign-language integration—learn in the format that works for you.',
  },
  {
    icon: Target,
    title: 'Targeted Job Matching',
    body: 'Connect directly with inclusive employers for remote, hybrid, or localized on-site roles across Nigeria.',
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          How It Works
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Three connected steps built around accessibility from the ground up.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {STEPS.map((step) => (
          <Card
            key={step.title}
            className="border-border transition-shadow hover:shadow-lg"
          >
            <CardHeader>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-mint text-mint-foreground">
                <step.icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <CardTitle className="mt-4 font-display text-xl">
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
