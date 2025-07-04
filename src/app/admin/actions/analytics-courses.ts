'use server'

import { supabaseAdmin } from '@/lib/supabase/service'

// Get course analytics data
export async function getCourseAnalytics() {
  const supabase = supabaseAdmin
  
  try {
    // Course enrollment and completion rates
    const { data: courseMetrics } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        category,
        is_free,
        created_at,
        segments(
          id,
          progress(
            user_id,
            is_completed
          )
        )
      `)
    
    // Most popular courses by enrollment
    const { data: popularCourses } = await supabase
      .from('progress')
      .select(`
        segment_id,
        segments(
          course_id,
          courses(
            title,
            category
          )
        )
      `)
    
    // Course completion time analysis
    const { data: completionTimes } = await supabase
      .from('progress')
      .select(`
        created_at,
        is_completed,
        segment_id,
        segments(
          course_id,
          segment_order,
          courses(title)
        )
      `)
      .eq('is_completed', true)
      .order('created_at', { ascending: true })
    
    return {
      courseMetrics: courseMetrics || [],
      popularCourses: popularCourses || [],
      completionTimes: completionTimes || []
    }
  } catch (error) {
    console.error('Error fetching course analytics:', error)
    throw new Error('Failed to fetch course analytics data')
  }
} 
