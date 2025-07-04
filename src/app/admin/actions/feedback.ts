'use server'

import { supabaseAdmin } from '@/lib/supabase/service'

// Get all feedback with user and segment details
export async function getAllFeedback() {
  const supabase = supabaseAdmin
  
  try {
    const { data: feedback } = await supabase
      .from('feedback')
      .select(`
        *,
        profiles!user_id(
          full_name,
          email,
          role
        ),
        segments(
          title,
          course_id,
          courses(
            title
          )
        )
      `)
      .order('created_at', { ascending: false })
    
    return { feedback: feedback || [] }
  } catch (error) {
    console.error('Error fetching feedback:', error)
    throw new Error('Failed to fetch feedback')
  }
}

// Get feedback by status
export async function getFeedbackByStatus(status: string) {
  const supabase = supabaseAdmin
  
  try {
    const { data: feedback } = await supabase
      .from('feedback')
      .select(`
        *,
        profiles!user_id(
          full_name,
          email,
          role
        ),
        segments(
          title,
          course_id,
          courses(
            title
          )
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    return { feedback: feedback || [] }
  } catch (error) {
    console.error('Error fetching feedback by status:', error)
    throw new Error('Failed to fetch feedback')
  }
}

// Get feedback analytics
export async function getFeedbackAnalytics() {
  const supabase = supabaseAdmin
  
  try {
    // Average ratings by course
    const { data: ratings } = await supabase
      .from('feedback')
      .select(`
        rating,
        segment_id,
        segments(
          course_id,
          courses(
            title
          )
        )
      `)
      .not('rating', 'is', null)
    
    // Feedback volume over time
    const { data: volume } = await supabase
      .from('feedback')
      .select('created_at, status')
      .order('created_at', { ascending: true })
    
    // Response time metrics
    const { data: responseMetrics } = await supabase
      .from('feedback')
      .select('created_at, status')
      .in('status', ['pending', 'responded'])
    
    return {
      ratings: ratings || [],
      volume: volume || [],
      responseMetrics: responseMetrics || []
    }
  } catch (error) {
    console.error('Error fetching feedback analytics:', error)
    throw new Error('Failed to fetch feedback analytics')
  }
}

// Update feedback status
export async function updateFeedbackStatus(
  feedbackId: string,
  status: string
) {
  const supabase = supabaseAdmin
  
  try {
    const { data, error } = await supabase
      .from('feedback')
      .update({ status })
      .eq('id', feedbackId)
      .select()
    
    if (error) throw error
    
    return { success: true, feedback: data[0] }
  } catch (error) {
    console.error('Error updating feedback status:', error)
    throw new Error('Failed to update feedback status')
  }
}

// Bulk update feedback status
export async function bulkUpdateFeedbackStatus(
  feedbackIds: string[],
  status: string
) {
  const supabase = supabaseAdmin
  
  try {
    const { data, error } = await supabase
      .from('feedback')
      .update({ status })
      .in('id', feedbackIds)
      .select()
    
    if (error) throw error
    
    return { success: true, updatedCount: data.length }
  } catch (error) {
    console.error('Error bulk updating feedback status:', error)
    throw new Error('Failed to bulk update feedback status')
  }
} 
