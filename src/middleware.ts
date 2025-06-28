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
    return response
  }
  
  // Protect all dashboard and onboarding routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding/student')) {
    console.log('Protected route detected. Checking for user session...');
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('NO USER FOUND in middleware. Redirecting to /login.'); // Critical Log
      return NextResponse.redirect(new URL('/login', request.url))
    } else {
      console.log('USER FOUND in middleware. Allowing access.'); // Success Log
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
    } else {
      console.log('USER FOUND for affiliate route. Allowing access.');
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

    // Check user role (this will be handled in the client-side layout for better UX)
    // The middleware redirects to login if no user, client-side checks admin role
    console.log('USER FOUND for admin route. Allowing access (role check in client).');
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