/**
 * Blockchain Transactions
 * Frontend SDK wrapper
 */

import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { 
  executeSponsoredTransaction,
  createProfileSponsoredTransaction,
  addLinkSponsoredTransaction,
  updateProfileSponsoredTransaction,
  updateProfileImageSponsoredTransaction,
  updateLinkSponsoredTransaction,
  deleteLinkSponsoredTransaction,
  toggleLinkSponsoredTransaction,
  canUseSponsoredTransaction,
  incrementSponsoredTransactionCount
} from './EnokiSP';

// Type alias for compatibility
export type { Transaction };

// Network config
export const NETWORK = 'testnet';
export const RPC_URL = 'https://fullnode.testnet.sui.io:443';

// Contract bilgileri (contract-info.json'dan)
export const PACKAGE_ID = '0x28d408ce45cef229c69aafd8c27a1f72eb9687db562b178b04426b20735ea0a8';
export const MODULE_NAME = 'violet';

// Sui Client
export const suiClient = new SuiClient({ url: RPC_URL });

// Types
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
  id: string;
  owner: string;
  username: string;
  display_name: string;
  bio: string;
  image_url: string;
  link_ids: number[];
  link_count: number;
  links: Link[]; // Will be filled dynamically on the frontend
}

export interface CreateProfileInput {
  username: string;
  display_name: string;
  bio: string;
  image_url: string;
}

export interface AddLinkInput {
  profileId: string;
  title: string;
  url: string;
  icon: string;
  banner: string;
}

export interface UpdateProfileInput {
  profileId: string;
  display_name: string;
  bio: string;
}

export interface UpdateProfileImageInput {
  profileId: string;
  image_url: string;
}

export interface UpdateLinkInput {
  profileId: string;
  link_id: number;
  title: string;
  url: string;
  icon: string;
  banner: string;
}

export interface DeleteLinkInput {
  profileId: string;
  link_id: number;
}

export interface ToggleLinkInput {
  profileId: string;
  link_id: number;
  is_active: boolean;
}

export interface ReorderLinkInput {
  profileId: string;
  link_id: number;
  new_order: number;
}

/**
 * 'Create Profile' transaction
 */
export function createProfileTransaction(input: CreateProfileInput): Transaction {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::create_profile`,
    arguments: [
      tx.pure.string(input.username),
      tx.pure.string(input.display_name),
      tx.pure.string(input.bio),
      tx.pure.string(input.image_url),
    ],
  });
  
  return tx;
}

/**
 * "Add Link" transaction
 */
export function addLinkTransaction(input: AddLinkInput): Transaction {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::add_link`,
    arguments: [
      tx.object(input.profileId),
      tx.pure.string(input.title),
      tx.pure.string(input.url),
      tx.pure.string(input.icon),
      tx.pure.string(input.banner),
    ],
  });
  
  return tx;
}

/**
 * 'Update Profile' transaction
 */
export function updateProfileTransaction(input: UpdateProfileInput): Transaction {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::update_profile`,
    arguments: [
      tx.object(input.profileId),
      tx.pure.string(input.display_name),
      tx.pure.string(input.bio),
    ],
  });
  
  return tx;
}

/**
 * 'Update Profile Picture' transaction
 */
export function updateProfileImageTransaction(input: UpdateProfileImageInput): Transaction {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::update_profile_image`,
    arguments: [
      tx.object(input.profileId),
      tx.pure.string(input.image_url),
    ],
  });
  
  return tx;
}

/**
 * 'Update Link' transaction
 */
export function updateLinkTransaction(input: UpdateLinkInput): Transaction {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::update_link`,
    arguments: [
      tx.object(input.profileId),
      tx.pure.u64(input.link_id),
      tx.pure.string(input.title),
      tx.pure.string(input.url),
      tx.pure.string(input.icon),
      tx.pure.string(input.banner),
    ],
  });
  
  return tx;
}

/**
 * 'Delete Link' transaction
 */
export function deleteLinkTransaction(input: DeleteLinkInput): Transaction {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::delete_link`,
    arguments: [
      tx.object(input.profileId),
      tx.pure.u64(input.link_id),
    ],
  });
  
  return tx;
}

/**
 * 'Toggle Link On/Off' transaction
 */
export function toggleLinkTransaction(input: ToggleLinkInput): Transaction {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::toggle_link`,
    arguments: [
      tx.object(input.profileId),
      tx.pure.u64(input.link_id),
      tx.pure.bool(input.is_active),
    ],
  });
  
  return tx;
}

/**
 * 'Reorder Link' transaction
 */
export function reorderLinkTransaction(input: ReorderLinkInput): Transaction {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::reorder_link`,
    arguments: [
      tx.object(input.profileId),
      tx.pure.u64(input.link_id),
      tx.pure.u64(input.new_order),
    ],
  });
  
  return tx;
}

/**
 * Get user profile data
 */
export async function getUserProfile(profileId: string): Promise<UserProfile | null> {
  try {
    const object = await suiClient.getObject({
      id: profileId,
      options: {
        showContent: true,
        showOwner: true,
      },
    });

    if (!object.data || object.data.content?.dataType !== 'moveObject') {
      return null;
    }

    const fields = object.data.content.fields as any;
    const owner = object.data.owner && typeof object.data.owner === 'object' && 'AddressOwner' in object.data.owner
      ? object.data.owner.AddressOwner
      : '';

    // Get Link IDs and conver them to int
    const link_ids = Array.isArray(fields.link_ids) 
      ? fields.link_ids.map((id: any) => {
          const parsed = parseInt(id);
          return isNaN(parsed) ? -1 : parsed;
        }).filter((id: number) => id >= 0) // 0 and upper (0 is also a valid ID!)
      : [];

    // Helper function to get links from the Dynamic fields
    const links: Link[] = await getProfileLinks(profileId, link_ids);

    return {
      id: profileId,
      owner,
      username: fields.username,
      display_name: fields.display_name,
      bio: fields.bio,
      image_url: fields.image_url || '',
      link_ids: link_ids,
      link_count: Number(fields.link_count || 0),
      links: links,
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

/**
 * Get profile links from dynamic fields
 */
async function getProfileLinks(profileId: string, linkIds: number[]): Promise<Link[]> {
  const links: Link[] = [];
  
  console.log('🔗 getProfileLinks çağrıldı:', { profileId, linkIds });
  
  // First list the whole dynamic field for debugging reasons
  try {
    const allFields = await suiClient.getDynamicFields({
      parentId: profileId,
    });
    console.log('All dynamic fields:', allFields.data);
  } catch (e) {
    console.error('Dynamic fields couldn\'t be listed:', e);
  }
  
  for (const linkId of linkIds) {
    try {
      // Method 1: Try as a string
      let fieldObject;
      try {
        fieldObject = await suiClient.getDynamicFieldObject({
          parentId: profileId,
          name: {
            type: `${PACKAGE_ID}::${MODULE_NAME}::LinkKey`,
            value: { id: String(linkId) }
          }
        });
      } catch (e1) {
        // Method 2: Try as an int
        console.log(`String failed for link ${linkId}, trying number...`);
        fieldObject = await suiClient.getDynamicFieldObject({
          parentId: profileId,
          name: {
            type: `${PACKAGE_ID}::${MODULE_NAME}::LinkKey`,
            value: { id: linkId }
          }
        });
      }

      console.log(`Link ${linkId} field object:`, fieldObject);

      if (fieldObject.data?.content?.dataType === 'moveObject') {
        const fields = fieldObject.data.content.fields as any;
        
        console.log(`Link ${linkId} parsed (raw fields):`, fields);
        
        // Dynamic field structure: {name: {...}, value: {...}} or using them directly as {fields: {...}}
        // Check whether the value is in the structure or in the fields
        let linkData = fields.value || fields.fields || fields;
        
        // If the linkData has fields nested, take it
        if (linkData.fields && typeof linkData.fields === 'object') {
          linkData = linkData.fields;
        }
        
        console.log(`Link ${linkId} final linkData:`, linkData);
        
        // Parse integers safely
        const parsedId = parseInt(linkData.id) >= 0 ? parseInt(linkData.id) : linkId;
        const parsedOrder = parseInt(linkData.order) >= 0 ? parseInt(linkData.order) : 0;
        
        links.push({
          id: parsedId,
          title: linkData.title || '',
          url: linkData.url || '',
          icon: linkData.icon || '',
          banner: linkData.banner || '',
          is_active: linkData.is_active === true,
          order: parsedOrder,
        });
      }
    } catch (error) {
      console.error(`Error fetching link ${linkId}:`, error);
      // Couldn't find a link, continue
    }
  }
  
  console.log(`Link count: ${links.length}`);
  
  // Sort according to the order
  return links.sort((a, b) => a.order - b.order);
}

/**
 * Get all the profiles belonging to the user
 */
export async function getUserProfiles(ownerAddress: string): Promise<UserProfile[]> {
  try {
    console.log('getUserProfiles called:', {
      ownerAddress,
      packageId: PACKAGE_ID,
      structType: `${PACKAGE_ID}::${MODULE_NAME}::UserProfile`
    });

    const objects = await suiClient.getOwnedObjects({
      owner: ownerAddress,
      filter: {
        StructType: `${PACKAGE_ID}::${MODULE_NAME}::UserProfile`,
      },
      options: {
        showContent: true,
        showOwner: true,
        showType: true,
      },
    });

    console.log('Found objects:', {
      count: objects.data.length,
      objects: objects.data
    });

    const profiles: UserProfile[] = [];

    for (const obj of objects.data) {
      console.log('Inspecting the object:', {
        objectId: obj.data?.objectId,
        dataType: obj.data?.content?.dataType,
        fields: obj.data?.content
      });

      if (obj.data?.content?.dataType === 'moveObject') {
        const fields = obj.data.content.fields as any;
        
        console.log('Profile fields:', fields);
        console.log('Raw link_ids from blockchain:', fields.link_ids);
        console.log('link_ids type:', typeof fields.link_ids);
        console.log('link_ids is array?:', Array.isArray(fields.link_ids));
        
        // Convert Link IDs to ints
        const link_ids = Array.isArray(fields.link_ids) 
          ? fields.link_ids.map((id: any) => {
              console.log('Processing id:', id, 'type:', typeof id);
              const parsed = parseInt(id);
              return isNaN(parsed) ? -1 : parsed;
            }).filter((id: number) => id >= 0) // 0 and upper (0 is a valid id too)
          : [];

        console.log('Parsed link_ids:', link_ids);

        // Get dynamic fields from the links
        const links: Link[] = await getProfileLinks(obj.data.objectId, link_ids);
        
        console.log('Links loaded:', links);
        
        profiles.push({
          id: obj.data.objectId,
          owner: ownerAddress,
          username: fields.username,
          display_name: fields.display_name,
          bio: fields.bio,
          image_url: fields.image_url || '',
          link_ids: link_ids,
          link_count: Number(fields.link_count || 0),
          links: links,
        });
      }
    }

    console.log('Total profile count:', profiles.length);
    console.log('Profiles:', profiles);

    return profiles;
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    return [];
  }
}

/**
 * Search the profile with target username (the event-based solution)
 * NOTE: ProfileCreated events are used for searching
 */
export async function getProfileByUsername(username: string) {
  try {
    console.log('Searching by Username:', username);
    
    // Query the ProfileCreated events
    const events = await suiClient.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::${MODULE_NAME}::ProfileCreated`,
      },
      limit: 50, // Check the last 50 profiles
    });

    console.log('Found ProfileCreated event count:', events.data.length);

    // Match for username
    for (const event of events.data) {
      const eventData = event.parsedJson as any;
      
      if (eventData && eventData.username === username) {
        console.log('Found event: ', eventData);
        
        // Get the Profile ID from the event
        const profileId = eventData.profile_id;
        
        // Get profile detals
        const profile = await getUserProfile(profileId);
        
        if (profile) {
          console.log('Fetched the profile data', profile);
          return profile;
        }
      }
    }

    console.log('Couldn\'t find a profile with the username:', username);
    return null;
  } catch (error) {
    console.error('Error searching profile by username:', error);
    return null;
  }
}

/**
 * NFT Interface
 */
export interface NFT {
  id: string;
  name: string;
  description: string;
  image_url: string;
  collection?: string;
  type: string;
}

/**
 * Get user NFTs
 */
export async function getUserNFTs(ownerAddress: string): Promise<NFT[]> {
  try {
    console.log('Loading the NFTs:', ownerAddress);
    
    // Get all the objects belonging to the user
    const objects = await suiClient.getOwnedObjects({
      owner: ownerAddress,
      options: {
        showContent: true,
        showType: true,
        showDisplay: true,
      },
    });

    const nfts: NFT[] = [];

    for (const obj of objects.data) {
      // If it has a display field, it might be an NFT
      if (obj.data?.display?.data) {
        const display = obj.data.display.data;
        
        // NFT accepting criteria
        const hasName = display.name || display.title;
        const hasImage = display.image_url || display.image || display.img_url;
        
        if (hasName && hasImage) {
          nfts.push({
            id: obj.data.objectId!,
            name: display.name || display.title || 'Unnamed NFT',
            description: display.description || '',
            image_url: display.image_url || display.image || display.img_url || '',
            collection: display.collection || display.project_name || undefined,
            type: obj.data.type || 'Unknown',
          });
        }
      }
    }

    console.log(`${nfts.length} number of NFTs found`);
    return nfts;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
}

/**
 * Sponsored Transaction Wrapper
 * Gas fee-free transactions for zkLogin users
 */
export const sponsoredBlockchain = {
  /**
   * Creating sponsored profile
   */
  async createProfile(input: CreateProfileInput, userAddress: string): Promise<any> {
    if (!canUseSponsoredTransaction(userAddress)) {
      throw new Error('Your daily sponsored transaction limit has been passed');
    }

    const transaction = createProfileSponsoredTransaction(input);
    const result = await executeSponsoredTransaction(transaction, userAddress);
    incrementSponsoredTransactionCount(userAddress);
    return result;
  },

  /**
   * Add a link with sponsors
   */
  async addLink(input: AddLinkInput, userAddress: string): Promise<any> {
    if (!canUseSponsoredTransaction(userAddress)) {
        throw new Error('Your daily sponsored transaction limit has been passed');
    }

    const transaction = addLinkSponsoredTransaction(input);
    const result = await executeSponsoredTransaction(transaction, userAddress);
    incrementSponsoredTransactionCount(userAddress);
    return result;
  },

  /**
   * Create a profile with sponsors
   */
  async updateProfile(input: UpdateProfileInput, userAddress: string): Promise<any> {
    if (!canUseSponsoredTransaction(userAddress)) {
      throw new Error('Your daily sponsored transaction limit has been passed');
    }

    const transaction = updateProfileSponsoredTransaction(input);
    const result = await executeSponsoredTransaction(transaction, userAddress);
    incrementSponsoredTransactionCount(userAddress);
    return result;
  },

  /**
   * Update a profile image with sponsors
   */
  async updateProfileImage(profileId: string, imageUrl: string, userAddress: string): Promise<any> {
    if (!canUseSponsoredTransaction(userAddress)) {
      throw new Error('Your daily sponsored transaction limit has been passed');
    }

    const transaction = updateProfileImageSponsoredTransaction({ profileId, image_url: imageUrl });
    const result = await executeSponsoredTransaction(transaction, userAddress);
    incrementSponsoredTransactionCount(userAddress);
    return result;
  },

  /**
   * Update link with sponsors
   */
  async updateLink(input: UpdateLinkInput, userAddress: string): Promise<any> {
    if (!canUseSponsoredTransaction(userAddress)) {
      throw new Error('Your daily sponsored transaction limit has been passed');
    }

    const transaction = updateLinkSponsoredTransaction(input);
    const result = await executeSponsoredTransaction(transaction, userAddress);
    incrementSponsoredTransactionCount(userAddress);
    return result;
  },

  /**
   * Delete link with sponsors
   */
  async deleteLink(profileId: string, linkId: number, userAddress: string): Promise<any> {
    if (!canUseSponsoredTransaction(userAddress)) {
      throw new Error('Your daily sponsored transaction limit has been passed');
    }

    const transaction = deleteLinkSponsoredTransaction({ profileId, link_id: linkId });
    const result = await executeSponsoredTransaction(transaction, userAddress);
    incrementSponsoredTransactionCount(userAddress);
    return result;
  },

  /**
   * Toggle link on/off with sponsors
   */
  async toggleLink(profileId: string, linkId: number, isActive: boolean, userAddress: string): Promise<any> {
    if (!canUseSponsoredTransaction(userAddress)) {
      throw new Error('Your daily sponsored transaction limit has been passed');
    }

    const transaction = toggleLinkSponsoredTransaction({ profileId, link_id: linkId, is_active: isActive });
    const result = await executeSponsoredTransaction(transaction, userAddress);
    incrementSponsoredTransactionCount(userAddress);
    return result;
  },

  /**
   *  Can the user use sponsored transactions?
   */
  canUseSponsoredTransaction(userAddress: string): boolean {
    return canUseSponsoredTransaction(userAddress);
  },


  /**
   * Sponsored transaction execute
   */
  async executeSponsoredTransaction(transaction: Transaction, userAddress: string): Promise<any> {
    return await executeSponsoredTransaction(transaction, userAddress);
  },

  /**
   * Leaderboard - Sort all users by XP
   */
  async getLeaderboard(page: number = 1, limit: number = 10): Promise<{
    users: UserProfile[];
    totalPages: number;
    currentPage: number;
  }> {
    try {
      console.log('Loading the leaderboard...', { page, limit });
      
      // Use ProfileCreated events to get all profiles
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${PACKAGE_ID}::${MODULE_NAME}::ProfileCreated`,
        },
        limit: 100, // Son 100 profili al
      });

      console.log('Total number of profile creation events found:', events.data.length);

      const allUsers: UserProfile[] = [];

      // Get profile data from all events
      for (const event of events.data) {
        const eventData = event.parsedJson as any;
        
        if (eventData && eventData.profile_id) {
          const profileId = eventData.profile_id;
          
          console.log('Profil ID has been found:', profileId);
          
          try {
            // Get profile
            const profile = await getUserProfile(profileId);
            
            if (profile) {
              console.log('Profile has been loaded:', profile.username);
              allUsers.push(profile);
            } else {
              console.warn('Profile null:', profileId);
            }
          } catch (error) {
            console.warn('Profil couldn\' be loaded:', profileId, error);
          }
        }
      }

      // Sort users alphabetically
      allUsers.sort((a, b) => a.username.localeCompare(b.username));

      // Add rank
      allUsers.forEach((user, index) => {
        (user as any).rank = index + 1;
      });

      // Pagination
      const totalPages = Math.ceil(allUsers.length / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = allUsers.slice(startIndex, endIndex);

      console.log('Leaderboard is ready:', {
        totalUsers: allUsers.length,
        currentPage: page,
        totalPages,
        usersOnPage: paginatedUsers.length
      });

      return {
        users: paginatedUsers,
        totalPages,
        currentPage: page
      };

    } catch (error) {
      console.error('Leaderboard load error:', error);
      return {
        users: [],
        totalPages: 0,
        currentPage: 1
      };
    }
  }
};

