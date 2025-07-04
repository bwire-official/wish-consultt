import { getProfile } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { PresenceTrackerWrapper } from '@/components/admin/PresenceTrackerWrapper';
import TopProgressBar from '@/components/dashboard/TopProgressBar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (!profile) {
    redirect('/login');
  }

  // SECURITY: Check user role server-side for student routes
  if (profile.role !== 'student') {
    console.log(`NON-STUDENT USER (${profile.role}) attempted student dashboard access. Redirecting to appropriate dashboard.`);
    
    if (profile.role === 'admin') {
      redirect('/admin');
    } else if (profile.role === 'affiliate') {
      redirect('/affiliate/dashboard');
    } else {
      redirect('/login');
    }
  }

  // If onboarding is not completed, redirect to onboarding
  if (!profile.onboarding_completed) {
    redirect('/onboarding/student');
  }

  return (
    <>
      {profile && <PresenceTrackerWrapper profile={profile} />}
      <div className="dashboard-layout" data-user-id={profile.id}>
        <TopProgressBar />
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
    </>
  );
} 