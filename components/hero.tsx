import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RegisterDialog } from '@/components/register-dialog'

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-navy text-navy-foreground"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-mint px-3 py-1 text-sm font-medium text-mint-foreground">
            Technology Without Barriers · NCC Hackathon 2026
          </span>
          <h1 className="text-balance font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Unlocking Your Potential: A Job &amp; Skills Platform Tailored for
            Persons with Disabilities in Nigeria.
          </h1>
          <p className="max-w-xl text-pretty text-lg leading-relaxed text-navy-foreground/80">
            From adaptive upskilling to matched job placement—build a career
            that fits <span className="font-semibold text-orange">you</span>.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <RegisterDialog
              trigger={
                <Button
                  size="lg"
                  className="bg-orange font-semibold text-orange-foreground hover:bg-orange/90"
                >
                  Create Your Profile
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              }
            />
            <a
              href="#jobs"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-navy-foreground/30 px-6 text-base font-medium text-navy-foreground transition-colors hover:bg-navy-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              Explore Open Roles
            </a>
            <a
              href="#"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-navy-foreground/30 px-6 text-base font-medium text-navy-foreground transition-colors hover:bg-navy-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              COMING SOON!!
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl border border-navy-foreground/10 shadow-2xl">
            <Image
              src="/images/hero-collaboration.png"
              alt="Diverse Nigerian professionals with disabilities collaborating in a modern tech office, including a wheelchair user at a laptop, a visually impaired colleague, and a colleague signing."
              width={720}
              height={540}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
