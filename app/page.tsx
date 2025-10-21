import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Upload, Share2, Download, Users, Shield, Zap, ArrowRight, Star, Check } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"

// Landing page component - Root page for Kittie (Vercel Test)
export default function LandingPage() {
    return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="home" />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            The easiest way to keep your brand assets in sync
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Manage your logos, photos, and documents from one place.
            <br />
            Update them once — and your media kit updates everywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4" asChild>
              <a href="/waitlist">Join the waitlist</a>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-amber-300 hover:bg-[#fcfcf0] text-amber-700" asChild>
              <a href="/how-it-works">→ See how it works</a>
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Join our waitlist to be notified when we launch. <a href="/pricing" className="text-orange-600 hover:text-orange-700">See our pricing →</a>
          </p>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Before Kittie</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-gray-600">Every time your logo changes, every partner, journalist, and landing page is out of date.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-gray-600">You chase Dropbox links, out-of-date PDFs, and random Google Drive folders.</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">With Kittie</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-gray-600">Kittie gives you one simple dashboard for your brand assets — and one embed code that&apos;s always current.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-gray-600">Update a file once. It updates everywhere instantly.</p>
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
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white" asChild>
              <a href="/waitlist">→ Join the waitlist</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Features</h2>
            <p className="text-xl text-gray-600">Everything you need to manage your brand assets</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🧱</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Embeddable Kits</h3>
                <p className="text-gray-600">Add your media kit to any site with one line of code.</p>
              </CardContent>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Updates</h3>
                <p className="text-gray-600">Edit assets in your dashboard and every embed auto-refreshes.</p>
              </CardContent>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaboration Ready</h3>
                <p className="text-gray-600">Invite teammates to upload and organize assets together.</p>
              </CardContent>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Branded</h3>
                <p className="text-gray-600">Your assets are served from a private CDN with custom branding.</p>
              </CardContent>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Downloads Simplified</h3>
                <p className="text-gray-600">Auto-generate ZIPs for press or partners — always current.</p>
              </CardContent>
            </Card>
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
            <span className="inline-block bg-orange-100 text-orange-800 border border-orange-200 px-4 md:px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm">
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
                <Button className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300" asChild>
                  <a href="/waitlist">Join waitlist</a>
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
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white" asChild>
                  <a href="/waitlist">Join waitlist</a>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="p-8 scale-105 shadow-xl border-2 border-orange-500 bg-gradient-to-br from-orange-50 to-white relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-orange-500 text-white">
                Limited Time
              </Badge>
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter Annual</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">$79<span className="text-lg text-gray-600">/year</span></div>
                <p className="text-gray-600 mb-4">Everything in Starter plan</p>
                <div className="mb-6">
                  <span className="text-sm text-gray-500 line-through">$228/year</span>
                  <span className="text-sm text-green-600 ml-2 font-medium">Save $149</span>
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
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" asChild>
                  <a href="/waitlist">Join waitlist</a>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <p className="text-gray-500 mt-8">
            Join the waitlist — no commitment required
          </p>
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
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4" asChild>
            <a href="/waitlist">Join the waitlist</a>
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