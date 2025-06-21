import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

type OnlineUser = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  online_at: string;
};

export function useActiveUsers() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const refreshUsers = useCallback(() => {
    if (channel) {
      const presenceState = channel.presenceState() as Record<string, OnlineUser[]>;
      const users = Object.values(presenceState).flat() as OnlineUser[];
      console.log('Manual refresh - Presence state:', presenceState);
      console.log('Manual refresh - Users found:', users);
      setOnlineUsers(users);
    }
  }, [channel]);

  useEffect(() => {
    // Small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      console.log('Setting up presence channel...');
      const supabase = createClient();
      const newChannel = supabase.channel('online-users');

      const handlePresenceUpdate = () => {
        const presenceState = newChannel.presenceState() as Record<string, OnlineUser[]>;
        const users = Object.values(presenceState).flat() as OnlineUser[];
        console.log('Presence update - State:', presenceState);
        console.log('Presence update - Users:', users);
        setOnlineUsers(users);
        setIsLoading(false);
      };

      newChannel
        .on('presence', { event: 'sync' }, () => {
          console.log('Presence sync event');
          handlePresenceUpdate();
        })
        .on('presence', { event: 'join' }, (payload) => {
          console.log('User joined:', payload);
          handlePresenceUpdate();
        })
        .on('presence', { event: 'leave' }, (payload) => {
          console.log('User left:', payload);
          handlePresenceUpdate();
        })
        .subscribe((status) => {
          console.log('Channel subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to presence channel');
          }
        });

      setChannel(newChannel);

      // Update current time every second for session duration calculations
      const timeTimer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => {
        console.log('Cleaning up presence channel...');
        clearInterval(timeTimer);
        supabase.removeChannel(newChannel);
      };
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const formatDuration = (startTime: string) => {
    const diff = currentTime.getTime() - new Date(startTime).getTime();
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor(diff / (1000 * 60 * 60));

    const h = hours > 0 ? `${hours}h ` : '';
    const m = minutes > 0 ? `${minutes}m ` : '';
    const s = `${seconds}s`;

    return h + m + s || '0s';
  };

  return {
    onlineUsers,
    currentTime,
    isLoading,
    formatDuration,
    refreshUsers,
  };
} 