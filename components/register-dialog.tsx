'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
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
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showPwdInput, setShowPwdInput] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [support, setSupport] = useState('')
  const [pwdId, setPwdId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, support, pwdId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setSubmitted(true)
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setErrorMsg(null)
    setLoading(false)
    setShowPwdInput(false)
    setName('')
    setEmail('')
    setSupport('')
    setPwdId('')
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) resetForm()
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
                Thanks for registering with Sora! Your profile has been recorded in our system and a confirmation email has been sent to <strong>{email}</strong> with your priority access details.
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
                <br />
                <br />
                Start with a quick, disability-aware profile so we can match you
                with inclusive employers and adaptive learning.
              </DialogDescription>
            </DialogHeader>

            {errorMsg && (
              <div className="p-3 text-xs bg-red-50 text-red-600 rounded-md border border-red-200">
                {errorMsg}
              </div>
            )}

            <form className="mt-2 flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-name">Full name</Label>
                <Input
                  id="reg-name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-email">Email address</Label>
                <Input
                  id="reg-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-pwdid">
                  National PWD ID (N-PWDID) (optional)
                </Label>
                <Input
                  id="reg-pwdid"
                  name="pwdId"
                  value={pwdId}
                  onChange={(e) => setPwdId(e.target.value)}
                  placeholder="e.g. NCPWD-2026-XXXXX"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-support">
                  Accessibility support you use (optional)
                </Label>
                <Input
                  id="reg-support"
                  name="support"
                  value={support}
                  onChange={(e) => setSupport(e.target.value)}
                  placeholder="e.g. screen reader, captions, sign language"
                />
              </div>

              {showPwdInput && (
                <div className="flex flex-col gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <Label htmlFor="reg-pwdid" className="text-green-900 font-medium">
                    National PWD ID (N-PWDID)
                  </Label>
                  <Input
                    id="reg-pwdid"
                    name="pwdId"
                    value={pwdId}
                    onChange={(e) => setPwdId(e.target.value)}
                    placeholder="e.g. NCPWD-2026-XXXXX"
                    required={showPwdInput}
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-orange font-semibold text-orange-foreground hover:bg-orange/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  'Create My Profile'
                )}
              </Button>

              {!showPwdInput && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPwdInput(true)}
                  className="w-full border-green text-green hover:bg-green/10 font-semibold"
                >
                  Sign Up with your National PWD ID (N-PWDID)
                </Button>
              )}
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}