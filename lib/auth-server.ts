import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Server-side authentication check
 * This runs on the server before the page renders
 * Cannot be bypassed by client-side manipulation
 */
export async function requireAuth() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('dashboard_authenticated');
  
  // If no auth cookie or cookie is not 'true', redirect to login
  if (!authCookie || authCookie.value !== 'true') {
    redirect('/login');
  }
}

/**
 * Check if user is authenticated (without redirecting)
 * Useful for conditional rendering
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('dashboard_authenticated');
  
  return authCookie?.value === 'true';
}
