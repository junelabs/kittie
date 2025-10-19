import { supabaseServer } from "../../../../lib/supabase-server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "../../../../src/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Key } from "lucide-react";

export default async function ApiKeysPage() {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">API Keys & Embed Tokens</h1>
            <p className="text-gray-600">
              Manage your API keys and embed tokens for programmatic access
            </p>
          </div>

          {/* Coming Soon Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-purple-600" />
                <span>API Access</span>
                <Badge variant="secondary">Coming Soon</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Key className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">API Keys Coming Soon</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We&apos;re working on API access that will allow you to programmatically manage your media kits and assets. 
                  This will include REST API endpoints and embed tokens for custom integrations.
                </p>
                <div className="space-y-4">
                  <Button variant="outline">Get Notified When Available</Button>
                  <p className="text-sm text-gray-500">
                    Expected release: Q2 2024
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Planned Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>REST API</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Create and manage media kits</li>
                  <li>• Upload and organize assets</li>
                  <li>• Generate embed codes</li>
                  <li>• Access analytics data</li>
                  <li>• Webhook support</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Embed Tokens</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Secure embed authentication</li>
                  <li>• Custom styling options</li>
                  <li>• Access control</li>
                  <li>• Usage analytics</li>
                  <li>• Rate limiting</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Documentation Preview */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>API Documentation Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-green-400">
                <div className="mb-2"># Example API Usage</div>
                <div className="mb-1">curl -X POST https://api.kittie.com/v1/kits \</div>
                <div className="mb-1">  -H &quot;Authorization: Bearer YOUR_API_KEY&quot; \</div>
                <div className="mb-1">  -H &quot;Content-Type: application/json&quot; \</div>
                <div className="mb-1">  -d &apos;{`{"name": "My Media Kit", "brand_color": "#6366f1"}`}&apos;</div>
                <div className="mt-4 text-gray-400"># Response</div>
                <div className="text-blue-400">{`{`}</div>
                <div className="ml-2 text-blue-400">&quot;id&quot;: &quot;kit_123&quot;,</div>
                <div className="ml-2 text-blue-400">&quot;name&quot;: &quot;My Media Kit&quot;,</div>
                <div className="ml-2 text-blue-400">&quot;public_id&quot;: &quot;abc123def456&quot;,</div>
                <div className="ml-2 text-blue-400">&quot;created_at&quot;: &quot;2024-01-15T10:30:00Z&quot;</div>
                <div className="text-blue-400">{`}`}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}