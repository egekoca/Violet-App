/**
 * Blockchain compatible types
 * Compatible with the Frontend SDK
 */

export interface Link {
  title: string;
  url: string;
  icon: string;
  is_active: boolean;
}

export interface UserProfile {
  id: string;           // Object ID (blockchain)
  owner: string;        // Wallet address
  username: string;
  display_name: string;
  bio: string;
  links: Link[];
}

// Extra types for UI (temporary compatibility)
export interface LinkWithId extends Link {
  id?: string;
  isActive?: boolean;
  order?: number;
}

