'use server'

import { supabaseAdmin } from '@/lib/supabase/service'
import { TablesInsert, TablesUpdate } from '@/types/supabase'

// Get all courses with segments
export async function getAllCourses() {
  const supabase = supabaseAdmin
  
  try {
    const { data: courses } = await supabase
      .from('courses')
      .select(`
        *,
        segments(
          id,
          title,
          segment_order,
          video_url,
          pdf_url
        )
      `)
      .order('created_at', { ascending: false })
    
    return { courses: courses || [] }
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw new Error('Failed to fetch courses')
  }
}

// Create new course
export async function createCourse(courseData: TablesInsert<'courses'>) {
  const supabase = supabaseAdmin
  
  try {
    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()
    
    if (error) throw error
    
    return { success: true, course: data[0] }
  } catch (error) {
    console.error('Error creating course:', error)
    throw new Error('Failed to create course')
  }
}

// Update course
export async function updateCourse(
  courseId: string,
  updates: TablesUpdate<'courses'>
) {
  const supabase = supabaseAdmin
  
  try {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', courseId)
      .select()
    
    if (error) throw error
    
    return { success: true, course: data[0] }
  } catch (error) {
    console.error('Error updating course:', error)
    throw new Error('Failed to update course')
  }
}

// Delete course
export async function deleteCourse(courseId: string) {
  const supabase = supabaseAdmin
  
  try {
    // First delete all segments
    await supabase
      .from('segments')
      .delete()
      .eq('course_id', courseId)
    
    // Then delete the course
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting course:', error)
    throw new Error('Failed to delete course')
  }
}

// Get course categories
export async function getCourseCategories() {
  const supabase = supabaseAdmin
  
  try {
    const { data } = await supabase
      .from('courses')
      .select('category')
      .not('category', 'is', null)
    
    // Extract unique categories
    const categories = [...new Set(data?.map(item => item.category) || [])]
    
    return { categories }
  } catch (error) {
    console.error('Error fetching course categories:', error)
    throw new Error('Failed to fetch course categories')
  }
} 
