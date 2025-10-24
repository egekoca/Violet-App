/**
 * Violet LinkTree TypeScript Type Definitions
 * Sui blockchain üzerindeki veri yapılarının TypeScript karşılıkları
 */

/**
 * Link - Tek bir sosyal medya veya web linki
 */
export interface Link {
  title: string;      // "Instagram"
  url: string;        // "https://instagram.com/..."
  icon: string;       // "📸"
  is_active: boolean; // true/false
}

/**
 * UserProfile - Kullanıcı profil objesi (on-chain)
 */
export interface UserProfile {
  id: string;             // Object ID
  owner: string;          // Wallet address
  username: string;       // "ahmet123"
  display_name: string;   // "Ahmet Yılmaz"
  bio: string;           // "Tüm linklerim burada 🚀"
  links: Link[];         // Link listesi
}

/**
 * Create profile için input
 */
export interface CreateProfileInput {
  username: string;
  display_name: string;
  bio: string;
}

/**
 * Add link için input
 */
export interface AddLinkInput {
  profileId: string;  // UserProfile object ID
  title: string;
  url: string;
  icon: string;
}

/**
 * Update profile için input
 */
export interface UpdateProfileInput {
  profileId: string;
  display_name: string;
  bio: string;
}

/**
 * Transaction sonucu
 */
export interface TransactionResult {
  success: boolean;
  digest: string;
  error?: string;
}

