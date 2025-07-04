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
        {/* Background Glowing Lights */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-3/4 right-1/3 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s' }}></div>
        </div>
        
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
        <main className="pt-16 pb-4 lg:pl-64 transition-all duration-300 min-h-screen relative z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}