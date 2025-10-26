import Link from "next/link";
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, X } from "lucide-react";
import { Navbar } from "../../../components/layout/Navbar";

export default function PricingPage() {
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Pricing tiers configuration - easily toggle active tiers
  const pricingTiers = {
    free: {
      name: "Free",
      price: 0,
      description: "Try Kittie",
      tagline: "Perfect for: Testing before committing",
      positioning: undefined,
      features: [
        "1 media kit",
        "2 GB storage",
        "Hosted on kittie.so",
        "Kittie branding"
      ],
      cta: "Start for free",
      ctaVariant: "outline" as const,
      popular: false,
      special: false,
      badge: undefined,
      originalPrice: undefined,
      expiresDate: undefined
    },
    starter: {
      name: "Starter",
      price: 19,
      description: "For founders & small teams",
      tagline: "Perfect for: Startups, solo founders, small companies",
      positioning: "Everything you need for professional brand assets",
      features: [
        "3 media kits",
        "25 GB storage",
        "Remove Kittie branding",
        "3 team members",
        "Email support (48hr)",
        "Custom domains (coming soon)",
        "Collect email submissions (coming soon)"
      ],
      cta: "Get Started",
      ctaVariant: "default" as const,
      popular: true,
      special: false,
      badge: undefined,
      originalPrice: undefined,
      expiresDate: undefined
    },
    // FUTURE TIERS - Uncomment when ready to launch
    /*
    team: {
      name: "Team",
      price: 79,
      description: "For marketing teams",
      tagline: "Perfect for: Growing companies (50-200 employees)",
      positioning: "Built for teams managing multiple products",
      features: [
        "10 media kits",
        "100 GB storage",
        "Unlimited team members",
        "Advanced analytics",
        "API access",
        "Priority support (24hr)"
      ],
      cta: "Get Started",
      ctaVariant: "default" as const,
      popular: false,
      special: false
    },
    agency: {
      name: "Agency",
      price: 199,
      description: "For agencies & enterprises",
      tagline: "Perfect for: Agencies, multi-brand enterprises",
      positioning: "Manage all your clients in one place",
      features: [
        "Unlimited media kits",
        "500 GB storage",
        "Client management features",
        "White-label",
        "Role-based permissions",
        "SSO/SAML",
        "Dedicated support"
      ],
      cta: "Contact sales",
      ctaVariant: "outline" as const,
      popular: false,
      special: false
    }
    */
  };

  // Active tiers for launch - change this array to show different tiers
  const activeTiers = ['free', 'starter'];
  // Change to ['free', 'starter', 'team', 'agency'] when ready to show all

  const comparisonFeatures = [
    {
      category: "Core Limits",
      features: [
        { name: "Media kits", free: "1", starter: "3" },
        { name: "Storage", free: "2 GB", starter: "25 GB" },
        { name: "Team members", free: "1", starter: "3" }
      ]
    },
    {
      category: "Hosting & Branding",
      features: [
        { name: "Hosted on kittie.so", free: true, starter: true },
        { name: "Remove Kittie branding", free: false, starter: true }
      ]
    },
    {
      category: "Support",
      features: [
        { name: "Email support (48hr)", free: false, starter: true }
      ]
    }
    // FUTURE FEATURES - Uncomment when Team/Agency tiers are active
    /*
    {
      category: "Advanced Features",
      features: [
        { name: "Advanced analytics", free: false, starter: false, team: true, agency: true },
        { name: "API access", free: false, starter: false, team: true, agency: true },
        { name: "Priority support (24hr)", free: false, starter: false, team: true, agency: false },
        { name: "Client management", free: false, starter: false, team: false, agency: true },
        { name: "White-label", free: false, starter: false, team: false, agency: true },
        { name: "Role-based permissions", free: false, starter: false, team: false, agency: true },
        { name: "SSO/SAML", free: false, starter: false, team: false, agency: true },
        { name: "Dedicated support", free: false, starter: false, team: false, agency: true }
      ]
    }
    */
  ];

  const faqs = [
    {
      question: "What counts as a media kit?",
      answer: "A media kit is a published collection of brand assets with its own unique link. Most companies need 1-3 kits, while agencies managing multiple clients need more."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at the end of your billing cycle."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! All paid plans include a 14-day free trial. No credit card required to start."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes. You can cancel your subscription at any time. You'll keep access to your plan features until the end of your billing period."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="pricing" />

      {/* Hero Section */}
      <section className="bg-white py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Stop sending your assets through zip files.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
            Give media, partners, and customers instant access to your logos, brand guidelines, 
            and press materials—always up-to-date, always on-brand.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeTiers.map((tierKey) => {
              const plan = pricingTiers[tierKey as keyof typeof pricingTiers];
              return (
                <Card 
                  key={plan.name}
                  className={`relative p-8 ${
                    plan.special 
                      ? 'scale-105 shadow-xl border-2 border-orange-500 bg-gradient-to-br from-orange-50 to-white' 
                      : plan.popular
                      ? 'shadow-lg border border-gray-200'
                      : 'border border-gray-200'
                  }`}
                >
                  {plan.special && plan.badge && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-orange-500 text-white">
                      {plan.badge}
                    </Badge>
                  )}
                  <CardContent className="p-0">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-gray-600 mb-4">{plan.description}</p>
                      <div className="flex items-baseline justify-center">
                        <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-lg text-gray-600 ml-1">/month</span>
                      </div>
                      {plan.positioning && (
                        <p className="text-sm text-gray-500 mt-2 italic">{plan.positioning}</p>
                      )}
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {plan.tagline && (
                      <p className="text-xs text-gray-500 mb-6 text-center">{plan.tagline}</p>
                    )}
                    
                    <Button 
                      className={`w-full py-3 rounded-lg font-medium transition-colors ${
                        plan.ctaVariant === 'default' 
                          ? 'bg-gray-900 hover:bg-gray-800 text-white' 
                          : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
                      }`}
                      asChild
                    >
                      <a href={plan.price === 0 ? "/waitlist" : "/waitlist"}>{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Waitlist Note */}
          <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-gray-600 text-center">
              <strong>Join the Waitlist:</strong> We&apos;re currently in beta. Get started free to be first in line when we open for general availability. You&apos;ll receive an email invitation with early access to all features. No commitment required.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table Toggle */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Button
            onClick={() => setIsComparisonOpen(!isComparisonOpen)}
            variant="outline"
            className="px-8 py-3 text-gray-900 border-gray-300 hover:bg-gray-50"
          >
            {isComparisonOpen ? 'Hide' : 'Compare all features'}
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isComparisonOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </section>

      {/* Comparison Table */}
      {isComparisonOpen && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-900 min-w-[200px]">Features</th>
                    <th className="text-center p-4 font-semibold text-gray-900 min-w-[120px]">Free</th>
                    <th className="text-center p-4 font-semibold text-gray-900 min-w-[120px]">Starter</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((category, categoryIndex) => (
                    <React.Fragment key={categoryIndex}>
                      <tr className="bg-gray-100">
                        <td colSpan={3} className="p-4 font-semibold text-gray-900">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature, featureIndex) => (
                        <tr key={featureIndex} className={featureIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-4 text-gray-700">{feature.name}</td>
                          <td className="p-4 text-center">
                            {typeof feature.free === 'boolean' ? (
                              feature.free ? (
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-gray-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-gray-700">{feature.free}</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {typeof feature.starter === 'boolean' ? (
                              feature.starter ? (
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-gray-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-gray-700">{feature.starter}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  aria-expanded={openFaq === index}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get started free for early access to Kittie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md" asChild>
              <Link href="/signup">Get started free</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-gray-900 border-gray-300 hover:bg-gray-50" asChild>
              <Link href="/help">Get help</Link>
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
              <p className="text-gray-400">Your media kit, always up to date.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Social</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">X</Link>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</Link>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Kittie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
