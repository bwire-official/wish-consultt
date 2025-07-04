'use server'

import { supabaseAdmin } from '@/lib/supabase/service'
import { Json, TablesInsert } from '@/types/supabase'

// Get all platform settings
export async function getAllSettings() {
  const supabase = supabaseAdmin
  
  try {
    const { data: settings } = await supabase
      .from('platform_settings')
      .select('*')
      .order('key', { ascending: true })
    
    return { settings: settings || [] }
  } catch (error) {
    console.error('Error fetching settings:', error)
    throw new Error('Failed to fetch platform settings')
  }
}

// Get settings by category
export async function getSettingsByCategory(category: string) {
  const supabase = supabaseAdmin
  
  try {
    const { data: settings } = await supabase
      .from('platform_settings')
      .select('*')
      .like('key', `${category}_%`)
      .order('key', { ascending: true })
    
    return { settings: settings || [] }
  } catch (error) {
    console.error('Error fetching settings by category:', error)
    throw new Error('Failed to fetch settings')
  }
}

// Update platform setting
export async function updateSetting(
  key: string,
  value: Json,
  description?: string
) {
  const supabase = supabaseAdmin
  
  try {
    const { data, error } = await supabase
      .from('platform_settings')
      .upsert([{
        key,
        value,
        description
      }])
      .select()
    
    if (error) throw error
    
    return { success: true, setting: data[0] }
  } catch (error) {
    console.error('Error updating setting:', error)
    throw new Error('Failed to update setting')
  }
}

// Bulk update settings
export async function bulkUpdateSettings(
  settings: TablesInsert<'platform_settings'>[]
) {
  const supabase = supabaseAdmin
  
  try {
    const { data, error } = await supabase
      .from('platform_settings')
      .upsert(settings)
      .select()
    
    if (error) throw error
    
    return { success: true, updatedSettings: data }
  } catch (error) {
    console.error('Error bulk updating settings:', error)
    throw new Error('Failed to bulk update settings')
  }
}

// Delete setting
export async function deleteSetting(key: string) {
  const supabase = supabaseAdmin
  
  try {
    const { error } = await supabase
      .from('platform_settings')
      .delete()
      .eq('key', key)
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting setting:', error)
    throw new Error('Failed to delete setting')
  }
} 
