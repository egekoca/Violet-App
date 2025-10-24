/**
 * Blockchain İşlemleri
 * Frontend SDK wrapper
 */

import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

// Type alias for compatibility
export type { Transaction };

// Network config
export const NETWORK = 'testnet';
export const RPC_URL = 'https://fullnode.testnet.sui.io:443';

// Contract bilgileri
export const PACKAGE_ID = '0x9969f9126a31085599b3f7f147b6361d82559a1de1b8709be00377fdea4f050c';
export const MODULE_NAME = 'linktree';

// Sui Client
export const suiClient = new SuiClient({ url: RPC_URL });

// Type'lar
export interface CreateProfileInput {
  username: string;
  display_name: string;
  bio: string;
}

export interface AddLinkInput {
  profileId: string;
  title: string;
  url: string;
  icon: string;
}

export interface UpdateProfileInput {
  profileId: string;
  display_name: string;
  bio: string;
}

/**
 * Profil oluşturma transaction'ı
 */
export function createProfileTransaction(input: CreateProfileInput): Transaction {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::create_profile`,
    arguments: [
      tx.pure.string(input.username),
      tx.pure.string(input.display_name),
      tx.pure.string(input.bio),
    ],
  });
  
  return tx;
}

/**
 * Link ekleme transaction'ı
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
    ],
  });
  
  return tx;
}

/**
 * Profil güncelleme transaction'ı
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
 * Profil bilgilerini getir
 */
export async function getUserProfile(profileId: string) {
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

    return {
      id: profileId,
      owner,
      username: fields.username,
      display_name: fields.display_name,
      bio: fields.bio,
      links: fields.links || [],
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

/**
 * Kullanıcının tüm profillerini getir
 */
export async function getUserProfiles(ownerAddress: string) {
  try {
    const objects = await suiClient.getOwnedObjects({
      owner: ownerAddress,
      filter: {
        StructType: `${PACKAGE_ID}::${MODULE_NAME}::UserProfile`,
      },
      options: {
        showContent: true,
      },
    });

    const profiles = [];

    for (const obj of objects.data) {
      if (obj.data?.content?.dataType === 'moveObject') {
        const fields = obj.data.content.fields as any;
        profiles.push({
          id: obj.data.objectId,
          owner: ownerAddress,
          username: fields.username,
          display_name: fields.display_name,
          bio: fields.bio,
          links: fields.links || [],
        });
      }
    }

    return profiles;
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    return [];
  }
}

