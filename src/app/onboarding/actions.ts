'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const username = formData.get('username') as string
  const fullName = formData.get('fullName') as string
  const phoneNumber = formData.get('phoneNumber') as string
  const role = formData.get('role') as string
  const avatarUrl = formData.get('avatarUrl') as string

  const { error } = await supabase
    .from('profiles')
    .update({
      username,
      full_name: fullName,
      phone_number: phoneNumber,
      role,
      avatar_url: avatarUrl,
      onboarding_completed: true
    })
    .eq('id', user.id)

  if (error) {
    console.error('Profile update error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Username check error:', error)
    return { available: false }
  }

  return { available: !data }
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()
  
  try {
    const file = formData.get('file') as File
    
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' }
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: 'File size must be less than 10MB' }
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { success: false, error: 'Failed to upload file' }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl

    // Update user profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl } as Record<string, unknown>)
      .eq('id', user.id)

    if (updateError) {
      console.error('Profile update error:', updateError)
      return { success: false, error: 'Failed to update profile' }
    }

    revalidatePath('/onboarding')
    
    return { success: true, url: publicUrl }
  } catch (error) {
    console.error('Avatar upload error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
} 