import { requireAuth } from "@/lib/auth-server";
import { KitEditor } from "@/components/kit/KitEditor";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MediaKit, Asset } from "../../../../types";

export default async function KitEditorPage({ params }: { params: { kitId: string } }) {
  // Server-side authentication check - cannot be bypassed
  await requireAuth();

  // For now, using placeholder data since we're focusing on auth
  // TODO: Replace with actual data fetching when needed
  const kit: MediaKit = {
    id: params.kitId,
    user_id: "placeholder",
    name: "Sample Kit",
    brand_color: null,
    is_public: false,
    public_id: "sample-kit",
    created_at: new Date().toISOString(),
  };
  
  const assets: Asset[] = [];
  const totalKits = 1;
  const publicKits = 0;

  return (
    <DashboardLayout totalKits={totalKits} publicKits={publicKits}>
      <div className="h-full bg-white">
        <KitEditor 
          kit={kit as MediaKit} 
          assets={assets as Asset[] || []} 
        />
      </div>
    </DashboardLayout>
  );
}
  