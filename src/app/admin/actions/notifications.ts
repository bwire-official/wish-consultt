'use server'

import { supabaseAdmin } from '@/lib/supabase/service'
import { Tables, TablesInsert } from '@/types/supabase'

export type Notification = Tables<'notifications'>
export type NotificationPreference = Tables<'notification_preferences'>

// Get user notifications with pagination
export async function getUserNotifications(
  userId: string,
  page: number = 1,
  limit: number = 20
) {
  const supabase = supabaseAdmin
  
  try {
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: notifications, error, count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('Error fetching notifications:', error)
      throw new Error('Failed to fetch notifications')
    }

    return {
      notifications: notifications || [],
      count: count || 0,
      hasMore: (count || 0) > to + 1
    }
  } catch (error) {
    console.error('Error in getUserNotifications:', error)
    throw new Error('Failed to fetch notifications')
  }
}

// Get unread notification count
export async function getUnreadNotificationCount(userId: string) {
  const supabase = supabaseAdmin
  
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .is('read_at', null)

    if (error) {
      console.error('Error fetching unread count:', error)
      throw new Error('Failed to fetch unread count')
    }

    return { count: count || 0 }
  } catch (error) {
    console.error('Error in getUnreadNotificationCount:', error)
    throw new Error('Failed to fetch unread count')
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: number, userId: string) {
  const supabase = supabaseAdmin
  
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error marking notification as read:', error)
      throw new Error('Failed to mark notification as read')
    }

    return { success: true }
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error)
    throw new Error('Failed to mark notification as read')
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(userId: string) {
  const supabase = supabaseAdmin
  
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('read_at', null)

    if (error) {
      console.error('Error marking all notifications as read:', error)
      throw new Error('Failed to mark all notifications as read')
    }

    return { success: true }
  } catch (error) {
    console.error('Error in markAllNotificationsAsRead:', error)
    throw new Error('Failed to mark all notifications as read')
  }
}

// Delete notification
export async function deleteNotification(notificationId: number, userId: string) {
  const supabase = supabaseAdmin
  
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting notification:', error)
      throw new Error('Failed to delete notification')
    }

    return { success: true }
  } catch (error) {
    console.error('Error in deleteNotification:', error)
    throw new Error('Failed to delete notification')
  }
}

// Get user notification preferences
export async function getNotificationPreferences(userId: string) {
  const supabase = supabaseAdmin
  
  try {
    const { data: preferences, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching notification preferences:', error)
      throw new Error('Failed to fetch notification preferences')
    }

    return { preferences: preferences || [] }
  } catch (error) {
    console.error('Error in getNotificationPreferences:', error)
    throw new Error('Failed to fetch notification preferences')
  }
}

// Update notification preferences
export async function updateNotificationPreferences(
  userId: string,
  preferences: Array<{
    type: string
    email_enabled: boolean
    push_enabled: boolean
    in_app_enabled: boolean
  }>
) {
  const supabase = supabaseAdmin
  
  try {
    // Upsert preferences
    const { error } = await supabase
      .from('notification_preferences')
      .upsert(
        preferences.map(pref => ({
          user_id: userId,
          ...pref
        })),
        { onConflict: 'user_id,type' }
      )

    if (error) {
      console.error('Error updating notification preferences:', error)
      throw new Error('Failed to update notification preferences')
    }

    return { success: true }
  } catch (error) {
    console.error('Error in updateNotificationPreferences:', error)
    throw new Error('Failed to update notification preferences')
  }
}

// Create manual notification (for admin use)
export async function createManualNotification(
  notification: TablesInsert<'notifications'>
) {
  const supabase = supabaseAdmin
  
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single()

    if (error) {
      console.error('Error creating manual notification:', error)
      throw new Error('Failed to create notification')
    }

    return { notification: data, success: true }
  } catch (error) {
    console.error('Error in createManualNotification:', error)
    throw new Error('Failed to create notification')
  }
} 