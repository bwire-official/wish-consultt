# Authentication System

## Overview

The Wish Consult platform implements a streamlined authentication system using Supabase Auth with middleware-based route protection.

## Protected Routes

### Dashboard Routes (`/dashboard/*`)
- **Access**: Authenticated students only
- **Protection**: Server-side middleware only
- **Redirect**: Unauthenticated users → `/login`

### Admin Routes (`/admin/*`)
- **Access**: Authenticated admins only
- **Protection**: Server-side middleware + client-side role check
- **Redirect**: Unauthenticated users → `/login`
- **Redirect**: Non-admin users → `/dashboard`

### Onboarding Routes (`/onboarding/*`)
- **Access**: Authenticated students only
- **Protection**: Server-side middleware only
- **Redirect**: Unauthenticated users → `/login`

## Authentication Flow

### Server-Side Protection (Middleware)
- **Location**: `src/middleware.ts`
- **Purpose**: Primary route protection at the edge
- **Features**:
  - Prevents unauthorized access before page loads
  - Handles authentication redirects efficiently
  - Logs authentication attempts
  - No client-side loading states needed

### Client-Side Profile Fetching
- **Purpose**: Fetch user profile data for UI display
- **Implementation**: Direct Supabase client calls in each page
- **Benefits**:
  - No complex state management
  - Simple and reliable
  - Fast page loads
  - No authentication loops

## User Roles

### Student
- Access to dashboard, courses, certificates, settings
- Access to onboarding flow
- Cannot access admin panel

### Admin
- Access to admin panel
- Access to all student features
- Cannot access affiliate features

### Affiliate
- Access to affiliate dashboard
- Access to student features
- Cannot access admin panel

## Authentication Flow

1. **Login**: User authenticates via `/login`
2. **Session Check**: Middleware validates session
3. **Route Access**: If authenticated, user can access protected routes
4. **Profile Fetch**: Client-side fetches user profile for UI
5. **Role Check**: Admin routes check role on client-side

## Security Features

- **Session Management**: Automatic session validation via middleware
- **Role-based Access**: Granular permission control
- **Efficient Protection**: No unnecessary client-side auth checks
- **Secure Redirects**: Proper redirect handling for all auth states
- **Fast Loading**: No authentication loading screens

## Implementation Examples

### Dashboard Page
```tsx
export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setUserProfile(profile);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Render dashboard content
}
```

### Admin Layout
```tsx
export default function AdminLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/login');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileData?.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setProfile(profileData);
      setLoading(false);
    };

    checkAdminAccess();
  }, []);

  if (loading) return <LoadingSpinner />;
  
  return <AdminDashboard>{children}</AdminDashboard>;
}
```

## Benefits of This Approach

1. **No Authentication Loading Screens**: Pages load immediately if user is authenticated
2. **Efficient**: Middleware handles auth at the edge, no client-side loops
3. **Simple**: Direct Supabase calls, no complex state management
4. **Reliable**: Server-side protection ensures security
5. **Fast**: No unnecessary re-renders or auth checks

## Environment Variables

Ensure these are set in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
``` 