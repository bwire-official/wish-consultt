import { getProfile } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { SettingsClient } from './SettingsClient';

export default async function SettingsPage() {
  const profile = await getProfile();

  if (!profile) {
    redirect('/login');
  }

  // If onboarding is not completed, redirect to onboarding
  if (!profile.onboarding_completed) {
    redirect('/onboarding/student');
  }

  return <SettingsClient profile={profile} />;
} 