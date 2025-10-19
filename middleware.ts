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
  
  // If it's a dashboard route, check for authorization
  if (isDashboardRoute) {
    // Check for admin email in environment
    const adminEmail = process.env.ADMIN_EMAIL;
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Allow access in development or if admin email is set
    if (isDevelopment || adminEmail) {
      return NextResponse.next();
    }
    
    // Redirect to home page if not authorized
    return NextResponse.redirect(new URL('/', request.url));
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
