module linktree::linktree {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use std::string::String;
    use std::vector;

    // ============ Events ============

    /// Profil oluşturulduğunda emit edilir
    public struct ProfileCreated has copy, drop {
        profile_id: address,
        owner: address,
        username: String,
    }

    /// Link eklendiğinde emit edilir
    public struct LinkAdded has copy, drop {
        profile_id: address,
        title: String,
        url: String,
    }

    /// Profil güncellendiğinde emit edilir
    public struct ProfileUpdated has copy, drop {
        profile_id: address,
        display_name: String,
    }

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
        let profile_id = object::new(ctx);
        let profile_addr = object::uid_to_address(&profile_id);
        let sender = tx_context::sender(ctx);

        let profile = UserProfile {
            id: profile_id,
            owner: sender,
            username: username,
            display_name,
            bio,
            links: vector::empty<Link>(),
        };

        // Event emit et
        event::emit(ProfileCreated {
            profile_id: profile_addr,
            owner: sender,
            username: username,
        });

        // Profili kullanıcıya transfer et (owned object)
        transfer::transfer(profile, sender);
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
            title: title,
            url: url,
            icon,
            is_active: true,
        };

        vector::push_back(&mut profile.links, link);

        // Event emit et
        event::emit(LinkAdded {
            profile_id: object::uid_to_address(&profile.id),
            title: title,
            url: url,
        });
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

        // Event emit et
        event::emit(ProfileUpdated {
            profile_id: object::uid_to_address(&profile.id),
            display_name: display_name,
        });
    }

    // ============ View Functions (Getter'lar) ============

    /// Profilin linklerini döndür
    public fun get_links(profile: &UserProfile): &vector<Link> {
        &profile.links
    }

    /// Profilin sahibini döndür
    public fun get_owner(profile: &UserProfile): address {
        profile.owner
    }

    /// Link sayısını döndür
    public fun get_link_count(profile: &UserProfile): u64 {
        vector::length(&profile.links)
    }
}