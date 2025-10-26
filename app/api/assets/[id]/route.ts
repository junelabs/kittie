import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AssetKind } from "../../../../types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { label, kind, order_index } = body;
    const { id } = await params;

    // Verify ownership via join
    const { data: existingAsset, error: fetchError } = await supabase
      .from("assets")
      .select(`
        id,
        media_kits!inner(owner_id)
      `)
      .eq("id", id)
      .eq("media_kits.owner_id", user.id)
      .single();

    if (fetchError || !existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (label !== undefined) updateData.label = label;
    if (kind !== undefined) {
      if (!['logo', 'image', 'doc', 'bio'].includes(kind)) {
        return NextResponse.json({ 
          error: "Invalid kind. Must be logo, image, doc, or bio" 
        }, { status: 400 });
      }
      updateData.kind = kind as AssetKind;
    }
    if (order_index !== undefined) updateData.order_index = order_index;

    const { data: asset, error } = await supabase
      .from("assets")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        media_kits!inner(owner_id)
      `)
      .eq("media_kits.owner_id", user.id)
      .single();

    if (error) {
      console.error("Error updating asset:", error);
      return NextResponse.json({ error: "Failed to update asset" }, { status: 500 });
    }

    return NextResponse.json(asset);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership and get file path
    const { data: asset, error: fetchError } = await supabase
      .from("assets")
      .select(`
        id,
        file_path,
        media_kits!inner(owner_id)
      `)
      .eq("id", id)
      .eq("media_kits.owner_id", user.id)
      .single();

    if (fetchError || !asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("assets")
      .remove([asset.file_path]);

    if (storageError) {
      console.error("Error deleting from storage:", storageError);
      // Continue with database deletion even if storage fails
    }

    // Delete from database
    const { error } = await supabase
      .from("assets")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting asset:", error);
      return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
