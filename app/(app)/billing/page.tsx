import { supabaseServer } from "../../../lib/supabase-server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Zap, Crown } from "lucide-react";

export default async function BillingPage() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Calculate stats for sidebar
  const totalKits = 0; // We could fetch this if needed
  const publicKits = 0;

  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for individuals and small projects",
      features: [
        "Up to 3 media kits",
        "Unlimited assets per kit",
        "Public embed pages",
        "Basic support"
      ],
      current: true,
      buttonText: "Current Plan",
      buttonVariant: "outline" as const
    },
    {
      name: "Growth",
      price: "$19",
      period: "/month",
      description: "For growing businesses and teams",
      features: [
        "Unlimited media kits",
        "Unlimited assets",
        "Custom branding",
        "Analytics dashboard",
        "Priority support",
        "API access"
      ],
      current: false,
      buttonText: "Upgrade to Growth",
      buttonVariant: "default" as const
    },
    {
      name: "Pro",
      price: "$49",
      period: "/month",
      description: "For agencies and large teams",
      features: [
        "Everything in Growth",
        "Team collaboration",
        "White-label embeds",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated support"
      ],
      current: false,
      buttonText: "Upgrade to Pro",
      buttonVariant: "outline" as const
    }
  ];

  return (
    <DashboardLayout totalKits={totalKits} publicKits={publicKits}>
      <div className="h-full bg-white">
        <div className="px-8 py-10">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Billing & Plans</h1>
            <p className="text-amber-600 text-lg">
              Manage your subscription and billing information
            </p>
          </div>

          {/* Current Plan Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Current Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Starter Plan</h3>
                  <p className="text-amber-600">Free forever</p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Plans */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.name} className={`relative ${plan.current ? 'ring-2 ring-orange-500' : ''}`}>
                  {plan.current && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-orange-500 to-orange-600">Current Plan</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{plan.name}</span>
                      {plan.name === "Growth" && <Zap className="h-5 w-5 text-orange-500" />}
                      {plan.name === "Pro" && <Crown className="h-5 w-5 text-orange-600" />}
                    </CardTitle>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-gray-500">{plan.period}</span>}
                    </div>
                    <p className="text-amber-600">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.buttonVariant === 'default' ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white' : 'border-amber-200 hover:bg-[#fcfcf0] text-amber-700'}`}
                      variant={plan.buttonVariant}
                      disabled={plan.current}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Billing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="mx-auto h-12 w-12 text-amber-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Billing Management Coming Soon</h3>
                <p className="text-amber-600 mb-4">
                  Stripe integration for billing management will be available in a future update.
                </p>
                <Button variant="outline" className="border-amber-200 hover:bg-[#fcfcf0] text-amber-700">Get Notified</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
