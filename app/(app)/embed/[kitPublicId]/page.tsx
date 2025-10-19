import { supabaseServer } from "../../../../lib/supabase-server";
import { notFound } from "next/navigation";
import { EditorPreview } from "../../../../src/components/kit/EditorPreview";
import { MediaKit, Section, Asset, TeamMember } from "../../../../types";

export default async function EmbedPage({ params }: { params: Promise<{ kitPublicId: string }> }) {
  const supabase = await supabaseServer();
  const { kitPublicId } = await params;

  // Fetch the public kit
  const { data: kit, error: kitError } = await supabase
    .from("media_kits")
    .select("*")
    .eq("public_id", kitPublicId)
    .eq("is_public", true)
    .single();

  if (kitError || !kit) {
    notFound();
  }

  // Fetch sections for this kit
  const { data: sections, error: sectionsError } = await supabase
    .from("sections")
    .select("*")
    .eq("kit_id", kit.id)
    .eq("visible", true)
    .order("order_index", { ascending: true });

  if (sectionsError) {
    console.error("Error fetching sections:", sectionsError);
  }

  // Fetch assets for this kit
  const { data: assets, error: assetsError } = await supabase
    .from("assets")
    .select("*")
    .eq("kit_id", kit.id)
    .order("order_index", { ascending: true });

  if (assetsError) {
    console.error("Error fetching assets:", assetsError);
  }

  // Fetch team members for this kit
  const { data: teamMembers, error: teamMembersError } = await supabase
    .from("team_members")
    .select("*")
    .eq("kit_id", kit.id)
    .order("order_index", { ascending: true });

  if (teamMembersError) {
    console.error("Error fetching team members:", teamMembersError);
  }

  // Create lookup maps for efficient rendering
  const assetsById = (assets || []).reduce((acc, asset) => {
    acc[asset.id] = asset;
    return acc;
  }, {} as Record<string, Asset>);

  const teamMembersById = (teamMembers || []).reduce((acc, member) => {
    acc[member.id] = member;
    return acc;
  }, {} as Record<string, TeamMember>);

  return (
    <div className="min-h-screen bg-white">
      <EditorPreview
        kit={kit as MediaKit}
        sections={sections as Section[] || []}
        assets={assets as Asset[] || []}
        teamMembers={teamMembers as TeamMember[] || []}
        assetsById={assetsById}
        teamMembersById={teamMembersById}
      />
    </div>
  );
}