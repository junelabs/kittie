"use client";

import React from "react";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  totalKits?: number;
  publicKits?: number;
  children: React.ReactNode;
}

export function DashboardLayout({ children, totalKits = 0, publicKits = 0 }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-white">
      <Sidebar totalKits={totalKits} publicKits={publicKits} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

export default DashboardLayout;


