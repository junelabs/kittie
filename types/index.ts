// Canonical shared types across the app

// Assets
export type AssetKind = 'logo' | 'image' | 'doc';

export interface Asset {
  id: string;
  kit_id: string;
  section_id?: string | null;
  user_id?: string;
  kind: AssetKind;
  label?: string | null;
  file_path: string;
  file_url?: string;
  order_index: number;
  size_bytes?: number | null;
  mime?: string | null;
  created_at: string;
}

// Media kits
export interface MediaKit {
  id: string;
  user_id: string;          // canonical owner reference
  owner_id?: string;        // kept optional for legacy compatibility
  name: string;
  brand_color: string | null;
  is_public: boolean;
  public_id: string;
  created_at: string;
  updated_at?: string;
  // Optional marketing fields (used by some UI)
  description?: string | null;
  primary_cta_label?: string | null;
  primary_cta_action?: 'downloadAll' | 'openUrl';
  primary_cta_url?: string | null;
  show_powered_by?: boolean;
}

// Kit sections
export type Section = {
  id: string;
  kit_id: string;
  kind: 'assets' | 'team';
  title: string;
  description: string | null;
  visible: boolean;
  order_index: number;
  created_at: string;
};

// Team members
export type TeamMember = {
  id: string;
  section_id: string;
  name: string;
  role: string | null;
  photo_url: string | null;
  email: string | null;
  x_handle: string | null;
  linkedin_url: string | null;
  order_index: number;
  created_at: string;
};

// Helper types for the UI
export type KitWithSections = MediaKit & {
  sections: Section[];
  assets: Asset[];
  team_members: TeamMember[];
};

export type SectionWithContent = Section & {
  assets?: Asset[];
  team_members?: TeamMember[];
};