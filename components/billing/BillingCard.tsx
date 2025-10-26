'use client';

import { useState } from 'react';
import { ArrowRight, CreditCard, FileText, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createBillingPortalSession, createCheckoutSession } from '@/app/actions/billing-actions';

type BillingCardProps = {
  planTier: string;
  hasStripeCustomer: boolean;
};

const PLAN_FEATURES = {
  free: [
    '1 media kit',
    '2 GB storage',
    'Hosted on kittie.so',
    'Kittie branding',
  ],
  starter: [
    '3 media kits',
    '25 GB storage',
    'Remove Kittie branding',
    '3 team members',
    'Email support (48hr)',
    'Custom domains (coming soon)',
    'Email submissions (coming soon)',
  ],
  pro: [
    'Unlimited media kits',
    'All premium templates',
    'Advanced analytics',
    'Custom domain',
    'Priority support',
    'API access',
  ],
  business: [
    'Everything in Pro',
    'Team collaboration',
    'SSO & Advanced security',
    'Dedicated account manager',
    'Custom integrations',
    'SLA guarantee',
  ],
};

export default function BillingCard({ planTier, hasStripeCustomer }: BillingCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleManageBilling = async () => {
    setLoading(true);
    setError('');

    const result = await createBillingPortalSession();

    if (result?.error) {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleUpgrade = async (planType: 'starter' | 'pro') => {
    setLoading(true);
    setError('');

    const result = await createCheckoutSession(planType);

    if (result?.error) {
      setError(result.error);
    }

    setLoading(false);
  };

  const planName = planTier.charAt(0).toUpperCase() + planTier.slice(1);
  const features = PLAN_FEATURES[planTier as keyof typeof PLAN_FEATURES] || PLAN_FEATURES.free;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-900">
          {error}
        </div>
      )}

      {/* Two Column Layout: Current Plan + Pricing */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan Card */}
        <div className="rounded-2xl border bg-white p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="mb-1">
                <h2 className="text-lg font-medium">Current Plan</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                You are currently on the {planName} plan
              </p>
            </div>
            <Badge variant={planTier === 'free' ? 'secondary' : 'default'}>
              {planName}
            </Badge>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-sm mb-3">Plan Features:</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-black"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            {planTier !== 'free' && (
              <Button onClick={handleManageBilling} disabled={loading || !hasStripeCustomer} variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                {loading ? 'Loading...' : 'Manage Billing'}
              </Button>
            )}
          </div>

          {!hasStripeCustomer && planTier !== 'free' && (
            <p className="text-xs text-muted-foreground mt-3">
              No billing account found. Please contact support if you believe this is an error.
            </p>
          )}
        </div>

        {/* Pricing Plans */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Starter Plan */}
          <div className="rounded-2xl border-2 border-black bg-gradient-to-br from-white to-gray-50/30 p-6 relative overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-black text-white border-0">
                Most Popular
              </Badge>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Starter</h2>
              <p className="text-sm text-muted-foreground mb-3">
                For founders & small teams
              </p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Everything you need for professional brand assets
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-sm mb-3">Everything in Free, plus:</h3>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2 text-sm">
                  <span className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-black"></span>
                  </span>
                  <span><strong>3 media kits</strong> (vs 1 in Free)</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-black"></span>
                  </span>
                  <span><strong>25 GB storage</strong> (vs 2 GB)</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-black"></span>
                  </span>
                  <span><strong>Remove Kittie branding</strong></span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-black"></span>
                  </span>
                  <span><strong>3 team members</strong></span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-black"></span>
                  </span>
                  <span><strong>Email support</strong> (48hr response)</span>
                </li>
              </ul>
            </div>

            {planTier === 'free' && (
              <Button 
                onClick={() => handleUpgrade('starter')} 
                disabled={loading}
                className="w-full bg-black hover:bg-gray-800"
                size="lg"
              >
                {loading ? 'Loading...' : 'Upgrade to Starter'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Pro Plan - Early Launch Offer */}
          <div className="rounded-2xl border-2 border-[var(--brand)] bg-gradient-to-br from-white to-orange-50/30 p-6 relative overflow-hidden">

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Starter Annual</h2>
              <p className="text-sm text-muted-foreground mb-3">
                For founders & small teams
              </p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-[var(--brand)]">$79</span>
                <span className="text-muted-foreground">/year</span>
              </div>
              <p className="text-sm text-[var(--brand)] font-medium">
                Early launch pricing (save $149)
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-sm mb-3">Everything in Free, plus:</h3>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2 text-sm">
                  <span className="h-5 w-5 rounded-full bg-[var(--brand)]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]"></span>
                  </span>
                  <span><strong>3 media kits</strong> (vs 1 in Free)</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="h-5 w-5 rounded-full bg-[var(--brand)]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]"></span>
                  </span>
                  <span><strong>25 GB storage</strong> (vs 2 GB)</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="h-5 w-5 rounded-full bg-[var(--brand)]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]"></span>
                  </span>
                  <span><strong>Remove Kittie branding</strong></span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="h-5 w-5 rounded-full bg-[var(--brand)]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]"></span>
                  </span>
                  <span><strong>3 team members</strong></span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="h-5 w-5 rounded-full bg-[var(--brand)]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]"></span>
                  </span>
                  <span><strong>Email support</strong> (48hr response)</span>
                </li>
              </ul>
            </div>

            {planTier === 'free' && (
              <Button 
                onClick={() => handleUpgrade('pro')} 
                disabled={loading}
                className="w-full bg-[var(--brand)] hover:bg-[var(--brand)]/90"
                size="lg"
              >
                {loading ? 'Loading...' : 'Upgrade to Starter'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Billing Portal Info */}
      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-medium mb-4">Billing Portal</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Through the Stripe billing portal, you can:
        </p>
        <ul className="space-y-2 mb-6">
          <li className="flex items-start gap-2 text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-black mt-2 shrink-0"></span>
            Update payment methods and billing information
          </li>
          <li className="flex items-start gap-2 text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-black mt-2 shrink-0"></span>
            View and download invoices
          </li>
          <li className="flex items-start gap-2 text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-black mt-2 shrink-0"></span>
            Upgrade, downgrade, or cancel your subscription
          </li>
        </ul>
      </div>

      {/* Support Card */}
      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-medium mb-2">Need Help?</h2>
        <p className="text-sm text-muted-foreground mb-4">
          If you have questions about billing or need assistance, we&apos;re here to help.
        </p>
        <Button variant="outline" asChild>
          <a href="mailto:support@kittie.app">
            <Mail className="mr-2 h-4 w-4" />
            Contact Support
          </a>
        </Button>
      </div>
    </div>
  );
}

