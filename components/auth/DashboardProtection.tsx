'use client';

import { useState, useEffect } from 'react';
import { DashboardAuth } from './DashboardAuth';

interface DashboardProtectionProps {
  children: React.ReactNode;
}

export function DashboardProtection({ children }: DashboardProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        // Check if we're in development mode
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        if (isDevelopment) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Check for admin email in environment
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        const authStatus = localStorage.getItem('kittie-dashboard-auth');
        
        if (adminEmail || authStatus === 'true') {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <DashboardAuth />;
  }

  return <>{children}</>;
}
