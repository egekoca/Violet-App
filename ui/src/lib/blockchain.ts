/**
 * Blockchain İşlemleri
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
} from './sponsoredTransactions';

// Type alias for compatibility
export type { Transaction };

// Network config
export const NETWORK = 'testnet';
export const RPC_URL = 'https://fullnode.testnet.sui.io:443';

// Contract bilgileri (contract-info.json'dan)
export const PACKAGE_ID = '0xec23f89363e1115b5b45b18b5be6b43b30bedacf85391772dde29d1ed6e7eaae';
export const MODULE_NAME = 'linktree';

// Sui Client
export const suiClient = new SuiClient({ url: RPC_URL });

// Type'lar
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
  total_xp: number; // Toplam XP puanı
  links: Link[]; // Frontend'de dinamik olarak doldurulacak
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
      tx.pure.string(input.image_url),
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
      tx.pure.string(input.banner),
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
 * Profil resmi güncelleme transaction'ı
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
 * Link güncelleme transaction'ı
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
 * Link silme transaction'ı
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
 * Link aktif/pasif yapma transaction'ı
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
 * Link sıralama transaction'ı
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
 * Profil bilgilerini getir
 * NOT: Linkler dynamic field olarak saklandığı için şimdilik link_ids'den yola çıkarak
 * linkleri frontend'de bir sonraki adımda çekeceğiz
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

    // Link ID'leri al ve sayıya dönüştür
    const link_ids = Array.isArray(fields.link_ids) 
      ? fields.link_ids.map((id: any) => {
          const parsed = parseInt(id);
          return isNaN(parsed) ? -1 : parsed;
        }).filter((id: number) => id >= 0) // 0 ve üzeri (0 da geçerli ID!)
      : [];

    // Dynamic fields'dan linkleri çekmek için yardımcı fonksiyon
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
      total_xp: Number(fields.total_xp || 0),
      links: links,
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

/**
 * Profil linklerini dynamic fields'dan çek
 */
async function getProfileLinks(profileId: string, linkIds: number[]): Promise<Link[]> {
  const links: Link[] = [];
  
  console.log('🔗 getProfileLinks çağrıldı:', { profileId, linkIds });
  
  // Önce tüm dynamic fields'ı listele (debug için)
  try {
    const allFields = await suiClient.getDynamicFields({
      parentId: profileId,
    });
    console.log('📋 Tüm dynamic fields:', allFields.data);
  } catch (e) {
    console.error('Dynamic fields listelenemedi:', e);
  }
  
  for (const linkId of linkIds) {
    try {
      // Method 1: String olarak dene
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
        // Method 2: Number olarak dene
        console.log(`⚠️ String failed for link ${linkId}, trying number...`);
        fieldObject = await suiClient.getDynamicFieldObject({
          parentId: profileId,
          name: {
            type: `${PACKAGE_ID}::${MODULE_NAME}::LinkKey`,
            value: { id: linkId }
          }
        });
      }

      console.log(`📦 Link ${linkId} field object:`, fieldObject);

      if (fieldObject.data?.content?.dataType === 'moveObject') {
        const fields = fieldObject.data.content.fields as any;
        
        console.log(`✅ Link ${linkId} parsed (raw fields):`, fields);
        
        // Dynamic field yapısı: {name: {...}, value: {...}} veya direkt {fields: {...}}
        // Value içinde mi yoksa direkt fields'ta mı kontrol et
        let linkData = fields.value || fields.fields || fields;
        
        // Eğer linkData içinde fields varsa (nested), onu al
        if (linkData.fields && typeof linkData.fields === 'object') {
          linkData = linkData.fields;
        }
        
        console.log(`✅ Link ${linkId} final linkData:`, linkData);
        
        // Sayısal değerleri güvenli şekilde parse et
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
      console.error(`❌ Error fetching link ${linkId}:`, error);
      // Link bulunamadı, devam et
    }
  }
  
  console.log(`🎯 Toplam ${links.length} link yüklendi`);
  
  // Sıralamaya göre sırala
  return links.sort((a, b) => a.order - b.order);
}

/**
 * Kullanıcının tüm profillerini getir
 */
export async function getUserProfiles(ownerAddress: string): Promise<UserProfile[]> {
  try {
    console.log('📡 getUserProfiles çağrıldı:', {
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

    console.log('📦 Bulunan objeler:', {
      count: objects.data.length,
      objects: objects.data
    });

    const profiles: UserProfile[] = [];

    for (const obj of objects.data) {
      console.log('🔍 Obje inceleniyor:', {
        objectId: obj.data?.objectId,
        dataType: obj.data?.content?.dataType,
        fields: obj.data?.content
      });

      if (obj.data?.content?.dataType === 'moveObject') {
        const fields = obj.data.content.fields as any;
        
        console.log('📋 Profil fields:', fields);
        console.log('🔍 Raw link_ids from blockchain:', fields.link_ids);
        console.log('🔍 link_ids type:', typeof fields.link_ids);
        console.log('🔍 link_ids is array?:', Array.isArray(fields.link_ids));
        
        // Link ID'leri al ve sayıya dönüştür
        const link_ids = Array.isArray(fields.link_ids) 
          ? fields.link_ids.map((id: any) => {
              console.log('  🔸 Processing id:', id, 'type:', typeof id);
              const parsed = parseInt(id);
              return isNaN(parsed) ? -1 : parsed;
            }).filter((id: number) => id >= 0) // 0 ve üzeri (0 da geçerli ID!)
          : [];

        console.log('🔢 Parsed link_ids:', link_ids);

        // Dynamic fields'dan linkleri çek
        const links: Link[] = await getProfileLinks(obj.data.objectId, link_ids);
        
        console.log('🔗 Links loaded:', links);
        
        profiles.push({
          id: obj.data.objectId,
          owner: ownerAddress,
          username: fields.username,
          display_name: fields.display_name,
          bio: fields.bio,
          image_url: fields.image_url || '',
          link_ids: link_ids,
          link_count: Number(fields.link_count || 0),
          total_xp: Number(fields.total_xp || 0),
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
        MoveEventType: `${PACKAGE_ID}::${MODULE_NAME}::ProfileCreated`,
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
 * Kullanıcının sahip olduğu NFT'leri getir
 */
export async function getUserNFTs(ownerAddress: string): Promise<NFT[]> {
  try {
    console.log('🖼️ NFT\'ler yükleniyor:', ownerAddress);
    
    // Kullanıcının tüm objelerini getir
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
      // Display field'ı varsa NFT olabilir
      if (obj.data?.display?.data) {
        const display = obj.data.display.data;
        
        // NFT olarak kabul edilecek kriterler
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

    console.log(`✅ ${nfts.length} NFT bulundu`);
    return nfts;
  } catch (error) {
    console.error('❌ Error fetching NFTs:', error);
    return [];
  }
}

/**
 * Sponsored Transaction Wrapper
 * zkLogin kullanıcıları için gas fee'siz işlemler
 */
export const sponsoredBlockchain = {
  /**
   * Sponsored profil oluşturma
   */
  async createProfile(input: CreateProfileInput, userAddress: string): Promise<any> {
    if (!canUseSponsoredTransaction(userAddress)) {
      throw new Error('Günlük sponsored transaction limitiniz doldu');
    }

    const transaction = createProfileSponsoredTransaction(input);
    const result = await executeSponsoredTransaction(transaction, userAddress);
    incrementSponsoredTransactionCount(userAddress);
    return result;
  },

  /**
   * Sponsored link ekleme
   */
  async addLink(input: AddLinkInput, userAddress: string): Promise<any> {
    if (!canUseSponsoredTransaction(userAddress)) {
      throw new Error('Günlük sponsored transaction limitiniz doldu');
    }

    const transaction = addLinkSponsoredTransaction(input);
    const result = await executeSponsoredTransaction(transaction, userAddress);
    incrementSponsoredTransactionCount(userAddress);
    return result;
  },

  /**
   * Sponsored profil güncelleme
   */
  async updateProfile(input: UpdateProfileInput, userAddress: string): Promise<any> {
    if (!canUseSponsoredTransaction(userAddress)) {
      throw new Error('Günlük sponsored transaction limitiniz doldu');
    }

    const transaction = updateProfileSponsoredTransaction(input);
    const result = await executeSponsoredTransaction(transaction, userAddress);
    incrementSponsoredTransactionCount(userAddress);
    return result;
  },

  /**
   * Sponsored profil resmi güncelleme
   */
  async updateProfileImage(profileId: string, imageUrl: string, userAddress: string): Promise<any> {
    if (!canUseSponsoredTransaction(userAddress)) {
      throw new Error('Günlük sponsored transaction limitiniz doldu');
    }

    const transaction = updateProfileImageSponsoredTransaction({ profileId, image_url: imageUrl });
    const result = await executeSponsoredTransaction(transaction, userAddress);
    incrementSponsoredTransactionCount(userAddress);
    return result;
  },

  /**
   * Sponsored link güncelleme
   */
  async updateLink(input: UpdateLinkInput, userAddress: string): Promise<any> {
    if (!canUseSponsoredTransaction(userAddress)) {
      throw new Error('Günlük sponsored transaction limitiniz doldu');
    }

    const transaction = updateLinkSponsoredTransaction(input);
    const result = await executeSponsoredTransaction(transaction, userAddress);
    incrementSponsoredTransactionCount(userAddress);
    return result;
  },

  /**
   * Sponsored link silme
   */
  async deleteLink(profileId: string, linkId: number, userAddress: string): Promise<any> {
    if (!canUseSponsoredTransaction(userAddress)) {
      throw new Error('Günlük sponsored transaction limitiniz doldu');
    }

    const transaction = deleteLinkSponsoredTransaction({ profileId, link_id: linkId });
    const result = await executeSponsoredTransaction(transaction, userAddress);
    incrementSponsoredTransactionCount(userAddress);
    return result;
  },

  /**
   * Sponsored link aktif/pasif yapma
   */
  async toggleLink(profileId: string, linkId: number, isActive: boolean, userAddress: string): Promise<any> {
    if (!canUseSponsoredTransaction(userAddress)) {
      throw new Error('Günlük sponsored transaction limitiniz doldu');
    }

    const transaction = toggleLinkSponsoredTransaction({ profileId, link_id: linkId, is_active: isActive });
    const result = await executeSponsoredTransaction(transaction, userAddress);
    incrementSponsoredTransactionCount(userAddress);
    return result;
  },

  /**
   * Kullanıcının sponsored transaction hakkı var mı?
   */
  canUseSponsoredTransaction(userAddress: string): boolean {
    return canUseSponsoredTransaction(userAddress);
  },

  /**
   * Link tıklama kaydı (XP sistemi)
   */
  async recordLinkClick(
    profileId: string,
    linkId: number,
    linkType: number, // 1=social, 2=media, 3=contact, 4=custom
    userAddress: string
  ): Promise<any> {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::record_link_click`,
      arguments: [
        tx.object(profileId),
        tx.pure.u64(linkId),
        tx.pure.u8(linkType),
      ],
    });

    return tx;
  },

  /**
   * Sponsored transaction execute
   */
  async executeSponsoredTransaction(transaction: Transaction, userAddress: string): Promise<any> {
    return await executeSponsoredTransaction(transaction, userAddress);
  },

  /**
   * Leaderboard - Tüm kullanıcıları XP'ye göre sırala
   */
  async getLeaderboard(page: number = 1, limit: number = 10): Promise<{
    users: UserProfile[];
    totalPages: number;
    currentPage: number;
  }> {
    try {
      console.log('🏆 Leaderboard yükleniyor...', { page, limit });
      
      // ProfileCreated event'lerini kullanarak tüm profilleri bul
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${PACKAGE_ID}::${MODULE_NAME}::ProfileCreated`,
        },
        limit: 100, // Son 100 profili al
      });

      console.log('📦 Bulunan profil event sayısı:', events.data.length);

      const allUsers: UserProfile[] = [];

      // Her event'ten profil detaylarını çek
      for (const event of events.data) {
        const eventData = event.parsedJson as any;
        
        if (eventData && eventData.profile_id) {
          const profileId = eventData.profile_id;
          
          console.log('🔍 Profil ID bulundu:', profileId);
          
          try {
            // Profil detaylarını çek
            const profile = await getUserProfile(profileId);
            
            if (profile) {
              console.log('✅ Profil yüklendi:', profile.username, 'XP:', profile.total_xp);
              allUsers.push(profile);
            } else {
              console.warn('⚠️ Profil null döndü:', profileId);
            }
          } catch (error) {
            console.warn('⚠️ Profil yüklenemedi:', profileId, error);
          }
        }
      }

      // XP'ye göre sırala (yüksekten düşüğe)
      allUsers.sort((a, b) => b.total_xp - a.total_xp);

      // Rank ekle
      allUsers.forEach((user, index) => {
        (user as any).rank = index + 1;
      });

      // Pagination
      const totalPages = Math.ceil(allUsers.length / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = allUsers.slice(startIndex, endIndex);

      console.log('✅ Leaderboard hazır:', {
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
      console.error('❌ Leaderboard yüklenirken hata:', error);
      return {
        users: [],
        totalPages: 0,
        currentPage: 1
      };
    }
  }
};

