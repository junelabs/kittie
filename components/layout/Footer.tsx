'use client';

import Link from 'next/link';
import { useEffect } from 'react';

// Declare global type for KittieEmbed
declare global {
  interface Window {
    KittieEmbed?: {
      open: (kitId: string) => void;
    };
  }
}

export function Footer() {
  useEffect(() => {
    // Load the Kittie embed script
    const script = document.createElement('script');
    script.src = '/embed.js'; // Use local embed script
    script.setAttribute('data-kit', 'demo-kit');
    script.setAttribute('data-mode', 'modal');
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="/embed.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const handleBrandKitClick = () => {
    if (window.KittieEmbed) {
      window.KittieEmbed.open('demo-kit');
    } else {
      // Fallback: open a demo page or show a message
      console.log('KittieEmbed not loaded yet, please try again in a moment');
      // You could also redirect to a demo page or show a modal
    }
  };

  return (
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
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              <li>
                <button 
                  onClick={handleBrandKitClick}
                  className="hover:text-white transition-colors text-left"
                >
                  Brand Kit
                </button>
              </li>
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
          <p>&copy; 2024 Kittie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
