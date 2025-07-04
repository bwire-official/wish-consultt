'use server'

import { supabaseAdmin } from '@/lib/supabase/service'

// Main dashboard overview data
export async function getDashboardOverview() {
  const supabase = supabaseAdmin
  
  try {
    // Get total user counts by role
    const { data: userCounts } = await supabase
      .from('profiles')
      .select('role')
      .eq('status', 'active')
    
    // Get recent user registrations (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { data: recentUsers } = await supabase
      .from('profiles')
      .select('created_at, role')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false })
    
    // Get active courses count
    const { data: coursesCount } = await supabase
      .from('courses')
      .select('id')
    
    // Get pending announcements
    const { data: pendingAnnouncements } = await supabase
      .from('announcements')
      .select('id, title, status')
      .eq('status', 'draft')
    
    return {
      userCounts: userCounts || [],
      recentUsers: recentUsers || [],
      coursesCount: coursesCount?.length || 0,
      pendingAnnouncements: pendingAnnouncements || []
    }
  } catch (error) {
    console.error('Error fetching dashboard overview:', error)
    throw new Error('Failed to fetch dashboard data')
  }
}

// Get system health metrics
export async function getSystemHealth() {
  const supabase = supabaseAdmin
  
  try {
    // Check for any system issues or high-priority items
    const { data: recentFeedback } = await supabase
      .from('feedback')
      .select('rating, created_at')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
    
    return {
      recentFeedback: recentFeedback || []
    }
  } catch (error) {
    console.error('Error fetching system health:', error)
    throw new Error('Failed to fetch system health data')
  }
} 
