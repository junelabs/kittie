import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NavbarProps {
  currentPage?: 'home' | 'pricing' | 'features' | 'how-it-works';
}

export function Navbar({ currentPage = 'home' }: NavbarProps) {
  return (
    <header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
                    <Link href="/" className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">K</span>
                      </div>
                      <span className="text-xl font-semibold text-gray-900">Kittie</span>
                    </Link>
          </div>
                  <nav className="hidden md:flex space-x-8">
                    <Link 
                      href="/features" 
                      className={`transition-colors ${
                        currentPage === 'features' 
                          ? 'text-gray-900 font-medium' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Features
                    </Link>
                    <Link 
                      href="/pricing" 
                      className={`transition-colors ${
                        currentPage === 'pricing' 
                          ? 'text-gray-900 font-medium' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Pricing
                    </Link>
                    <Link 
                      href="/how-it-works" 
                      className={`transition-colors ${
                        currentPage === 'how-it-works' 
                          ? 'text-gray-900 font-medium' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      How it works
                    </Link>
                  </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-600 border-0" asChild>
              <Link href="/waitlist">Join Waitlist</Link>
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md" asChild>
              <Link href="/waitlist">Join Waitlist</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
