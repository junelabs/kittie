"use client";

import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";

export default function WaitlistSuccessPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="home" />

      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-500 rounded-lg shadow-xl overflow-hidden">
            <div className="p-10">
              <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-2xl">🎉</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">You&apos;re on the list!</h1>
              <p className="text-lg text-gray-700 mb-8">
                Thanks for joining the Kittie waitlist. We&apos;ll email you with early access and launch updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/" className="px-5 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium" aria-label="Back to home">Back to home</Link>
                <Link href="/features" className="px-5 py-3 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium" aria-label="Explore features">Explore features</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

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
  );
}


