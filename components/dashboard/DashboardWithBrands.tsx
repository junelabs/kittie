'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VerifyEmailBanner from './VerifyEmailBanner';
import { TopBar } from './TopBar';
import { Toolbar } from './Toolbar';
import KitsGrid from './KitsGrid';
import UsageCard from './UsageCard';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import { getBrands } from '@/app/actions/brand-actions';

interface Kit {
  id: string;
  name: string;
  archived: boolean;
  updated_at: string;
  created_at?: string;
  logo_url?: string | null;
}

interface DashboardWithBrandsProps {
  user: {
    id: string;
    email?: string;
    user_metadata?: { full_name?: string };
    email_confirmed_at?: string;
  };
  profile: {
    full_name?: string;
    plan_tier?: string;
    onboarded_at?: string;
  } | null;
  kits: Kit[];
  showArchived: boolean;
  emailVerified: boolean;
  notOnboarded: boolean;
  userName: string;
  userInitials: string;
  planTier: string;
  maxKits: number;
  currentKitCount: number;
  brands: any[];
}

export default function DashboardWithBrands({
  user,
  profile,
  kits,
  showArchived,
  emailVerified,
  notOnboarded,
  userName,
  userInitials,
  planTier,
  maxKits,
  currentKitCount,
  brands,
}: DashboardWithBrandsProps) {
  const [activeBrandId, setActiveBrandId] = useState<string>('');
  const [filteredKits, setFilteredKits] = useState<Kit[]>(kits);
  const router = useRouter();

  useEffect(() => {
    // Load brands and set active brand
    const loadBrands = async () => {
      try {
        const brands = await getBrands();
        if (brands.length > 0) {
          setActiveBrandId(brands[0].id);
        }
      } catch (error) {
        console.error('Failed to load brands:', error);
      }
    };

    loadBrands();
  }, []);

  useEffect(() => {
    // Filter kits by active brand
    if (activeBrandId) {
      // For now, show all kits since we need to implement brand filtering in the query
      // This would be updated to filter by brand_id in the database query
      setFilteredKits(kits);
    }
  }, [activeBrandId, kits]);

  const handleBrandChange = (brandId: string) => {
    setActiveBrandId(brandId);
    // In a real implementation, this would trigger a new query to fetch kits for this brand
    // For now, we'll just update the state
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto w-full max-w-7xl px-4">
          <TopBar 
            userName={userName}
            userEmail={user.email ?? ''}
            userPlan={planTier}
            userInitials={userInitials}
            unreadCount={0}
            activeBrandId={activeBrandId}
            onBrandChange={setActiveBrandId}
          />
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="py-6">
          <VerifyEmailBanner emailVerified={emailVerified} />
          
          {/* Header */}
          <div className="mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">My Kits</h2>
              <p className="text-sm text-gray-600">Manage your brand media kits</p>
            </div>
          </div>
          
          {/* Usage Card and Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-1">
              <UsageCard 
                planTier={planTier}
                kitCount={currentKitCount}
                maxKits={maxKits}
                storageUsed={currentKitCount > 0 ? 500 : 0} // 500MB per kit, 0 if no kits
                storageLimit={planTier === 'free' ? 2000 : planTier === 'starter' ? 25000 : 100000}
                onUpgrade={() => router.push('/billing')}
              />
            </div>
            
            <div className="lg:col-span-3">
              <Toolbar showArchived={showArchived} />
              <KitsGrid kits={filteredKits} />
            </div>
          </div>
          
          <OnboardingModal openByDefault={brands.length === 0} />
        </div>
      </div>
    </div>
  );
}
