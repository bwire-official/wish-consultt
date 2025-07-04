'use server'

import { supabaseAdmin } from '@/lib/supabase/service'
import { getProfile } from '@/lib/auth/session'

interface AdminInvitationResult {
  success: boolean;
  message: string;
  invitationId?: string;
}

interface AdminInvitationData {
  invited_by: string;
  // Add other properties if they exist and are used
}

// Send admin role invitation
export async function sendAdminInvitation(
  targetUserId: string, 
  reason: string = 'Invited to join administrative team'
): Promise<AdminInvitationResult> {
  try {
    // 1. Verify the current user is an admin
    const currentProfile = await getProfile();
    
    if (!currentProfile || currentProfile.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can send admin invitations');
    }

    // 2. Get target user's details
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

    // 3. Check if invitation already exists
    const { data: existingInvitation } = await supabaseAdmin
      .from('notifications')
      .select('id')
      .eq('user_id', targetUserId)
      .eq('type', 'admin_invitation')
      .is('read_at', null) // Unread invitations
      .single();

    if (existingInvitation) {
      return {
        success: false,
        message: 'User already has a pending admin invitation'
      };
    }

    // 4. Create professional invitation notification
    const { data: invitation, error: notifError } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: targetUserId,
        type: 'admin_invitation',
        category: 'system',
        title: 'Admin Role Invitation',
        message: `You have been invited to join the administrative team at Wish Consult by ${currentProfile.full_name || currentProfile.email}.\n\nAs an administrator, you would have access to:\n• User Management & Analytics\n• Course Management System\n• Platform Settings & Configuration\n• Financial Reports & Data\n\nThis is an important responsibility. Please consider carefully before accepting.`,
        data: { 
          invited_by: currentProfile.id,
          invited_by_name: currentProfile.full_name || currentProfile.email,
          current_role: targetUser.role,
          reason: reason,
          invitation_type: 'admin_role'
        },
        action_url: '/admin/invitation/respond',
        priority: 'high',
        icon: 'crown'
      })
      .select('id')
      .single();

    if (notifError) {
      console.error('Failed to create admin invitation:', notifError);
      throw new Error('Failed to send invitation');
    }

    // 5. Notify the admin who sent the invitation
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: currentProfile.id,
        type: 'admin_invitation_sent',
        category: 'system',
        title: 'Admin Invitation Sent',
        message: `Admin role invitation sent to ${targetUser.full_name || targetUser.email}. They will receive a notification and can accept or decline the invitation.`,
        data: { 
          target_user: targetUserId,
          target_user_name: targetUser.full_name || targetUser.email,
          invitation_id: invitation.id
        },
        priority: 'medium',
        icon: 'mail'
      });

    // 6. Log for monitoring
    console.log(`📧 ADMIN INVITATION SENT: ${targetUser.email} by ${currentProfile.email}`);
    console.log(`   Reason: ${reason}`);
    console.log(`   Invitation ID: ${invitation.id}`);

    return {
      success: true,
      message: `Admin invitation sent to ${targetUser.full_name || targetUser.email}`,
      invitationId: invitation.id.toString()
    };

  } catch (error) {
    console.error('Admin invitation failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Invitation failed'
    };
  }
}

// Accept admin invitation
export async function acceptAdminInvitation(invitationId: number): Promise<AdminInvitationResult> {
  try {
    const currentProfile = await getProfile();
    
    if (!currentProfile) {
      throw new Error('Unauthorized: Please log in');
    }

    // Get the invitation
    const { data: invitation, error: inviteError } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('id', invitationId)
      .eq('user_id', currentProfile.id)
      .eq('type', 'admin_invitation')
      .is('read_at', null)
      .single();

    if (inviteError || !invitation) {
      return {
        success: false,
        message: 'Invalid or expired invitation'
      };
    }

    // Promote user to admin
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        role: 'admin',
        updated_at: new Date().toISOString()
      })
      .eq('id', currentProfile.id);

    if (updateError) {
      throw updateError;
    }

    // Mark invitation as read (accepted)
    await supabaseAdmin
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', invitationId);

    // Create success notification for new admin
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: currentProfile.id,
        type: 'admin_invitation_accepted',
        category: 'system',
        title: 'Welcome to the Admin Team!',
        message: `Congratulations! You have successfully accepted the admin role invitation. You now have full administrative access to the platform. Welcome to the team!`,
        data: { 
          invitation_id: invitationId,
          promoted_at: new Date().toISOString()
        },
        action_url: '/admin',
        priority: 'high',
        icon: 'crown'
      });

    // Notify the admin who sent the invitation
    if (invitation.data && typeof invitation.data === 'object' && 'invited_by' in invitation.data) {
      const invitationData = invitation.data as unknown as AdminInvitationData;
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: invitationData.invited_by,
          type: 'admin_invitation_response',
          category: 'system',
          title: 'Admin Invitation Accepted',
          message: `✅ ${currentProfile.full_name || currentProfile.email} has accepted your admin role invitation and is now part of the administrative team.`,
          data: { 
            responder_id: currentProfile.id,
            responder_name: currentProfile.full_name || currentProfile.email,
            response: 'accepted',
            invitation_id: invitationId
          },
          priority: 'medium',
          icon: 'check-circle'
        });
    }

    console.log(`✅ ADMIN INVITATION ACCEPTED: ${currentProfile.email}`);

    return {
      success: true,
      message: 'Admin invitation accepted successfully! Welcome to the team.'
    };

  } catch (error) {
    console.error('Accept invitation failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to accept invitation'
    };
  }
}

// Decline admin invitation
export async function declineAdminInvitation(invitationId: number, reason?: string): Promise<AdminInvitationResult> {
  try {
    const currentProfile = await getProfile();
    
    if (!currentProfile) {
      throw new Error('Unauthorized: Please log in');
    }

    // Get the invitation
    const { data: invitation, error: inviteError } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('id', invitationId)
      .eq('user_id', currentProfile.id)
      .eq('type', 'admin_invitation')
      .is('read_at', null)
      .single();

    if (inviteError || !invitation) {
      return {
        success: false,
        message: 'Invalid or expired invitation'
      };
    }

    // Mark invitation as read (declined)
    await supabaseAdmin
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', invitationId);

    // Create decline notification for user
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: currentProfile.id,
        type: 'admin_invitation_declined',
        category: 'system',
        title: 'Admin Invitation Declined',
        message: `You have declined the admin role invitation. Your current role and permissions remain unchanged.`,
        data: { 
          invitation_id: invitationId,
          declined_at: new Date().toISOString(),
          reason: reason
        },
        priority: 'low',
        icon: 'x-circle'
      });

    // Notify the admin who sent the invitation
    if (invitation.data && typeof invitation.data === 'object' && 'invited_by' in invitation.data) {
      const invitationData = invitation.data as unknown as AdminInvitationData;
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: invitationData.invited_by,
          type: 'admin_invitation_response',
          category: 'system',
          title: 'Admin Invitation Declined',
          message: `❌ ${currentProfile.full_name || currentProfile.email} has declined your admin role invitation.${reason ? ` Reason: ${reason}` : ''}`,
          data: { 
            responder_id: currentProfile.id,
            responder_name: currentProfile.full_name || currentProfile.email,
            response: 'declined',
            invitation_id: invitationId,
            reason: reason
          },
          priority: 'low',
          icon: 'x-circle'
        });
    }

    console.log(`❌ ADMIN INVITATION DECLINED: ${currentProfile.email}`);

    return {
      success: true,
      message: 'Admin invitation declined.'
    };

  } catch (error) {
    console.error('Decline invitation failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to decline invitation'
    };
  }
} 