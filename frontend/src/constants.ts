/**
 * Violet LinkTree Smart Contract Sabitleri
 */

/**
 * Deployed contract package ID
 * Testnet'te deploy edilen contract adresi
 */
export const PACKAGE_ID = '0x9969f9126a31085599b3f7f147b6361d82559a1de1b8709be00377fdea4f050c';

/**
 * Module adı
 */
export const MODULE_NAME = 'linktree';

/**
 * Tam modül yolu
 */
export const MODULE_PATH = `${PACKAGE_ID}::${MODULE_NAME}`;

/**
 * Contract fonksiyon isimleri
 */
export const FUNCTIONS = {
  CREATE_PROFILE: 'create_profile',
  ADD_LINK: 'add_link',
  UPDATE_PROFILE: 'update_profile',
} as const;

/**
 * Contract struct type'ları
 */
export const TYPES = {
  USER_PROFILE: `${MODULE_PATH}::UserProfile`,
  LINK: `${MODULE_PATH}::Link`,
} as const;

/**
 * Validasyon limitleri
 */
export const LIMITS = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  DISPLAY_NAME_MAX_LENGTH: 50,
  BIO_MAX_LENGTH: 200,
  LINK_TITLE_MAX_LENGTH: 50,
  LINK_URL_MAX_LENGTH: 500,
  MAX_LINKS: 20,
} as const;

