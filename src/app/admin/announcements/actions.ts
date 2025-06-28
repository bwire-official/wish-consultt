'use server'

import { getProfile } from '@/lib/auth/session'
import { supabaseAdmin } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'

export async function createAnnouncement(formData: FormData) {
  const profile = await getProfile();
  if (!profile || profile.role !== 'admin') {
    throw new Error('Not authorized');
  }

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const targetAudience = formData.get('targetAudience') as string;
  
  // This is the new part: get the specific user ID if one was selected
  const targetUserId = formData.get('target_user_id') as string | null;

  if (!title || !content || !targetAudience) {
    return { success: false, message: 'Missing required fields.' };
  }

  const { error } = await supabaseAdmin.from('announcements').insert({
    title,
    content,
    created_by: profile.id,
    target_audience: targetAudience,
    // Only set the target_user_id if the audience is 'user'
    target_user_id: targetAudience === 'user' ? targetUserId : null,
    status: 'published',
  });

  if (error) {
    console.error("Error creating announcement:", error);
    return { success: false, message: 'Failed to create announcement.' };
  }
  
  revalidatePath('/dashboard');
  revalidatePath('/admin/announcements');

  return { success: true, message: 'Announcement published!' };
}

export async function updateAnnouncement(id: number, formData: FormData) {
  const profile = await getProfile();
  if (!profile || profile.role !== 'admin') {
    throw new Error('Not authorized');
  }

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const status = formData.get('status') as 'published' | 'scheduled' | 'draft';
  const priority = formData.get('priority') as 'low' | 'medium' | 'high' | 'urgent';
  const targetAudience = formData.get('targetAudience') as 'all' | 'students' | 'affiliates' | 'admins' | 'user';
  const targetUserId = formData.get('target_user_id') as string | null;
  const scheduledFor = formData.get('scheduledFor') as string | null;
  const tags = formData.get('tags') as string;

  const { error } = await supabaseAdmin
    .from('announcements')
    .update({
      title,
      content,
      status,
      priority,
      target_audience: targetAudience,
      target_user_id: targetAudience === 'user' ? targetUserId : null,
      scheduled_for: scheduledFor,
      tags: tags ? JSON.parse(tags) : [],
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error("Error updating announcement:", error);
    return { success: false, message: 'Failed to update announcement.' };
  }
  
  revalidatePath('/dashboard');
  revalidatePath('/admin/announcements');

  return { success: true, message: 'Announcement updated successfully!' };
}

export async function archiveAnnouncement(id: number) {
  const profile = await getProfile();
  if (!profile || profile.role !== 'admin') {
    throw new Error('Not authorized');
  }

  const { error } = await supabaseAdmin
    .from('announcements')
    .update({
      status: 'archived',
      archived_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error("Error archiving announcement:", error);
    return { success: false, message: 'Failed to archive announcement.' };
  }
  
  revalidatePath('/dashboard');
  revalidatePath('/admin/announcements');

  return { success: true, message: 'Announcement archived successfully!' };
}

export async function restoreAnnouncement(id: number) {
  const profile = await getProfile();
  if (!profile || profile.role !== 'admin') {
    throw new Error('Not authorized');
  }

  const { error } = await supabaseAdmin
    .from('announcements')
    .update({
      status: 'draft',
      archived_at: null,
    })
    .eq('id', id);

  if (error) {
    console.error("Error restoring announcement:", error);
    return { success: false, message: 'Failed to restore announcement.' };
  }
  
  revalidatePath('/dashboard');
  revalidatePath('/admin/announcements');

  return { success: true, message: 'Announcement restored successfully!' };
}

export async function deleteAnnouncement(id: number) {
  const profile = await getProfile();
  if (!profile || profile.role !== 'admin') {
    throw new Error('Not authorized');
  }

  const { error } = await supabaseAdmin
    .from('announcements')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting announcement:", error);
    return { success: false, message: 'Failed to delete announcement.' };
  }
  
  revalidatePath('/dashboard');
  revalidatePath('/admin/announcements');

  return { success: true, message: 'Announcement deleted successfully!' };
}

export async function publishAnnouncement(id: number) {
  const profile = await getProfile();
  if (!profile || profile.role !== 'admin') {
    throw new Error('Not authorized');
  }

  const { error } = await supabaseAdmin
    .from('announcements')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error("Error publishing announcement:", error);
    return { success: false, message: 'Failed to publish announcement.' };
  }
  
  revalidatePath('/dashboard');
  revalidatePath('/admin/announcements');

  return { success: true, message: 'Announcement published successfully!' };
}

export async function searchUsers(query: string) {
  const profile = await getProfile();
  if (!profile || profile.role !== 'admin') {
    throw new Error('Not authorized');
  }

  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, role, avatar_url, username')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,username.ilike.%${query}%`)
      .limit(10);

    if (error) {
      console.error('Error searching users:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
} 