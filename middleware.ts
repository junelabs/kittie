import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const pathname = request.nextUrl.pathname;
  
  // Check if the request is for a protected dashboard route
  const isDashboardRoute = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/kit') || 
                          pathname.startsWith('/settings') || 
                          pathname.startsWith('/billing') ||
                          pathname.startsWith('/help') ||
                          pathname.startsWith('/assets');
  
  // If it's a dashboard route, check for authorization via cookies
  if (isDashboardRoute) {
    // Check for authentication cookie
    const authCookie = request.cookies.get('dashboard_authenticated');
    
    // If no auth cookie, redirect to home page
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/kit/:path*',
    '/settings/:path*',
    '/billing/:path*',
    '/help/:path*',
    '/assets/:path*'
  ]
};
