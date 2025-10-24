/**
 * Violet LinkTree Smart Contract İşlemleri
 * Sui blockchain üzerindeki contract ile etkileşim
 */

import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import { PACKAGE_ID, MODULE_NAME, FUNCTIONS, TYPES } from './constants';
import type {
  CreateProfileInput,
  AddLinkInput,
  UpdateProfileInput,
  UserProfile,
  TransactionResult,
} from './types';

/**
 * Yeni profil oluştur
 * 
 * @param client - Sui client
 * @param input - Profil bilgileri
 * @param sender - Kullanıcı wallet adresi
 */
export function createProfileTransaction(
  input: CreateProfileInput
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTIONS.CREATE_PROFILE}`,
    arguments: [
      tx.pure.string(input.username),
      tx.pure.string(input.display_name),
      tx.pure.string(input.bio),
    ],
  });

  return tx;
}

/**
 * Profile link ekle
 * 
 * @param input - Link bilgileri
 */
export function addLinkTransaction(input: AddLinkInput): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTIONS.ADD_LINK}`,
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
 * Profil bilgilerini güncelle
 * 
 * @param input - Güncellenecek bilgiler
 */
export function updateProfileTransaction(
  input: UpdateProfileInput
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTIONS.UPDATE_PROFILE}`,
    arguments: [
      tx.object(input.profileId),
      tx.pure.string(input.display_name),
      tx.pure.string(input.bio),
    ],
  });

  return tx;
}

/**
 * Kullanıcının profilini getir (object ID ile)
 * 
 * @param client - Sui client
 * @param profileId - UserProfile object ID
 */
export async function getUserProfile(
  client: SuiClient,
  profileId: string
): Promise<UserProfile | null> {
  try {
    const object = await client.getObject({
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

    return {
      id: profileId,
      owner: object.data.owner && typeof object.data.owner === 'object' && 'AddressOwner' in object.data.owner
        ? object.data.owner.AddressOwner
        : '',
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
 * Kullanıcının sahip olduğu tüm profilleri getir
 * 
 * @param client - Sui client
 * @param ownerAddress - Wallet adresi
 */
export async function getUserProfiles(
  client: SuiClient,
  ownerAddress: string
): Promise<UserProfile[]> {
  try {
    const objects = await client.getOwnedObjects({
      owner: ownerAddress,
      filter: {
        StructType: TYPES.USER_PROFILE,
      },
      options: {
        showContent: true,
      },
    });

    const profiles: UserProfile[] = [];

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

