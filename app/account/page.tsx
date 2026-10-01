import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient, getCurrentProfile } from '@/lib/supabase/server'
import { AccountWorkspace } from '@/components/account/account-workspace'

export const metadata: Metadata = {
  title: 'Your Sora profile',
  description: 'Manage your Sora profile and uploaded documents.',
}

export default async function AccountPage() {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')

  if (profile.role === 'admin' && profile.status === 'approved') redirect('/admin')
  if (profile.role === 'employer' && profile.status === 'approved') redirect('/employer')

  let cvPath: string | null = null
  let pwdDetails = null
  let pwdDocuments: Array<{ id: string; document_type: 'cv' | 'qualification'; file_name: string; created_at: string }> = []
  let employerDetails = null
  if (profile.role === 'pwd') {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase
      .from('pwd_profiles')
      .select('headline, category, skills, disability, accommodations, work_mode, experience_years, availability, summary, pwd_id, cv_path')
      .eq('user_id', profile.id)
      .maybeSingle()
    cvPath = data?.cv_path ?? null
    pwdDetails = data
    const { data: documents } = await supabase
      .from('pwd_documents')
      .select('id, document_type, file_name, created_at')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
    pwdDocuments = documents ?? []
  } else if (profile.role === 'employer') {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase
      .from('employer_profiles')
      .select('organization_name, organization_type, website, organization_state, recruiter_job_title, accessibility_support')
      .eq('user_id', profile.id)
      .maybeSingle()
    employerDetails = data
  }

  return <AccountWorkspace profile={{ ...profile, cv_path: cvPath, pwd_details: pwdDetails, pwd_documents: pwdDocuments, employer_details: employerDetails }} />
}