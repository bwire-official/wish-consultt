import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/service'
import { Tables } from '@/types/supabase'

// This API endpoint publishes scheduled announcements
// Called by Vercel Cron service
export async function GET(request: NextRequest) {
  try {
    // SECURITY: Verify this is a legitimate Vercel Cron call
    const userAgent = request.headers.get('user-agent') || ''
    const isVercelCron = userAgent.includes('Vercel') || 
                        request.headers.get('x-vercel-cron') === 'true' ||
                        process.env.NODE_ENV === 'production'
    
    // Additional security: Check for Vercel-specific headers
    const isInternalCall = request.headers.get('x-vercel-internal') === 'true'
    
    // In production, we can be more strict about verification
    if (process.env.NODE_ENV === 'production' && !isVercelCron && !isInternalCall) {
      console.error('❌ Unauthorized access attempt to cron endpoint')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    const now = new Date()
    const nowISO = now.toISOString()
    
    console.log(`🕒 API: Checking for scheduled announcements at ${now.toLocaleString()}`)

    // Find announcements ready to publish
    const { data: scheduledAnnouncements, error } = await supabaseAdmin
      .from('announcements')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_for', nowISO)

    if (error) {
      console.error('❌ Error fetching scheduled announcements:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!scheduledAnnouncements || scheduledAnnouncements.length === 0) {
      return NextResponse.json({ 
        message: 'No announcements ready to publish',
        published: 0,
        timestamp: nowISO
      })
    }

    console.log(`📢 Found ${scheduledAnnouncements.length} announcements ready to publish`)

    const publishedAnnouncements = []
    const errors = []

    // Publish each announcement
    for (const announcement of scheduledAnnouncements) {
      try {
        console.log(`📤 Publishing: "${announcement.title}"`)

        // Update announcement status to published
        const { error: updateError } = await supabaseAdmin
          .from('announcements')
          .update({
            status: 'published',
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', announcement.id)

        if (updateError) {
          console.error(`❌ Error publishing announcement ${announcement.id}:`, updateError)
          errors.push({
            id: announcement.id,
            title: announcement.title,
            error: updateError.message
          })
          continue
        }

        // Create notifications for target users
        await createNotificationsForAnnouncement(announcement)

        publishedAnnouncements.push({
          id: announcement.id,
          title: announcement.title,
          publishedAt: new Date().toISOString()
        })

        console.log(`✅ Successfully published: "${announcement.title}"`)

      } catch (error: unknown) {
        console.error(`❌ Error processing announcement ${announcement.id}:`, error)
        const message = error instanceof Error ? error.message : "An unknown error occurred"
        errors.push({
          id: announcement.id,
          title: announcement.title,
          error: message
        })
      }
    }

    return NextResponse.json({
      message: `Published ${publishedAnnouncements.length} announcements`,
      published: publishedAnnouncements.length,
      announcements: publishedAnnouncements,
      errors: errors,
      timestamp: nowISO
    })

  } catch (error: unknown) {
    console.error('❌ API Error:', error)
    const message = error instanceof Error ? error.message : "An unknown server error occurred"
    return NextResponse.json({ 
      error: 'Internal server error',
      message
    }, { status: 500 })
  }
}

// Function to create notifications when announcement is published
async function createNotificationsForAnnouncement(announcement: Tables<'announcements'>) {
  try {
    // Get target users based on target_audience
    let targetUsers: { id: string; role?: string; status?: string }[] = []
    
    if (announcement.target_audience === 'all') {
      const { data: allUsers } = await supabaseAdmin
        .from('profiles')
        .select('id, role, status')
      
      targetUsers = allUsers || []
    } else if (announcement.target_audience === 'user' && announcement.target_user_id) {
      targetUsers = [{ id: announcement.target_user_id }]
    } else if (announcement.target_audience && ['students', 'affiliates', 'admins'].includes(announcement.target_audience)) {
      // Map plural target_audience to singular role values
      const roleMap: Record<string, string> = {
        'students': 'student',
        'affiliates': 'affiliate', 
        'admins': 'admin'
      }
      const roleToMatch = roleMap[announcement.target_audience]

      const { data: roleUsers } = await supabaseAdmin
        .from('profiles')
        .select('id, role, status')
        .eq('role', roleToMatch)
      
      targetUsers = roleUsers || []
    }

    if (targetUsers.length === 0) {
      console.log(`⚠️ No target users found for announcement ${announcement.id}`)
      return
    }

    // Create notifications for all target users
    const notifications = targetUsers.map(user => ({
      user_id: user.id,
      type: 'announcement',
      category: 'system',
      title: announcement.title,
      message: announcement.content,
      data: { announcement_id: announcement.id },
      action_url: `/announcements/${announcement.id}`,
      priority: announcement.priority || 'medium',
      icon: 'megaphone'
    }))

    const { error: notifError } = await supabaseAdmin
      .from('notifications')
      .insert(notifications)

    if (notifError) {
      console.error(`❌ Error creating notifications for announcement ${announcement.id}:`, notifError)
    } else {
      console.log(`✅ Created ${notifications.length} notifications for announcement ${announcement.id}`)
    }
  } catch (error) {
    console.error(`❌ Error creating notifications for announcement ${announcement.id}:`, error)
  }
}

// Allow GET for testing (but still with security checks)
export async function POST() {
  return NextResponse.json({ 
    message: 'Announcement publisher endpoint',
    usage: 'This endpoint is called by Vercel Cron every 5 minutes',
    security: 'Protected by Vercel internal calls only',
    timestamp: new Date().toISOString()
  })
} 