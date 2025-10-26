/**
 * Sponsored Transactions - Gas Fee-free Transactions
 * A sponsored transaction system with the Backend API
 */

import { Transaction } from '@mysten/sui/transactions';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { toBase64 } from '@mysten/sui/utils';

// Contract info
export const PACKAGE_ID = '0x28d408ce45cef229c69aafd8c27a1f72eb9687db562b178b04426b20735ea0a8';
export const MODULE_NAME = 'violet';

// Backend API URL
const BACKEND_URL = 'http://localhost:3001';

// Sui Client
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

/**
 * Sponsored transaction with the Backend API ile 
 * zkLogin users can make transactions without having to pay any gas fee
 */
export async function executeSponsoredTransaction(
  transaction: Transaction,
  userAddress: string
): Promise<any> {
  try {
    console.log('Sponsored transaction is starting...', {
      userAddress,
      packageId: PACKAGE_ID
    });

    // Build the Transaction (onlyTransactionKind: true)
    const transactionBlockKindBytes = await transaction.build({
      client: suiClient,
      onlyTransactionKind: true,
    });

    console.log('Transaction built:', {
      txBytesLength: transactionBlockKindBytes.length
    });

    // Take JWT from localStorage JWT (stored by the Enoki wallet)
    console.log('localStorage keys:', Object.keys(localStorage));
    
    // Farklı JWT key'lerini dene
    const jwt = localStorage.getItem('enoki-jwt') || 
                localStorage.getItem('zklogin-jwt') || 
                localStorage.getItem('jwt') ||
                localStorage.getItem('token') ||
                localStorage.getItem('enoki-token');
    
    console.log('JWT token search:', {
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

    console.log('JWT token found:', jwt.slice(0, 20) + '...');
    
    // Ask for a sponsor from the backend (with JWT)
    const sponsorResponse = await fetch(`${BACKEND_URL}/api/sponsor-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionBlockKindBytes: toBase64(transactionBlockKindBytes),
        userAddress,
        jwt, // Send the JWT to the backend
      }),
    });

    if (!sponsorResponse.ok) {
      const errorData = await sponsorResponse.json();
      throw new Error(errorData.message || 'Failed to sponsor transaction');
    }

    const sponsorResult = await sponsorResponse.json();
    console.log('Sponsored transaction has been created successfully:', sponsorResult);

    // Send an execute request to the backend
    const executeResponse = await fetch(`${BACKEND_URL}/api/execute-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        digest: sponsorResult.result.digest,
        bytes: sponsorResult.result.bytes,
        jwt, // Send JWT to backend
      }),
    });

    if (!executeResponse.ok) {
      const errorData = await executeResponse.json();
      throw new Error(errorData.message || 'Failed to execute transaction');
    }

    const executeResult = await executeResponse.json();
    console.log('Transaction executed successfully:', executeResult);
    
    return executeResult.result;
  } catch (error) {
    console.error('Sponsored transaction error:', error);
    throw error;
  }
}

/**
 * Creating a profile - Sponsored
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
 * Link add - Sponsored
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
 * Profil update - Sponsored
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
 * Profile photo update - Sponsored
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
 * Link update - Sponsored
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
 * Link deleting - Sponsored
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
 * Link toggle on/off - Sponsored
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
 * Rate limiting control
 * Daily limit per user
 */
const DAILY_LIMIT = 10; // Daily 10 sponsored transactions
const userTransactionCounts = new Map<string, { count: number; date: string }>();

export function canUseSponsoredTransaction(userAddress: string): boolean {
  const today = new Date().toDateString();
  const userData = userTransactionCounts.get(userAddress);
  
  if (!userData || userData.date !== today) {
    // New day, reset the limit
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
