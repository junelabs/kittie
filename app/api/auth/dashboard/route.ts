import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // Get the dashboard password from environment variables
    const dashboardPassword = process.env.DASHBOARD_PASSWORD;
    
    // If no password is set, deny access
    if (!dashboardPassword) {
      return NextResponse.json(
        { error: 'Dashboard access not configured' },
        { status: 403 }
      );
    }
    
    // Check if the provided password matches
    if (password === dashboardPassword) {
      const response = NextResponse.json({ authenticated: true });
      // Set httpOnly cookie for middleware
      response.cookies.set('dashboard_authenticated', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400, // 24 hours
        path: '/'
      });
      return response;
    } else {
      return NextResponse.json(
        { authenticated: false, message: 'Incorrect password.' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
