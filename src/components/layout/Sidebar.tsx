"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  ChevronDown,
  CreditCard,
  LogOut,
  BarChart3,
  Home,
  Plus,
  Settings,
  FileText,
  Package,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  totalKits: number;
  publicKits: number;
}

export function Sidebar({ totalKits, publicKits }: SidebarProps) {
  const pathname = usePathname();
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const primaryActions = [
    {
      name: "My Kits",
      href: "/dashboard",
      icon: Package,
      current: pathname === "/dashboard",
      active: true
    },
    {
      name: "New Kit",
      href: "/kit/new",
      icon: Plus,
      current: pathname === "/kit/new",
      isAction: true
    }
  ];

  const coreSections = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      current: pathname === "/dashboard"
    },
    {
      name: "Assets",
      href: "/assets",
      icon: FileText,
      current: pathname === "/assets"
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      current: pathname === "/analytics"
    }
  ];


  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center px-6 border-b border-amber-200">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">🐱</span>
          </div>
          <span className="text-xl font-semibold text-gray-900 tracking-tight">Kittie</span>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="px-6 py-4">
        <div className="space-y-2">
          {primaryActions.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                          item.active 
                            ? "text-orange-800 font-semibold" 
                            : item.isAction
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-sm"
                            : "text-gray-700 hover:text-gray-900 hover:bg-[#fcfcf0]"
                )}
              >
                <Icon className="h-4 w-4 mr-3" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Core Sections */}
      <div className="flex-1 px-6 py-2">
        <nav className="space-y-1">
          {coreSections.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  item.current 
                    ? "text-orange-800 font-semibold" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-[#fcfcf0]"
                )}
              >
                <Icon className="h-4 w-4 mr-3" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Usage Stats */}
      <div className="px-6 py-4 border-t border-amber-200">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Storage Used</span>
            <span className="text-xs text-amber-600">{totalKits} kits</span>
          </div>
          <div className="w-full bg-[#fcfcf0] rounded-full h-2">
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full" style={{ width: '25%' }}></div>
          </div>
          <div className="text-xs text-amber-600">2.1 GB of 10 GB used</div>
        </div>
      </div>


      {/* User Profile */}
      <div className="px-6 py-4 border-t border-amber-200">
        <button
          onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#fcfcf0] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-orange-700" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">David Brant...</div>
              <div className="text-xs text-amber-600">@d__brantley</div>
            </div>
          </div>
          <ChevronDown className="h-4 w-4" />
        </button>
        
        {/* Account Dropdown Menu */}
        {isAccountOpen && (
          <div className="mt-2 space-y-1">
            <Link
              href="/settings"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-[#fcfcf0] transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
            <Link
              href="/billing"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-[#fcfcf0] transition-colors"
            >
              <CreditCard className="h-4 w-4" />
              <span>Upgrade</span>
            </Link>
            <Link
              href="/help"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-[#fcfcf0] transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Help & Support</span>
            </Link>
            <button className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-[#fcfcf0] transition-colors w-full text-left">
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
