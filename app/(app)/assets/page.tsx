import { supabaseServer } from "../../../lib/supabase-server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "../../../src/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

export default async function AssetsPage() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Calculate stats for sidebar
  const totalKits = 0; // We could fetch this if needed
  const publicKits = 0;

  return (
    <DashboardLayout totalKits={totalKits} publicKits={publicKits}>
      <div className="h-full bg-white">
        <div className="px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assets</h1>
            <p className="text-amber-600">
              Manage all your uploaded assets across all media kits
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-400" />
                <Input
                  placeholder="Search assets..."
                  className="pl-10 border-amber-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2 border-amber-200 hover:bg-[#fcfcf0] text-amber-700">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </div>
          </div>

          {/* Assets Grid */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>All Assets</span>
                  <span className="text-sm font-normal text-gray-500">0 assets</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-[#fcfcf0] rounded-full flex items-center justify-center mb-6">
                    <Search className="h-12 w-12 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No assets found</h3>
                  <p className="text-amber-600 mb-8 max-w-md mx-auto">
                    Upload assets to your media kits to see them here. This global view will help you manage all your brand assets in one place.
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/dashboard'}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                  >
                    Go to Media Kits
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
