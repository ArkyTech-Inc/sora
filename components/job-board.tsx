'use client'

import { useState } from 'react'
import { BarChart3, Code2, MapPin, UserCog } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

type Arrangement = 'Remote' | 'Hybrid' | 'On-site'

type Job = {
  title: string
  icon: typeof BarChart3
  arrangement: Arrangement
  location: string
  company: string
}

const JOBS: Job[] = [
  {
    title: 'Junior Data Analyst',
    icon: BarChart3,
    arrangement: 'Remote',
    location: 'Remote',
    company: 'Disability-inclusive employer',
  },
  {
    title: 'Software Developer',
    icon: Code2,
    arrangement: 'Hybrid',
    location: 'Lagos',
    company: 'Inclusive tech company',
  },
  {
    title: 'Administrative Assistant',
    icon: UserCog,
    arrangement: 'On-site',
    location: 'FCT Abuja',
    company: 'Accessible workplace',
  },
]

const FILTERS = ['All Roles', 'Remote', 'Hybrid', 'On-site (Abuja/Lagos)'] as const
type Filter = (typeof FILTERS)[number]

const ARRANGEMENT_STYLES: Record<Arrangement, string> = {
  Remote: 'bg-mint text-mint-foreground',
  Hybrid: 'bg-navy text-navy-foreground',
  'On-site': 'bg-orange text-orange-foreground',
}

function matchesFilter(job: Job, filter: Filter) {
  if (filter === 'All Roles') return true
  if (filter === 'Remote') return job.arrangement === 'Remote'
  if (filter === 'Hybrid') return job.arrangement === 'Hybrid'
  return job.arrangement === 'On-site'
}

export function JobBoard() {
  const [filter, setFilter] = useState<Filter>('All Roles')
  const visibleJobs = JOBS.filter((job) => matchesFilter(job, filter))

  return (
    <section
      id="jobs"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Explore Job Roles
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Openings from employers committed to accessible, inclusive workplaces.
        </p>
      </div>

      <div
        className="mt-8 flex flex-wrap justify-center gap-2"
        role="group"
        aria-label="Filter roles by work arrangement"
      >
        {FILTERS.map((f) => {
          const active = filter === f
          return (
            <Button
              key={f}
              type="button"
              variant={active ? 'default' : 'outline'}
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className={
                active
                  ? 'bg-navy text-navy-foreground hover:bg-navy/90'
                  : 'bg-transparent'
              }
            >
              {f}
            </Button>
          )
        })}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {visibleJobs.map((job) => (
          <Card key={job.title} className="flex flex-col border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-foreground">
                  <job.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <Badge className={ARRANGEMENT_STYLES[job.arrangement]}>
                  {job.arrangement}
                </Badge>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                {job.title}
              </h3>
              <p className="text-sm text-muted-foreground">{job.company}</p>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {job.location}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full bg-transparent"
              >
                View Details
                <span className="sr-only"> for {job.title}</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {visibleJobs.length === 0 && (
        <p className="mt-10 text-center text-muted-foreground" role="status">
          No roles match this filter right now—check back soon.
        </p>
      )}
    </section>
  )
}
