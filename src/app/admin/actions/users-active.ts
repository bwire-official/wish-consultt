'use server'

import { supabaseAdmin } from '@/lib/supabase/service'

// Get currently active users (based on recent activity)
export async function getActiveUsers() {
  const supabase = supabaseAdmin
  
  try {
    // Consider users active if they've had progress in the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { data: activeUsers } = await supabase
      .from('progress')
      .select(`
        user_id,
        created_at,
        profiles!user_id(
          id,
          full_name,
          email,
          role,
          created_at,
          status,
          country,
          last_seen:updated_at
        )
      `)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
    
    // Remove duplicates by user_id and get most recent activity
    const uniqueActiveUsers = activeUsers?.reduce((acc, current) => {
      const existingUser = acc.find(user => user.profiles?.id === current.profiles?.id)
      if (!existingUser || new Date(current.created_at) > new Date(existingUser.created_at)) {
        return [...acc.filter(user => user.profiles?.id !== current.profiles?.id), current]
      }
      return acc
    }, [] as typeof activeUsers) || []
    
    return { activeUsers: uniqueActiveUsers }
  } catch (error) {
    console.error('Error fetching active users:', error)
    throw new Error('Failed to fetch active users')
  }
}

// Get user activity patterns
export async function getUserActivityPatterns() {
  const supabase = supabaseAdmin
  
  try {
    // Get activity by hour of day
    const { data: hourlyActivity } = await supabase
      .from('progress')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
    
    // Get activity by day of week
    const { data: dailyActivity } = await supabase
      .from('progress')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    
    return {
      hourlyActivity: hourlyActivity || [],
      dailyActivity: dailyActivity || []
    }
  } catch (error) {
    console.error('Error fetching activity patterns:', error)
    throw new Error('Failed to fetch activity patterns')
  }
}

// Get online users (this would need real-time presence tracking)
export async function getOnlineUsers() {
  const supabase = supabaseAdmin
  
  try {
    // For now, consider users online if they've been active in the last 15 minutes
    const fifteenMinutesAgo = new Date()
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15)
    
    const { data: onlineUsers } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        role,
        updated_at
      `)
      .gte('updated_at', fifteenMinutesAgo.toISOString())
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
    
    return { onlineUsers: onlineUsers || [] }
  } catch (error) {
    console.error('Error fetching online users:', error)
    throw new Error('Failed to fetch online users')
  }
} 
