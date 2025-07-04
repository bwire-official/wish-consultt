'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/service' 
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import * as brevo from '@getbrevo/brevo';
import { render } from '@react-email/render';
import { PasswordResetNoticeEmail } from '@/components/emails/PasswordResetNotice';
import { TablesInsert } from '@/types/supabase';

// --- SIGNUP ACTION ---
export async function signup(formData: FormData) {
  const origin = (await headers()).get('origin');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const inviteCode = formData.get('inviteCode') as string;
  const fullName = `${firstName} ${lastName}`.trim();
  const supabase = createClient(); // This is the user-context client
  
  let inviteData = null;
  
  // Validate invite code if provided
  if (inviteCode && inviteCode.trim()) {
    const validation = await validateInviteCode(inviteCode);
    if (!validation.valid) {
      return redirect(`/signup?message=${encodeURIComponent(validation.error || 'Invalid invite code')}`);
    }
    inviteData = validation.inviteData;
  }

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
  const profileData: TablesInsert<'profiles'> = { 
    id: user.id, 
    email: user.email, 
    full_name: fullName 
  };
  
  // Add invited_by if invite code was used
  if (inviteData) {
    profileData.invited_by = inviteData.affiliate_id;
  }
  
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert(profileData);

  if (profileError) {
    console.error("CRITICAL: Failed to create profile for new user:", profileError);
    // Optional: Add logic here to delete the auth user if profile creation fails, to prevent orphaned users.
    return redirect('/signup?message=Could not create user profile.');
  }

  // ✅ SECURE: Check if this should be the first admin user
  try {
    await checkAndPromoteFirstAdmin(user.id, email);
  } catch (error) {
    console.error('Admin promotion check failed:', error);
    // Don't fail signup for this, just log
  }
  
  // Step 2.5: If invite code was used, increment the uses count
  if (inviteData) {
    const { error: updateError } = await supabaseAdmin
      .from('invite_codes')
      .update({ uses: inviteData.uses + 1 })
      .eq('id', inviteData.id);
      
    if (updateError) {
      console.error("Failed to update invite code usage:", updateError);
      // Don't fail the signup for this, just log it
    }
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

  // Input validation
  if (!identity || !password || typeof identity !== 'string' || typeof password !== 'string') {
    return { success: false, error: 'Please enter both email/username and password' };
  }

  // 1. Determine if the user provided an email or a username
  if (identity.includes('@')) {
    // If it contains '@', assume it's an email
    emailForLogin = identity;
  } else {
    // Otherwise, assume it's a username and find the associated email
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', identity)
        .single();

      if (error || !profile || !profile.email) {
        // SECURITY: Don't reveal whether username exists or not
        return { success: false, error: 'Invalid credentials' };
      }
      emailForLogin = profile.email;
    } catch (error) {
      console.error('Username lookup error:', error);
      return { success: false, error: 'Invalid credentials' };
    }
  }

  // 2. Attempt to sign in the user with the found email
  try {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email: emailForLogin,
      password,
    });

    if (error) {
      // SECURITY: Generic error message for all authentication failures
      return { success: false, error: 'Invalid credentials' };
    }

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    // 3. Get the user's profile to check their role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, onboarding_completed')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile lookup error:', profileError);
      return { success: false, error: 'Authentication failed' };
    }

    if (!profile) {
      return { success: false, error: 'Authentication failed' };
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
    return { success: false, error: 'Authentication failed' };
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

  return redirect('/login?message=Password updated successfully. Please log in.&status=success');
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
    
    // ✅ SECURE: Check if this should be the first admin user
    try {
      await checkAndPromoteFirstAdmin(user.id, email);
    } catch (error) {
      console.error('Admin promotion check failed:', error);
      // Don't fail signup for this, just log
    }
    
    return redirect(`/verify-email?email=${email}`);
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return redirect('/signup?message=Unexpected error occurred.');
  }
}

/**
 * Handles Step 1 of the password reset flow.
 * Checks if a user exists and sends them a 6-digit OTP code.
 * SECURITY: Always returns success to prevent user enumeration.
 */
export async function requestPasswordReset(formData: FormData) {
  const identity = formData.get('identity') as string;
  const supabase = createClient();
  
  // Input validation
  if (!identity || typeof identity !== 'string') {
    return redirect('/forgot-password?message=Please enter your email or username.');
  }

  try {
    // 1. Find the user by either email or username
    let profileQuery = supabase.from('profiles').select('email, role');
    if (identity.includes('@')) {
      profileQuery = profileQuery.eq('email', identity);
    } else {
      profileQuery = profileQuery.eq('username', identity);
    }
    
    const { data: profile, error: profileError } = await profileQuery.single();

    // 2. Only proceed if user exists and is not an affiliate
    if (!profileError && profile && profile.email) {
      const userRole = profile.role;
      const emailToReset = profile.email;

      // Handle affiliate users by redirecting them (but don't reveal if user exists)
      if (userRole === 'affiliate') {
        return redirect('/affiliate/forgot-password?message=Please use the affiliate portal for password reset.');
      }

      // Send the password reset OTP for valid users
      const { error } = await supabase.auth.resetPasswordForEmail(emailToReset);
      
      if (error) {
        console.error("Error sending password reset OTP:", error);
        // Still redirect to success to prevent enumeration
      }
    }

    // SECURITY: Always redirect to success page regardless of whether user exists
    // This prevents attackers from determining which users are registered
    const isResend = formData.get('resend') === 'true';
    const successMessage = isResend ? '&message=If an account exists with that information, a verification code has been resent.&status=success' : '';
    return redirect(`/forgot-password/verify?email=${encodeURIComponent(identity)}${successMessage}`);

  } catch (error) {
    console.error("Unexpected error in requestPasswordReset:", error);
    // Even on error, don't reveal information about user existence
    return redirect(`/forgot-password/verify?email=${encodeURIComponent(identity)}&message=If an account exists with that information, a verification code has been sent.&status=success`);
  }
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

  // Step 1: Get the current user's details before updating
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/forgot-password?message=Authentication session expired.');
  }

  // Step 2: Update the password in Supabase Auth
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("Final Password Update Error:", error);
    const message = error.message || 'Failed to update password.';
    return redirect(`/forgot-password/reset?message=${encodeURIComponent(message)}`);
  }

  // --- NEW: Send Security Notification via Brevo ---
  // Step 3: On success, send the security alert email.
  try {
    const api = new brevo.TransactionalEmailsApi();
    api.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);
    
    // Convert our React component to an HTML string
    const emailHtml = await render(
      await PasswordResetNoticeEmail({
        userFullName: user.user_metadata.full_name,
        resetTime: new Date().toUTCString(),
      })
    );

    await api.sendTransacEmail({
      sender: { email: 'security@mail.wishconsult.app', name: 'Wish Consult Security' },
      to: [{ email: user.email! }],
      subject: 'Security Alert: Your Wish Consult Password Was Changed',
      htmlContent: emailHtml,
    });

  } catch (emailError) {
    console.error("Failed to send password reset notice via Brevo:", emailError);
    // Do not block the user if the email fails. Just log the error.
  }
  
  // Step 4: Redirect to login with a success message.
  return redirect('/login?message=Password updated successfully. Please log in.&status=success');
};

// --- INVITE CODE VALIDATION (INTERNAL USE ONLY) ---
async function validateInviteCode(inviteCode: string) {
  if (!inviteCode || inviteCode.trim() === '') {
    return { valid: false, error: 'Please enter an invite code' };
  }

  // Use admin client to bypass RLS for invite code validation
  try {
    console.log('Validating invite code:', inviteCode.trim());
    
    const { data: inviteData, error } = await supabaseAdmin
      .from('invite_codes')
      .select('id, affiliate_id, code_text, is_active, uses')
      .eq('code_text', inviteCode.trim())
      .single();

    console.log('Query result:', { inviteData, error });

    if (error || !inviteData) {
      console.log('Invite code not found or error:', error);
      return { valid: false, error: 'Invalid invite code' };
    }

    if (!inviteData.is_active) {
      console.log('Invite code is inactive');
      return { valid: false, error: 'This invite code is no longer active' };
    }

    console.log('Invite code is valid');
    return { 
      valid: true, 
      inviteData: {
        id: inviteData.id,
        affiliate_id: inviteData.affiliate_id,
        uses: inviteData.uses
      }
    };
  } catch (error) {
    console.error('Error validating invite code:', error);
    return { valid: false, error: 'Failed to validate invite code' };
  }
}

// --- SECURE INVITE CODE VALIDATION FOR CLIENT USE ---
export async function validateInviteCodeSecure(inviteCode: string) {
  // Input validation
  if (!inviteCode || typeof inviteCode !== 'string' || inviteCode.trim().length === 0) {
    return { valid: false, error: 'Please enter an invite code' };
  }

  // Rate limiting could be added here
  const trimmedCode = inviteCode.trim();
  
  // Validate code length (assuming reasonable limits)
  if (trimmedCode.length < 3 || trimmedCode.length > 20) {
    return { valid: false, error: 'Invalid invite code format' };
  }

  try {
    // Use the internal validation function (server-side only)
    return await validateInviteCode(trimmedCode);
  } catch (error) {
    console.error('Error in secure invite code validation:', error);
    return { valid: false, error: 'Unable to validate invite code at this time' };
  }
}

// ✅ SECURE: Environment-based admin creation
async function checkAndPromoteFirstAdmin(userId: string, email: string) {
  const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
  
  if (!SUPER_ADMIN_EMAIL) {
    return; // No super admin configured
  }

  // Check if this is the super admin email
  if (email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
    return; // Not the super admin
  }

  // Check if any admins already exist
  const { data: existingAdmins } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('role', 'admin')
    .limit(1);

  if (existingAdmins && existingAdmins.length > 0) {
    console.log('Admin already exists, skipping auto-promotion');
    return; // Admin already exists
  }

  // Promote to admin with audit trail
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ 
      role: 'admin',
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (!error) {
    console.log(`🚀 SUPER ADMIN PROMOTED: ${email} (${userId})`);
    
    // Create audit trail
    try {
      await supabaseAdmin
        .from('admin_promotions')
        .insert({
          user_id: userId,
          promoted_by: 'SYSTEM',
          reason: 'First-time super admin setup',
          promoted_at: new Date().toISOString()
        });
      console.log('Audit trail created');
    } catch {
      console.log('Audit table not found or error - promotion still successful');
    }
  }
}