'use server'

import { supabaseAdmin } from '@/lib/supabase/service'
import { getProfile } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

interface PromoteUserResult {
  success: boolean;
  message: string;
  auditId?: string;
}

// ✅ SECURE: Admin-to-admin promotion with full audit trail
export async function promoteUserToAdmin(
  targetUserId: string, 
  reason: string = 'Promoted by admin'
): Promise<PromoteUserResult> {
  try {
    // 1. Verify the current user is an admin
    const currentProfile = await getProfile();
    
    if (!currentProfile || currentProfile.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can promote users');
    }

    // 2. Get target user's current role
    const { data: targetUser, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('id', targetUserId)
      .single();

    if (fetchError || !targetUser) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    if (targetUser.role === 'admin') {
      return {
        success: false,
        message: 'User is already an admin'
      };
    }

    // 3. Update user role to admin
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        role: 'admin',
        updated_at: new Date().toISOString()
      })
      .eq('id', targetUserId);

    if (updateError) {
      throw updateError;
    }

    // 4. Create comprehensive audit trail
    const { data: auditRecord, error: auditError } = await supabaseAdmin
      .from('admin_promotions')
      .insert({
        user_id: targetUserId,
        promoted_by: currentProfile.id,
        previous_role: targetUser.role,
        new_role: 'admin',
        reason: reason,
        promoted_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (auditError) {
      console.error('Audit trail creation failed:', auditError);
      // Don't fail the promotion for audit issues
    }

    // 5. Notify the promoted user about their new admin role
    try {
      const { error: notifError } = await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: targetUserId,
          type: 'role_promotion',
          category: 'system',
          title: 'Congratulations! You\'re now an Admin',
          message: `You have been promoted to administrator by ${currentProfile.full_name || currentProfile.email}. You now have full admin access to the platform.`,
          data: { 
            promoted_by: currentProfile.id,
            promoted_by_name: currentProfile.full_name || currentProfile.email,
            previous_role: targetUser.role,
            reason: reason
          },
          action_url: '/admin',
          priority: 'high',
          icon: 'crown'
        })

      if (notifError) {
        console.error('Failed to send promotion notification:', notifError)
        // Don't fail the promotion for notification issues
      }
    } catch (notifError) {
      console.error('Promotion notification failed:', notifError)
    }

    // 6. Log success for monitoring
    console.log(`🚀 ADMIN PROMOTED: ${targetUser.email} by ${currentProfile.email}`);
    console.log(`   Reason: ${reason}`);
    console.log(`   Audit ID: ${auditRecord?.id || 'N/A'}`);

    return {
      success: true,
      message: `Successfully promoted ${targetUser.full_name || targetUser.email} to admin`,
      auditId: auditRecord?.id
    };

  } catch (error) {
    console.error('Admin promotion failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Promotion failed'
    };
  }
}

// ✅ SECURE: Get promotion history (admin-only)
export async function getPromotionHistory() {
  try {
    const currentProfile = await getProfile();
    
    if (!currentProfile || currentProfile.role !== 'admin') {
      redirect('/login');
    }

    const { data: history, error } = await supabaseAdmin
      .from('admin_promotion_history')
      .select('*')
      .order('promoted_at', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    return { history: history || [] };
  } catch (error) {
    console.error('Error fetching promotion history:', error);
    throw new Error('Failed to fetch promotion history');
  }
}

// ✅ SECURE: Search users for promotion (admin-only)
export async function searchUsersForPromotion(query: string) {
  try {
    const currentProfile = await getProfile();
    
    if (!currentProfile || currentProfile.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    if (query.trim().length < 2) {
      return { users: [] };
    }

    const { data: users, error } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, role, created_at')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .neq('role', 'admin') // Exclude existing admins
      .limit(10);

    if (error) {
      throw error;
    }

    return { users: users || [] };
  } catch (error) {
    console.error('Error searching users for promotion:', error);
    throw new Error('Failed to search users');
  }
} 