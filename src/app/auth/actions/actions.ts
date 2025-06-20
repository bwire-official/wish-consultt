'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/service' // We will use the admin client
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

// --- SIGNUP ACTION ---
export async function signup(formData: FormData) {
  const origin = (await headers()).get('origin');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const fullName = `${firstName} ${lastName}`.trim();
  const supabase = createClient(); // This is the user-context client

  // Step 1: Create the user in the Auth system.
  // This will now succeed because the broken trigger is gone.
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/onboarding/student`,
      data: {
        full_name: fullName,
        first_name: firstName,
        last_name: lastName
      }
    },
  });

  if (signUpError || !user) {
    console.error('Signup Error:', signUpError);
    // Use the error message from Supabase if available
    const message = signUpError?.message || 'Could not create user.';
    return redirect(`/signup?message=${encodeURIComponent(message)}`);
  }

  // Step 1.5: Update the user's display name in Auth
  const { error: updateError } = await supabase.auth.updateUser({
    data: { 
      full_name: fullName,
      first_name: firstName,
      last_name: lastName
    }
  });

  if (updateError) {
    console.error('Failed to update user display name:', updateError);
    // Continue anyway, this is not critical
  }

  // Step 2: Now that the auth user exists, explicitly INSERT their profile.
  // We use the ADMIN client to bypass RLS for this one-time, secure setup.
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({ 
      id: user.id, 
      email: user.email, 
      full_name: fullName 
    });

  if (profileError) {
    console.error("CRITICAL: Failed to create profile for new user:", profileError);
    // Optional: Add logic here to delete the auth user if profile creation fails, to prevent orphaned users.
    return redirect('/signup?message=Could not create user profile.');
  }

  // Step 3: Redirect to email verification.
  return redirect(`/verify-email?email=${email}`);
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
    // Return error instead of redirecting
    return { success: false, error: 'Invalid or expired code. Please try again.' }
  }

  // Return success - the client will handle the redirect with countdown
  return { success: true }
}

// --- LOGIN ACTION ---
export async function login(formData: FormData) {
  const identity = formData.get('identity') as string; // This can be email or username
  const password = formData.get('password') as string;
  const supabase = createClient();
  let emailForLogin: string | null = null;

  // 1. Determine if the user provided an email or a username
  if (identity.includes('@')) {
    // If it contains '@', assume it's an email
    emailForLogin = identity;
  } else {
    // Otherwise, assume it's a username and find the associated email
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('username', identity)
      .single();

    if (error || !profile || !profile.email) {
      console.error('Username lookup error:', error);
      return { success: false, error: 'Invalid credentials' };
    }
    emailForLogin = profile.email;
  }

  // 2. Attempt to sign in the user with the found email
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: emailForLogin,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return redirect("/auth-code-error");
  }

  return redirect("/verify-email");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return redirect("/auth-code-error");
  }

  return redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
  };

  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return redirect("/auth-code-error");
  }

  return redirect("/forgot-password");
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const data = {
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.updateUser({
    password: data.password,
  });

  if (error) {
    return redirect("/auth-code-error");
  }

  return redirect("/dashboard");
}

export async function resendVerificationEmail(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// --- SIMPLIFIED SIGNUP ACTION (for debugging) ---
export async function signupSimple(formData: FormData) {
  console.log('=== SIMPLIFIED SIGNUP ACTION STARTED ===');
  
  const origin = (await headers()).get('origin');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const fullName = `${firstName} ${lastName}`.trim();
  
  console.log('Form data received:', { email, firstName, lastName, fullName });
  
  const supabase = createClient();
  console.log('Supabase client created');

  try {
    // Step 1: Create the user in auth.users (without trigger)
    console.log('Step 1: Creating user in auth.users...');
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/onboarding/student`,
        data: {
          full_name: fullName,
          first_name: firstName,
          last_name: lastName
        }
      },
    });

    console.log('Signup response:', { user: user?.id, error: signUpError });

    if (signUpError || !user) {
      console.error('Signup Error:', signUpError);
      return redirect('/signup?message=Could not create user.');
    }

    // Step 2: Manually create the profile
    console.log('Step 2: Manually creating profile...');
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        role: 'student',
        status: 'active',
        onboarding_completed: false
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't redirect, just log the error for debugging
      return redirect('/signup?message=User created but profile failed.');
    }

    console.log('Profile created successfully');
    return redirect(`/verify-email?email=${email}`);
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return redirect('/signup?message=Unexpected error occurred.');
  }
} 