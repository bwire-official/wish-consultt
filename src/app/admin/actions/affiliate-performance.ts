'use server'

import { supabaseAdmin } from '@/lib/supabase/service'

// Get affiliate performance metrics
export async function getAffiliatePerformance() {
  const supabase = supabaseAdmin
  
  try {
    const { data: performance } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        created_at,
        invite_codes(
          code_text,
          uses,
          created_at
        ),
        invited_users:profiles!invited_by(
          id,
          created_at,
          payments(
            amount,
            status,
            created_at
          )
        ),
        commissions(
          commission_amount,
          status,
          created_at
        )
      `)
      .eq('role', 'affiliate')
    
    return { performance: performance || [] }
  } catch (error) {
    console.error('Error fetching affiliate performance:', error)
    throw new Error('Failed to fetch affiliate performance')
  }
}

// Get top performing affiliates
export async function getTopAffiliates(limit: number = 10) {
  const supabase = supabaseAdmin
  
  try {
    // Get affiliates with their commission totals
    const { data: affiliatesWithCommissions } = await supabase
      .from('commissions')
      .select(`
        affiliate_id,
        commission_amount,
        status,
        profiles!affiliate_id(
          full_name,
          email,
          created_at
        )
      `)
      .eq('status', 'paid')
      .limit(limit)
    
    return { topAffiliates: affiliatesWithCommissions || [] }
  } catch (error) {
    console.error('Error fetching top affiliates:', error)
    throw new Error('Failed to fetch top affiliates')
  }
}

// Get affiliate conversion rates for performance tracking
export async function getPerformanceConversions() {
  const supabase = supabaseAdmin
  
  try {
    const { data: conversions } = await supabase
      .from('profiles')
      .select(`
        id,
        invited_by,
        created_at,
        payments(
          amount,
          status,
          created_at
        ),
        affiliate:profiles!invited_by(
          full_name,
          email
        )
      `)
      .not('invited_by', 'is', null)
    
    return { conversions: conversions || [] }
  } catch (error) {
    console.error('Error fetching affiliate conversions:', error)
    throw new Error('Failed to fetch affiliate conversions')
  }
}

// Get affiliate performance trends
export async function getPerformanceTrends() {
  const supabase = supabaseAdmin
  
  try {
    // Invite trends over time
    const { data: inviteTrends } = await supabase
      .from('profiles')
      .select('created_at, invited_by')
      .not('invited_by', 'is', null)
      .order('created_at', { ascending: true })
    
    // Commission trends over time
    const { data: commissionTrends } = await supabase
      .from('commissions')
      .select('commission_amount, created_at, affiliate_id, status')
      .order('created_at', { ascending: true })
    
    return {
      inviteTrends: inviteTrends || [],
      commissionTrends: commissionTrends || []
    }
  } catch (error) {
    console.error('Error fetching performance trends:', error)
    throw new Error('Failed to fetch performance trends')
  }
} 
