'use client';

import { useState, useTransition, useEffect } from 'react';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = { email: String(form.get('email')), password: String(form.get('password')) };
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }

    // Use a simple route handler for sign-up to keep keys server-side
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      const msg = await res.text();
      setError(msg || 'Sign up failed');
      return;
    }

    startTransition(() => router.replace('/dashboard'));
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Hero-style gradient background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 42%, rgba(255,255,255,0.85) 52%, rgba(255,255,255,0) 62%),
          linear-gradient(to right, #FFF9E6 0%, #FFE6CC 50%, #F2E6FF 100%)
        `,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%, 100% 100%',
        backgroundPosition: 'top left, bottom left'
      }}></div>
      
      {/* White fade overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white to-transparent"></div>

      {/* Main Content */}
      <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl mb-4 shadow-lg">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">
            Create your account
          </h1>
          <p className="text-gray-600 text-sm">
            Your brand kits, organized beautifully.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Input 
                  id="email"
                  name="email" 
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="h-12 px-4 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input 
                  id="password"
                  name="password" 
                  type="password" 
                  placeholder="Create a password"
                  required 
                  className="h-12 px-4 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                />
                <p className="text-xs text-gray-500">Minimum 6 characters</p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg animate-in fade-in duration-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={pending} 
              className="w-full h-12 bg-black hover:bg-black/90 text-white font-medium text-base transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {pending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Create account</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-gray-700 hover:text-gray-900 underline">Terms</Link>
              {' '}and{' '}
              <a href="#" className="text-gray-700 hover:text-gray-900 underline">Privacy Policy</Link>.
            </p>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-6 animate-in fade-in duration-700 delay-500">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="font-medium text-gray-900 hover:text-black transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}