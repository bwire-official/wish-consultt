'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/service' 
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
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email: emailForLogin,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!user) {
      return { success: false, error: 'Login failed' };
    }

    // 3. Get the user's profile to check their role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, onboarding_completed')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile lookup error:', profileError);
      return { success: false, error: 'Failed to get user profile' };
    }

    if (!profile) {
      return { success: false, error: 'User profile not found' };
    }

    // Use proper type since onboarding_completed exists in DB but not in TypeScript types
    const userProfile = profile as unknown as { role: string; onboarding_completed: boolean };

    // 4. Check role and return appropriate redirect path
    if (userProfile.role === 'admin') {
      return { success: true, redirectTo: '/admin' };
    } else if (userProfile.role === 'affiliate') {
      return { success: false, error: 'Please use the affiliate dashboard to sign in.' };
    } else if (userProfile.role === 'student') {
      // Check if onboarding is completed
      if (!userProfile.onboarding_completed) {
        return { success: true, redirectTo: '/onboarding/student' };
      } else {
        return { success: true, redirectTo: '/dashboard' };
      }
    } else {
      // Default fallback for unknown roles
      return { success: true, redirectTo: '/dashboard' };
    }

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

/**
 * Handles Step 1 of the password reset flow.
 * Checks if a user exists and sends them a 6-digit OTP code.
 */
export async function requestPasswordReset(formData: FormData) {
  const identity = formData.get('identity') as string;
  const supabase = createClient();
  let emailToReset: string | null = null;
  let userRole: string | null = null;

  // 1. Find the user by either email or username
  let profileQuery = supabase.from('profiles').select('email, role');
  if (identity.includes('@')) {
    profileQuery = profileQuery.eq('email', identity);
  } else {
    profileQuery = profileQuery.eq('username', identity);
  }
  
  const { data: profile, error: profileError } = await profileQuery.single();

  // 2. Handle cases where the user does not exist
  if (profileError || !profile) {
    console.error("User not found:", profileError);
    return redirect('/forgot-password?message=User with this identity does not exist.');
  }
  
  emailToReset = profile.email;
  userRole = profile.role;

  // 3. Handle affiliate users by redirecting them
  if (userRole === 'affiliate') {
    return redirect('/affiliate/forgot-password?message=Please use the affiliate portal for password reset.');
  }

  // 4. If everything is correct, send the password reset OTP
  if (emailToReset) {
    const { error } = await supabase.auth.resetPasswordForEmail(emailToReset);
    
    if (error) {
      console.error("Error sending password reset OTP:", error);
      return redirect('/forgot-password?message=Could not send reset code. Please try again.');
    }

    // Success! Redirect to the code verification step.
    // We pass the email along so the next form knows who is verifying.
    return redirect(`/forgot-password/verify?email=${encodeURIComponent(emailToReset)}`);
  }

  return redirect('/forgot-password?message=An unexpected error occurred.');
}

/**
 * Handles Step 2 of the password reset flow.
 * Verifies that the 6-digit OTP is correct for the given email.
 */
export async function verifyPasswordResetCode(formData: FormData) {
  const email = formData.get('email') as string;
  const token = formData.get('token') as string;
  const supabase = createClient();

  if (!email || !token) {
    return redirect(`/forgot-password/verify?email=${email}&message=Email and code are required.`);
  }

  // Use the 'recovery' type for password reset verification
  const { error } = await supabase.auth.verifyOtp({
    type: 'recovery',
    email,
    token,
  });

  // If Supabase returns an error, the code was wrong or expired.
  if (error) {
    console.error("Password Reset Code Verification Error:", error);
    return redirect(`/forgot-password/verify?email=${email}&message=Invalid or expired code. Please try again.`);
  }

  // SUCCESS! The code was correct.
  // Redirect to the final step: the page to set a new password.
  // We pass the email along so the final form knows which user to update.
  return redirect(`/reset-password?email=${encodeURIComponent(email)}`);
}

/**
 * Handles Step 3 of the password reset flow.
 * Updates the user's password after they've verified their OTP code.
 */
export async function updateUserPassword(formData: FormData) {
  const password = formData.get('password') as string;
  const supabase = createClient();

  // Supabase automatically uses the secure session created
  // during OTP verification to know which user to update.
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("Final Password Update Error:", error);
    // Redirect back to the start of the flow with an error
    return redirect('/forgot-password?message=Failed to update password. Please try again.');
  }

  // Success! The password has been changed.
  return redirect('/login?message=Password updated successfully. Please log in.&status=success');
} 