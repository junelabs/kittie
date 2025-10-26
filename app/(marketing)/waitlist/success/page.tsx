"use client";

import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

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
                Thanks for signing up for Kittie! You now have access to all features.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/" className="px-5 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium" aria-label="Back to home">Back to home</Link>
                <Link href="/features" className="px-5 py-3 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium" aria-label="Explore features">Explore features</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


