/**
 * Blockchain İşlemleri
 * Frontend SDK wrapper
 */

import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { RPC_URL, TESTNET_PACKAGE_ID, MODULE_NAME } from '../constants';

// Type alias for compatibility
export type { Transaction };

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
    target: `${TESTNET_PACKAGE_ID}::${MODULE_NAME}::create_profile`,
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
    target: `${TESTNET_PACKAGE_ID}::${MODULE_NAME}::add_link`,
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
    target: `${TESTNET_PACKAGE_ID}::${MODULE_NAME}::update_profile`,
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

    // Links'i düzelt: {type, fields} formatından {title, url, icon, is_active} formatına
    const links = Array.isArray(fields.links)
      ? fields.links.map((link: any) => {
          if (link.fields) {
            return {
              title: link.fields.title,
              url: link.fields.url,
              icon: link.fields.icon,
              is_active: link.fields.is_active,
            };
          }
          return link;
        })
      : [];

    return {
      id: profileId,
      owner,
      username: fields.username,
      display_name: fields.display_name,
      bio: fields.bio,
      links: links,
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
    console.log('📡 getUserProfiles çağrıldı:', {
      ownerAddress,
      packageId: TESTNET_PACKAGE_ID,
      structType: `${TESTNET_PACKAGE_ID}::${MODULE_NAME}::UserProfile`
    });

    const objects = await suiClient.getOwnedObjects({
      owner: ownerAddress,
      filter: {
        StructType: `${TESTNET_PACKAGE_ID}::${MODULE_NAME}::UserProfile`,
      },
      options: {
        showContent: true,
        showOwner: true,
        showType: true,
      },
    });

    console.log('📦 Bulunan objeler:', {
      count: objects.data.length,
      objects: objects.data
    });

    const profiles = [];

    for (const obj of objects.data) {
      console.log('🔍 Obje inceleniyor:', {
        objectId: obj.data?.objectId,
        dataType: obj.data?.content?.dataType,
        fields: obj.data?.content
      });

      if (obj.data?.content?.dataType === 'moveObject') {
        const fields = obj.data.content.fields as any;

        console.log('📋 Profil fields:', fields);
        console.log('🔗 Links (raw):', fields.links);

        // Links'i düzelt: {type, fields} formatından {title, url, icon, is_active} formatına
        const links = Array.isArray(fields.links)
          ? fields.links.map((link: any) => {
              // Eğer link.fields varsa (blockchain formatı), onları çıkar
              if (link.fields) {
                return {
                  title: link.fields.title,
                  url: link.fields.url,
                  icon: link.fields.icon,
                  is_active: link.fields.is_active,
                };
              }
              // Eğer direkt obje ise (zaten doğru format), olduğu gibi döndür
              return link;
            })
          : [];

        console.log('🔗 Links (parsed):', links);

        profiles.push({
          id: obj.data.objectId,
          owner: ownerAddress,
          username: fields.username,
          display_name: fields.display_name,
          bio: fields.bio,
          links: links,
        });
      }
    }

    console.log('✅ Toplam profil sayısı:', profiles.length);
    console.log('📊 Profiller:', profiles);

    return profiles;
  } catch (error) {
    console.error('❌ Error fetching user profiles:', error);
    return [];
  }
}

/**
 * Username'e göre profil ara (EVENT-BASED ÇÖZÜM)
 * NOT: ProfileCreated event'lerini kullanarak profil arıyor
 * Production için Move contract'a Username Registry eklenmeli (Dynamic Fields ile)
 */
export async function getProfileByUsername(username: string) {
  try {
    console.log('🔍 Username arıyor:', username);

    // ProfileCreated event'lerini query et
    const events = await suiClient.queryEvents({
      query: {
        MoveEventType: `${TESTNET_PACKAGE_ID}::${MODULE_NAME}::ProfileCreated`,
      },
      limit: 50, // Son 50 profili kontrol et
    });

    console.log('📦 Bulunan ProfileCreated event sayısı:', events.data.length);

    // Username eşleşmesi ara
    for (const event of events.data) {
      const eventData = event.parsedJson as any;

      if (eventData && eventData.username === username) {
        console.log('✅ Event bulundu!', eventData);

        // Profile ID'yi event'ten al
        const profileId = eventData.profile_id;

        // Profil detaylarını çek
        const profile = await getUserProfile(profileId);

        if (profile) {
          console.log('✅ Profil detayları getirildi:', profile);
          return profile;
        }
      }
    }

    console.log('❌ Profil bulunamadı:', username);
    return null;
  } catch (error) {
    console.error('❌ Error searching profile by username:', error);
    return null;
  }
}

