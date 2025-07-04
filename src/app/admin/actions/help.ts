'use server'

import { supabaseAdmin } from '@/lib/supabase/service'
import { Json } from '@/types/supabase'

// Get platform settings for help documentation
export async function getHelpSettings() {
  const supabase = supabaseAdmin
  
  try {
    const { data: settings } = await supabase
      .from('platform_settings')
      .select('*')
      .like('key', 'help_%')
    
    return { settings: settings || [] }
  } catch (error) {
    console.error('Error fetching help settings:', error)
    throw new Error('Failed to fetch help settings')
  }
}

// Update help documentation setting
export async function updateHelpSetting(
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
    console.error('Error updating help setting:', error)
    throw new Error('Failed to update help setting')
  }
}

// Get frequently asked questions data
export async function getFAQData() {
  const supabase = supabaseAdmin
  
  try {
    // Get common issues from feedback
    const { data: commonIssues } = await supabase
      .from('feedback')
      .select(`
        text_feedback,
        rating,
        created_at,
        segments(
          title,
          courses(
            title
          )
        )
      `)
      .not('text_feedback', 'is', null)
      .lte('rating', 3) // Low ratings might indicate common issues
      .limit(50)
    
    return { commonIssues: commonIssues || [] }
  } catch (error) {
    console.error('Error fetching FAQ data:', error)
    throw new Error('Failed to fetch FAQ data')
  }
} 
