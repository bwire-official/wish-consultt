import { getProfile } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { PresenceTrackerWrapper } from '@/components/admin/PresenceTrackerWrapper';
import AdminPageLoader from '@/components/admin/AdminPageLoader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (!profile) {
    redirect('/login');
  }

  // Check if user is admin
  if (profile.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <>
      {profile && <PresenceTrackerWrapper profile={profile} />}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AdminPageLoader />
        <AdminNavbar
          profile={{
            ...profile,
            full_name: profile.full_name ?? undefined,
            username: profile.username ?? undefined,
            email: profile.email ?? undefined,
            avatar_url: profile.avatar_url ?? undefined,
            role: profile.role ?? undefined,
          }}
        />
        <AdminSidebar />
        <main className="pt-16 lg:pl-64 transition-all duration-300">
          {children}
        </main>
      </div>
    </>
  );
}