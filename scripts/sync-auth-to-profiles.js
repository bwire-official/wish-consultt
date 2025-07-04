const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://qyktwvuxkryhvfbvxiaw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5a3R3dnV4a3J5aHZmYnZ4aWF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDcyNzE0NywiZXhwIjoyMDUwMzAzMTQ3fQ.iwSkfVnbGGEsR0hNCKKWe7A1K6oOlsrjKGS5wy3MpZM'
)

async function syncAuthToProfiles() {
  console.log('🔄 Syncing auth users to profiles table...\n')
  
  try {
    // 1. Get all authenticated users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.log('❌ Error fetching auth users:', authError.message)
      return
    }

    const authUsers = authData.users || []
    console.log(`🔐 AUTH USERS: ${authUsers.length}`)
    
    if (authUsers.length === 0) {
      console.log('   ❌ No authenticated users found!')
      return
    }

    // 2. Check existing profiles
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('id')
    
    const existingIds = new Set(existingProfiles?.map(p => p.id) || [])
    console.log(`👤 EXISTING PROFILES: ${existingIds.size}`)

    // 3. Find users needing profiles
    const usersNeedingProfiles = authUsers.filter(user => !existingIds.has(user.id))
    console.log(`🆕 USERS NEEDING PROFILES: ${usersNeedingProfiles.length}`)

    if (usersNeedingProfiles.length === 0) {
      console.log('   ✅ All auth users already have profiles!')
      return
    }

    // 4. Create missing profiles
    let created = 0
    for (const user of usersNeedingProfiles) {
      try {
        // Determine role based on email or metadata
        let role = 'student' // default
        if (user.email?.includes('admin')) {
          role = 'admin'
        } else if (user.user_metadata?.signup_type === 'affiliate' || user.email?.includes('affiliate')) {
          role = 'affiliate'
        }

        const profileData = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || 
                    user.user_metadata?.first_name || 
                    user.email?.split('@')[0] || 
                    'User',
          role: role,
          status: 'active',
          onboarding_completed: true, // Set to true so they can access dashboard
          created_at: user.created_at,
          updated_at: new Date().toISOString()
        }

        const { data, error: insertError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()

        if (insertError) {
          console.log(`   ❌ Failed to create profile for ${user.email}: ${insertError.message}`)
        } else {
          console.log(`   ✅ Created profile for ${user.email} (${role})`)
          created++
        }
      } catch (err) {
        console.log(`   ❌ Error processing ${user.email}: ${err.message}`)
      }
    }

    console.log(`\n📊 SUMMARY:`)
    console.log(`   Auth users: ${authUsers.length}`)
    console.log(`   Existing profiles: ${existingIds.size}`)
    console.log(`   Created profiles: ${created}`)
    console.log(`   Total profiles now: ${existingIds.size + created}`)

    if (created > 0) {
      console.log('\n🎉 Sync completed! You can now test notifications.')
      console.log('📝 Next steps:')
      console.log('   1. Create a new announcement targeting "Students"')
      console.log('   2. Publish it')
      console.log('   3. Check the bell icon in your student dashboard')
    }

  } catch (error) {
    console.log('❌ Sync failed:', error.message)
  }
}

syncAuthToProfiles() 