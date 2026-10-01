import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminReviewWorkspace } from '@/components/admin/admin-review-workspace'
import { getCurrentProfile } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Admin — Sora',
  description: 'Review and approve employer applications.',
}

export default async function AdminPage() {
  const profile = await getCurrentProfile()

  if (!profile || profile.role !== 'admin' || profile.status !== 'approved') {
    redirect('/login')
  }

  return <AdminReviewWorkspace />
}
