import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  await supabase.auth.getSession()
  
  const { pathname } = request.nextUrl
  console.log(`--- MIDDLEWARE RUNNING for path: ${pathname} ---`); // Log the path

  // Skip middleware for auth routes and public pages
  if (pathname.startsWith('/login') || 
      pathname.startsWith('/signup') || 
      pathname.startsWith('/verify-email') ||
      pathname.startsWith('/forgot-password') ||
      pathname.startsWith('/auth/callback') ||
      pathname.startsWith('/affiliate/login') ||
      pathname.startsWith('/affiliate/signup') ||
      pathname.startsWith('/affiliate/verify-email') ||
      pathname.startsWith('/affiliate/forgot-password') ||
      pathname === '/' ||
      pathname === '/affiliate' ||
      pathname.startsWith('/api/')) {
    
    // SECURITY: Special protection for cron endpoint
    if (pathname === '/api/cron/publish-scheduled') {
      const userAgent = request.headers.get('user-agent') || ''
      const isVercelCron = userAgent.includes('Vercel') || 
                          request.headers.get('x-vercel-cron') === 'true' ||
                          request.headers.get('x-vercel-internal') === 'true'
      
      // In production, block non-Vercel calls to cron endpoint
      if (process.env.NODE_ENV === 'production' && !isVercelCron) {
        console.error('❌ Unauthorized access attempt to cron endpoint from middleware')
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }
    
    return response
  }
  
  // Protect all dashboard and onboarding routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding/student')) {
    console.log('Protected route detected. Checking for user session...');
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('NO USER FOUND in middleware. Redirecting to /login.'); // Critical Log
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // SECURITY: Check user role server-side for student routes  
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error || !profile) {
        console.log('PROFILE NOT FOUND for student route. Redirecting to /login.');
        return NextResponse.redirect(new URL('/login', request.url))
      }

      if (profile.role !== 'student') {
        console.log(`NON-STUDENT USER (${profile.role}) attempted student route access. Redirecting to appropriate dashboard.`);
        
        // Redirect based on actual role
        if (profile.role === 'admin') {
          return NextResponse.redirect(new URL('/admin', request.url))
        } else if (profile.role === 'affiliate') {
          return NextResponse.redirect(new URL('/affiliate/dashboard', request.url))
        } else {
          return NextResponse.redirect(new URL('/login', request.url))
        }
      }

      console.log('STUDENT USER confirmed. Allowing student access.');
    } catch (error) {
      console.error('Error checking student role:', error);
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protect affiliate routes (dashboard and onboarding only - landing page is public)
  if (pathname.startsWith('/affiliate/dashboard') || 
      pathname.startsWith('/onboarding/affiliate')) {
    console.log('Affiliate protected route detected. Checking for affiliate session...');
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('NO USER FOUND for affiliate route. Redirecting to /affiliate/login.');
      return NextResponse.redirect(new URL('/affiliate/login', request.url))
    }

    // SECURITY: Check user role server-side for affiliate routes
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error || !profile) {
        console.log('PROFILE NOT FOUND for affiliate route. Redirecting to /affiliate/login.');
        return NextResponse.redirect(new URL('/affiliate/login', request.url))
      }

      if (profile.role !== 'affiliate') {
        console.log(`NON-AFFILIATE USER (${profile.role}) attempted affiliate access. Redirecting to appropriate dashboard.`);
        
        // Redirect based on actual role
        if (profile.role === 'student') {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        } else if (profile.role === 'admin') {
          return NextResponse.redirect(new URL('/admin', request.url))
        } else {
          return NextResponse.redirect(new URL('/affiliate/login', request.url))
        }
      }

      console.log('AFFILIATE USER confirmed. Allowing affiliate access.');
    } catch (error) {
      console.error('Error checking affiliate role:', error);
      return NextResponse.redirect(new URL('/affiliate/login', request.url))
    }
  }

  // Protect admin routes with role check
  if (pathname.startsWith('/admin')) {
    console.log('Admin route detected. Checking for admin access...');
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('NO USER FOUND for admin route. Redirecting to /login.');
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // SECURITY: Check user role server-side to prevent unauthorized access
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error || !profile) {
        console.log('PROFILE NOT FOUND for admin route. Redirecting to /login.');
        return NextResponse.redirect(new URL('/login', request.url))
      }

      if (profile.role !== 'admin') {
        console.log(`NON-ADMIN USER (${profile.role}) attempted admin access. Redirecting to appropriate dashboard.`);
        
        // Redirect based on actual role
        if (profile.role === 'student') {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        } else if (profile.role === 'affiliate') {
          return NextResponse.redirect(new URL('/affiliate/dashboard', request.url))
        } else {
          return NextResponse.redirect(new URL('/login', request.url))
        }
      }

      console.log('ADMIN USER confirmed. Allowing admin access.');
    } catch (error) {
      console.error('Error checking admin role:', error);
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 