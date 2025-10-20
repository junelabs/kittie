export type AssetKind = "logo" | "image" | "doc";

export interface Asset {
  id: string;
  kit_id: string;
  user_id: string;
  kind: AssetKind;
  label: string | null;
  file_path: string;
  order_index: number;
  created_at: string;
}

export interface MediaKit {
  id: string;
  user_id: string;
  name: string;
  brand_color: string | null;
  is_public: boolean;
  public_id: string;
  created_at: string;
}
export type MediaKit = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  brand_color: string | null;
  public_id: string;
  is_public: boolean;
  primary_cta_label: string | null;
  primary_cta_action: 'downloadAll' | 'openUrl';
  primary_cta_url: string | null;
  show_powered_by: boolean;
  created_at: string;
  updated_at: string;
};

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

export type AssetKind = 'logo' | 'image' | 'doc' | 'bio';

export type Asset = {
  id: string;
  kit_id: string;
  section_id: string | null;
  kind: AssetKind;
  file_path: string;
  file_url: string;
  label: string | null;
  alt_text: string | null;
  order_index: number;
  size_bytes: number | null;
  mime: string | null;
  created_at: string;
};

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