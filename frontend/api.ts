import { Link, UserProfile, CreateLinkRequest, UpdateLinkRequest, UpdateProfileRequest } from './types';

// Mock API'yi import ediyoruz
import { mockAPI } from '../backend/mockData';

export class APIClient {
  async getProfile(): Promise<UserProfile> {
    return mockAPI.getProfile();
  }

  async updateProfile(updates: UpdateProfileRequest): Promise<UserProfile> {
    return mockAPI.updateProfile(updates);
  }

  async getLinks(): Promise<Link[]> {
    return mockAPI.getLinks();
  }

  async addLink(link: CreateLinkRequest): Promise<Link> {
    return mockAPI.addLink(link);
  }

  async updateLink(id: string, updates: UpdateLinkRequest): Promise<Link> {
    return mockAPI.updateLink(id, updates);
  }

  async deleteLink(id: string): Promise<void> {
    return mockAPI.deleteLink(id);
  }

  async reorderLinks(linkIds: string[]): Promise<Link[]> {
    return mockAPI.reorderLinks(linkIds);
  }
}

export const apiClient = new APIClient();

