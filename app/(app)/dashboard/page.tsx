// app/(app)/dashboard/page.tsx
import { requireAuth } from "@/lib/auth-server";
import { KitList } from "@/components/kit/KitList";
import { NewKitDialog } from "@/components/kit/NewKitDialog";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MediaKit } from "../../../types";
import { Card, CardContent } from "@/components/ui/card";
import { FolderPlus } from "lucide-react";

export default async function DashboardPage() {
  // Server-side authentication check - cannot be bypassed
  await requireAuth();

  // For now, using placeholder data since we're focusing on auth
  // TODO: Replace with actual data fetching when needed
  const kits: MediaKit[] = [];
  const totalKits = 0;
  const publicKits = 0;
  const hasKits = false;

  return (
    <DashboardLayout totalKits={totalKits} publicKits={publicKits}>
      <div className="h-full bg-white">
        <div className="px-8 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Inspiration</h1>
            <div className="flex items-center space-x-4 mt-4">
                      <button className="px-4 py-2 bg-[#fcfcf0] text-orange-800 rounded-lg text-sm font-medium border border-amber-200">
                All
              </button>
              <button className="px-4 py-2 text-amber-600 hover:text-orange-800 hover:bg-[#fcfcf0] text-sm font-medium rounded-lg transition-colors">
                Art
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Today Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Today</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sample content cards */}
                <Card className="border border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-amber-50 to-orange-100 rounded-t-lg"></div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Creative Design Trends</h3>
                      <p className="text-sm text-amber-700">Explore the latest design trends for 2024</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-orange-50 to-amber-100 rounded-t-lg"></div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Brand Guidelines</h3>
                      <p className="text-sm text-amber-700">Essential elements for consistent branding</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-200 rounded-t-lg"></div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Color Palettes</h3>
                      <p className="text-sm text-amber-700">Curated color combinations for your projects</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Trending Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Trending</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 rounded-t-lg"></div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Earthquake Response</h3>
                      <p className="text-sm text-amber-700">Community support and emergency protocols</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-amber-50 to-orange-100 rounded-t-lg"></div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Tech Innovation</h3>
                      <p className="text-sm text-amber-700">Latest breakthroughs in technology</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-orange-50 to-amber-200 rounded-t-lg"></div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Social Impact</h3>
                      <p className="text-sm text-amber-700">Making a difference in communities</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Media Kits Section - Keep existing functionality */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your Media Kits</h2>
                {hasKits && <NewKitDialog />}
              </div>
              
              {hasKits ? (
                <KitList kits={kits as MediaKit[] || []} />
              ) : (
                <Card className="border-2 border-dashed border-amber-300 bg-white">
                  <CardContent className="p-16 text-center">
                    <div className="mx-auto w-24 h-24 bg-[#fcfcf0] rounded-2xl flex items-center justify-center mb-8">
                      <FolderPlus className="h-12 w-12 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">No media kits yet</h3>
                    <p className="text-amber-700 mb-10 max-w-md mx-auto text-lg">
                      Create your first media kit to start organizing and sharing your brand assets
                    </p>
                    <NewKitDialog variant="prominent" />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
