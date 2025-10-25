/**
 * Blockchain uyumlu type'lar
 * Frontend SDK ile uyumlu
 */

export interface Link {
  id: number;
  title: string;
  url: string;
  icon: string;
  banner: string;
  is_active: boolean;
  order: number;
}

export interface UserProfile {
  id: string;           // Object ID (blockchain)
  owner: string;        // Wallet address
  username: string;
  display_name: string;
  bio: string;
  image_url: string;
  link_ids: number[];
  link_count: number;
  links: Link[];        // Frontend'de dynamic fields'dan yüklenir
}

