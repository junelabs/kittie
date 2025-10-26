import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    const { name, brand_color, is_public } = body;
    const { id } = await params;

    // Verify ownership
    const { data: existingKit, error: fetchError } = await supabase
      .from("media_kits")
      .select("id")
      .eq("id", id)
      .eq("owner_id", user.id)
      .single();

    if (fetchError || !existingKit) {
      return NextResponse.json({ error: "Kit not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (brand_color !== undefined) updateData.brand_color = brand_color;
    if (is_public !== undefined) updateData.is_public = is_public;

    const { data: kit, error } = await supabase
      .from("media_kits")
      .update(updateData)
      .eq("id", id)
      .eq("owner_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating kit:", error);
      return NextResponse.json({ error: "Failed to update kit" }, { status: 500 });
    }

    return NextResponse.json(kit);
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

    // Verify ownership
    const { data: existingKit, error: fetchError } = await supabase
      .from("media_kits")
      .select("id")
      .eq("id", id)
      .eq("owner_id", user.id)
      .single();

    if (fetchError || !existingKit) {
      return NextResponse.json({ error: "Kit not found" }, { status: 404 });
    }

    // Delete kit (assets will be deleted on cascade)
    const { error } = await supabase
      .from("media_kits")
      .delete()
      .eq("id", id)
      .eq("owner_id", user.id);

    if (error) {
      console.error("Error deleting kit:", error);
      return NextResponse.json({ error: "Failed to delete kit" }, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
