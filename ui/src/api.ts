import { Link, UserProfile } from './types';

// Mock API - Backend mock data'yı simüle ediyoruz
const mockProfile: UserProfile = {
  id: '1',
  username: 'benimhesabim',
  displayName: 'Benim Adım',
  bio: 'Tüm linklerim burada! 🚀',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  theme: 'light'
};

let mockLinks: Link[] = [
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

let profile = { ...mockProfile };

export const api = {
  async getProfile(): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...profile };
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 300));
    profile = { ...profile, ...updates };
    return { ...profile };
  },

  async getLinks(): Promise<Link[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockLinks].filter(l => l.isActive).sort((a, b) => a.order - b.order);
  },

  async getAllLinks(): Promise<Link[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockLinks].sort((a, b) => a.order - b.order);
  },

  async addLink(link: Omit<Link, 'id'>): Promise<Link> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newLink: Link = {
      ...link,
      id: Date.now().toString()
    };
    mockLinks.push(newLink);
    return newLink;
  },

  async updateLink(id: string, updates: Partial<Link>): Promise<Link> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockLinks.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Link bulunamadı');
    mockLinks[index] = { ...mockLinks[index], ...updates };
    return { ...mockLinks[index] };
  },

  async deleteLink(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockLinks = mockLinks.filter(l => l.id !== id);
  },

  async reorderLinks(linkIds: string[]): Promise<Link[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    linkIds.forEach((id, index) => {
      const link = mockLinks.find(l => l.id === id);
      if (link) {
        link.order = index + 1;
      }
    });
    return [...mockLinks].sort((a, b) => a.order - b.order);
  }
};

