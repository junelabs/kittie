'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TopBar } from '@/components/dashboard/TopBar';
import AccountForm from '@/components/account/AccountForm';

type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string | null;
};

type AccountPageClientProps = {
  userName: string;
  userEmail: string;
  userPlan: string;
  userInitials: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  brands: Brand[];
};

export default function AccountPageClient({
  userName,
  userEmail,
  userPlan,
  userInitials,
  fullName,
  email,
  avatarUrl,
  brands,
}: AccountPageClientProps) {
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

      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold">Account Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your profile information and preferences
          </p>
        </div>

        <AccountForm 
          initialData={{
            full_name: fullName,
            email: email,
            avatar_url: avatarUrl,
          }}
        />
      </div>
    </div>
  );
}
