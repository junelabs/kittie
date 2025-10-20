"use client";

import { Navbar } from "../../../components/layout/Navbar"
import { useState } from "react";

export default function WaitlistPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Submission failed');
      }
      // Redirect to success page
      window.location.href = '/waitlist/success';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="home" />
      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Join the Kittie Waitlist
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Be the first to know when we launch. Get the early offer pricing.
          </p>
        </div>
      </section>

      {/* Native Form */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-[#fef7ed] to-white border-2 border-orange-200 rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-[#fef7ed] to-white border-b border-orange-100">
              <h2 className="text-lg font-semibold text-gray-900">Sign up for early access</h2>
              <p className="text-sm text-gray-600 mt-1">No spam, just updates on our launch progress.</p>
            </div>
            <form onSubmit={onSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company (optional)</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Company name"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-700">{success}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg font-medium transition-colors bg-orange-500 hover:bg-orange-600 text-white"
              >
                {submitting ? 'Joining...' : 'Join waitlist'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <span className="text-xl font-semibold">Kittie</span>
              </div>
              <p className="text-gray-400">The easiest way to keep your brand assets in sync.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/how-it-works" className="hover:text-white transition-colors">How it works</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Social</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">X (Twitter)</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Kittie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
