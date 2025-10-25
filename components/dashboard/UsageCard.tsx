'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Crown, Check } from 'lucide-react';

interface UsageCardProps {
  planTier: string;
  kitCount: number;
  maxKits: number;
  storageUsed?: number;
  storageLimit?: number;
  onUpgrade?: () => void;
}

const PLAN_FEATURES = {
  free: {
    name: 'Free',
    color: 'bg-gray-100 text-gray-800',
    badgeColor: 'secondary' as const,
    features: ['1 media kit', '2 GB storage', 'Kittie branding']
  },
  starter: {
    name: 'Starter',
    color: 'bg-blue-100 text-blue-800',
    badgeColor: 'default' as const,
    features: ['3 media kits', '25 GB storage', 'Remove branding']
  },
  pro: {
    name: 'Pro',
    color: 'bg-purple-100 text-purple-800',
    badgeColor: 'default' as const,
    features: ['10 media kits', '100 GB storage', 'Advanced features']
  },
  business: {
    name: 'Business',
    color: 'bg-green-100 text-green-800',
    badgeColor: 'default' as const,
    features: ['50 media kits', '500 GB storage', 'Team features']
  }
};

export default function UsageCard({ 
  planTier, 
  kitCount, 
  maxKits, 
  storageUsed = 0, 
  storageLimit = 2000, 
  onUpgrade 
}: UsageCardProps) {
  const plan = PLAN_FEATURES[planTier as keyof typeof PLAN_FEATURES] || PLAN_FEATURES.free;
  const kitUsagePercent = (kitCount / maxKits) * 100;
  const storageUsagePercent = (storageUsed / storageLimit) * 100;
  const isNearLimit = kitUsagePercent >= 80;
  const isAtLimit = kitCount >= maxKits;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Your Plan</CardTitle>
          <Badge variant={plan.badgeColor} className={plan.color}>
            {plan.name}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Kit Usage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Media Kits</span>
            <span className="text-sm text-gray-600">
              {kitCount} of {maxKits} used
            </span>
          </div>
          
          <Progress 
            value={kitUsagePercent} 
            className="h-2 [&>div]:bg-blue-500"
          />
        </div>

        {/* Storage Usage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Storage</span>
            <span className="text-sm text-gray-600">
              {Math.round(storageUsed / 1000)} GB of {Math.round(storageLimit / 1000)} GB used
            </span>
          </div>
          
          <Progress 
            value={storageUsagePercent} 
            className="h-2 [&>div]:bg-green-500"
          />
        </div>

        {/* Plan Features */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Plan Features:</h4>
          <ul className="space-y-1">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Upgrade CTA */}
        {planTier === 'free' && (
          <div className="pt-4 border-t border-gray-200">
            <Button 
              onClick={onUpgrade}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade Plan</span>
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Unlock more kits and features
            </p>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
