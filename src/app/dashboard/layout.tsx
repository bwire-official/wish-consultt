import { getProfile } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (!profile) {
    redirect('/login');
  }

  // If onboarding is not completed, redirect to onboarding
  if (!profile.onboarding_completed) {
    redirect('/onboarding/student');
  }

  return (
    <div className="dashboard-layout" data-user-id={profile.id}>
      <DashboardNavbar
        profile={{
          ...profile,
          full_name: profile.full_name ?? undefined,
          username: profile.username ?? undefined,
          avatar_url: profile.avatar_url ?? undefined,
        }}
      />
      <div className="pt-14">
        {children}
      </div>
    </div>
  );
} 