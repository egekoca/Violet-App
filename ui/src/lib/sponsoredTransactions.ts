/**
 * Sponsored Transactions - Gas Fee'siz İşlemler
 * Backend API ile sponsored transaction sistemi
 */

import { Transaction } from '@mysten/sui/transactions';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { toBase64 } from '@mysten/sui/utils';

// Contract bilgileri
export const PACKAGE_ID = '0x3ff3a568887c819e06f8f4521052853c40c1f311b41450b38f5c68f9cd4b3aa0';
export const MODULE_NAME = 'linktree';

// Backend API URL
const BACKEND_URL = 'http://localhost:3001';

// Sui Client
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

/**
 * Backend API ile sponsored transaction
 * zkLogin kullanıcıları gas fee ödemeden işlem yapar
 */
export async function executeSponsoredTransaction(
  transaction: Transaction,
  userAddress: string
): Promise<any> {
  try {
    console.log('🚀 Sponsored transaction başlatılıyor...', {
      userAddress,
      packageId: PACKAGE_ID
    });

    // Transaction'ı build et (onlyTransactionKind: true)
    const transactionBlockKindBytes = await transaction.build({
      client: suiClient,
      onlyTransactionKind: true,
    });

    console.log('🔧 Transaction built:', {
      txBytesLength: transactionBlockKindBytes.length
    });

    // JWT token'ı localStorage'dan al (Enoki wallet tarafından saklanır)
    console.log('🔍 localStorage keys:', Object.keys(localStorage));
    
    // Farklı JWT key'lerini dene
    const jwt = localStorage.getItem('enoki-jwt') || 
                localStorage.getItem('zklogin-jwt') || 
                localStorage.getItem('jwt') ||
                localStorage.getItem('token') ||
                localStorage.getItem('enoki-token');
    
    console.log('🔑 JWT token search:', {
      'enoki-jwt': localStorage.getItem('enoki-jwt'),
      'zklogin-jwt': localStorage.getItem('zklogin-jwt'),
      'jwt': localStorage.getItem('jwt'),
      'token': localStorage.getItem('token'),
      'enoki-token': localStorage.getItem('enoki-token'),
      found: !!jwt
    });
    
    if (!jwt) {
      throw new Error('JWT token not found. Please login with zkLogin first.');
    }

    console.log('🔑 JWT token found:', jwt.slice(0, 20) + '...');
    
    // Backend'e sponsor isteği gönder (JWT token ile)
    const sponsorResponse = await fetch(`${BACKEND_URL}/api/sponsor-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionBlockKindBytes: toBase64(transactionBlockKindBytes),
        userAddress,
        jwt, // JWT token'ı backend'e gönder
      }),
    });

    if (!sponsorResponse.ok) {
      const errorData = await sponsorResponse.json();
      throw new Error(errorData.message || 'Failed to sponsor transaction');
    }

    const sponsorResult = await sponsorResponse.json();
    console.log('✅ Sponsored transaction oluşturuldu:', sponsorResult);

    // Backend'e execute isteği gönder
    const executeResponse = await fetch(`${BACKEND_URL}/api/execute-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        digest: sponsorResult.result.digest,
        bytes: sponsorResult.result.bytes,
        jwt, // JWT token'ı backend'e gönder
      }),
    });

    if (!executeResponse.ok) {
      const errorData = await executeResponse.json();
      throw new Error(errorData.message || 'Failed to execute transaction');
    }

    const executeResult = await executeResponse.json();
    console.log('✅ Transaction executed successfully:', executeResult);
    
    return executeResult.result;
  } catch (error) {
    console.error('❌ Sponsored transaction hatası:', error);
    throw error;
  }
}

/**
 * Profil oluşturma - Sponsored
 */
export function createProfileSponsoredTransaction(input: {
  username: string;
  display_name: string;
  bio: string;
  image_url: string;
}): Transaction {
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
 * Link ekleme - Sponsored
 */
export function addLinkSponsoredTransaction(input: {
  profileId: string;
  title: string;
  url: string;
  icon: string;
  banner: string;
}): Transaction {
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
 * Profil güncelleme - Sponsored
 */
export function updateProfileSponsoredTransaction(input: {
  profileId: string;
  display_name: string;
  bio: string;
}): Transaction {
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
 * Profil resmi güncelleme - Sponsored
 */
export function updateProfileImageSponsoredTransaction(input: {
  profileId: string;
  image_url: string;
}): Transaction {
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
 * Link güncelleme - Sponsored
 */
export function updateLinkSponsoredTransaction(input: {
  profileId: string;
  link_id: number;
  title: string;
  url: string;
  icon: string;
  banner: string;
}): Transaction {
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
 * Link silme - Sponsored
 */
export function deleteLinkSponsoredTransaction(input: {
  profileId: string;
  link_id: number;
}): Transaction {
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
 * Link aktif/pasif yapma - Sponsored
 */
export function toggleLinkSponsoredTransaction(input: {
  profileId: string;
  link_id: number;
  is_active: boolean;
}): Transaction {
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
 * Rate limiting kontrolü
 * Kullanıcı başına günlük limit
 */
const DAILY_LIMIT = 10; // Günlük 10 sponsored transaction
const userTransactionCounts = new Map<string, { count: number; date: string }>();

export function canUseSponsoredTransaction(userAddress: string): boolean {
  const today = new Date().toDateString();
  const userData = userTransactionCounts.get(userAddress);
  
  if (!userData || userData.date !== today) {
    // Yeni gün, sıfırla
    userTransactionCounts.set(userAddress, { count: 0, date: today });
    return true;
  }
  
  return userData.count < DAILY_LIMIT;
}

export function incrementSponsoredTransactionCount(userAddress: string): void {
  const today = new Date().toDateString();
  const userData = userTransactionCounts.get(userAddress);
  
  if (!userData || userData.date !== today) {
    userTransactionCounts.set(userAddress, { count: 1, date: today });
  } else {
    userTransactionCounts.set(userAddress, { count: userData.count + 1, date: today });
  }
}
