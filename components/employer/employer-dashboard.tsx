'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Users } from 'lucide-react'
import { type Candidate } from '@/lib/employer-data'
import { CandidateCard } from '@/components/employer/candidate-card'
import { InterestDialog } from '@/components/employer/interest-dialog'
import { TalentFilters } from '@/components/employer/talent-filters'
import { Button } from '@/components/ui/button'


function toggle(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value]
}

type EmployerDetails = {
  organization_name: string
  organization_type: string
  organization_state: string | null
  accessibility_support: string | null
  website: string | null
}

type EmployerApplication = {
  id: string
  role: string
  status: 'submitted' | 'reviewing' | 'closed'
  created_at: string
  candidate: { full_name: string; email: string; phone: string | null; state: string | null } | null
  profile: { user_id: string; headline: string; category: string; skills: string[]; summary: string } | null
}

type EmployerInterest = {
  id: string
  created_at: string
  candidate: { full_name: string; email: string; phone: string | null; state: string | null } | null
  profile: { user_id: string; headline: string; category: string; skills: string[]; summary: string } | null
}

export function EmployerDashboard({
  employerName = 'Employer',
  employerDetails,
}: {
  employerName?: string
  employerDetails?: EmployerDetails | null
}) {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedDisabilities, setSelectedDisabilities] = useState<string[]>([])
  const [selectedModes, setSelectedModes] = useState<string[]>([])
  const [revealedIds, setRevealedIds] = useState<string[]>([])
  const [pending, setPending] = useState<Candidate | null>(null)
  const [interestError, setInterestError] = useState<string | null>(null)
  const [applications, setApplications] = useState<EmployerApplication[]>([])
  const [interests, setInterests] = useState<EmployerInterest[]>([])
  const [monitoringError, setMonitoringError] = useState<string | null>(null)
  const [workingApplication, setWorkingApplication] = useState<string | null>(null)

  const refreshMonitoring = useCallback(async () => {
    const [interestResponse, applicationResponse] = await Promise.all([
      fetch('/api/employer/interests'),
      fetch('/api/employer/applications'),
    ])
    const [interestData, applicationData] = await Promise.all([
      interestResponse.json(),
      applicationResponse.json(),
    ])
    if (!interestResponse.ok) throw new Error(interestData.error || 'Unable to load interested profiles.')
    if (!applicationResponse.ok) throw new Error(applicationData.error || 'Unable to load applications.')
    setInterests(interestData.interests ?? [])
    setApplications(applicationData.applications ?? [])
    setRevealedIds((interestData.interests ?? []).map((interest: EmployerInterest) => interest.profile?.user_id).filter(Boolean))
  }, [])

  useEffect(() => {
    fetch('/api/employer/talent')
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Unable to load talent.')
        return data
      })
      .then((data) => {
        setCandidates(data.candidates.map((candidate: Record<string, unknown>) => ({
          id: candidate.user_id,
          code: `SORA-${String(candidate.user_id).slice(0, 6).toUpperCase()}`,
          public: {
            initials: 'PWD',
            headline: candidate.headline,
            category: candidate.category,
            skills: candidate.skills || [],
            disability: candidate.disability,
            accommodations: candidate.accommodations || [],
            workMode: candidate.work_mode,
            state: candidate.state,
            experienceYears: candidate.experience_years,
            verifiedBy: 'Sora verified',
            verifiedOn: 'Verified profile',
            availability: candidate.availability,
            summary: candidate.summary,
          },
        })))
      })
      .catch((error) => setLoadError(error instanceof Error ? error.message : 'Unable to load talent.'))
      .finally(() => setLoading(false))
    refreshMonitoring().catch((error) => setMonitoringError(error instanceof Error ? error.message : 'Unable to load dashboard activity.'))
  }, [refreshMonitoring])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()

    return candidates.filter((candidate) => {
      const p = candidate.public

      if (selectedSkills.length > 0 && !selectedSkills.includes(p.category)) {
        return false
      }
      if (
        selectedDisabilities.length > 0 &&
        !selectedDisabilities.includes(p.disability)
      ) {
        return false
      }
      if (selectedModes.length > 0 && !selectedModes.includes(p.workMode)) {
        return false
      }
      if (q.length > 0) {
        const haystack = [p.headline, p.category, ...p.skills]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [candidates, query, selectedSkills, selectedDisabilities, selectedModes])

  const activeCount =
    selectedSkills.length +
    selectedDisabilities.length +
    selectedModes.length +
    (query.trim() ? 1 : 0)

  const resetFilters = () => {
    setQuery('')
    setSelectedSkills([])
    setSelectedDisabilities([])
    setSelectedModes([])
  }

  const confirmInterest = async (candidate: Candidate) => {
    setInterestError(null)
    try {
      const response = await fetch('/api/employer/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pwdId: candidate.id }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to express interest.')
      setRevealedIds((prev) => (prev.includes(candidate.id) ? prev : [...prev, candidate.id]))
      if (data.emailSent === false) setInterestError('Interest was saved, but the PWD email could not be delivered.')
      setPending(null)
      await refreshMonitoring()
    } catch (error) {
      setInterestError(error instanceof Error ? error.message : 'Unable to express interest.')
    }
  }

  async function updateApplication(applicationId: string, status: 'reviewing' | 'closed') {
    setWorkingApplication(applicationId)
    setMonitoringError(null)
    try {
      const response = await fetch('/api/pwd/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to update this application.')
      await refreshMonitoring()
      if (data.emailSent === false) setMonitoringError('The application status changed, but the PWD email could not be delivered.')
    } catch (error) {
      setMonitoringError(error instanceof Error ? error.message : 'Unable to update this application.')
    } finally {
      setWorkingApplication(null)
    }
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-navy p-6 text-navy-foreground sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-foreground/10 px-3 py-1 text-xs font-semibold">
            Employer account
          </span>
          <span className="text-xs text-navy-foreground/70">Verified employer access</span>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">
            {employerDetails?.organization_name || employerName}
          </h1>
          <p className="text-sm font-medium text-navy-foreground/80">
            {employerDetails?.organization_type || 'Verified employer'} · {employerDetails?.organization_state || 'Nigeria'}
          </p>
          {employerDetails?.accessibility_support && <p className="text-sm text-navy-foreground/80">Accessibility: {employerDetails.accessibility_support}</p>}
          {employerDetails?.website && <a href={employerDetails.website} target="_blank" rel="noreferrer" className="w-fit text-sm text-orange underline underline-offset-2">Organization website</a>}
          <p className="max-w-2xl text-sm leading-relaxed text-navy-foreground/80">
            Browse verified Persons with Disabilities talent. Filter by the
            skills you need and the disability types your workplace is equipped
            to support. Profiles stay anonymous until you express interest.
          </p>
        </div>
        <dl className="mt-2 flex flex-wrap gap-x-8 gap-y-3">
          <div className="flex flex-col">
            <dt className="text-xs text-navy-foreground/70">Verified talent</dt>
            <dd className="font-display text-xl font-bold">
              {candidates.length}
            </dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-xs text-navy-foreground/70">Matching filters</dt>
            <dd className="font-display text-xl font-bold">{results.length}</dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-xs text-navy-foreground/70">
              Interests expressed
            </dt>
            <dd className="font-display text-xl font-bold">
              {interests.length}
            </dd>
          </div>
        </dl>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <TalentFilters
          query={query}
          onQueryChange={setQuery}
          selectedSkills={selectedSkills}
          onToggleSkill={(v) => setSelectedSkills((p) => toggle(p, v))}
          selectedDisabilities={selectedDisabilities}
          onToggleDisability={(v) => setSelectedDisabilities((p) => toggle(p, v))}
          selectedModes={selectedModes}
          onToggleMode={(v) => setSelectedModes((p) => toggle(p, v))}
          onReset={resetFilters}
          activeCount={activeCount}
        />

        <section aria-label="Candidate results" className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" aria-hidden="true" />
              <p aria-live="polite">
              Showing <strong className="text-foreground">{results.length}</strong>{' '}
              of {candidates.length} verified candidates
            </p>
          </div>

          {loading ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center text-sm text-muted-foreground">Loading verified talent...</div>
          ) : loadError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-12 text-center text-sm text-red-700">{loadError}</div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-card p-12 text-center">
              <h3 className="font-display text-lg font-bold text-foreground">
                No candidates match these filters
              </h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Try removing a filter or broadening the skill category to see
                more verified talent.
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {results.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  revealed={revealedIds.includes(candidate.id)}
                  onExpressInterest={setPending}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="grid gap-6 lg:grid-cols-2" aria-label="Dashboard activity">
        <div className="border-t border-border pt-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Applications</h2>
              <p className="mt-1 text-sm text-muted-foreground">Candidates who have applied to your organization.</p>
            </div>
            <span className="text-sm font-semibold text-foreground">{applications.length}</span>
          </div>
          {applications.length === 0 ? <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">No applications yet.</p> : <ul className="space-y-3">{applications.map((application) => (
            <li key={application.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">{application.candidate?.full_name || 'Sora candidate'}</h3>
                  <p className="text-sm text-muted-foreground">{application.role} · {application.profile?.category}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{application.candidate?.email} · {new Date(application.created_at).toLocaleDateString()}</p>
                </div>
                <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold capitalize text-foreground">{application.status}</span>
              </div>
              {application.profile?.summary && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{application.profile.summary}</p>}
              {application.status !== 'closed' && <div className="mt-3 flex gap-2">
                {application.status === 'submitted' && <Button size="sm" variant="outline" disabled={workingApplication === application.id} onClick={() => void updateApplication(application.id, 'reviewing')}>Mark reviewing</Button>}
                <Button size="sm" variant="outline" disabled={workingApplication === application.id} onClick={() => void updateApplication(application.id, 'closed')}>Close application</Button>
              </div>}
            </li>
          ))}</ul>}
        </div>

        <div className="border-t border-border pt-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Profiles you contacted</h2>
              <p className="mt-1 text-sm text-muted-foreground">Contact details remain available here after you express interest.</p>
            </div>
            <span className="text-sm font-semibold text-foreground">{interests.length}</span>
          </div>
          {interests.length === 0 ? <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">Express interest in a verified profile to track it here.</p> : <ul className="space-y-3">{interests.map((interest) => (
            <li key={interest.id} className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold text-foreground">{interest.candidate?.full_name || 'Sora candidate'}</h3>
              <p className="text-sm text-muted-foreground">{interest.profile?.headline} · {interest.candidate?.state}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {interest.candidate?.email && <a className="text-orange underline underline-offset-2" href={`mailto:${interest.candidate.email}`}>{interest.candidate.email}</a>}
                {interest.candidate?.phone && <a className="text-orange underline underline-offset-2" href={`tel:${interest.candidate.phone.replace(/\\s/g, '')}`}>{interest.candidate.phone}</a>}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Interest expressed {new Date(interest.created_at).toLocaleDateString()}</p>
            </li>
          ))}</ul>}
        </div>
      </section>
      {monitoringError && <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{monitoringError}</p>}

      <InterestDialog
        candidate={pending}
        onOpenChange={(open) => {
          if (!open) setPending(null)
        }}
        onConfirm={confirmInterest}
      />
      {interestError && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {interestError}
        </p>
      )}
    </div>
  )
}
