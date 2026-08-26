'use client'

import {
  BadgeCheck,
  CalendarClock,
  Lock,
  Mail,
  MapPin,
  Phone,
  Link2,
  Briefcase,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Candidate } from '@/lib/employer-data'

type CandidateCardProps = {
  candidate: Candidate
  revealed: boolean
  onExpressInterest: (candidate: Candidate) => void
}

export function CandidateCard({
  candidate,
  revealed,
  onExpressInterest,
}: CandidateCardProps) {
  const p = candidate.public

  return (
    <li className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-navy-foreground"
          >
            {p.initials}
          </div>
          <div className="flex flex-col">
            <h3 className="font-display text-base font-bold leading-tight text-foreground">
              {revealed ? candidate.private.name : p.headline}
            </h3>
            <p className="text-xs text-muted-foreground">
              {revealed ? p.headline : `Candidate ${candidate.code}`}
            </p>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green/10 px-2 py-1 text-[0.7rem] font-semibold text-green">
          <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Verified
        </span>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{p.summary}</p>

      <dl className="flex flex-col gap-2 text-xs">
        <div className="flex items-center gap-2">
          <dt className="sr-only">Disability type</dt>
          <dd className="inline-flex items-center rounded-md bg-muted px-2 py-1 font-medium text-foreground">
            {p.disability}
          </dd>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
            <dt className="sr-only">Experience</dt>
            <dd>
              {p.experienceYears} yr{p.experienceYears === 1 ? '' : 's'} ·{' '}
              {p.workMode}
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <dt className="sr-only">Location</dt>
            <dd>{revealed ? candidate.private.location : p.state}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
            <dt className="sr-only">Availability</dt>
            <dd>{p.availability}</dd>
          </div>
        </div>
      </dl>

      <div className="flex flex-col gap-2">
        <h4 className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
          Skills
        </h4>
        <ul className="flex flex-wrap gap-1.5">
          {p.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-md border border-border px-2 py-1 text-xs text-foreground"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
          Workplace adjustments needed
        </h4>
        <ul className="flex flex-wrap gap-1.5">
          {p.accommodations.map((item) => (
            <li
              key={item}
              className="rounded-md bg-mint px-2 py-1 text-xs font-medium text-navy"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto border-t border-border pt-4">
        {revealed ? (
          <div className="flex flex-col gap-2">
            <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-green">
              Contact details unlocked
            </p>
            <ul className="flex flex-col gap-1.5 text-sm">
              <li className="flex items-center gap-2 text-foreground">
                <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <a
                  href={`mailto:${candidate.private.email}`}
                  className="underline underline-offset-4 hover:text-orange"
                >
                  {candidate.private.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <Phone className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <a
                  href={`tel:${candidate.private.phone.replace(/\s/g, '')}`}
                  className="underline underline-offset-4 hover:text-orange"
                >
                  {candidate.private.phone}
                </a>
              </li>
              {candidate.private.portfolio && (
                <li className="flex items-center gap-2 text-foreground">
                  <Link2
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>{candidate.private.portfolio}</span>
                </li>
              )}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
                Name and contact details stay private until you express interest.
              </span>
            </p>
            <Button
              size="lg"
              className="w-full bg-orange font-semibold text-orange-foreground hover:bg-orange/90"
              onClick={() => onExpressInterest(candidate)}
            >
              Express Interest
              <span className="sr-only">
                {' '}
                in candidate {candidate.code}, {p.headline}
              </span>
            </Button>
          </div>
        )}
      </div>
    </li>
  )
}
