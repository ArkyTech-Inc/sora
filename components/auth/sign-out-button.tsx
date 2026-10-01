'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  async function signOut() {
    setError(null)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
      router.replace('/')
      router.refresh()
    } catch {
      setError('Unable to log out. Please try again.')
    }
  }

  return (
    <div>
      <Button variant="outline" className={className} onClick={signOut}>
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Log out
      </Button>
      {error && <p role="alert" className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  )
}