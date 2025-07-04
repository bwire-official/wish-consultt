'use server'

import { supabaseAdmin } from '@/lib/supabase/service'

// Get general platform analytics
export async function getGeneralAnalytics() {
  const supabase = supabaseAdmin
  
  try {
    // User growth over time
    const { data: userGrowth } = await supabase
      .from('profiles')
      .select('created_at, role')
      .order('created_at', { ascending: true })
    
    // Course completion rates
    const { data: courseProgress } = await supabase
      .from('progress')
      .select(`
        is_completed,
        segment_id,
        segments (
          course_id,
          courses (
            title
          )
        )
      `)
    
    // Platform engagement metrics
    const { data: recentActivity } = await supabase
      .from('progress')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
    
    return {
      userGrowth: userGrowth || [],
      courseProgress: courseProgress || [],
      recentActivity: recentActivity || []
    }
  } catch (error) {
    console.error('Error fetching general analytics:', error)
    throw new Error('Failed to fetch analytics data')
  }
} 
