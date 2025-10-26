import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
// import { MediaKit } from "../../../types";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: kits, error } = await supabase
      .from("media_kits")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching kits:", error);
      return NextResponse.json({ error: "Failed to fetch kits" }, { status: 500 });
    }

    return NextResponse.json(kits);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, brand_color } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const public_id = nanoid(12);
    
    const { data: kit, error } = await supabase
      .from("media_kits")
      .insert({
        owner_id: user.id,
        name,
        brand_color: brand_color || null,
        public_id,
        is_public: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating kit:", error);
      return NextResponse.json({ error: "Failed to create kit" }, { status: 500 });
    }

    return NextResponse.json(kit);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
