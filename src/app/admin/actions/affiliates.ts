'use server'

import { supabaseAdmin } from '@/lib/supabase/service'

// Get all affiliates with performance data
export async function getAllAffiliates() {
  const supabase = supabaseAdmin
  
  try {
    const { data: affiliates } = await supabase
      .from('profiles')
      .select(`
        *,
        invite_codes(
          id,
          code_text,
          uses,
          is_active,
          created_at
        ),
        invited_users:profiles!invited_by(
          id,
          full_name,
          email,
          created_at,
          role
        ),
        commissions(
          commission_amount,
          status,
          created_at
        )
      `)
      .eq('role', 'affiliate')
      .order('created_at', { ascending: false })
    
    return { affiliates: affiliates || [] }
  } catch (error) {
    console.error('Error fetching affiliates:', error)
    throw new Error('Failed to fetch affiliates')
  }
}

// Update affiliate status
export async function updateAffiliateStatus(
  affiliateId: string,
  status: string
) {
  const supabase = supabaseAdmin
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', affiliateId)
      .eq('role', 'affiliate')
      .select()
    
    if (error) throw error
    
    return { success: true, affiliate: data[0] }
  } catch (error) {
    console.error('Error updating affiliate status:', error)
    throw new Error('Failed to update affiliate status')
  }
}

// Get affiliate dashboard metrics
export async function getAffiliateDashboardMetrics() {
  const supabase = supabaseAdmin
  
  try {
    // Total affiliates
    const { data: totalAffiliates } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'affiliate')
    
    // Active affiliates (with recent activity)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { data: activeAffiliates } = await supabase
      .from('profiles')
      .select('id, updated_at')
      .eq('role', 'affiliate')
      .gte('updated_at', thirtyDaysAgo.toISOString())
    
    // Total commissions
    const { data: commissions } = await supabase
      .from('commissions')
      .select('commission_amount, status')
    
    return {
      totalAffiliates: totalAffiliates?.length || 0,
      activeAffiliates: activeAffiliates?.length || 0,
      commissions: commissions || []
    }
  } catch (error) {
    console.error('Error fetching affiliate dashboard metrics:', error)
    throw new Error('Failed to fetch affiliate metrics')
  }
} 
