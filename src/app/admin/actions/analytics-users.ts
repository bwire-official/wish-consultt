'use server'

import { supabaseAdmin } from '@/lib/supabase/service'

// Get user analytics data
export async function getUserAnalytics() {
  const supabase = supabaseAdmin
  
  try {
    // User demographics and growth
    const { data: userDemographics } = await supabase
      .from('profiles')
      .select(`
        role,
        country,
        education_level,
        experience_level,
        created_at,
        status,
        onboarding_completed,
        professional_role,
        specialization
      `)
    
    // User engagement patterns
    const { data: userEngagement } = await supabase
      .from('progress')
      .select(`
        user_id,
        created_at,
        is_completed,
        profiles!user_id(
          role,
          created_at,
          country
        )
      `)
    
    // User retention metrics
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { data: activeUsers } = await supabase
      .from('progress')
      .select(`
        user_id,
        created_at,
        profiles!user_id(role, created_at)
      `)
      .gte('created_at', sevenDaysAgo.toISOString())
    
    return {
      userDemographics: userDemographics || [],
      userEngagement: userEngagement || [],
      activeUsers: activeUsers || []
    }
  } catch (error) {
    console.error('Error fetching user analytics:', error)
    throw new Error('Failed to fetch user analytics data')
  }
}

// Get user lifecycle metrics
export async function getUserLifecycle() {
  const supabase = supabaseAdmin
  
  try {
    // Onboarding completion rates
    const { data: onboardingData } = await supabase
      .from('profiles')
      .select('onboarding_completed, role, created_at')
    
    // Time to first course engagement
    const { data: firstEngagement } = await supabase
      .from('progress')
      .select(`
        user_id,
        created_at,
        profiles!user_id(created_at)
      `)
      .order('created_at', { ascending: true })
    
    return {
      onboardingData: onboardingData || [],
      firstEngagement: firstEngagement || []
    }
  } catch (error) {
    console.error('Error fetching user lifecycle data:', error)
    throw new Error('Failed to fetch user lifecycle data')
  }
} 
