'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type RegisterDialogProps = {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'lg'
}

export function RegisterDialog({
  children,
  className,
  size = 'default',
}: RegisterDialogProps) {
  const [submitted, setSubmitted] = useState(false)

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) setSubmitted(false)
      }}
    >
      <DialogTrigger className={cn(buttonVariants({ size }), className)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2
              className="h-12 w-12 text-orange"
              aria-hidden="true"
            />
            <DialogHeader className="items-center">
              <DialogTitle className="font-display">
                You&apos;re on your way!
              </DialogTitle>
              <DialogDescription>
                Thanks for registering with Sora. Your profile has been recorded and we&apos;ll be in touch once we launch.
      .
              </DialogDescription>
            </DialogHeader>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                Create your Sora profile
              </DialogTitle>
              <DialogDescription>
                Join the Waitlist!
                <br/>
                <br/>
                 Start with a quick, disability-aware profile so we can match you
                with inclusive employers and adaptive learning.
              </DialogDescription>
            </DialogHeader>
            <form
              className="mt-2 flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
              }}
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-name">Full name</Label>
                <Input id="reg-name" name="name" required autoComplete="name" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-email">Email address</Label>
                <Input
                  id="reg-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-support">
                  Accessibility support you use (optional)
                </Label>
                <Input
                  id="reg-support"
                  name="support"
                  placeholder="e.g. screen reader, captions, sign language"
                />
              </div>
              <Button
                type="submit"
                className="mt-2 w-full bg-orange font-semibold text-orange-foreground hover:bg-orange/90"
              >
                Create My Profile
              </Button>
                
              <Button
                type="submit"
                className="mt-2 w-full bg-green font-semibold text-green-foreground hover:bg-green/90"
              >
                Sign Up with your National PWD ID (N-PWDID)
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}