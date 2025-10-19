import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  totalKits?: number;
  publicKits?: number;
}

export function DashboardLayout({ children, totalKits, publicKits }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        {children}
      </div>
    </div>
  );
}
