import { PresenceTracker } from '@/components/auth/PresenceTracker';
import { type Profile } from '@/types';

export function PresenceTrackerWrapper({ profile }: { profile: Profile }) {
  return <PresenceTracker profile={profile} />;
} 