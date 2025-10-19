import { Navbar } from "../../../components/layout/Navbar"
import Script from "next/script"

export default function WaitlistPage() {
  return (
    <>
      <Script 
        src="https://tally.so/widgets/embed.js" 
        strategy="afterInteractive"
      />
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

      {/* Tally Form Embed */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-500 rounded-lg shadow-xl overflow-hidden relative">
            <div className="p-6 bg-gradient-to-r from-orange-50 to-white border-b border-orange-200">
              <h2 className="text-lg font-semibold text-gray-900">Sign up for early access</h2>
              <p className="text-sm text-gray-600 mt-1">No spam, just updates on our launch progress.</p>
            </div>
            <div className="relative" style={{ height: '600px' }}>
              <iframe 
                data-tally-src="https://tally.so/r/wAVOz0?transparentBackground=1" 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                marginHeight={0} 
                marginWidth={0} 
                title="Kittie Waitlist"
                className="absolute inset-0"
              />
            </div>
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
    </>
  )
}
