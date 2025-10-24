/**
 * Violet Frontend SDK
 * Sui blockchain ile etkileşim için tüm fonksiyonlar
 */

// Network yapılandırması
export {
  NETWORKS,
  CURRENT_NETWORK,
  getNetworkConfig,
  getExplorerUrl,
  getObjectExplorerUrl,
  getAddressExplorerUrl,
} from './networkConfig';
export type { NetworkType, NetworkConfig } from './networkConfig';

// Contract sabitleri
export {
  PACKAGE_ID,
  MODULE_NAME,
  MODULE_PATH,
  FUNCTIONS,
  TYPES,
  LIMITS,
} from './constants';

// Type definitions
export type {
  Link,
  UserProfile,
  CreateProfileInput,
  AddLinkInput,
  UpdateProfileInput,
  TransactionResult,
} from './types';

// Sui client
export { createSuiClient, suiClient } from './client';

// Contract fonksiyonları
export {
  createProfileTransaction,
  addLinkTransaction,
  updateProfileTransaction,
  getUserProfile,
  getUserProfiles,
} from './contract';

