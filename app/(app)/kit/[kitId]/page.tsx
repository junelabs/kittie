import { supabaseServer } from "../../../../lib/supabase-server";
import { redirect, notFound } from "next/navigation";
import { KitEditor } from "@/components/kit/KitEditor";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MediaKit, Asset } from "../../../../types";

export default async function KitEditorPage({ params }: { params: { kitId: string } }) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch kit and verify ownership
  const { data: kit, error: kitError } = await supabase
    .from("media_kits")
    .select("*")
    .eq("id", params.kitId)
    .eq("owner_id", user.id)
    .single();

  if (kitError || !kit) {
    notFound();
  }

  // Fetch assets for this kit
  const { data: assets, error: assetsError } = await supabase
    .from("assets")
    .select("*")
    .eq("kit_id", params.kitId)
    .order("order_index", { ascending: true });

  if (assetsError) {
    console.error("Error fetching assets:", assetsError);
  }

  // Calculate stats for sidebar
  const totalKits = 1; // We could fetch this if needed
  const publicKits = kit.is_public ? 1 : 0;

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
  