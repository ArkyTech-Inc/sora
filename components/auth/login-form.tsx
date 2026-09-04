'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createSupabaseBrowserClient()
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
      if (loginError) throw loginError
      router.push('/account')
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to log in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
      {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="flex flex-col gap-2">
        <Label htmlFor="login-email">Email address</Label>
        <Input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="login-password">Password</Label>
        <Input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />
      </div>
      <Button type="submit" disabled={loading} className="mt-2 h-10 bg-orange font-semibold text-orange-foreground hover:bg-orange/90">
        {loading ? 'Logging in...' : 'Log in'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New to Sora? <Link href="/signup/pwd" className="font-semibold text-orange hover:underline">Create a PWD profile</Link>
      </p>
    </form>
  )
}