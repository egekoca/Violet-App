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

  // UI için ekstra tipler (geçici uyumluluk)
  export interface LinkWithId extends Link {
    id?: string;
    isActive?: boolean;
    order?: number;
  }