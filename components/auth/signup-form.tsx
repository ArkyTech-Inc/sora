'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type SignupRole = 'pwd' | 'employer'

const fieldClass = 'flex flex-col gap-2'

export function SignupForm({ role }: { role: SignupRole }) {
  const router = useRouter()
  const [form, setForm] = useState<Record<string, string>>({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    state: '',
    organizationName: '',
    organizationType: '',
    website: '',
    recruiterJobTitle: '',
    accessibilitySupport: '',
    headline: '',
    category: '',
    skills: '',
    disability: '',
    accommodations: '',
    workMode: '',
    experienceYears: '0',
    availability: '',
    summary: '',
    pwdId: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const list = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const body = {
      ...form,
      role,
      skills: list(form.skills),
      accommodations: list(form.accommodations),
      experienceYears: Number(form.experienceYears),
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to create your account.')
      setSubmitted(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to create your account.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="mt-8 rounded-xl border border-green/30 bg-green/10 p-6">
        <h2 className="font-display text-xl font-bold text-foreground">Account created</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Check your email to confirm your account. {role === 'employer' ? 'After confirmation, an administrator will review your employer application.' : 'After confirmation, log in to finish managing your profile and documents.'}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" onClick={() => router.push('/login')} className="bg-orange text-orange-foreground hover:bg-orange/90">Go to login</Button>
          <Button type="button" variant="outline" onClick={() => router.push('/')}>Return home</Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="mt-8 flex flex-col gap-7">
      {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className={fieldClass}><Label htmlFor="fullName">Full name</Label><Input id="fullName" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} required autoComplete="name" /></div>
        <div className={fieldClass}><Label htmlFor="email">Email address</Label><Input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required autoComplete="email" /></div>
        <div className={fieldClass}><Label htmlFor="password">Password</Label><Input id="password" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required minLength={8} autoComplete="new-password" /></div>
        <div className={fieldClass}><Label htmlFor="phone">Phone number</Label><Input id="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="tel" /></div>
        <div className={fieldClass}><Label htmlFor="state">State / location</Label><Input id="state" value={form.state} onChange={(e) => update('state', e.target.value)} required /></div>
      </section>

      {role === 'employer' ? (
        <section className="flex flex-col gap-4 border-t border-border pt-6">
          <h2 className="font-display text-xl font-bold text-foreground">Organization details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={fieldClass}><Label htmlFor="organizationName">Organization name</Label><Input id="organizationName" value={form.organizationName} onChange={(e) => update('organizationName', e.target.value)} required /></div>
            <div className={fieldClass}><Label htmlFor="organizationType">Organization type</Label><Input id="organizationType" placeholder="Agency, company, NGO" value={form.organizationType} onChange={(e) => update('organizationType', e.target.value)} required /></div>
            <div className={fieldClass}><Label htmlFor="website">Website</Label><Input id="website" type="url" value={form.website} onChange={(e) => update('website', e.target.value)} placeholder="https://" /></div>
            <div className={fieldClass}><Label htmlFor="recruiterJobTitle">Your job title</Label><Input id="recruiterJobTitle" value={form.recruiterJobTitle} onChange={(e) => update('recruiterJobTitle', e.target.value)} /></div>
          </div>
          <div className={fieldClass}><Label htmlFor="accessibilitySupport">Accessibility support your workplace provides</Label><Input id="accessibilitySupport" value={form.accessibilitySupport} onChange={(e) => update('accessibilitySupport', e.target.value)} placeholder="Captioning, ramps, flexible schedules" /></div>
        </section>
      ) : (
        <section className="flex flex-col gap-4 border-t border-border pt-6">
          <h2 className="font-display text-xl font-bold text-foreground">Professional profile</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={fieldClass}><Label htmlFor="headline">Professional headline</Label><Input id="headline" value={form.headline} onChange={(e) => update('headline', e.target.value)} placeholder="Frontend developer" required /></div>
            <div className={fieldClass}><Label htmlFor="category">Skill category</Label><Input id="category" value={form.category} onChange={(e) => update('category', e.target.value)} placeholder="Software Development" required /></div>
            <div className={fieldClass}><Label htmlFor="skills">Skills</Label><Input id="skills" value={form.skills} onChange={(e) => update('skills', e.target.value)} placeholder="React, TypeScript, SQL" /></div>
            <div className={fieldClass}><Label htmlFor="experienceYears">Years of experience</Label><Input id="experienceYears" type="number" min="0" value={form.experienceYears} onChange={(e) => update('experienceYears', e.target.value)} /></div>
            <div className={fieldClass}><Label htmlFor="workMode">Preferred work arrangement</Label><Input id="workMode" value={form.workMode} onChange={(e) => update('workMode', e.target.value)} placeholder="Remote, hybrid, or on-site" required /></div>
            <div className={fieldClass}><Label htmlFor="availability">Availability</Label><Input id="availability" value={form.availability} onChange={(e) => update('availability', e.target.value)} placeholder="Immediately available" required /></div>
          </div>
          <div className={fieldClass}><Label htmlFor="summary">Professional summary</Label><textarea id="summary" value={form.summary} onChange={(e) => update('summary', e.target.value)} required rows={4} className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={fieldClass}><Label htmlFor="disability">Disability type</Label><Input id="disability" value={form.disability} onChange={(e) => update('disability', e.target.value)} required /></div>
            <div className={fieldClass}><Label htmlFor="accommodations">Workplace accommodations</Label><Input id="accommodations" value={form.accommodations} onChange={(e) => update('accommodations', e.target.value)} placeholder="Screen reader, flexible hours" /></div>
            <div className={fieldClass}><Label htmlFor="pwdId">National PWD ID (optional)</Label><Input id="pwdId" value={form.pwdId} onChange={(e) => update('pwdId', e.target.value)} /></div>
          </div>
        </section>
      )}

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Already have an account? <Link href="/login" className="font-semibold text-orange hover:underline">Log in</Link></p>
        <Button type="submit" disabled={loading} className="h-10 bg-orange font-semibold text-orange-foreground hover:bg-orange/90">{loading ? 'Creating account...' : 'Create account'}</Button>
      </div>
    </form>
  )
}