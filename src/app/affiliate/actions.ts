'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function signupAffiliate(formData: FormData) {
  const origin = (await headers()).get('origin');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const fullName = `${firstName} ${lastName}`.trim();

  // We use the standard client for the initial auth signup
  const supabase = createClient();

  // Step 1: Create the user in the main Supabase Auth system.
  // The fix is to pass the data directly within this signUp call.
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/affiliate/verify-email`,
      data: {
        full_name: fullName // This is the correct way to set the display name
      }
    },
  });

  if (signUpError || !user) {
    console.error('Affiliate Signup Error:', signUpError);
    console.error('SignUp error message:', signUpError?.message);
    console.error('SignUp error status:', signUpError?.status);
    
    // Handle the case where the email might already exist
    const message = signUpError?.message.includes('unique constraint') || signUpError?.message.includes('already registered')
      ? 'An account with this email already exists. Please try logging in instead.' 
      : 'Could not create affiliate account. Please try again.';
    return redirect(`/affiliate/signup?message=${encodeURIComponent(message)}`);
  }

  // Step 2: Explicitly INSERT the new profile using the admin client.
  // This is the most reliable way to set the role correctly.
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({ 
      id: user.id, 
      email: user.email, 
      full_name: fullName,
      role: 'affiliate' // This is the most important part
    });

  if (profileError) {
    console.error("CRITICAL: Failed to create affiliate profile:", profileError);
    console.error("Profile error code:", profileError.code);
    console.error("Profile error message:", profileError.message);
    console.error("Profile error details:", profileError.details);
    
    // Check if the error is due to duplicate email in profiles table
    if (profileError.code === '23505' && profileError.message.includes('profiles_email_key')) {
      return redirect(`/affiliate/signup?message=${encodeURIComponent('An account with this email already exists. Please try logging in instead.')}`);
    }
    
    // If this fails, we have an "orphaned" auth user. This is a critical error to log.
    return redirect('/affiliate/signup?message=Could not create affiliate profile. Please try again.');
  }

  // Step 3: Redirect to the affiliate-specific verification page.
  return redirect(`/affiliate/verify-email?email=${email}`);
}

/**
 * Verifies the 6-digit OTP for a new affiliate's email.
 */
export async function verifyAffiliateOtp(formData: FormData) {
  const email = formData.get('email') as string;
  const token = formData.get('token') as string;
  const supabase = createClient();

  if (!email || !token) {
    return { success: false, error: 'Email and code are required.' };
  }

  // The type for initial email verification is 'signup'.
  const { error } = await supabase.auth.verifyOtp({
    type: 'signup',
    email,
    token,
  });

  // If the code is wrong or expired, Supabase returns an error.
  if (error) {
    console.error("Affiliate OTP Verification Error:", error);
    return { success: false, error: 'Invalid or expired code.' };
  }

  // On success, return success response so frontend can show popup
  return { success: true };
}

/**
 * Checks if a username is available for registration.
 * Uses admin client to bypass RLS for public username availability checking.
 */
export async function checkUsernameAvailability(username: string) {
  if (!username || username.length < 3) {
    return { available: false, message: 'Username must be at least 3 characters' };
  }

  // Basic validation
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { 
      available: false, 
      message: 'Username can only contain letters, numbers, and underscores' 
    };
  }

  try {
    // Use admin client to bypass RLS and check username availability
    const { data: existingUser, error } = await supabaseAdmin
      .from('profiles')
      .select('username')
      .eq('username', username.toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is what we want
      console.error('Username check error:', error);
      return { 
        available: false, 
        message: 'Error checking username availability' 
      };
    }

    if (existingUser) {
      return { 
        available: false, 
        message: 'Username is already taken' 
      };
    } else {
      return { 
        available: true, 
        message: 'Username is available!' 
      };
    }
  } catch (error) {
    console.error('Username availability check failed:', error);
    return { 
      available: false, 
      message: 'Error checking username availability' 
    };
  }
}

/**
 * Comprehensive affiliate login handler that manages all authentication scenarios
 */
export async function loginAffiliate(formData: FormData) {
  const identifier = formData.get('identifier') as string; // Can be email or username
  const password = formData.get('password') as string;

  if (!identifier || !password) {
    return { 
      success: false, 
      error: 'Please provide both email/username and password.' 
    };
  }

  const supabase = createClient();

  try {
    // Determine if identifier is email or username
    const isEmail = identifier.includes('@');
    let email = identifier;

    // If it's a username, we need to get the email first
    if (!isEmail) {
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('email')
        .eq('username', identifier.toLowerCase())
        .single();

      if (profileError || !profile || !profile.email) {
        return { 
          success: false, 
          error: 'Invalid credentials. Please try again.' 
        };
      }
      email = profile.email;
    }

    // Attempt to sign in with email and password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Scenario 3: Wrong Password/Credentials
    if (authError || !authData.user) {
      return { 
        success: false, 
        error: 'Invalid credentials. Please try again.' 
      };
    }

    const user = authData.user;

    // Get the user's profile to check role and onboarding status
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role, onboarding_completed, full_name, username')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      // Sign them out if we can't get their profile
      await supabase.auth.signOut();
      return { 
        success: false, 
        error: 'Account error. Please contact support.' 
      };
    }

    // Scenario 2: Wrong Door (Student or Admin trying to login as affiliate)
    if (profile.role !== 'affiliate') {
      // Immediately sign them out
      await supabase.auth.signOut();
      return { 
        success: false, 
        error: 'This is not an affiliate account. Please use the main login page.',
        wrongRole: true
      };
    }

    // Scenario 4: Unverified Affiliate
    if (!user.email_confirmed_at) {
      // Don't sign them out, but ask if they want to verify
      return {
        success: false,
        needsVerification: true,
        email: user.email,
        message: 'Your email has not been verified. Would you like to continue with verification?'
      };
    }

    // Scenario 1: Happy Path - Check onboarding completion
    if (profile.onboarding_completed) {
      return { 
        success: true, 
        redirectTo: '/affiliate/dashboard',
        message: `Welcome back, ${profile.full_name || profile.username || 'Partner'}!`
      };
    } else {
      return { 
        success: true, 
        redirectTo: '/onboarding/affiliate',
        message: 'Please complete your onboarding to access your dashboard.'
      };
    }

  } catch (error) {
    console.error('Affiliate login error:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}

/**
 * Resends verification email for unverified affiliate
 */
export async function resendAffiliateVerification(email: string) {
  const headersList = await headers();
  const origin = (headersList?.get('origin') ?? 'http://localhost:3000') as string;
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/affiliate/verify-email`
      }
    });

    if (error) {
      return { 
        success: false, 
        error: 'Failed to send verification email. Please try again.' 
      };
    }

    return { 
      success: true, 
      message: 'Verification email sent successfully!' 
    };
  } catch (error) {
    console.error('Resend verification error:', error);
    return { 
      success: false, 
      error: 'Failed to send verification email. Please try again.' 
    };
  }
}

/**
 * Fetches the actual invite code for the current affiliate user
 */
export async function getAffiliateInviteCode() {
  const supabase = createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { 
        success: false, 
        error: 'User not authenticated' 
      };
    }

    // Get the user's invite code from the database
    const { data: inviteCode, error } = await supabaseAdmin
      .from('invite_codes')
      .select('code_text')
      .eq('affiliate_id', user.id)
      .single();

    if (error || !inviteCode) {
      return { 
        success: false, 
        error: 'No invite code found' 
      };
    }

    return { 
      success: true, 
      inviteCode: inviteCode.code_text 
    };
  } catch (error) {
    console.error('Get invite code error:', error);
    return { 
      success: false, 
      error: 'Failed to fetch invite code' 
    };
  }
} 