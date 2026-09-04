import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/supabase/server'
import { AccountWorkspace } from '@/components/account/account-workspace'

export const metadata: Metadata = {
  title: 'Your Sora profile',
  description: 'Manage your Sora profile and uploaded documents.',
}

export default async function AccountPage() {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')

  return <AccountWorkspace profile={profile} />
}