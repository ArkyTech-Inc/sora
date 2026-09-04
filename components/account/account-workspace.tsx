'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

type Profile = {
  id: string
  role: 'pwd' | 'employer' | 'admin'
  status: 'pending' | 'approved' | 'rejected'
  full_name: string
  email: string
}

export function AccountWorkspace({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState<'cv' | 'qualification'>('cv')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function signOut() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

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
          <Button variant="outline" onClick={signOut}>Log out</Button>
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

          {profile.role === 'employer' ? (
            <div className="mt-8 rounded-xl border border-border bg-muted/50 p-5">
              <h2 className="font-display text-lg font-bold text-foreground">Employer review in progress</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Your organization profile is saved. Once an administrator approves it, your employer dashboard will become available.</p>
            </div>
          ) : profile.role === 'pwd' ? (
            <div className="mt-8 rounded-xl border border-border bg-muted/50 p-5">
              <h2 className="font-display text-lg font-bold text-foreground">Professional documents</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Upload your CV and qualifications. Files are stored privately and are not shown to employers before an authorized interest action.</p>
              {message && <p className="mt-4 rounded-md border border-border bg-background p-3 text-sm text-foreground">{message}</p>}
              <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto]">
                <input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setFile(event.target.files?.[0] || null)} className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                <select value={documentType} onChange={(event) => setDocumentType(event.target.value as 'cv' | 'qualification')} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  <option value="cv">CV</option>
                  <option value="qualification">Qualification</option>
                </select>
              </div>
              <Button onClick={upload} disabled={!file || loading} className="mt-4 bg-orange text-orange-foreground hover:bg-orange/90">{loading ? 'Uploading...' : 'Upload document'}</Button>
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-border bg-muted/50 p-5"><h2 className="font-display text-lg font-bold text-foreground">Admin account</h2><p className="mt-2 text-sm text-muted-foreground">Use the admin workspace to review employer applications.</p></div>
          )}
        </section>
      </div>
    </main>
  )
}