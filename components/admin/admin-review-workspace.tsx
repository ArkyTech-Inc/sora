'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

type AccountApplication = {
  id: string
  role: 'employer' | 'pwd'
  full_name: string
  email: string
  phone: string | null
  state: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  employer_profiles?: Array<{
    organization_name?: string | null
    organization_type?: string | null
    website?: string | null
    recruiter_job_title?: string | null
    accessibility_support?: string | null
  }>
  pwd_profiles?: Array<{
    headline?: string | null
    category?: string | null
    skills?: string[] | null
    disability?: string | null
    pwd_id?: string | null
    summary?: string | null
  }>
}

export function AdminReviewWorkspace() {
  const [applications, setApplications] = useState<AccountApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [workingId, setWorkingId] = useState<string | null>(null)

  async function loadApplications() {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/approvals')
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to load applications.')
      setApplications(result.applications ?? [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load applications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadApplications()
  }, [])

  async function updateStatus(userId: string, decision: 'approved' | 'rejected') {
    setWorkingId(userId)
    setError(null)

    try {
      const response = await fetch('/api/admin/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, decision }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to update account status.')
      await loadApplications()
      if (result.emailSent === false) {
        setError(`Account status was updated, but Resend could not deliver the email notification. ${result.emailError || ''}`.trim())
      }
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update account status.')
    } finally {
      setWorkingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-mint px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">Admin Console</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-foreground">Account verification queue</h1>
        </header>

        {error && <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        {loading ? (
          <p className="rounded-xl border border-border bg-background p-6 text-sm text-muted-foreground">Loading accounts…</p>
        ) : applications.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">No employer or PWD accounts are waiting for review.</p>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => {
              const employer = application.employer_profiles?.[0]
              const pwd = application.pwd_profiles?.[0]
              return (
                <article key={application.id} className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h2 className="font-display text-xl font-bold text-foreground">{application.full_name}</h2>
                        <span className="rounded-md bg-orange/10 px-2 py-1 text-[10px] font-semibold uppercase text-orange">{application.role}</span>
                        <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground">{application.status}</span>
                      </div>

                      <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                        <p><span className="font-medium text-foreground">Email:</span> {application.email}</p>
                        <p><span className="font-medium text-foreground">Phone:</span> {application.phone || '—'}</p>
                        <p><span className="font-medium text-foreground">State:</span> {application.state || '—'}</p>
                        <p><span className="font-medium text-foreground">Submitted:</span> {new Date(application.created_at).toLocaleDateString()}</p>
                      </div>

                      {application.role === 'employer' ? (
                        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
                          <p><span className="font-medium text-foreground">Organization:</span> {employer?.organization_name || '—'}</p>
                          <p><span className="font-medium text-foreground">Type:</span> {employer?.organization_type || '—'}</p>
                          <p><span className="font-medium text-foreground">Website:</span> {employer?.website || '—'}</p>
                          <p><span className="font-medium text-foreground">Recruiter role:</span> {employer?.recruiter_job_title || '—'}</p>
                          <p><span className="font-medium text-foreground">Accessibility support:</span> {employer?.accessibility_support || '—'}</p>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
                          <p><span className="font-medium text-foreground">Headline:</span> {pwd?.headline || '—'}</p>
                          <p><span className="font-medium text-foreground">Category:</span> {pwd?.category || '—'}</p>
                          <p><span className="font-medium text-foreground">Disability:</span> {pwd?.disability || '—'}</p>
                          <p><span className="font-medium text-foreground">N-PWDID:</span> {pwd?.pwd_id || 'Not provided'}</p>
                          <p><span className="font-medium text-foreground">Skills:</span> {pwd?.skills?.join(', ') || '—'}</p>
                          {pwd?.summary && <p className="mt-2">{pwd.summary}</p>}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {application.status !== 'pending' && (
                        <Button
                          variant="outline"
                          onClick={() => void updateStatus(application.id, application.status as 'approved' | 'rejected')}
                          disabled={workingId === application.id}
                        >
                          Resend decision email
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => void updateStatus(application.id, 'rejected')}
                        disabled={workingId === application.id || application.status === 'rejected'}
                      >
                        {workingId === application.id ? 'Updating…' : 'Reject'}
                      </Button>
                      <Button
                        className="bg-orange text-orange-foreground hover:bg-orange/90"
                        onClick={() => void updateStatus(application.id, 'approved')}
                        disabled={workingId === application.id || application.status === 'approved'}
                      >
                        {workingId === application.id ? 'Updating…' : 'Approve'}
                      </Button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
