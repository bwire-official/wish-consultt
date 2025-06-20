import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// This client uses the service role key and bypasses RLS
// Only use this for server-side operations that need admin privileges
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // This is the service role key, not the anon key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
) 