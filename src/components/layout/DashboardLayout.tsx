"use client";

import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  totalKits: number;
  publicKits: number;
}

export function DashboardLayout({ children, totalKits, publicKits }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar totalKits={totalKits} publicKits={publicKits} />
      <main className="flex-1 overflow-auto">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
