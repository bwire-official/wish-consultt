import { getProfile } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

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
    <div className="admin-layout" data-user-id={profile.id}>
      {children}
    </div>
  );
}