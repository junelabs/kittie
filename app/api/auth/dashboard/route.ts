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
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
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
