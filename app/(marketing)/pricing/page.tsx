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
      description: "Perfect for getting started",
      features: [
        "1 active kit",
        "2 GB storage",
        "10 GB bandwidth/mo",
        "1 team member",
        "Hosted on kittie.so",
        "Basic analytics",
        "Community support"
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
      description: "For growing teams",
      features: [
        "3 active kits",
        "25 GB storage",
        "100 GB bandwidth/mo",
        "3 team members",
        "Custom domain embedding",
        "Remove branding",
        "WordPress & Webflow plugins",
        "Standard analytics",
        "Email support (48hr)"
      ],
      cta: "Join the waitlist",
      ctaVariant: "default" as const,
      popular: true,
      special: false,
      badge: undefined,
      originalPrice: undefined,
      expiresDate: undefined
    },
    limitedOffer: {
      name: "Starter Annual",
      price: 79,
      originalPrice: 228,
      description: "Pre-Sale: Starter Annual",
      features: [
        "Everything in Starter, plus:",
        "Valid for 12 months",
        "Save $149 (normally $228/year)",
        "3 active kits",
        "25 GB storage",
        "100 GB bandwidth/mo",
        "3 team members",
        "All Starter features included"
      ],
      cta: "Get Early Bird Offer",
      ctaVariant: "special" as const,
      popular: false,
      special: true,
      badge: "Early Bird Offer",
      expiresDate: "December 31, 2024"
    },
    // FUTURE TIERS - Uncomment when ready to launch
    /*
    pro: {
      name: "Pro",
      price: 79,
      description: "For professional teams",
      features: [
        "10 active kits",
        "100 GB storage",
        "500 GB bandwidth/mo",
        "Unlimited team members",
        "Everything in Starter, plus:",
        "Advanced analytics (geo, referrers, time-based)",
        "API access (read-only)",
        "Version history",
        "Custom CSS",
        "Priority support (24hr)"
      ],
      cta: "Join the waitlist",
      ctaVariant: "default" as const,
      popular: false,
      special: false
    },
    business: {
      name: "Business",
      price: 199,
      description: "For agencies and enterprises",
      features: [
        "Unlimited active kits",
        "500 GB storage",
        "2 TB bandwidth/mo",
        "Unlimited team members",
        "Everything in Pro, plus:",
        "White-label",
        "Full API access (read/write)",
        "Webhooks & Zapier",
        "SSO/SAML",
        "Role-based permissions",
        "Client management",
        "Audit logs",
        "Dedicated support (4hr)"
      ],
      cta: "Contact sales",
      ctaVariant: "outline" as const,
      popular: false,
      special: false
    }
    */
  };

  // Active tiers for launch - change this array to show different tiers
  const activeTiers = ['free', 'starter', 'limitedOffer'];
  // Change to ['free', 'starter', 'pro', 'business'] when ready to show all

  const comparisonFeatures = [
    {
      category: "Core Limits",
      features: [
        { name: "Active kits", free: "1", starter: "3", limitedOffer: "3" },
        { name: "Storage", free: "2 GB", starter: "25 GB", limitedOffer: "25 GB" },
        { name: "Bandwidth/month", free: "10 GB", starter: "100 GB", limitedOffer: "100 GB" },
        { name: "Team members", free: "1", starter: "3", limitedOffer: "3" }
      ]
    },
    {
      category: "Hosting & Branding",
      features: [
        { name: "Custom domain", free: false, starter: true, limitedOffer: true },
        { name: "Remove branding", free: false, starter: true, limitedOffer: true }
      ]
    },
    {
      category: "Assets & Features",
      features: [
        { name: "WordPress plugin", free: false, starter: true, limitedOffer: true },
        { name: "Webflow plugin", free: false, starter: true, limitedOffer: true }
      ]
    },
    {
      category: "Analytics & Insights",
      features: [
        { name: "Basic analytics", free: true, starter: false, limitedOffer: false },
        { name: "Standard analytics", free: false, starter: true, limitedOffer: true }
      ]
    },
    {
      category: "Support",
      features: [
        { name: "Community support", free: true, starter: false, limitedOffer: false },
        { name: "Email support (48hr)", free: false, starter: true, limitedOffer: true }
      ]
    }
    // FUTURE FEATURES - Uncomment when Pro/Business tiers are active
    /*
    {
      category: "Advanced Features",
      features: [
        { name: "Version history", free: false, starter: false, pro: true, business: true },
        { name: "Custom CSS", free: false, starter: false, pro: true, business: true },
        { name: "API access (read-only)", free: false, starter: false, pro: true, business: true },
        { name: "Full API access", free: false, starter: false, pro: false, business: true },
        { name: "Webhooks", free: false, starter: false, pro: false, business: true },
        { name: "White-label", free: false, starter: false, pro: false, business: true },
        { name: "SSO/SAML", free: false, starter: false, pro: false, business: true }
      ]
    }
    */
  ];

  const faqs = [
    {
      question: "What counts as an active media kit?",
      answer: "An active media kit is a published collection of brand assets with its own embed code. Most companies need 1-3 kits, while agencies managing multiple clients need more."
    },
    {
      question: "What happens after my limited offer year expires?",
      answer: "After 12 months, you can renew at the standard Starter rate ($29/month) or upgrade to a higher tier when available."
    },
    {
      question: "Can I upgrade from the limited offer?",
      answer: "Yes! If we launch higher tiers during your offer period, you can upgrade and we&apos;ll prorate your remaining time."
    },
    {
      question: "Is there a free trial?",
      answer: "All paid plans include a 14-day free trial. No credit card required to start."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes. You can cancel your subscription at any time. For the limited offer, you&apos;ll keep access until the end of your 12-month period."
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
          <div className="flex justify-center mb-4">
            <span className="inline-block bg-orange-100 text-orange-800 border border-orange-200 px-4 md:px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm">
              🎁 Launch Special: Get 1 year for $79 (save $149)
            </span>
          </div>
          <div className="max-w-3xl mx-auto mt-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>🎉 Pre-Launch Special:</strong> We&apos;re launching soon! Join our waitlist now to secure early access and exclusive pricing when we go live.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        {plan.special ? (
                          <span className="text-lg text-gray-600 ml-1">/year</span>
                        ) : (
                          <span className="text-lg text-gray-600 ml-1">/month</span>
                        )}
                      </div>
                      {plan.special && plan.originalPrice && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-500 line-through">${plan.originalPrice}/year</span>
                          <span className="text-sm text-green-600 ml-2 font-medium">Save $149</span>
                        </div>
                      )}
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full py-3 rounded-lg font-medium transition-colors ${
                        plan.ctaVariant === 'default' 
                          ? 'bg-gray-900 hover:bg-gray-800 text-white' 
                          : plan.ctaVariant === 'special'
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
                      }`}
                      asChild
                    >
                      {plan.ctaVariant === 'special' ? (
                        <a href="https://buy.stripe.com/6oU9AS0zi7qe0c8gE25AQ05" target="_blank" rel="noopener noreferrer">{plan.cta}</a>
                      ) : (
                        <a href="/waitlist">Join waitlist</a>
                      )}
                    </Button>
                    
                    {plan.special && plan.expiresDate && (
                      <p className="text-center text-sm text-gray-500 mt-3">
                        Offer expires {plan.expiresDate}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Waitlist Note */}
          <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-gray-600 text-center">
              <strong>About the Waitlist:</strong> We&apos;re in pre-launch mode. Join the waitlist to be first in line when we open for signups. You&apos;ll receive an email invitation with early access to all features and special launch pricing. No commitment required.
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
                    <th className="text-center p-4 font-semibold text-gray-900 min-w-[120px]">Limited Offer</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((category, categoryIndex) => (
                    <React.Fragment key={categoryIndex}>
                      <tr className="bg-gray-100">
                        <td colSpan={4} className="p-4 font-semibold text-gray-900">
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
                          <td className="p-4 text-center">
                            {typeof feature.limitedOffer === 'boolean' ? (
                              feature.limitedOffer ? (
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-gray-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-gray-700">{feature.limitedOffer}</span>
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
            Join thousands of teams already using Kittie to manage their brand assets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4">
              Join the waitlist
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-gray-900 border-gray-300 hover:bg-gray-50">
              Contact sales
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
                <a href="#" className="text-gray-400 hover:text-white transition-colors">X</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
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
