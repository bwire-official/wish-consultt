'use server'

import { supabaseAdmin } from '@/lib/supabase/service'

// Get scheduled events and announcements
export async function getCalendarEvents() {
  const supabase = supabaseAdmin
  
  try {
    // Scheduled announcements
    const { data: scheduledAnnouncements } = await supabase
      .from('announcements')
      .select(`
        id,
        title,
        scheduled_for,
        status,
        priority,
        target_audience,
        created_by
      `)
      .not('scheduled_for', 'is', null)
      .order('scheduled_for', { ascending: true })
    
    // Get system maintenance windows or important dates
    // This could be expanded to include course launch dates, etc.
    
    return {
      scheduledAnnouncements: scheduledAnnouncements || []
    }
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    throw new Error('Failed to fetch calendar data')
  }
}

// Update announcement schedule
export async function updateAnnouncementSchedule(
  announcementId: number,
  scheduledFor: string | null
) {
  const supabase = supabaseAdmin
  
  try {
    const { data, error } = await supabase
      .from('announcements')
      .update({ 
        scheduled_for: scheduledFor,
        updated_at: new Date().toISOString()
      })
      .eq('id', announcementId)
      .select()
    
    if (error) throw error
    
    return { success: true, data }
  } catch (error) {
    console.error('Error updating announcement schedule:', error)
    throw new Error('Failed to update announcement schedule')
  }
} 
