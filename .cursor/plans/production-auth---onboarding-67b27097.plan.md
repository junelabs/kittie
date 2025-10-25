<!-- 67b27097-c339-4ff7-8acc-f78a4ca57f2f a2884029-1566-4540-9b9d-42fffaf447c4 -->
# Production-Ready Authentication & Onboarding System

## Overview

Build a secure, production-ready auth system with Supabase, minimal onboarding, and Stripe integration. Users sign up instantly but need email verification to publish kits.

## Phase 1: Clean Up & Remove Conflicting Auth Systems

### Remove Password-Based Dashboard Auth

**Files to delete:**

- `components/auth/DashboardAuth.tsx` - Old password system
- `components/auth/DashboardProtection.tsx` - Not needed with Supabase
- `app/api/auth/dashboard/route.ts` - Password API endpoint
- `DASHBOARD_SETUP.md` - Outdated documentation

**Update `lib/auth-server.ts`:**

Replace cookie-based auth with Supabase session check:

```typescript
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function requireAuth() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value; },
      },
    }
  );
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  return session.user;
}
```

### Clean Up Disabled/Duplicate Components

**Delete entire directories:**

- `src/components/` - Duplicate components causing conflicts
- `components/onboarding.disabled/` - Old onboarding implementation
- `app/(app)/onboarding/page.tsx.disabled` - Old onboarding page

## Phase 2: Database Schema Setup

### Create Supabase Tables

Run these migrations in Supabase SQL Editor:

**1. Profiles Table:**

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  business_name TEXT,
  logo_url TEXT,
  onboarded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);
```

**2. Update Media Kits Table:**

Add email verification check:

```sql
ALTER TABLE media_kits 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Policy: Only verified users can publish kits
CREATE POLICY "Only verified users can publish kits"
  ON media_kits FOR UPDATE
  USING (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email_confirmed_at IS NOT NULL
    )
  );
```

**3. Stripe Customer Integration:**

```sql
ALTER TABLE profiles
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_subscription_id TEXT,
ADD COLUMN plan_tier TEXT DEFAULT 'free' CHECK (plan_tier IN ('free', 'starter', 'pro', 'business'));
```

## Phase 3: Middleware for Route Protection

**Create `middleware.ts` at project root:**

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          req.cookies.set({ name, value, ...options })
          res = NextResponse.next({ request: { headers: req.headers } })
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options) {
          req.cookies.set({ name, value: '', ...options })
          res = NextResponse.next({ request: { headers: req.headers } })
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  
  // Protected app routes
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard') ||
                          req.nextUrl.pathname.startsWith('/kit') ||
                          req.nextUrl.pathname.startsWith('/assets') ||
                          req.nextUrl.pathname.startsWith('/settings') ||
                          req.nextUrl.pathname.startsWith('/billing') ||
                          req.nextUrl.pathname.startsWith('/onboarding')
  
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  // Check if user needs onboarding
  if (session && req.nextUrl.pathname.startsWith('/dashboard')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarded_at')
      .eq('id', session.user.id)
      .single()
    
    if (!profile?.onboarded_at) {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }
  }
  
  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/kit/:path*', '/assets/:path*', 
            '/settings/:path*', '/billing/:path*', '/onboarding/:path*']
}
```

## Phase 4: Update Login Page

**Update `app/(marketing)/login/page.tsx`:**

```typescript
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signup"|"login">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = supabaseBrowser();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      
      // Create profile
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email,
        });
      }
      
      // Redirect to onboarding
      router.push("/onboarding");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? "Loading..." : mode === "signup" ? "Sign up" : "Sign in"}
            </Button>
            <button
              type="button"
              className="w-full text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            >
              {mode === "signup" 
                ? "Already have an account? Sign in" 
                : "Don't have an account? Sign up"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Phase 5: Create Minimal Onboarding Page

**Create `app/(app)/onboarding/page.tsx`:**

```typescript
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
  const [businessName, setBusinessName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = supabaseBrowser();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let logoUrl = null;

      // Upload logo if provided
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${user.id}/logo.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('assets')
          .upload(fileName, logoFile, { upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage
            .from('assets')
            .getPublicUrl(fileName);
          logoUrl = data.publicUrl;
        }
      }

      // Update profile
      await supabase
        .from('profiles')
        .update({
          business_name: businessName || null,
          logo_url: logoUrl,
          onboarded_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSkip() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('profiles')
        .update({ onboarded_at: new Date().toISOString() })
        .eq('id', user.id);

      router.push("/dashboard");
    } catch (error) {
      console.error("Skip error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Kittie!</CardTitle>
          <p className="text-sm text-gray-600">
            Let's set up your brand (optional)
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                type="text"
                placeholder="Acme Inc."
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="logo">Logo (optional)</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                disabled={loading}
                className="flex-1"
              >
                Skip for now
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                {loading ? "Saving..." : "Continue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Phase 6: Email Verification Check for Publishing

**Create helper function in `lib/auth.ts`:**

```typescript
import { supabaseBrowser } from './supabase-browser';

export async function checkEmailVerified(): Promise<boolean> {
  const supabase = supabaseBrowser();
  const { data: { user } } = await supabase.auth.getUser();
  return !!user?.email_confirmed_at;
}

export async function sendVerificationEmail(): Promise<void> {
  const supabase = supabaseBrowser();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user && !user.email_confirmed_at) {
    await supabase.auth.resend({
      type: 'signup',
      email: user.email!,
    });
  }
}
```

**Update kit publishing logic in relevant components:**

Add email verification check before allowing publish action. Show a banner/modal prompting email verification if not confirmed.

## Phase 7: Stripe Integration

**Install Stripe:**

```bash
pnpm add stripe @stripe/stripe-js
```

**Create `lib/stripe-client.ts`:**

```typescript
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};
```

**Create checkout API route `app/api/stripe/checkout/route.ts`:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json();
    
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) { return cookieStore.get(name)?.value; },
        },
      }
    );
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      customer_email: session.user.email,
      metadata: { userId: session.user.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
}
```

**Update webhook handler `app/api/stripe/webhook/route.ts`:**

Handle `checkout.session.completed` and `customer.subscription.updated` events to update user profiles with subscription data.

## Phase 8: Environment Variables

**Update `.env.local` and `.env.example`:**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Remove these (no longer needed):
# DASHBOARD_PASSWORD
# NEXT_PUBLIC_ADMIN_EMAIL
```

## Phase 9: Update Dashboard to Check Onboarding

**Update `app/(app)/dashboard/page.tsx`:**

Remove `requireAuth()` call (middleware handles this now). The middleware will redirect to onboarding if needed.

## Phase 10: Testing Checklist

- [ ] Signup flow: New user → onboarding → dashboard
- [ ] Login flow: Existing user → dashboard (skip onboarding)
- [ ] Skip onboarding: Works and marks user as onboarded
- [ ] Email verification: Unverified users see banner, can't publish
- [ ] Protected routes: Redirect to login when not authenticated
- [ ] Stripe checkout: Payment flow works end-to-end
- [ ] Webhook: Subscription updates reflected in profile

## Phase 11: Deploy to Production

1. Push code to GitHub
2. Add environment variables to Vercel
3. Set up Stripe webhook endpoint in Stripe dashboard
4. Configure Supabase email templates
5. Test complete flow in production
6. Monitor for errors in Vercel logs

### To-dos

- [ ] Remove old password-based auth system and duplicate components
- [ ] Create profiles table and update media_kits table in Supabase
- [ ] Create middleware.ts for route protection and onboarding checks
- [ ] Update login page with improved UI and proper redirects
- [ ] Create minimal brand settings onboarding page with skip option
- [ ] Add email verification check for kit publishing
- [ ] Implement Stripe checkout and webhook handling
- [ ] Update environment variables and remove deprecated ones
- [ ] Update dashboard to work with new middleware
- [ ] Test complete auth flow, onboarding, and payment integration
- [ ] Deploy to production with proper configuration