'use server'

import { supabaseAdmin } from '@/lib/supabase/service'

// Get revenue analytics
export async function getRevenueAnalytics() {
  const supabase = supabaseAdmin
  
  try {
    // Payment data over time
    const { data: payments } = await supabase
      .from('payments')
      .select(`
        amount,
        currency,
        created_at,
        status,
        user_id,
        profiles!user_id(role, invited_by)
      `)
      .eq('status', 'completed')
      .order('created_at', { ascending: true })
    
    // Commission payouts
    const { data: commissions } = await supabase
      .from('commissions')
      .select(`
        commission_amount,
        created_at,
        status,
        affiliate_id,
        profiles!affiliate_id(full_name, email)
      `)
    
    // Payout requests
    const { data: payoutRequests } = await supabase
      .from('payout_requests')
      .select(`
        amount,
        status,
        requested_at,
        completed_at,
        affiliate_id,
        profiles!affiliate_id(full_name, email)
      `)
    
    return {
      payments: payments || [],
      commissions: commissions || [],
      payoutRequests: payoutRequests || []
    }
  } catch (error) {
    console.error('Error fetching revenue analytics:', error)
    throw new Error('Failed to fetch revenue analytics data')
  }
}

// Calculate revenue metrics
export async function getRevenueMetrics() {
  const supabase = supabaseAdmin
  
  try {
    // Monthly recurring revenue calculation
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { data: monthlyRevenue } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', thirtyDaysAgo.toISOString())
    
    // Total platform revenue
    const { data: totalRevenue } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed')
    
    return {
      monthlyRevenue: monthlyRevenue || [],
      totalRevenue: totalRevenue || []
    }
  } catch (error) {
    console.error('Error calculating revenue metrics:', error)
    throw new Error('Failed to calculate revenue metrics')
  }
} 
