import { createClient } from '@/lib/supabase/server'
import { AppError } from '@/utils/error-handling'
import { type Profile } from '@/types'

// Define Json type locally since it's not exported by @supabase/supabase-js
type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export async function getSession() {
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Session Error:', error.message)
    throw new AppError('Failed to get session', 500, 'SESSION_ERROR')
  }

  return session
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Profile Fetch Error:', error.message)
    return null
  }

  // Map the database result to our Profile interface
  return {
    id: profile.id,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    username: profile.username,
    email: profile.email,
    full_name: profile.full_name,
    phone_number: profile.phone_number,
    role: profile.role,
    status: profile.status,
    onboarding_data: profile.onboarding_data,
    invited_by: profile.invited_by,
    avatar_url: (profile as Record<string, unknown>).avatar_url as string | null,
    is_premium: (profile as Record<string, unknown>).is_premium as boolean,
    onboarding_completed: (profile as Record<string, unknown>).onboarding_completed as boolean
  } as Profile
}

export async function updateProfile(
  updates: Partial<Profile>
): Promise<Profile> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new AppError('Authentication required', 401, 'AUTH_REQUIRED')
  }

  // Ensure onboarding_data is compatible with Json type and include all updates
  const safeUpdates = {
    ...updates,
    onboarding_data: updates.onboarding_data !== undefined
      ? updates.onboarding_data as Json
      : undefined,
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .update(safeUpdates)
    .eq('id', user.id)
    .select('*')
    .single()

  if (error || !profile) {
    console.error('Profile Update Error:', error?.message)
    throw new AppError('Failed to update profile', 500, 'UPDATE_ERROR')
  }

  // Map the database result to our Profile interface (same as getProfile)
  return {
    id: profile.id,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    username: profile.username,
    email: profile.email,
    full_name: profile.full_name,
    phone_number: profile.phone_number,
    role: profile.role,
    status: profile.status,
    onboarding_data: profile.onboarding_data,
    invited_by: profile.invited_by,
    avatar_url: (profile as Record<string, unknown>).avatar_url as string | null,
    is_premium: (profile as Record<string, unknown>).is_premium as boolean,
    onboarding_completed: (profile as Record<string, unknown>).onboarding_completed as boolean
  } as Profile
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Signout Error:', error.message)
    throw new AppError('Failed to sign out', 500, 'SIGNOUT_ERROR')
  }
}

export async function getAnnouncementsForUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  // We need the user's role to check for role-based announcements
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile) return [];

  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('status', 'published')
    // This 'or' clause is the key. It finds all announcements that are either:
    // 1. For everyone ('all')
    // 2. For the user's specific role (e.g., 'students')
    // 3. Sent directly to this specific user's ID
    .or(`target_audience.eq.all,target_audience.eq.${profile.role},and(target_audience.eq.user,target_user_id.eq.${user.id})`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }

  return data;
}
