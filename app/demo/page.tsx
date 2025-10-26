import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="home" />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-orange-100 text-orange-800 border-orange-200">
            Demo Press Kit
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Kittie Demo
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            This is how your brand kit will look when you create it with Kittie. 
            Everything stays organized, professional, and always up to date.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md" asChild>
              <Link href="/waitlist">Join Waitlist</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-gray-900 border-gray-300 hover:bg-gray-50" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Assets Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Brand Assets</h2>
            <p className="text-lg text-gray-600">Download our logos, images, and brand materials</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Logo Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">K</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Logo</h3>
                  <p className="text-sm text-gray-600 mb-4">Primary logo in various formats</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Brand Colors */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="flex justify-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-orange-500 rounded"></div>
                    <div className="w-8 h-8 bg-amber-500 rounded"></div>
                    <div className="w-8 h-8 bg-gray-900 rounded"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Brand Colors</h3>
                  <p className="text-sm text-gray-600 mb-4">Primary and secondary color palette</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Typography */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">Typography</div>
                  <div className="text-sm text-gray-600 mb-4">Font families and styles</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Font Stack</h3>
                  <p className="text-sm text-gray-600 mb-4">Inter, system fonts</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-lg text-gray-600">Meet the people behind Kittie</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">D</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">David Brantley</h3>
              <p className="text-gray-600">Founder & CEO</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">A</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Alex Chen</h3>
              <p className="text-gray-600">Head of Design</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Sarah Johnson</h3>
              <p className="text-gray-600">Lead Developer</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to create your own?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start building your brand kit today and keep everything organized in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md" asChild>
              <Link href="/waitlist">Join Waitlist</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-gray-900 border-gray-300 hover:bg-gray-50" asChild>
              <Link href="/features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
