'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TopBar } from '@/components/dashboard/TopBar';
import BillingCard from '@/components/billing/BillingCard';

type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string | null;
};

type BillingPageClientProps = {
  userName: string;
  userEmail: string;
  userPlan: string;
  userInitials: string;
  planTier: string;
  hasStripeCustomer: boolean;
  brands: Brand[];
};

export default function BillingPageClient({
  userName,
  userEmail,
  userPlan,
  userInitials,
  planTier,
  hasStripeCustomer,
  brands,
}: BillingPageClientProps) {
  const [activeBrandId, setActiveBrandId] = useState<string | undefined>(
    brands.length > 0 ? brands[0].id : undefined
  );

  const handleBrandChange = (brandId: string) => {
    setActiveBrandId(brandId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto w-full max-w-7xl px-4">
          <TopBar 
            userName={userName}
            userEmail={userEmail}
            userPlan={userPlan}
            userInitials={userInitials}
            unreadCount={0}
            activeBrandId={activeBrandId}
            onBrandChange={handleBrandChange}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold">Billing & Plans</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your subscription and payment methods
          </p>
        </div>

        <BillingCard 
          planTier={planTier}
          hasStripeCustomer={hasStripeCustomer}
        />
      </div>
    </div>
  );
}
