'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Share2, Download, Check } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"

// Landing page component - Root page for Kittie (Vercel Test)
export default function LandingPage() {
    return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="home" />


      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient - two layered gradients: white fade mask over horizontal color wash */}
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

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-8 pb-20">
          <div className="text-center">
            {/* Trust line */}
            <div className="mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <p className="text-sm text-gray-600 font-medium">
                Trusted by creative teams, agencies, and modern brands.
              </p>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Your brand kit,<br />
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                always up to date.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              Kittie helps teams organize, share, and embed brand assets beautifully — from logos to press photos — all in one simple, shareable link.
            </p>

            {/* Email form */}
            <div className="max-w-md mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get('email');
                if (email) {
                  window.location.href = `/signup?email=${encodeURIComponent(email.toString())}`;
                }
              }} className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-gray-100">
                <input 
                  name="email"
                  type="email" 
                  placeholder="Enter your work email" 
                  required
                  className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 bg-transparent border-0 focus:outline-none focus:ring-0"
                />
                <button type="submit" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
                  Get started free
                </button>
              </form>
            </div>

            {/* Mockup section */}
            <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              {/* Main mockup card */}
              <div className="relative max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">K</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Acme Corp Brand Kit</h3>
                          <p className="text-sm text-gray-500">Updated 2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Logo</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Photos</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Guidelines</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Assets</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating use case cards */}
                <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-gray-100 p-4 animate-float">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-sm">📤</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Share press assets</span>
                  </div>
                </div>

                <div className="absolute -top-2 -right-4 bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-gray-100 p-4 animate-float delay-1000">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-sm">🔗</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Send logos to partners</span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-8 bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-gray-100 p-4 animate-float delay-2000">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 text-sm">🎨</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Embed your brand kit</span>
                  </div>
                </div>

                <div className="absolute -bottom-2 -right-8 bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-gray-100 p-4 animate-float delay-3000">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 text-sm">✨</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Keep everything consistent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1️⃣ Upload your assets</h3>
              <p className="text-gray-600">Logos, press images, PDFs, bios, anything.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2️⃣ Organize by kit</h3>
              <p className="text-gray-600">Create separate kits for brands, products, or campaigns.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3️⃣ Share or embed</h3>
              <p className="text-gray-600">Drop one iframe anywhere; it always stays in sync.</p>
            </div>
          </div>
          <div className="mt-12">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md" asChild>
              <Link href="/signup">→ Get started free</Link>
            </Button>
          </div>
        </div>
      </section>


      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h2>
          <p className="text-xl text-gray-600 mb-8">Simple and transparent</p>
          
          {/* Launch Special Callout */}
          <div className="flex justify-center mb-8">
            <span className="inline-block bg-orange-100 text-gray-900 border border-gray-200 px-4 md:px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm">
              🎁 Launch Special: Get 1 year for $79 (save $149)
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 border border-gray-200">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">$0<span className="text-lg text-gray-600">/mo</span></div>
                <p className="text-gray-600 mb-6">Perfect for getting started</p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">1 active kit</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">2 GB storage</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">Community support</span>
                  </li>
                </ul>
                <Button className="w-full bg-white hover:bg-green-500 text-gray-900 border border-gray-200" asChild>
                  <Link href="/signup">Get started free</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="p-8 border border-gray-200 shadow-lg">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">$19<span className="text-lg text-gray-600">/mo</span></div>
                <p className="text-gray-600 mb-6">For growing teams</p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">3 active kits</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">25 GB storage</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">Custom domain</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">Email support</span>
                  </li>
                </ul>
                <form action="/api/stripe/checkout" method="POST">
                  <input type="hidden" name="plan" value="starter" />
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Join Starter
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card className="p-8 scale-105 shadow-xl border-2 border-[#8B65B2] bg-white relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-400 to-orange-600 text-white">
                Early Bird Offer
              </Badge>
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter Annual</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">$79<span className="text-lg text-gray-600">/year</span></div>
                <p className="text-gray-600 mb-4">Pre-Sale: Starter Annual</p>
                <div className="mb-6">
                  <span className="text-sm text-gray-600 line-through">$228/year</span>
                  <span className="text-sm text-green-500 ml-2 font-medium">Save $149</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">Everything in Starter</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">Valid for 12 months</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">Limited time offer</span>
                  </li>
                </ul>
                <form action="/api/stripe/checkout" method="POST">
                  <input type="hidden" name="plan" value="pro" />
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Get Early Bird Offer
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </section>


      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            One link. One embed. Always on brand.
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Stop updating media kits manually — Kittie keeps them current everywhere.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md" asChild>
            <Link href="/signup">Get started free</Link>
          </Button>
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
              <p className="text-gray-600">The easiest way to keep your brand assets in sync.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Social</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">X (Twitter)</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
            <p>&copy; 2025 Kittie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}