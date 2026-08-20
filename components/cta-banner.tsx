import { Button } from '@/components/ui/button'
import { RegisterDialog } from '@/components/register-dialog'

export function CtaBanner() {
  return (
    <section className="bg-orange text-orange-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-14 text-center sm:px-6 lg:px-8">
        <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Ready to build your future? Register now.
        </h2>
        <p className="max-w-2xl text-pretty text-lg text-orange-foreground/90">
          Create your accessibility-aware profile in minutes and get matched
          with inclusive employers across Nigeria.
        </p>
      </div>
    </section>
  )
}
