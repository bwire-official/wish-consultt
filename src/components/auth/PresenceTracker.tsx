'use client'

import { createClient } from '@/lib/supabase/client'
import { type Profile } from '@/types'
import { useEffect } from 'react'

export const PresenceTracker = ({ profile }: { profile: Profile }) => {
  useEffect(() => {
    console.log('PresenceTracker: Setting up for user:', profile.email);
    const supabase = createClient()
    const channel = supabase.channel('online-users')

    channel.subscribe(async (status) => {
      console.log('PresenceTracker: Channel status:', status);
      if (status === 'SUBSCRIBED') {
        console.log('PresenceTracker: Tracking user presence for:', profile.email);
        // When the user connects, announce their presence.
        // We include the time they came online to calculate session duration.
        await channel.track({
          user_id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          avatar_url: profile.avatar_url,
          online_at: new Date().toISOString(), // This is key for session time
        })
        console.log('PresenceTracker: Successfully tracked user:', profile.email);
      }
    })

    // The cleanup function automatically removes the user's presence when they leave.
    return () => {
      console.log('PresenceTracker: Cleaning up for user:', profile.email);
      supabase.removeChannel(channel)
    }
  }, [profile])

  return null // This component renders nothing.
} 