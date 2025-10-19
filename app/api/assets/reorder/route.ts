import { NextRequest, NextResponse } from "next/server";
import { supabaseServerMutating } from "../../../../lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await supabaseServerMutating();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { updates } = body;

    if (!Array.isArray(updates)) {
      return NextResponse.json({ 
        error: "Updates must be an array" 
      }, { status: 400 });
    }

    if (updates.length === 0) {
      return NextResponse.json({ message: "No updates to process" });
    }

    // Verify all assets belong to the user
    const assetIds = updates.map((u: { id: string }) => u.id);
    const { data: assets, error: fetchError } = await supabase
      .from("assets")
      .select(`
        id,
        media_kits!inner(owner_id)
      `)
      .in("id", assetIds)
      .eq("media_kits.owner_id", user.id);

    if (fetchError) {
      console.error("Error fetching assets:", fetchError);
      return NextResponse.json({ error: "Failed to verify assets" }, { status: 500 });
    }

    if (assets.length !== assetIds.length) {
      return NextResponse.json({ 
        error: "Some assets not found or not owned by user" 
      }, { status: 403 });
    }

    // Batch update order_index for each asset
    const updatePromises = updates.map((update: { id: string; order_index: number }) =>
      supabase
        .from("assets")
        .update({ order_index: update.order_index })
        .eq("id", update.id)
    );

    const results = await Promise.all(updatePromises);
    
    // Check for any errors
    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
      console.error("Error updating assets:", errors);
      return NextResponse.json({ 
        error: "Failed to update some assets" 
      }, { status: 500 });
    }

    return NextResponse.json({ message: "Assets reordered successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
