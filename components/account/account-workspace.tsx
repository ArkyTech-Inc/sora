'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignOutButton } from '@/components/auth/sign-out-button'

type Profile = {
  id: string
  role: 'pwd' | 'employer' | 'admin'
  status: 'pending' | 'approved' | 'rejected'
  full_name: string
  email: string
  cv_path: string | null
  pwd_documents: Array<{
    id: string
    document_type: 'cv' | 'qualification'
    file_name: string
    created_at: string
  }>
  pwd_details: {
    headline: string
    category: string
    skills: string[]
    disability: string
    accommodations: string[]
    work_mode: string
    experience_years: number
    availability: string
    summary: string
    pwd_id: string | null
  } | null
  employer_details: {
    organization_name: string
    organization_type: string
    website: string | null
    organization_state: string | null
    recruiter_job_title: string | null
    accessibility_support: string | null
  } | null
}

type VerifiedEmployer = {
  id: string
  full_name: string
  state: string | null
  employer_profiles: Array<{
    organization_name: string
    organization_type: string
    website: string | null
    accessibility_support: string | null
  }>
}

type PwdApplication = {
  id: string
  employer_id: string
  role: string
  status: 'submitted' | 'reviewing' | 'closed'
  created_at: string
  employer: { id: string; full_name: string; state: string | null } | null
  organization: { organization_name: string; organization_type: string } | null
}

export function AccountWorkspace({ profile }: { profile: Profile }) {
  const [file, setFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState<'cv' | 'qualification'>('cv')
  const [cvUploaded, setCvUploaded] = useState(Boolean(profile.cv_path))
  const [documents, setDocuments] = useState(profile.pwd_documents)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [employers, setEmployers] = useState<VerifiedEmployer[]>([])
  const [applications, setApplications] = useState<PwdApplication[]>([])
  const [applicationStatus, setApplicationStatus] = useState<Record<string, boolean>>({})

  async function applyToEmployer(employerId: string, role: string) {
    setLoading(true)
    setMessage(null)
    try {
      const response = await fetch('/api/pwd/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employerId, role }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to submit application.')
      setApplicationStatus((current) => ({ ...current, [employerId]: true }))
      setMessage(result.emailSent === false
        ? 'Application saved. The employer notification could not be delivered.'
        : 'Application sent. The verified employer has been notified by email.')
      const applicationsResponse = await fetch('/api/pwd/applications')
      const applicationsResult = await applicationsResponse.json()
      if (applicationsResponse.ok) setApplications(applicationsResult.applications ?? [])
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to submit application.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (profile.role !== 'pwd' || profile.status !== 'approved') return
    Promise.all([fetch('/api/pwd/employers'), fetch('/api/pwd/applications')])
      .then(async ([employerResponse, applicationResponse]) => {
        const [employerResult, applicationResult] = await Promise.all([
          employerResponse.json(),
          applicationResponse.json(),
        ])
        if (!employerResponse.ok) throw new Error(employerResult.error || 'Unable to load employers.')
        if (!applicationResponse.ok) throw new Error(applicationResult.error || 'Unable to load applications.')
        setEmployers(employerResult.employers ?? [])
        setApplications(applicationResult.applications ?? [])
        setApplicationStatus(Object.fromEntries(
          (applicationResult.applications ?? []).map((application: PwdApplication) => [application.employer_id, true]),
        ))
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Unable to load your dashboard.'))
  }, [profile.role, profile.status])

  async function upload() {
    if (!file) return
    setLoading(true)
    setMessage(null)
    const body = new FormData()
    body.append('file', file)
    body.append('documentType', documentType)

    try {
      const response = await fetch('/api/profile/documents', { method: 'POST', body })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Upload failed.')
      setMessage('Document uploaded successfully.')
      if (documentType === 'cv') setCvUploaded(true)
      if (result.document) setDocuments((current) => [result.document, ...current])
      setFile(null)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-mint px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="font-display text-xl font-extrabold text-foreground">Sora</Link>
          <SignOutButton />
        </header>
        <section className="mt-8 rounded-2xl border border-border bg-background p-6 shadow-lg sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-orange">{profile.role === 'pwd' ? 'PWD profile' : 'Employer account'}</p>
              <h1 className="mt-2 font-display text-3xl font-extrabold text-foreground">Welcome, {profile.full_name}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{profile.email}</p>
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize text-foreground">{profile.status}</span>
          </div>

          {profile.role === 'pwd' && profile.status !== 'approved' && (
            <p className="mt-6 rounded-lg border border-orange/30 bg-orange/10 p-4 text-sm leading-relaxed text-foreground">
              {profile.status === 'pending'
                ? 'Your profile is waiting for Sora verification. You can complete your profile and upload documents while it is reviewed.'
                : 'Your profile is not verified. Contact Sora support for help with the review.'}
            </p>
          )}

          {profile.role === 'employer' ? (
            <div className="mt-8 rounded-xl border border-border bg-muted/50 p-5">
              <h2 className="font-display text-lg font-bold text-foreground">{profile.employer_details?.organization_name || 'Employer profile'}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{profile.employer_details?.organization_type || 'Organization'} · {profile.employer_details?.organization_state || 'Location pending'}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Your organization profile is saved. Once an administrator approves it, your employer dashboard will become available.</p>
            </div>
          ) : profile.role === 'pwd' ? (
            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-border bg-muted/50 p-5">
              <h2 className="font-display text-lg font-bold text-foreground">Your professional profile</h2>
              <p className="mt-2 text-sm text-muted-foreground">{profile.pwd_details?.headline} · {profile.pwd_details?.category}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{profile.pwd_details?.summary}</p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div><dt className="font-semibold text-foreground">Disability</dt><dd className="text-muted-foreground">{profile.pwd_details?.disability}</dd></div>
                <div><dt className="font-semibold text-foreground">Work arrangement</dt><dd className="text-muted-foreground">{profile.pwd_details?.work_mode}</dd></div>
                <div><dt className="font-semibold text-foreground">Experience</dt><dd className="text-muted-foreground">{profile.pwd_details?.experience_years} years</dd></div>
                <div><dt className="font-semibold text-foreground">Availability</dt><dd className="text-muted-foreground">{profile.pwd_details?.availability}</dd></div>
                <div className="sm:col-span-2"><dt className="font-semibold text-foreground">Workplace accommodations</dt><dd className="text-muted-foreground">{profile.pwd_details?.accommodations.join(', ') || 'None listed'}</dd></div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">{profile.pwd_details?.skills.map((skill) => <span key={skill} className="rounded-md bg-background px-2 py-1 text-xs text-foreground">{skill}</span>)}</div>
              </div>
              <div className="rounded-xl border border-border bg-muted/50 p-5">
              <h2 className="font-display text-lg font-bold text-foreground">Professional documents</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cvUploaded ? 'Your CV is uploaded. You can add a qualification document whenever you are ready.' : 'Upload your CV and qualifications. Files are stored privately and are not shown to employers before an authorized interest action.'}</p>
              {cvUploaded && <p className="mt-4 rounded-md border border-green/30 bg-green/10 p-3 text-sm text-foreground">CV uploaded successfully.</p>}
              {message && <p className="mt-4 rounded-md border border-border bg-background p-3 text-sm text-foreground">{message}</p>}
              {documents.length > 0 && <ul className="mt-4 space-y-2">{documents.map((document) => (
                <li key={document.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm">
                  <span className="font-medium text-foreground">{document.file_name}</span>
                  <span className="text-xs capitalize text-muted-foreground">{document.document_type} · {new Date(document.created_at).toLocaleDateString()}</span>
                </li>
              ))}</ul>}
              <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto]">
                <input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setFile(event.target.files?.[0] || null)} className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                <select value={documentType} onChange={(event) => setDocumentType(event.target.value as 'cv' | 'qualification')} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  <option value="cv">CV</option>
                  <option value="qualification">Qualification</option>
                </select>
              </div>
              <Button onClick={upload} disabled={!file || loading} className="mt-4 bg-orange text-orange-foreground hover:bg-orange/90">{loading ? 'Uploading...' : 'Upload document'}</Button>
              </div>
              <div className="rounded-xl border border-border bg-background p-5">
                <h2 className="font-display text-lg font-bold text-foreground">Learn and prepare</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Build confidence before you apply with accessible, self-paced career modules.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {['Building an accessible career', 'Presenting your strengths', 'Requesting workplace accommodations', 'Preparing for inclusive interviews'].map((lesson, index) => (
                    <a key={lesson} href="/#learn" className="rounded-lg border border-border p-3 transition-colors hover:border-orange">
                      <span className="text-xs font-semibold text-orange">Module {index + 1}</span>
                      <span className="mt-1 block text-sm font-semibold text-foreground">{lesson}</span>
                    </a>
                  ))}
                </div>
              </div>
              {profile.status === 'approved' ? <>
              <div className="rounded-xl border border-border bg-background p-5">
                <h2 className="font-display text-lg font-bold text-foreground">Your applications</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Track responses from verified employers.</p>
                <div className="mt-4 space-y-3">
                  {applications.length === 0 ? <p className="text-sm text-muted-foreground">You have not applied to an employer yet.</p> : applications.map((application) => (
                    <div key={application.id} className="flex flex-col gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{application.organization?.organization_name || application.employer?.full_name || 'Verified employer'}</h3>
                        <p className="text-sm text-muted-foreground">{application.role} · {new Date(application.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className="w-fit rounded-md bg-muted px-2 py-1 text-xs font-semibold capitalize text-foreground">{application.status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-background p-5">
                <h2 className="font-display text-lg font-bold text-foreground">Apply to verified employers</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Send your profile to approved Sora employers. They will receive an email and can follow up with you.</p>
                <div className="mt-4 space-y-3">
                  {employers.length === 0 ? <p className="text-sm text-muted-foreground">No verified employers are accepting applications yet.</p> : employers.map((employer) => {
                    const details = employer.employer_profiles[0]
                    return <div key={employer.id} className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div><h3 className="font-semibold text-foreground">{details?.organization_name || employer.full_name}</h3><p className="text-sm text-muted-foreground">{details?.organization_type} · {employer.state || 'Nigeria'}</p></div>
                      <Button onClick={() => void applyToEmployer(employer.id, profile.pwd_details?.headline || 'Open opportunity')} disabled={loading || applicationStatus[employer.id]} className="bg-orange text-orange-foreground hover:bg-orange/90">{applicationStatus[employer.id] ? 'Applied' : 'Apply with profile'}</Button>
                    </div>
                  })}
                </div>
              </div>
              </> : <div className="rounded-xl border border-border bg-muted/50 p-5">
                <h2 className="font-display text-lg font-bold text-foreground">Employer applications unlock after verification</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">You can use the learning modules and finish your documents while Sora reviews your profile.</p>
              </div>}
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-border bg-muted/50 p-5"><h2 className="font-display text-lg font-bold text-foreground">Admin account</h2><p className="mt-2 text-sm text-muted-foreground">Use the admin workspace to review employer applications.</p></div>
          )}
        </section>
      </div>
    </main>
  )
}