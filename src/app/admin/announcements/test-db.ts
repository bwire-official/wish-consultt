'use server'

import { supabaseAdmin } from '@/lib/supabase/service'

export async function testAnnouncementsTable() {
  try {
    console.log('Testing announcements table...')
    
    // Test 1: Simple count query
    const { data: countData, error: countError } = await supabaseAdmin
      .from('announcements')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('Count error:', countError)
      return { error: `Count failed: ${countError.message}` }
    }
    
    console.log('Count successful')
    
    // Test 2: Simple select
    const { data: selectData, error: selectError } = await supabaseAdmin
      .from('announcements')
      .select('id, title, status')
      .limit(1)
    
    if (selectError) {
      console.error('Select error:', selectError)
      return { error: `Select failed: ${selectError.message}` }
    }
    
    console.log('Select successful:', selectData)
    
    return { 
      success: true, 
      count: countData?.length || 0,
      sample: selectData 
    }
    
  } catch (error) {
    console.error('Test error:', error)
    return { error: `Test failed: ${error}` }
  }
} 