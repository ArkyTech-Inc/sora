import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="bg-navy text-navy-foreground hover:bg-navy/90" nativeButton={false} render={<Link href="/signup/pwd" />}>Create a PWD profile</Button>
          <Button variant="outline" className="border-orange-foreground/40 bg-transparent text-orange-foreground hover:bg-orange-foreground/10" nativeButton={false} render={<Link href="/signup/employer" />}>Sign up as an employer</Button>
        </div>
      </div>
    </section>
  )
}
