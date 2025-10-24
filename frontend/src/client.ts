/**
 * Sui Client Kurulumu
 * Blockchain ile iletişim için temel client
 */

import { SuiClient } from '@mysten/sui/client';
import { getNetworkConfig } from './networkConfig';

/**
 * Sui Client instance'ı oluştur
 */
export function createSuiClient(): SuiClient {
  const config = getNetworkConfig();
  return new SuiClient({ url: config.rpcUrl });
}

/**
 * Global Sui client instance (singleton)
 */
export const suiClient = createSuiClient();

