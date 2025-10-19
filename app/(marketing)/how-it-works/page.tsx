import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Upload, Share2, Download, Users, Shield, Zap, ArrowRight, Star, Globe, Palette, BarChart3, Clock, Smartphone, Monitor, FileText, Image, FolderOpen } from "lucide-react"
import { Navbar } from "../../../components/layout/Navbar"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="how-it-works" />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            How Kittie works
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get your brand assets organized and shareable in minutes. 
            Here&apos;s exactly how to get started with Kittie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4" asChild>
              <a href="/waitlist">Join the waitlist</a>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-amber-300 hover:bg-[#fcfcf0] text-amber-700">
              See pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Step by Step Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple 3-Step Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From upload to share in just a few clicks
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Your Assets</h3>
              <p className="text-gray-600 mb-6">
                Drag and drop your logos, images, documents, and brand files. 
                Kittie supports all major file formats and automatically optimizes them.
              </p>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    <span>Logo files (PNG, SVG, EPS)</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Image className="w-4 h-4 mr-2" />
                    <span>Brand images (JPG, PNG)</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    <span>Documents (PDF, DOC)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Palette className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Organize & Customize</h3>
              <p className="text-gray-600 mb-6">
                Arrange your assets into organized media kits. Add descriptions, 
                set permissions, and customize the look to match your brand.
              </p>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    <span>Drag to reorder</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    <span>Add descriptions</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    <span>Custom branding</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Share2 className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Share & Collaborate</h3>
              <p className="text-gray-600 mb-6">
                Share your media kit with a single link. Everyone gets the latest version 
                automatically, and you can track who&apos;s using what.
              </p>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="w-4 h-4 mr-2" />
                    <span>One-click sharing</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    <span>Usage analytics</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Team collaboration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Workflow */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Detailed Workflow</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See exactly how teams use Kittie to manage their brand assets
            </p>
          </div>
          
          <div className="space-y-16">
            {/* Upload Process */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mr-4">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">1. Upload & Organize</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Start by uploading your brand assets. Drag and drop files directly into Kittie, 
                  or use our bulk upload feature for multiple files at once.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Support for all major file formats</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Automatic file optimization and compression</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Smart file organization and categorization</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Drop files here or click to upload</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded p-3 flex items-center">
                      <FileText className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm">logo.svg</span>
                    </div>
                    <div className="bg-white rounded p-3 flex items-center">
                      <Image className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">hero.jpg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customize Process */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-gray-50 rounded-2xl p-8">
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Brand Guidelines</span>
                        <span className="text-xs text-gray-500">PDF</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded mb-2"></div>
                      <div className="text-xs text-gray-500">2.4 MB</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Logo Pack</span>
                        <span className="text-xs text-gray-500">ZIP</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded mb-2"></div>
                      <div className="text-xs text-gray-500">1.8 MB</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mr-4">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">2. Customize & Brand</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Customize your media kit to match your brand. Add your logo, choose colors, 
                  and organize assets into logical groups.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Custom branding and color schemes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Drag-and-drop organization</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Custom descriptions and metadata</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Share Process */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mr-4">
                    <Share2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">3. Share & Track</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Share your media kit with a single link. Set permissions, track usage, 
                  and ensure everyone always has the latest version.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">One-click sharing with custom links</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Password protection and access controls</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Real-time analytics and download tracking</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Share Link</span>
                      <Button size="sm" className="text-xs">Copy</Button>
                    </div>
                    <div className="bg-gray-100 rounded p-2 text-sm font-mono">
                      kittie.so/your-brand
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded p-3 text-center">
                      <div className="text-2xl font-bold text-orange-500">127</div>
                      <div className="text-xs text-gray-500">Downloads</div>
                    </div>
                    <div className="bg-white rounded p-3 text-center">
                      <div className="text-2xl font-bold text-orange-500">89</div>
                      <div className="text-xs text-gray-500">Views</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Perfect For</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you&apos;re a startup or enterprise, Kittie adapts to your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Marketing Teams</h3>
                <p className="text-gray-600 mb-4">
                  Keep your brand assets organized and easily accessible for campaigns, 
                  presentations, and client work.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Campaign asset management</li>
                  <li>• Client brand guidelines</li>
                  <li>• Team collaboration</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Agencies</h3>
                <p className="text-gray-600 mb-4">
                  Manage multiple client brands in one place. Keep everything organized 
                  and shareable with clients and team members.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Multi-client management</li>
                  <li>• White-label solutions</li>
                  <li>• Client access controls</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Startups</h3>
                <p className="text-gray-600 mb-4">
                  Get your brand assets organized from day one. Professional presentation 
                  without the complexity or cost.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Quick setup</li>
                  <li>• Professional presentation</li>
                  <li>• Investor-ready materials</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Enterprise</h3>
                <p className="text-gray-600 mb-4">
                  Scale your brand management across departments and locations with 
                  enterprise-grade security and controls.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Enterprise security</li>
                  <li>• Advanced analytics</li>
                  <li>• Custom integrations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-6">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Designers</h3>
                <p className="text-gray-600 mb-4">
                  Showcase your work professionally. Share portfolios, brand guidelines, 
                  and design assets with clients and collaborators.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Portfolio presentation</li>
                  <li>• Client collaboration</li>
                  <li>• Version control</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Compliance Teams</h3>
                <p className="text-gray-600 mb-4">
                  Ensure brand consistency across all touchpoints. Track usage, 
                  maintain compliance, and control access to sensitive materials.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Brand compliance</li>
                  <li>• Usage tracking</li>
                  <li>• Access controls</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of teams who trust Kittie to keep their brand assets organized and accessible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4" asChild>
              <a href="/waitlist">Join the waitlist</a>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-amber-300 hover:bg-[#fcfcf0] text-amber-700">
              View pricing
            </Button>
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
              <p className="text-gray-400">
                The easiest way to keep your brand assets in sync.
              </p>
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
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Kittie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
