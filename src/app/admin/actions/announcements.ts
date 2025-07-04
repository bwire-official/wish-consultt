'use server'

import { supabaseAdmin } from '@/lib/supabase/service'
import { Tables, TablesInsert, TablesUpdate, Json } from '@/types/supabase'
import { getProfile } from '@/lib/auth/session'

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMITS = {
  ANNOUNCEMENT_CREATE: { limit: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour
  ANNOUNCEMENT_PUBLISH: { limit: 20, windowMs: 60 * 60 * 1000 }, // 20 per hour
  ANNOUNCEMENT_DELETE: { limit: 5, windowMs: 60 * 60 * 1000 }   // 5 per hour
}

// Rate limiting function
function checkRateLimit(userId: string, action: keyof typeof RATE_LIMITS): boolean {
  const key = `${userId}-${action}`
  const config = RATE_LIMITS[action]
  const now = Date.now()
  
  const userLimit = rateLimitStore.get(key)
  
  if (!userLimit || now > userLimit.resetTime) {
    // Reset window
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs })
    return true
  }
  
  if (userLimit.count >= config.limit) {
    return false
  }
  
  userLimit.count++
  return true
}

// Audit logging function
async function createAuditLog(
  adminId: string,
  action: string,
  resourceType: string,
  resourceId: string | number,
  details: Record<string, Json>,
  ipAddress?: string
) {
  const supabase = supabaseAdmin
  
  try {
    await supabase.from('admin_audit_trail').insert({
      admin_id: adminId,
      action,
      resource_type: resourceType,
      resource_id: resourceId.toString(),
      details,
      ip_address: ipAddress,
      created_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
    // Don't throw - audit logging shouldn't break the main operation
  }
}

// Enhanced announcement interface matching the database structure
export interface AdminAnnouncement extends Tables<'announcements'> {
  created_by_profile?: {
    full_name: string | null
    email: string | null
    username: string | null
  } | null
  target_user_profile?: {
    full_name: string | null
    email: string | null
    username: string | null
  } | null
}

// Get announcements with pagination and search
export async function getAdminAnnouncements(
  searchQuery?: string, 
  page: number = 1, 
  limit: number = 20,
  statusFilter?: string,
  priorityFilter?: string,
  audienceFilter?: string
) {
  // Verify admin access
  const profile = await getProfile()
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  const supabase = supabaseAdmin
  
  try {
    // Calculate offset for pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    // Enhanced query with admin profile information
    let query = supabase
      .from('announcements')
      .select(`
        *,
        created_by_profile:profiles!created_by(
          full_name,
          email,
          username
        ),
        target_user_profile:profiles!target_user_id(
          full_name,
          email,
          username
        )
      `, { count: 'exact' })

    // Apply search filter
    if (searchQuery && searchQuery.trim().length > 0) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
    }

    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    // Apply priority filter  
    if (priorityFilter && priorityFilter !== 'all') {
      query = query.eq('priority', priorityFilter)
    }

    // Apply audience filter
    if (audienceFilter && audienceFilter !== 'all') {
      query = query.eq('target_audience', audienceFilter)
    }

    // Apply pagination and ordering
    const { data: announcements, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('Error fetching announcements:', error)
      throw new Error('Failed to fetch announcements')
    }

    // Convert to AdminAnnouncement format with proper profile data
    const enhancedAnnouncements: AdminAnnouncement[] = (announcements || []).map(announcement => ({
      ...announcement,
      // Use the actual fetched profile data instead of null
      created_by_profile: announcement.created_by_profile || null,
      target_user_profile: announcement.target_user_profile || null
    }))
    
    // Calculate pagination metadata
    const totalPages = Math.ceil((count ?? 0) / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
    return { 
      announcements: enhancedAnnouncements,
      count: count ?? 0,
      pagination: {
        currentPage: page,
        totalPages,
        limit,
        hasNextPage,
        hasPrevPage,
        from: from + 1,
        to: Math.min(to + 1, count ?? 0)
      }
    }
  } catch (error) {
    console.error('Error fetching admin announcements:', error)
    throw new Error('Failed to fetch announcements')
  }
}

// Get announcement statistics for dashboard
export async function getAnnouncementStats() {
  // Verify admin access
  const profile = await getProfile()
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  const supabase = supabaseAdmin
  
  try {
    // Get all announcements for counting
    const { data: announcements } = await supabase
      .from('announcements')
      .select('status, views, engagement_rate')

    if (!announcements) {
      return {
        publishedCount: 0,
        scheduledCount: 0,
        draftCount: 0,
        archivedCount: 0,
        totalViews: 0,
        avgEngagement: 0
      }
    }

    const publishedCount = announcements.filter(a => a.status === 'published').length
    const scheduledCount = announcements.filter(a => a.status === 'scheduled').length
    const draftCount = announcements.filter(a => a.status === 'draft').length
    const archivedCount = announcements.filter(a => a.status === 'archived').length
    const totalViews = announcements.reduce((sum, a) => sum + (a.views || 0), 0)
    const avgEngagement = announcements.length > 0 
      ? announcements.reduce((sum, a) => sum + (a.engagement_rate || 0), 0) / announcements.length
      : 0

    return {
      publishedCount,
      scheduledCount,
      draftCount,
      archivedCount,
      totalViews,
      avgEngagement: Math.round(avgEngagement * 100) / 100
    }
  } catch (error) {
    console.error('Error fetching announcement stats:', error)
    throw new Error('Failed to fetch announcement statistics')
  }
}

// Create new announcement
export async function createAdminAnnouncement(data: Omit<TablesInsert<'announcements'>, 'created_by'>) {
  // Verify admin access
  const profile = await getProfile()
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  // Check rate limit
  if (!checkRateLimit(profile.id, 'ANNOUNCEMENT_CREATE')) {
    throw new Error('Rate limit exceeded. You can only create 10 announcements per hour.')
  }

  const supabase = supabaseAdmin
  
  try {
    const { data: announcement, error } = await supabase
      .from('announcements')
      .insert({
        ...data,
        created_by: profile.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: data.status === 'published' ? new Date().toISOString() : null
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating announcement:', error)
      throw new Error('Failed to create announcement')
    }

    // Create audit log
    await createAuditLog(
      profile.id,
      'ANNOUNCEMENT_CREATED',
      'announcement',
      announcement.id,
      {
        title: announcement.title,
        status: announcement.status,
        target_audience: announcement.target_audience,
        priority: announcement.priority,
        admin_name: profile.full_name || profile.email || 'Unknown Admin'
      }
    )

    // IF CREATED AS PUBLISHED, TRIGGER NOTIFICATION CREATION
    let debugInfo: {
      title: string;
      target_audience: string | null;
      target_user_id: string | null;
      notificationsCreated: number;
      errors: string[];
    } | null = null
    if (data.status === 'published') {
      debugInfo = {
        title: announcement.title,
        target_audience: announcement.target_audience,
        target_user_id: announcement.target_user_id,
        notificationsCreated: 0,
        errors: [] as string[]
      }

      try {
        // Get target users based on target_audience
        let targetUsers: { id: string; role?: string; status?: string }[] = []
        
        if (announcement.target_audience === 'all') {
          const { data: allUsers, error: usersError } = await supabase
            .from('profiles')
            .select('id, role, status')
          
          if (usersError) {
            debugInfo.errors.push(`Error fetching all users: ${usersError.message}`)
          } else {
            targetUsers = allUsers || []
          }
        } else if (announcement.target_audience === 'user' && announcement.target_user_id) {
          targetUsers = [{ id: announcement.target_user_id }]
        } else if (['students', 'affiliates', 'admins'].includes(announcement.target_audience || '')) {
          // Map plural target_audience to singular role values for database query
          const roleMap: Record<string, string> = {
            'students': 'student',
            'affiliates': 'affiliate', 
            'admins': 'admin'
          }
          const roleToMatch = roleMap[announcement.target_audience || ''] || 'student'

          const { data: roleUsers, error: roleError } = await supabase
            .from('profiles')
            .select('id, role, status')
            .eq('role', roleToMatch)
          
          if (roleError) {
            debugInfo.errors.push(`Error fetching users for role ${roleToMatch}: ${roleError.message}`)
          } else {
            targetUsers = roleUsers || []
          }
        }

        // Log detailed debug info
        debugInfo.errors.push(`Found ${targetUsers.length} target users for audience: ${announcement.target_audience}`)
        
        // Show role mapping if applicable
        if (['students', 'affiliates', 'admins'].includes(announcement.target_audience || '')) {
          const roleMap: Record<string, string> = {
            'students': 'student',
            'affiliates': 'affiliate', 
            'admins': 'admin'
          }
          const mappedRole = roleMap[announcement.target_audience || '']
          debugInfo.errors.push(`Mapped "${announcement.target_audience}" to database role: "${mappedRole}"`)
        }
        
        // Log each user found for debugging
        if (targetUsers.length > 0) {
          targetUsers.slice(0, 3).forEach((user, i) => {
            debugInfo!.errors.push(`User ${i+1}: ID=${user.id.substring(0,8)}..., Role=${user.role || 'N/A'}, Status=${user.status || 'N/A'}`)
          })
          if (targetUsers.length > 3) {
            debugInfo!.errors.push(`... and ${targetUsers.length - 3} more users`)
          }
        } else {
          debugInfo!.errors.push(`❌ No users found - Check: audience="${announcement.target_audience}", expected database roles: student/affiliate/admin`)
        }
        
        // Create notifications for all target users
        if (targetUsers.length > 0) {
          const notifications = targetUsers.map(user => ({
            user_id: user.id,
            type: 'announcement',
            category: 'system',
            title: announcement.title,
            message: announcement.content,
            data: { announcement_id: announcement.id },
            action_url: `/announcements/${announcement.id}`,
            priority: announcement.priority || 'medium',
            icon: 'megaphone'
          }))

          const { data: createdNotifications, error: notifError } = await supabase
            .from('notifications')
            .insert(notifications)
            .select('id')

          if (notifError) {
            debugInfo.errors.push(`Error creating notifications: ${notifError.message}`)
          } else {
            debugInfo.notificationsCreated = createdNotifications?.length || 0
          }
        } else {
          debugInfo.errors.push('No target users found for the specified audience')
        }
      } catch (notifError: unknown) {
        if (notifError instanceof Error) {
          debugInfo.errors.push(`Notification creation failed: ${notifError.message}`)
        } else {
          debugInfo.errors.push(`An unknown error occurred during notification creation.`)
        }
      }
    }

    return { 
      success: true, 
      announcement,
      debug: debugInfo // Return debug info to client (only when published)
    }
  } catch (error) {
    console.error('Error creating admin announcement:', error)
    throw new Error('Failed to create announcement')
  }
}

// Update existing announcement
export async function updateAdminAnnouncement(
  id: number, 
  updates: TablesUpdate<'announcements'>
) {
  // Verify admin access
  const profile = await getProfile()
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  const supabase = supabaseAdmin
  
  try {
    const { data: announcement, error } = await supabase
      .from('announcements')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating announcement:', error)
      throw new Error('Failed to update announcement')
    }

    return { success: true, announcement }
  } catch (error) {
    console.error('Error updating admin announcement:', error)
    throw new Error('Failed to update announcement')
  }
}

// Delete announcement
export async function deleteAdminAnnouncement(id: number) {
  // Verify admin access
  const profile = await getProfile()
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  // Check rate limit
  if (!checkRateLimit(profile.id, 'ANNOUNCEMENT_DELETE')) {
    throw new Error('Rate limit exceeded. You can only delete 5 announcements per hour.')
  }

  const supabase = supabaseAdmin
  
  try {
    // Get announcement details before deletion for audit log
    const { data: announcementToDelete } = await supabase
      .from('announcements')
      .select('title, status, target_audience')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting announcement:', error)
      throw new Error('Failed to delete announcement')
    }

    // Create audit log
    if (announcementToDelete) {
      await createAuditLog(
        profile.id,
        'ANNOUNCEMENT_DELETED',
        'announcement',
        id,
        {
          title: announcementToDelete.title,
          status: announcementToDelete.status,
          target_audience: announcementToDelete.target_audience,
          admin_name: profile.full_name || profile.email || 'Unknown Admin'
        }
      )
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting admin announcement:', error)
    throw new Error('Failed to delete announcement')
  }
}

// Publish announcement (change status to published)
export async function publishAdminAnnouncement(id: number) {
  // Verify admin access
  const profile = await getProfile()
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  // Check rate limit
  if (!checkRateLimit(profile.id, 'ANNOUNCEMENT_PUBLISH')) {
    throw new Error('Rate limit exceeded. You can only publish 20 announcements per hour.')
  }

  const supabase = supabaseAdmin
  
  try {
    // First, update the announcement
    const { data: announcement, error } = await supabase
      .from('announcements')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error publishing announcement:', error)
      throw new Error('Failed to publish announcement')
    }

    // Create audit log
    await createAuditLog(
      profile.id,
      'ANNOUNCEMENT_PUBLISHED',
      'announcement',
      announcement.id,
      {
        title: announcement.title,
        target_audience: announcement.target_audience,
        admin_name: profile.full_name || profile.email || 'Unknown Admin'
      }
    )

    // MANUAL NOTIFICATION CREATION WITH BETTER DEBUGGING
    const debugInfo = {
      title: announcement.title,
      target_audience: announcement.target_audience,
      target_user_id: announcement.target_user_id,
      notificationsCreated: 0,
      errors: [] as string[]
    }

    try {
      // Get target users based on target_audience
      let targetUsers: { id: string; role?: string; status?: string }[] = []
      
      if (announcement.target_audience === 'all') {
        const { data: allUsers, error: usersError } = await supabase
          .from('profiles')
          .select('id, role, status')
        
        if (usersError) {
          debugInfo.errors.push(`Error fetching all users: ${usersError.message}`)
        } else {
          targetUsers = allUsers || []
        }
      } else if (announcement.target_audience === 'user' && announcement.target_user_id) {
        targetUsers = [{ id: announcement.target_user_id }]
      } else if (['students', 'affiliates', 'admins'].includes(announcement.target_audience || '')) {
        // Map plural target_audience to singular role values for database query
        const roleMap: Record<string, string> = {
          'students': 'student',
          'affiliates': 'affiliate', 
          'admins': 'admin'
        }
        const roleToMatch = roleMap[announcement.target_audience || ''] || 'student'

        const { data: roleUsers, error: roleError } = await supabase
          .from('profiles')
          .select('id, role, status')
          .eq('role', roleToMatch)
        
        if (roleError) {
          debugInfo.errors.push(`Error fetching users for role ${roleToMatch}: ${roleError.message}`)
        } else {
          targetUsers = roleUsers || []
        }
      }

      // Log detailed debug info
      debugInfo.errors.push(`Found ${targetUsers.length} target users for audience: ${announcement.target_audience}`)
      
      // Show role mapping if applicable
      if (['students', 'affiliates', 'admins'].includes(announcement.target_audience || '')) {
        const roleMap: Record<string, string> = {
          'students': 'student',
          'affiliates': 'affiliate', 
          'admins': 'admin'
        }
        const mappedRole = roleMap[announcement.target_audience || '']
        debugInfo.errors.push(`Mapped "${announcement.target_audience}" to database role: "${mappedRole}"`)
      }
      
      // Log each user found for debugging
      if (targetUsers.length > 0) {
        targetUsers.slice(0, 3).forEach((user, i) => {
          debugInfo.errors.push(`User ${i+1}: ID=${user.id.substring(0,8)}..., Role=${user.role || 'N/A'}, Status=${user.status || 'N/A'}`)
        })
        if (targetUsers.length > 3) {
          debugInfo.errors.push(`... and ${targetUsers.length - 3} more users`)
        }
      } else {
        debugInfo.errors.push(`❌ No users found - Check: audience="${announcement.target_audience}", expected database roles: student/affiliate/admin`)
      }
      
      // Create notifications for all target users
      if (targetUsers.length > 0) {
        const notifications = targetUsers.map(user => ({
          user_id: user.id,
          type: 'announcement',
          category: 'system',
          title: announcement.title,
          message: announcement.content,
          data: { announcement_id: announcement.id },
          action_url: `/announcements/${announcement.id}`,
          priority: announcement.priority || 'medium',
          icon: 'megaphone'
        }))

        const { data: createdNotifications, error: notifError } = await supabase
          .from('notifications')
          .insert(notifications)
          .select('id')

        if (notifError) {
          debugInfo.errors.push(`Error creating notifications: ${notifError.message}`)
        } else {
          debugInfo.notificationsCreated = createdNotifications?.length || 0
        }
      } else {
        debugInfo.errors.push('No target users found for the specified audience')
      }
    } catch (notifError: unknown) {
      if (notifError instanceof Error) {
        debugInfo.errors.push(`Notification creation failed: ${notifError.message}`)
      } else {
        debugInfo.errors.push(`An unknown error occurred during notification creation.`)
      }
    }

    return { 
      success: true, 
      announcement,
      debug: debugInfo // Return debug info to client
    }
  } catch (error) {
    console.error('Error publishing admin announcement:', error)
    throw new Error('Failed to publish announcement')
  }
}

// Archive announcement
export async function archiveAdminAnnouncement(id: number) {
  // Verify admin access
  const profile = await getProfile()
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  const supabase = supabaseAdmin
  
  try {
    const { data: announcement, error } = await supabase
      .from('announcements')
      .update({
        status: 'archived',
        archived_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error archiving announcement:', error)
      throw new Error('Failed to archive announcement')
    }

    return { success: true, announcement }
  } catch (error) {
    console.error('Error archiving admin announcement:', error)
    throw new Error('Failed to archive announcement')
  }
}

// Search users for specific targeting (secure version)
export async function searchUsersForAnnouncements(searchQuery: string) {
  // Verify admin access
  const profile = await getProfile()
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  const supabase = supabaseAdmin
  
  try {
    if (searchQuery.trim().length < 2) {
      return { users: [] }
    }

    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, username, role, avatar_url')
      .or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`)
      .limit(10)

    if (error) {
      console.error('Error searching users:', error)
      throw new Error('Failed to search users')
    }

    return { users: users || [] }
  } catch (error) {
    console.error('Error in searchUsersForAnnouncements:', error)
    throw new Error('Failed to search users')
  }
}

// Export ALL users data as CSV (with search support)
export async function exportAnnouncementUsersData(searchQuery?: string) {
  const supabase = supabaseAdmin
  
  try {
    let userQuery = supabase.from('profiles').select(`
      id,
      created_at,
      updated_at,
      username,
      email,
      full_name,
      phone_number,
      role,
      status,
      onboarding_completed,
      country,
      date_of_birth,
      education_level,
      invited_by
    `);

    // Apply search filter if provided
    if (searchQuery && searchQuery.trim().length > 0) {
      userQuery = userQuery.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`);
    }

    const { data: users, error } = await userQuery.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users for export:', error);
      throw new Error('Failed to fetch users for export');
    }

    const headers = ['Name', 'Email', 'Username', 'Role', 'Status', 'Onboarding Complete', 'Joined Date', 'Phone', 'Country', 'Education Level', 'Invited By'];
    const csvContent = [
      headers.join(','),
      ...(users || []).map(user => [
        user.full_name || user.username || '',
        user.email || '',
        user.username || '',
        user.role || 'student',
        user.status || 'inactive',
        user.onboarding_completed ? 'Yes' : 'No',
        new Date(user.created_at).toLocaleDateString(),
        user.phone_number || '',
        user.country || '',
        user.education_level || '',
        user.invited_by || ''
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    return {
      csvContent,
      totalExported: users?.length || 0,
      searchApplied: !!searchQuery?.trim()
    };
  } catch (error) {
    console.error('Error exporting all users data:', error)
    throw new Error('Failed to export users data')
  }
} 