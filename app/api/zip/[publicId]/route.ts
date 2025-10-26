import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import archiver from "archiver";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    const supabase = await createClient();
    
    const { publicId } = await params;
    
    // Fetch public kit by public_id
    const { data: kit, error: kitError } = await supabase
      .from("media_kits")
      .select("*")
      .eq("public_id", publicId)
      .eq("is_public", true)
      .single();

    if (kitError || !kit) {
      return NextResponse.json({ error: "Kit not found" }, { status: 404 });
    }

    // Fetch assets for this kit
    const { data: assets, error: assetsError } = await supabase
      .from("assets")
      .select("*")
      .eq("kit_id", kit.id)
      .order("order_index", { ascending: true });

    if (assetsError) {
      console.error("Error fetching assets:", assetsError);
      return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 });
    }

    if (!assets || assets.length === 0) {
      return NextResponse.json({ error: "No assets found" }, { status: 404 });
    }

    // Create zip stream
    const archive = archiver("zip", {
      zlib: { level: 9 }
    });

    // Set response headers
    const headers = new Headers();
    headers.set("Content-Type", "application/zip");
    headers.set("Content-Disposition", `attachment; filename="${kit.name}-assets.zip"`);

    const stream = new ReadableStream({
      start(controller) {
        archive.on("data", (chunk) => {
          controller.enqueue(chunk);
        });

        archive.on("end", () => {
          controller.close();
        });

        archive.on("error", (err) => {
          console.error("Archive error:", err);
          controller.error(err);
        });
      }
    });

    // Add each asset to the zip
    for (const asset of assets) {
      try {
        // Get signed download URL for the asset
        const { data: downloadData, error: downloadError } = await supabase.storage
          .from("assets")
          .createSignedUrl(asset.file_path, 60); // 60 seconds expiry

        if (downloadError || !downloadData) {
          console.error(`Error creating download URL for ${asset.file_path}:`, downloadError);
          continue;
        }

        // Fetch the file content
        const response = await fetch(downloadData.signedUrl);
        if (!response.ok) {
          console.error(`Failed to fetch ${asset.file_path}:`, response.status);
          continue;
        }

        const buffer = await response.arrayBuffer();
        const filename = asset.label || asset.file_path.split("/").pop() || `asset-${asset.id}`;
        
        archive.append(Buffer.from(buffer), { name: filename });
      } catch (error) {
        console.error(`Error processing asset ${asset.id}:`, error);
        continue;
      }
    }

    // Finalize the archive
    archive.finalize();

    return new NextResponse(stream, { headers });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
