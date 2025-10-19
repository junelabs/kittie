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
    name: "Sample Kit",
    description: "This is a sample kit",
    brand_color: null,
    public_id: "sample-kit",
    is_public: false,
    primary_cta_label: null,
    primary_cta_action: 'downloadAll',
    primary_cta_url: null,
    show_powered_by: true,
    owner_id: "placeholder",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
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
  