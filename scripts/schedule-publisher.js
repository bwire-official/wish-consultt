const { createClient } = require('@supabase/supabase-js')

// Try to load dotenv if available  
try {
  require('dotenv').config()
} catch (e) {
  console.log(' dotenv not available, using system environment variables')
}

console.log(' Environment Variables Check:')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Found' : 'Missing')
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Found' : 'Missing')

// Exit if no credentials
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error(' Missing Supabase credentials!')
  console.log(' Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  console.log(' Alternative: Manually publish overdue announcements in admin panel')
  process.exit(1)
}

console.log(' Credentials found, checking for scheduled announcements...')

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// Function to check and publish scheduled announcements
async function checkScheduledAnnouncements() {
  try {
    const now = new Date()
    const nowISO = now.toISOString()
    console.log(' Current time (Local):', now.toLocaleString())
    console.log(' Current time (UTC):', nowISO)

    // Find announcements ready to publish
    const { data: scheduledAnnouncements, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_for', nowISO)

    if (error) {
      console.error(' Error fetching scheduled announcements:', error)
      return
    }

    if (!scheduledAnnouncements || scheduledAnnouncements.length === 0) {
      console.log(' No announcements ready to publish')
      return
    }

    console.log(' Found', scheduledAnnouncements.length, 'announcements ready to publish')

    // Publish each announcement
    for (const announcement of scheduledAnnouncements) {
      try {
        console.log(' Publishing:', announcement.title)

        // Update announcement status to published
        const { error: updateError } = await supabase
          .from('announcements')
          .update({
            status: 'published',
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', announcement.id)

        if (updateError) {
          console.error(' Error publishing announcement', announcement.id, ':', updateError)
          continue
        }

        console.log(' Successfully published:', announcement.title)

      } catch (error) {
        console.error(' Error processing announcement', announcement.id, ':', error)
      }
    }
  } catch (error) {
    console.error(' Error in checkScheduledAnnouncements:', error)
  }
}

// Run the check function
checkScheduledAnnouncements()
  .then(() => {
    console.log(' Scheduled announcement check completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error(' Fatal error:', error)
    process.exit(1)
  })
