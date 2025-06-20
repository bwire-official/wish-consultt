import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  console.log('--- AUTH CALLBACK HIT ---'); // Checkpoint 1
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    console.log('Code found, attempting to exchange for session...'); // Checkpoint 2
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      console.log('Session exchanged SUCCESSFULLY. Redirecting to:', `${origin}${next}`); // Checkpoint 3
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error('ERROR exchanging code for session:', error.message); // Checkpoint 4
    }
  }

  // return the user to an error page with instructions
  console.error('Callback error: No code found in URL.'); // Checkpoint 5
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
} 