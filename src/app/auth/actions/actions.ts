'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// --- SIGNUP ACTION ---
export async function signup(formData: FormData) {
  //const origin = headers().get('origin')
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const username = formData.get('username') as string
  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        username: username,
      },
      // Corrected to not use emailRedirectTo for OTP flow
    },
  })

  if (error) {
    console.error('Signup Error:', error)
    // Redirect with a generic error, specific errors handled on page
    redirect('/signup?message=Could not authenticate user. Please try again.')
  }

  // On success, redirect to the correct verification page
  redirect(`/verify-email?email=${email}`)
}


// --- VERIFY OTP ACTION ---
export async function verifyOtp(formData: FormData) {
  const email = formData.get('email') as string
  const token = formData.get('token') as string
  const supabase = createClient()

  // This is the core verification logic
  const { error } = await supabase.auth.verifyOtp({
    type: 'signup',
    email,
    token,
  })

  // If Supabase returns an error (invalid token), this block will now execute
  if (error) {
    console.error('OTP Verification Error:', error)
    // Redirect back to the SAME page with an error message in the URL
    redirect(`/verify-email?email=${email}&message=Invalid or expired code. Please try again.`)
  }

  // This line is ONLY reached if the code was correct.
  // Redirect to the start of the onboarding flow.
  redirect('/onboarding/student')
} 