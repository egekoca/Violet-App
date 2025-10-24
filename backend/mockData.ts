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

export const mockProfile: UserProfile = {
  id: '1',
  username: 'benimhesabim',
  displayName: 'Benim Adım',
  bio: 'Tüm linklerim burada! 🚀',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  theme: 'light'
};

export const mockLinks: Link[] = [
  {
    id: '1',
    title: 'Instagram',
    url: 'https://instagram.com',
    icon: '📸',
    isActive: true,
    order: 1
  },
  {
    id: '2',
    title: 'YouTube Kanalım',
    url: 'https://youtube.com',
    icon: '▶️',
    isActive: true,
    order: 2
  },
  {
    id: '3',
    title: 'Twitter',
    url: 'https://twitter.com',
    icon: '🐦',
    isActive: true,
    order: 3
  },
  {
    id: '4',
    title: 'Web Sitem',
    url: 'https://example.com',
    icon: '🌐',
    isActive: true,
    order: 4
  },
  {
    id: '5',
    title: 'GitHub',
    url: 'https://github.com',
    icon: '💻',
    isActive: true,
    order: 5
  }
];

// Mock API Functions
class MockAPI {
  private links: Link[] = [...mockLinks];
  private profile: UserProfile = { ...mockProfile };

  async getProfile(): Promise<UserProfile> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...this.profile }), 300);
    });
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.profile = { ...this.profile, ...updates };
        resolve({ ...this.profile });
      }, 300);
    });
  }

  async getLinks(): Promise<Link[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.links].sort((a, b) => a.order - b.order));
      }, 300);
    });
  }

  async addLink(link: Omit<Link, 'id'>): Promise<Link> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newLink: Link = {
          ...link,
          id: Date.now().toString()
        };
        this.links.push(newLink);
        resolve(newLink);
      }, 300);
    });
  }

  async updateLink(id: string, updates: Partial<Link>): Promise<Link> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.links.findIndex(l => l.id === id);
        if (index === -1) {
          reject(new Error('Link bulunamadı'));
          return;
        }
        this.links[index] = { ...this.links[index], ...updates };
        resolve({ ...this.links[index] });
      }, 300);
    });
  }

  async deleteLink(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.links.findIndex(l => l.id === id);
        if (index === -1) {
          reject(new Error('Link bulunamadı'));
          return;
        }
        this.links.splice(index, 1);
        resolve();
      }, 300);
    });
  }

  async reorderLinks(linkIds: string[]): Promise<Link[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        linkIds.forEach((id, index) => {
          const link = this.links.find(l => l.id === id);
          if (link) {
            link.order = index + 1;
          }
        });
        resolve([...this.links].sort((a, b) => a.order - b.order));
      }, 300);
    });
  }
}

export const mockAPI = new MockAPI();

