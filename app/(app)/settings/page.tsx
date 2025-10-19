import { supabaseServer } from "../../../lib/supabase-server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building2, CreditCard, Settings as SettingsIcon } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Calculate stats for sidebar
  const totalKits = 0; // We could fetch this if needed
  const publicKits = 0;

  return (
    <DashboardLayout totalKits={totalKits} publicKits={publicKits}>
      <div className="h-full bg-white">
        <div className="px-8 py-10">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Settings</h1>
            <p className="text-amber-600 text-lg">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Personal</span>
              </TabsTrigger>
              <TabsTrigger value="organization" className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>Organization</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Billing</span>
              </TabsTrigger>
              <TabsTrigger value="other" className="flex items-center space-x-2">
                <SettingsIcon className="h-4 w-4" />
                <span>Other</span>
              </TabsTrigger>
            </TabsList>

            {/* Personal Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter your last name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="Enter your phone number" />
                  </div>
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Organization Tab */}
            <TabsContent value="organization">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name</Label>
                    <Input id="organizationName" placeholder="Enter your organization name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizationEmail">Organization Email</Label>
                    <Input id="organizationEmail" type="email" placeholder="Enter organization email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizationWebsite">Website</Label>
                    <Input id="organizationWebsite" type="url" placeholder="https://your-website.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizationDescription">Description</Label>
                    <Input id="organizationDescription" placeholder="Brief description of your organization" />
                  </div>
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">Save Organization Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <CreditCard className="mx-auto h-12 w-12 text-amber-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Billing Management</h3>
                    <p className="text-amber-600 mb-4">
                      Manage your subscription and payment methods.
                    </p>
                    <Button 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                      onClick={() => window.location.href = '/billing'}
                    >
                      Go to Billing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other Tab */}
            <TabsContent value="other">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>API Keys & Embed Tokens</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8">
                      <SettingsIcon className="mx-auto h-12 w-12 text-amber-500 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">API Keys Coming Soon</h3>
                      <p className="text-amber-600 mb-4">
                        API keys and embed tokens will be available in a future update.
                      </p>
                      <Button variant="outline" className="border-amber-200 hover:bg-[#fcfcf0] text-amber-700">Get Notified</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8">
                      <SettingsIcon className="mx-auto h-12 w-12 text-amber-500 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications Coming Soon</h3>
                      <p className="text-amber-600">
                        Notification preferences will be available in a future update.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
