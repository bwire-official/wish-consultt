import { getProfile } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { CertificatesClient } from './CertificatesClient';

export default async function CertificatesPage() {
  const profile = await getProfile();

  if (!profile) {
    redirect('/login');
  }

  // If onboarding is not completed, redirect to onboarding
  if (!profile.onboarding_completed) {
    redirect('/onboarding/student');
  }

  return <CertificatesClient />;
} 