module linktree::linktree {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use std::string::String;

    // ============ Struct'lar ============

    /// Tek bir link bilgisi
    public struct Link has store, copy, drop {
        title: String,      // "Instagram"
        url: String,        // "https://instagram.com/..."
        icon: String,       // "📸"
        is_active: bool,    // true/false
    }

    /// Kullanıcı profili - blockchain üzerinde bir nesne
    public struct UserProfile has key, store {
        id: UID,
        owner: address,         // Profil sahibi
        username: String,       // "ahmet123"
        display_name: String,   // "Ahmet Yılmaz"
        bio: String,           // "Tüm linklerim burada 🚀"
        links: vector<Link>,   // Link listesi
    }

    // ============ Fonksiyonlar ============

    /// Yeni bir profil oluştur
    public entry fun create_profile(
        username: String,
        display_name: String,
        bio: String,
        ctx: &mut TxContext
    ) {
        let profile = UserProfile {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            username,
            display_name,
            bio,
            links: vector::empty<Link>(),
        };

        // Profili kullanıcıya transfer et (owned object)
        transfer::transfer(profile, tx_context::sender(ctx));
    }

    /// Profile yeni bir link ekle
    public entry fun add_link(
        profile: &mut UserProfile,
        title: String,
        url: String,
        icon: String,
        ctx: &mut TxContext
    ) {
        // Sadece owner ekleyebilir
        assert!(profile.owner == tx_context::sender(ctx), 0);

        let link = Link {
            title,
            url,
            icon,
            is_active: true,
        };

        vector::push_back(&mut profile.links, link);
    }

    /// Profil bilgilerini güncelle
    public entry fun update_profile(
        profile: &mut UserProfile,
        display_name: String,
        bio: String,
        ctx: &mut TxContext
    ) {
        // Sadece owner güncelleyebilir
        assert!(profile.owner == tx_context::sender(ctx), 0);

        profile.display_name = display_name;
        profile.bio = bio;
    }
}