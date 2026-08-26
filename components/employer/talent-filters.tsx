'use client'

import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DISABILITY_TYPES,
  SKILL_CATEGORIES,
  WORK_MODES,
} from '@/lib/employer-data'

type TalentFiltersProps = {
  query: string
  onQueryChange: (value: string) => void
  selectedSkills: string[]
  onToggleSkill: (value: string) => void
  selectedDisabilities: string[]
  onToggleDisability: (value: string) => void
  selectedModes: string[]
  onToggleMode: (value: string) => void
  onReset: () => void
  activeCount: number
}

function FilterGroup({
  legend,
  options,
  selected,
  onToggle,
  idPrefix,
}: {
  legend: string
  options: readonly string[]
  selected: string[]
  onToggle: (value: string) => void
  idPrefix: string
}) {
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
        {legend}
      </legend>
      {options.map((option) => {
        const id = `${idPrefix}-${option.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`
        return (
          <div key={option} className="flex items-center gap-2.5">
            <input
              type="checkbox"
              id={id}
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
            <Label
              htmlFor={id}
              className="cursor-pointer text-sm font-normal leading-snug text-foreground"
            >
              {option}
            </Label>
          </div>
        )
      })}
    </fieldset>
  )
}

export function TalentFilters({
  query,
  onQueryChange,
  selectedSkills,
  onToggleSkill,
  selectedDisabilities,
  onToggleDisability,
  selectedModes,
  onToggleMode,
  onReset,
  activeCount,
}: TalentFiltersProps) {
  return (
    <aside
      aria-label="Filter candidates"
      className="flex flex-col gap-6 rounded-xl border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold text-foreground">
          Filters
        </h2>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear ({activeCount})
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="talent-search">Search skills or roles</Label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="talent-search"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="e.g. React, SQL, design"
            className="pl-9"
          />
        </div>
      </div>

      <FilterGroup
        legend="Skill category"
        options={SKILL_CATEGORIES}
        selected={selectedSkills}
        onToggle={onToggleSkill}
        idPrefix="skill"
      />

      <FilterGroup
        legend="Disability type"
        options={DISABILITY_TYPES}
        selected={selectedDisabilities}
        onToggle={onToggleDisability}
        idPrefix="disability"
      />

      <FilterGroup
        legend="Work arrangement"
        options={WORK_MODES}
        selected={selectedModes}
        onToggle={onToggleMode}
        idPrefix="mode"
      />
    </aside>
  )
}
