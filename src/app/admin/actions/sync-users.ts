'use server'

import { supabaseAdmin } from '@/lib/supabase/service'
import { getProfile } from '@/lib/auth/session'

export async function syncAuthUsersToProfiles() {
  // Verify admin access
  const profile = await getProfile()
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  try {
    // Get all auth users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (authError) {
      throw new Error(`Failed to get auth users: ${authError.message}`)
    }

    const authUsers = authData.users || []
    
    // Get existing profiles
    const { data: existingProfiles } = await supabaseAdmin
      .from('profiles')
      .select('id')
    
    const existingIds = new Set(existingProfiles?.map(p => p.id) || [])
    
    // Find users without profiles
    const usersNeedingProfiles = authUsers.filter(user => !existingIds.has(user.id))
    
    const results = {
      totalAuthUsers: authUsers.length,
      existingProfiles: existingIds.size,
      createdProfiles: 0,
      errors: [] as string[]
    }

    // Create missing profiles
    for (const user of usersNeedingProfiles) {
      try {
        // Determine role based on email or metadata
        let role = 'student' // default
        if (user.email?.includes('admin')) {
          role = 'admin'
        } else if (user.user_metadata?.signup_type === 'affiliate' || user.email?.includes('affiliate')) {
          role = 'affiliate'
        }

        const { error: insertError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || 
                      user.user_metadata?.first_name || 
                      user.email?.split('@')[0] || 
                      'User',
            role: role,
            status: 'active',
            created_at: user.created_at,
            updated_at: new Date().toISOString()
          })

        if (insertError) {
          results.errors.push(`Failed to create profile for ${user.email}: ${insertError.message}`)
        } else {
          results.createdProfiles++
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          results.errors.push(`Error processing ${user.email}: ${err.message}`)
        } else {
          results.errors.push(`An unknown error occurred while processing ${user.email}`)
        }
      }
    }

    return results
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Sync failed: ${error.message}`)
    }
    throw new Error(`Sync failed due to an unknown error.`)
  }
} 