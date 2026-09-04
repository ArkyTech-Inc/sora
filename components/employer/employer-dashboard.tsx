'use client'

import { useEffect, useMemo, useState } from 'react'
import { Users } from 'lucide-react'
import { type Candidate } from '@/lib/employer-data'
import { CandidateCard } from '@/components/employer/candidate-card'
import { InterestDialog } from '@/components/employer/interest-dialog'
import { TalentFilters } from '@/components/employer/talent-filters'


function toggle(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value]
}

export function EmployerDashboard({ employerName = 'Employer' }: { employerName?: string }) {
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
  }, [])

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
      setPending(null)
    } catch (error) {
      setInterestError(error instanceof Error ? error.message : 'Unable to express interest.')
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
            {employerName}
          </h1>
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
              {revealedIds.length}
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
