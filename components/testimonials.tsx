import { Quote } from 'lucide-react'

export function Testimonials() {
  return (
    <section
      id="support"
      className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24 lg:px-8"
    >
      <figure className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm md:p-12">
        <Quote
          className="mx-auto h-10 w-10 text-orange"
          aria-hidden="true"
        />
        <blockquote className="mt-6">
          <p className="text-balance font-display text-2xl font-medium leading-relaxed text-foreground md:text-3xl">
            &ldquo;Sora gave me skills I couldn&apos;t access before and
            connected me with an employer that values my abilities.&rdquo;
          </p>
        </blockquote>
        <figcaption className="mt-6 flex items-center justify-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy font-display text-lg font-bold text-navy-foreground">
            AS
          </span>
          <span className="text-left">
            <span className="block font-semibold text-foreground">Abdulhaqq Somoye</span>
            <span className="block text-sm text-muted-foreground">
              Operations Associate
            </span>
          </span>
        </figcaption>
      </figure>
    </section>
  )
}
