'use server'

import { supabaseAdmin } from '@/lib/supabase/service'
import { TablesUpdate } from '@/types/supabase'

// Get all payout requests
export async function getPayoutRequests() {
  const supabase = supabaseAdmin
  
  try {
    const { data: payoutRequests } = await supabase
      .from('payout_requests')
      .select(`
        *,
        profiles!affiliate_id(
          full_name,
          email,
          phone_number
        )
      `)
      .order('requested_at', { ascending: false })
    
    return { payoutRequests: payoutRequests || [] }
  } catch (error) {
    console.error('Error fetching payout requests:', error)
    throw new Error('Failed to fetch payout requests')
  }
}

// Get payout requests by status
export async function getPayoutRequestsByStatus(status: string) {
  const supabase = supabaseAdmin
  
  try {
    const { data: payoutRequests } = await supabase
      .from('payout_requests')
      .select(`
        *,
        profiles!affiliate_id(
          full_name,
          email,
          phone_number
        )
      `)
      .eq('status', status)
      .order('requested_at', { ascending: false })
    
    return { payoutRequests: payoutRequests || [] }
  } catch (error) {
    console.error('Error fetching payout requests by status:', error)
    throw new Error('Failed to fetch payout requests')
  }
}

// Update payout request status
export async function updatePayoutStatus(
  payoutId: string,
  status: string,
  adminNotes?: string
) {
  const supabase = supabaseAdmin
  
  try {
    const updateData: Partial<TablesUpdate<'payout_requests'>> = { status }
    
    if (adminNotes) {
      updateData.admin_notes = adminNotes
    }
    
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('payout_requests')
      .update(updateData)
      .eq('id', payoutId)
      .select(`
        *,
        profiles!affiliate_id(
          id,
          full_name,
          email
        )
      `)
      .single()
    
    if (error) throw error

    // Send notification when payout is completed
    if (status === 'completed' && data.profiles) {
      try {
        await supabase
          .from('notifications')
          .insert({
            user_id: data.affiliate_id,
            type: 'payout_processed',
            category: 'payment',
            title: 'Payout Processed!',
            message: `Your $${data.amount} payout has been processed and sent to your account`,
            data: { 
              payout_id: data.id,
              amount: data.amount,
              completed_at: data.completed_at,
              admin_notes: adminNotes
            },
            action_url: '/affiliate/dashboard/payouts',
            priority: 'high',
            icon: 'bank'
          })
      } catch (notifError) {
        console.error('Failed to send payout notification:', notifError)
        // Don't fail the payout update for notification issues
      }
    }
    
    return { success: true, payout: data }
  } catch (error) {
    console.error('Error updating payout status:', error)
    throw new Error('Failed to update payout status')
  }
}

// Get payout analytics
export async function getPayoutAnalytics() {
  const supabase = supabaseAdmin
  
  try {
    // Total payouts by status
    const { data: payoutsByStatus } = await supabase
      .from('payout_requests')
      .select('status, amount')
    
    // Payout volume over time
    const { data: payoutVolume } = await supabase
      .from('payout_requests')
      .select('requested_at, amount, status')
      .order('requested_at', { ascending: true })
    
    // Average payout amounts
    const { data: averagePayouts } = await supabase
      .from('payout_requests')
      .select('amount, affiliate_id')
    
    return {
      payoutsByStatus: payoutsByStatus || [],
      payoutVolume: payoutVolume || [],
      averagePayouts: averagePayouts || []
    }
  } catch (error) {
    console.error('Error fetching payout analytics:', error)
    throw new Error('Failed to fetch payout analytics')
  }
} 
