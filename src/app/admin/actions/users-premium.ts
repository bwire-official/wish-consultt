'use server'

import { supabaseAdmin } from '@/lib/supabase/service'

// Get premium users (users who have made payments)
export async function getPremiumUsers() {
  const supabase = supabaseAdmin
  
  try {
    const { data: premiumUsers } = await supabase
      .from('profiles')
      .select(`
        *,
        payments(
          amount,
          currency,
          created_at,
          status
        )
      `)
      .not('payments', 'is', null)
      .order('created_at', { ascending: false })
    
    return { premiumUsers: premiumUsers || [] }
  } catch (error) {
    console.error('Error fetching premium users:', error)
    throw new Error('Failed to fetch premium users')
  }
}

// Get premium subscription analytics
export async function getPremiumAnalytics() {
  const supabase = supabaseAdmin
  
  try {
    // Revenue metrics
    const { data: payments } = await supabase
      .from('payments')
      .select('amount, currency, created_at, status')
      .eq('status', 'completed')
    
    // Premium user growth over time
    const { data: premiumGrowth } = await supabase
      .from('payments')
      .select(`
        created_at,
        user_id,
        profiles!user_id(created_at)
      `)
      .eq('status', 'completed')
      .order('created_at', { ascending: true })
    
    return {
      payments: payments || [],
      premiumGrowth: premiumGrowth || []
    }
  } catch (error) {
    console.error('Error fetching premium analytics:', error)
    throw new Error('Failed to fetch premium analytics')
  }
} 
