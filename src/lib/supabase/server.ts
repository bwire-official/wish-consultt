import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          const store = await cookieStore;
          return store.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            // Only set cookies if we're in a Server Action or Route Handler
            // In Server Components, this will be ignored
            cookiesToSet.forEach(async ({ name, value, options }) => {
              const store = await cookieStore;
              store.set(name, value, options);
            })
          } catch {
            // The `setAll` method was called from a Server Component.
           
          }
        },
      },
    }
  )
}
