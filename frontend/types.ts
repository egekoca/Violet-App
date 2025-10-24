export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  isActive: boolean;
  order: number;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  theme: 'light' | 'dark';
}

export interface CreateLinkRequest {
  title: string;
  url: string;
  icon?: string;
  isActive: boolean;
  order: number;
}

export interface UpdateLinkRequest {
  title?: string;
  url?: string;
  icon?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateProfileRequest {
  username?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  theme?: 'light' | 'dark';
}

