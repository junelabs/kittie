import { NextRequest, NextResponse } from "next/server";
import { supabaseServerMutating } from "../../../../lib/supabase-server";
import { AssetKind } from "../../../../types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await supabaseServerMutating();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { kitId, kind, filename, size, mime } = body;

    if (!kitId || !kind || !filename) {
      return NextResponse.json({ 
        error: "kitId, kind, and filename are required" 
      }, { status: 400 });
    }

    if (!['logo', 'image', 'doc', 'bio'].includes(kind)) {
      return NextResponse.json({ 
        error: "Invalid kind. Must be logo, image, doc, or bio" 
      }, { status: 400 });
    }

    // Verify kit ownership
    const { data: kit, error: kitError } = await supabase
      .from("media_kits")
      .select("id")
      .eq("id", kitId)
      .eq("owner_id", user.id)
      .single();

    if (kitError || !kit) {
      return NextResponse.json({ error: "Kit not found" }, { status: 404 });
    }

    // Generate file path
    const timestamp = Date.now();
    const file_path = `${user.id}/${kitId}/${timestamp}_${filename}`;

    // Get signed upload URL
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("assets")
      .createSignedUploadUrl(file_path);

    if (uploadError || !uploadData) {
      console.error("Error creating signed upload URL:", uploadError);
      return NextResponse.json({ 
        error: "Failed to create upload URL" 
      }, { status: 500 });
    }

    // Get the next order index for this kit
    const { data: lastAsset } = await supabase
      .from("assets")
      .select("order_index")
      .eq("kit_id", kitId)
      .order("order_index", { ascending: false })
      .limit(1)
      .single();

    const order_index = (lastAsset?.order_index || 0) + 1;

    // Insert asset record
    const { data: asset, error: assetError } = await supabase
      .from("assets")
      .insert({
        kit_id: kitId,
        kind: kind as AssetKind,
        file_path,
        file_url: uploadData.path, // Temporary, will be updated after upload
        label: null,
        order_index,
        size_bytes: size || null,
        mime: mime || null,
      })
      .select()
      .single();

    if (assetError) {
      console.error("Error creating asset record:", assetError);
      return NextResponse.json({ 
        error: "Failed to create asset record" 
      }, { status: 500 });
    }

    return NextResponse.json({
      uploadUrl: uploadData.signedUrl,
      asset,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
