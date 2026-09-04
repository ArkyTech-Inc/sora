import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { randomUUID } from 'node:crypto'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_EXTENSIONS = new Set(['pdf', 'doc', 'docx'])

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'pwd') return NextResponse.json({ error: 'Only PWD profiles can upload documents.' }, { status: 403 })

    const formData = await request.formData()
    const file = formData.get('file')
    const documentType = formData.get('documentType')
    if (!(file instanceof File) || (documentType !== 'cv' && documentType !== 'qualification')) {
      return NextResponse.json({ error: 'A valid document and type are required.' }, { status: 400 })
    }
    if (file.size === 0 || file.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'Files must be smaller than 10 MB.' }, { status: 400 })

    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    if (!ALLOWED_EXTENSIONS.has(extension)) return NextResponse.json({ error: 'Only PDF, DOC, and DOCX files are accepted.' }, { status: 400 })

    const path = `${user.id}/${randomUUID()}.${extension}`
    const upload = await supabase.storage.from('private-documents').upload(path, file, { contentType: file.type || undefined, upsert: false })
    if (upload.error) throw upload.error

    const { error: documentError } = await supabase.from('pwd_documents').insert({ user_id: user.id, document_type: documentType, file_name: file.name, storage_path: path })
    if (documentError) throw documentError

    if (documentType === 'cv') {
      const { error } = await supabase.from('pwd_profiles').update({ cv_path: path }).eq('user_id', user.id)
      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Document upload error:', error)
    return NextResponse.json({ error: 'Unable to upload that document.' }, { status: 500 })
  }
}