'use server'

import { supabaseAdmin } from '@/lib/supabase/service'

// Get affiliate performance analytics
export async function getAffiliateAnalytics() {
  const supabase = supabaseAdmin
  
  try {
    // Top performing affiliates by invites
    const { data: affiliateInvites } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        created_at,
        invited_users:profiles!invited_by(id, created_at)
      `)
      .eq('role', 'affiliate')
    
    // Commission data
    const { data: commissions } = await supabase
      .from('commissions')
      .select(`
        commission_amount,
        created_at,
        status,
        affiliate_id,
        profiles!affiliate_id(full_name, email)
      `)
    
    // Invite code usage
    const { data: inviteCodes } = await supabase
      .from('invite_codes')
      .select(`
        code_text,
        uses,
        created_at,
        is_active,
        affiliate_id,
        profiles!affiliate_id(full_name, email)
      `)
    
    return {
      affiliateInvites: affiliateInvites || [],
      commissions: commissions || [],
      inviteCodes: inviteCodes || []
    }
  } catch (error) {
    console.error('Error fetching affiliate analytics:', error)
    throw new Error('Failed to fetch affiliate analytics data')
  }
}

// Get affiliate conversion metrics
export async function getAffiliateConversions() {
  const supabase = supabaseAdmin
  
  try {
    // Users who were invited and became paying customers
    const { data: conversions } = await supabase
      .from('profiles')
      .select(`
        id,
        created_at,
        invited_by,
        payments(amount, created_at, status)
      `)
      .not('invited_by', 'is', null)
    
    return {
      conversions: conversions || []
    }
  } catch (error) {
    console.error('Error fetching affiliate conversions:', error)
    throw new Error('Failed to fetch conversion data')
  }
} 
