'use server'

import { supabaseAdmin } from '@/lib/supabase/service'
import { TablesUpdate } from '@/types/supabase'

// Enhanced user interface matching the client-side structure
export interface AdminUser {
  // Core Profile properties
  id: string;
  created_at: string;
  updated_at: string;
  username: string | null;
  email: string | null;
  full_name: string | null;
  phone_number: string | null;
  role: string;
  status: string;
  onboarding_data: Record<string, unknown> | null;
  invited_by: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  
  // Additional database properties
  country: string | null;
  date_of_birth: string | null;
  education_level: string | null;
  availability: string | null;
  experience_level: string | null;
  language: string | null;
  timezone: string | null;
  
  // Computed properties
  is_premium: boolean;
  location?: string | null;
  last_active?: string | null;
  joined_date?: string;
  courses?: {
    enrolled: number;
    completed: number;
    in_progress: number;
    certificates: number;
  };
  progress?: {
    current_course: string | null;
    completion_rate: number | null;
    average_score: number | null;
    last_activity: string | null;
  };
  preferences?: {
    language: string;
    notifications: boolean;
    theme: string;
  };
  warnings?: number;
  last_warning?: string | null;
}

// Get users with search, filtering, and pagination
export async function getAdminUsers(query?: string, page: number = 1, limit: number = 50) {
  const supabase = supabaseAdmin
  
  try {
    // Calculate offset for pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

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
      onboarding_data,
      invited_by,
      avatar_url,
      onboarding_completed,
      country,
      date_of_birth,
      education_level,
      availability,
      experience_level,
      language,
      timezone
    `, { count: 'exact' });

    // Apply search filter if provided
    if (query && query.trim().length > 0) {
      userQuery = userQuery.or(`full_name.ilike.%${query}%,email.ilike.%${query}%,username.ilike.%${query}%`);
    }

    // Apply pagination and ordering
    const { data: users, error, count } = await userQuery
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
    
    // Normalize users to match AdminUser interface
    const normalizedUsers: AdminUser[] = (users || []).map(user => {
      return {
        // Core Profile properties
        id: user.id,
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at,
        username: user.username || null,
        email: user.email || null,
        full_name: user.full_name || null,
        phone_number: user.phone_number || null,
        role: user.role || 'student',
        status: user.status || 'inactive',
        onboarding_data: user.onboarding_data as Record<string, unknown> | null,
        invited_by: user.invited_by || null,
        avatar_url: user.avatar_url || null,
        onboarding_completed: user.onboarding_completed ?? false,
        
        // Additional database properties
        country: user.country || null,
        date_of_birth: user.date_of_birth || null,
        education_level: user.education_level || null,
        availability: user.availability || null,
        experience_level: user.experience_level || null,
        language: user.language || null,
        timezone: user.timezone || null,
        
        // Computed properties with defaults
        is_premium: false, // Default - can be enhanced later
        location: user.country,
        joined_date: user.created_at,
        courses: {
          enrolled: 0,
          completed: 0,
          in_progress: 0,
          certificates: 0
        },
        progress: {
          current_course: null,
          completion_rate: null,
          average_score: null,
          last_activity: null
        },
        preferences: {
          language: user.language || 'en',
          notifications: true,
          theme: 'light'
        },
        warnings: 0,
        last_warning: null
      };
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil((count ?? 0) / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return { 
      users: normalizedUsers, 
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
    };
  } catch (error) {
    console.error('Error fetching admin users:', error)
    throw new Error('Failed to fetch users')
  }
}

// Get user statistics for dashboard
export async function getUserStats() {
  const supabase = supabaseAdmin
  
  try {
    // Get total users count by role
    const { data: userCounts } = await supabase
      .from('profiles')
      .select('role')
    
    // Get active users count
    const { data: activeUsers } = await supabase
      .from('profiles')
      .select('id')
      .eq('status', 'active')
    
    // Get premium users count (placeholder - enhance when premium logic exists)
    const premiumCount = 0
    
    // Get course enrollments (placeholder - enhance when progress table logic exists)
    const courseEnrollments = 0
    
    const totalUsers = userCounts?.length || 0
    const activeCount = activeUsers?.length || 0
    
    return {
      totalUsers,
      premiumUsers: premiumCount,
      activeUsers: activeCount,
      courseEnrollments
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    throw new Error('Failed to fetch user statistics')
  }
}

// Export users data as CSV
export async function exportUsersData(users: AdminUser[]) {
  try {
    const headers = ['Name', 'Email', 'Username', 'Role', 'Status', 'Premium', 'Joined Date', 'Courses Enrolled', 'Phone', 'Location'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user.full_name || user.username || '',
        user.email || '',
        user.username || '',
        user.role,
        user.status,
        user.is_premium ? 'Yes' : 'No',
        new Date(user.created_at).toLocaleDateString(),
        user.courses?.enrolled || 0,
        user.phone_number || '',
        user.location || user.country || ''
      ].join(','))
    ].join('\n');
    
    return csvContent;
  } catch (error) {
    console.error('Error exporting users data:', error)
    throw new Error('Failed to export users data')
  }
}

// Search users for UserSelector component (SECURE replacement for client-side admin query)
export async function searchUsersForSelector(searchQuery: string) {
  const supabase = supabaseAdmin
  
  try {
    if (searchQuery.trim().length < 2) {
      return { users: [] }
    }

    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, avatar_url')
      .or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
      .limit(10)

    if (error) {
      console.error('Error searching users:', error)
      throw new Error('Failed to search users')
    }

    return { users: users || [] }
  } catch (error) {
    console.error('Error in searchUsersForSelector:', error)
    throw new Error('Failed to search users')
  }
}

// Get all users with detailed information (legacy function - kept for compatibility)
export async function getAllUsers() {
  const supabase = supabaseAdmin
  
  try {
    const { data: users } = await supabase
      .from('profiles')
      .select(`
        *,
        invited_by_profile:profiles!invited_by(full_name, email),
        interests(topic),
        learning_goals(goal),
        languages(language_name),
        certifications(name, issuing_organization)
      `)
      .order('created_at', { ascending: false })
    
    return { users: users || [] }
  } catch (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }
}

// Get users by role
export async function getUsersByRole(role: string) {
  const supabase = supabaseAdmin
  
  try {
    const { data: users } = await supabase
      .from('profiles')
      .select(`
        *,
        invited_by_profile:profiles!invited_by(full_name, email)
      `)
      .eq('role', role)
      .order('created_at', { ascending: false })
    
    return { users: users || [] }
  } catch (error) {
    console.error('Error fetching users by role:', error)
    throw new Error('Failed to fetch users')
  }
}

// Search users
export async function searchUsers(searchTerm: string) {
  const supabase = supabaseAdmin
  
  try {
    const { data: users } = await supabase
      .from('profiles')
      .select(`
        *,
        invited_by_profile:profiles!invited_by(full_name, email)
      `)
      .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .limit(20)
    
    return { users: users || [] }
  } catch (error) {
    console.error('Error searching users:', error)
    throw new Error('Failed to search users')
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: TablesUpdate<'profiles'>
) {
  const supabase = supabaseAdmin
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
    
    if (error) throw error
    
    return { success: true, user: data[0] }
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw new Error('Failed to update user profile')
  }
}

// Update user status
export async function updateUserStatus(userId: string, status: string) {
  const supabase = supabaseAdmin
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
    
    if (error) throw error
    
    return { success: true, user: data[0] }
  } catch (error) {
    console.error('Error updating user status:', error)
    throw new Error('Failed to update user status')
  }
}

// Get user activity summary
export async function getUserActivity(userId: string) {
  const supabase = supabaseAdmin
  
  try {
    // Get user's progress
    const { data: progress } = await supabase
      .from('progress')
      .select(`
        *,
        segments(
          title,
          course_id,
          courses(
            title
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    // Get user's feedback
    const { data: feedback } = await supabase
      .from('feedback')
      .select(`
        *,
        segments(
          title,
          courses(
            title
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    // Get user's payments if any
    const { data: payments } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    return {
      progress: progress || [],
      feedback: feedback || [],
      payments: payments || []
    }
  } catch (error) {
    console.error('Error fetching user activity:', error)
    throw new Error('Failed to fetch user activity')
  }
}

// Export ALL users data as CSV (with search support)
export async function exportAllUsersData(searchQuery?: string) {
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
