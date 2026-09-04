import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Supabase server environment variables are missing you this man.')
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Server components cannot always mutate cookies. Middleware handles refreshes.
        }
      },
    },
  })
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export async function getCurrentProfile() {
  const supabase = await createSupabaseServerClient()
  const user = await getCurrentUser()

  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('id, role, status, full_name, email')
    .eq('id', user.id)
    .maybeSingle()

  return data
}