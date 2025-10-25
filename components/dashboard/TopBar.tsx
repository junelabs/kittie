'use client';

import { Crown } from 'lucide-react';
import Link from 'next/link';
import UserMenu from '@/components/header/UserMenu';
import { signOut } from '@/app/actions/auth-actions';
import BrandSelector from '@/components/dashboard/BrandSelector';

export function TopBar({
  userName='User',
  userEmail='',
  userPlan='free',
  userInitials='U',
  unreadCount=0,
  activeBrandId,
  onBrandChange,
}: { 
  userName?: string; 
  userEmail?: string;
  userPlan?: string;
  userInitials?: string;
  unreadCount?: number;
  activeBrandId?: string;
  onBrandChange?: (brandId: string) => void;
}) {
  
  const handleBuyPro = () => {
    // TODO: Wire up upgrade/billing functionality
    window.location.href = '/billing';
  };

  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-lg font-semibold text-orange-500 hover:text-orange-600 transition-colors">
          Kittie
        </Link>
        {activeBrandId && onBrandChange && (
          <BrandSelector 
            activeBrandId={activeBrandId}
            onBrandChange={onBrandChange}
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        {userPlan === 'free' && (
          <button
            onClick={handleBuyPro}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-bold transition cursor-pointer bg-[#FFF5E6] border border-[#FFDCB3] text-[#C25224] hover:bg-[#FFEDD5]"
          >
            <Crown className="mr-2 size-4" /> Upgrade
          </button>
        )}

        <UserMenu 
          user={{
            name: userName,
            email: userEmail,
            initials: userInitials,
            plan: userPlan,
            avatarUrl: '',
          }}
          unreadCount={unreadCount}
          onSignOut={handleSignOut}
        />
      </div>
    </div>
  );
}

