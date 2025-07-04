'use server'

import { supabaseAdmin } from '@/lib/supabase/service'
import { TablesInsert, TablesUpdate } from '@/types/supabase'

// Get segments for a specific course
export async function getCourseSegments(courseId: string) {
  const supabase = supabaseAdmin
  
  try {
    const { data: segments } = await supabase
      .from('segments')
      .select(`
        *,
        progress(
          user_id,
          is_completed,
          created_at
        )
      `)
      .eq('course_id', courseId)
      .order('segment_order', { ascending: true })
    
    return { segments: segments || [] }
  } catch (error) {
    console.error('Error fetching course segments:', error)
    throw new Error('Failed to fetch course segments')
  }
}

// Create new segment
export async function createSegment(segmentData: TablesInsert<'segments'>) {
  const supabase = supabaseAdmin
  
  try {
    const { data, error } = await supabase
      .from('segments')
      .insert([segmentData])
      .select()
    
    if (error) throw error
    
    return { success: true, segment: data[0] }
  } catch (error) {
    console.error('Error creating segment:', error)
    throw new Error('Failed to create segment')
  }
}

// Update segment
export async function updateSegment(
  segmentId: string,
  updates: TablesUpdate<'segments'>
) {
  const supabase = supabaseAdmin
  
  try {
    const { data, error } = await supabase
      .from('segments')
      .update(updates)
      .eq('id', segmentId)
      .select()
    
    if (error) throw error
    
    return { success: true, segment: data[0] }
  } catch (error) {
    console.error('Error updating segment:', error)
    throw new Error('Failed to update segment')
  }
}

// Delete segment
export async function deleteSegment(segmentId: string) {
  const supabase = supabaseAdmin
  
  try {
    // First delete all progress records for this segment
    await supabase
      .from('progress')
      .delete()
      .eq('segment_id', segmentId)
    
    // Then delete the segment
    const { error } = await supabase
      .from('segments')
      .delete()
      .eq('id', segmentId)
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting segment:', error)
    throw new Error('Failed to delete segment')
  }
}

// Reorder segments
export async function reorderSegments(
  courseId: string,
  segmentOrders: Array<{ id: string; segment_order: number }>
) {
  const supabase = supabaseAdmin
  
  try {
    // Update all segment orders in a transaction-like manner
    const updates = segmentOrders.map(({ id, segment_order }) =>
      supabase
        .from('segments')
        .update({ segment_order })
        .eq('id', id)
        .eq('course_id', courseId)
    )
    
    await Promise.all(updates)
    
    return { success: true }
  } catch (error) {
    console.error('Error reordering segments:', error)
    throw new Error('Failed to reorder segments')
  }
} 
