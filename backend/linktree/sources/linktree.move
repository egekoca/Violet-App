module linktree::linktree {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use sui::dynamic_field as df;
    use std::string::String;
    use std::vector;

    // ============ Error Codes ============
    
    const ENotOwner: u64 = 0;
    const ELinkNotFound: u64 = 1;

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
        link_id: u64,
        title: String,
        url: String,
    }

    /// Link güncellendiğinde emit edilir
    public struct LinkUpdated has copy, drop {
        profile_id: address,
        link_id: u64,
        title: String,
    }

    /// Link silindiğinde emit edilir
    public struct LinkDeleted has copy, drop {
        profile_id: address,
        link_id: u64,
    }

    /// Profil güncellendiğinde emit edilir
    public struct ProfileUpdated has copy, drop {
        profile_id: address,
        display_name: String,
    }

    /// Link tıklandığında emit edilir (XP sistemi için)
    public struct LinkClicked has copy, drop {
        profile_id: address,
        link_id: u64,
        clicker: address,
        xp_earned: u64,
    }

    /// Profil resmi güncellendiğinde emit edilir
    public struct ProfileImageUpdated has copy, drop {
        profile_id: address,
        image_url: String,
    }

    // ============ Struct'lar ============

    /// Tek bir link bilgisi - Dynamic Field olarak saklanır
    public struct Link has store, copy, drop {
        id: u64,
        title: String,        // "Instagram"
        url: String,          // "https://instagram.com/..."
        icon: String,         // "📸" veya icon URL
        banner: String,       // Link banner resmi URL (opsiyonel)
        is_active: bool,      // true/false
        order: u64,           // Sıralama için
    }

    /// Link ID için wrapper - Dynamic Field key olarak kullanılır
    public struct LinkKey has copy, drop, store {
        id: u64
    }

    /// Kullanıcı profili - blockchain üzerinde bir nesne
    public struct UserProfile has key, store {
        id: UID,
        owner: address,           // Profil sahibi
        username: String,         // "ahmet123"
        display_name: String,     // "Ahmet Yılmaz"
        bio: String,             // "Tüm linklerim burada 🚀"
        image_url: String,        // Profil resmi URL
        link_ids: vector<u64>,   // Dynamic field olarak saklanan link ID'leri
        next_link_id: u64,       // Otomatik increment için
        link_count: u64,         // Toplam link sayısı
        total_xp: u64,           // Toplam XP puanı
    }

    // ============ Profil Fonksiyonları ============

    /// Yeni bir profil oluştur
    entry fun create_profile(
        username: String,
        display_name: String,
        bio: String,
        image_url: String,
        ctx: &mut TxContext
    ) {
        let profile_id = object::new(ctx);
        let profile_addr = object::uid_to_address(&profile_id);
        let sender = tx_context::sender(ctx);

        let profile = UserProfile {
            id: profile_id,
            owner: sender,
            username,
            display_name,
            bio,
            image_url,
            link_ids: vector::empty<u64>(),
            next_link_id: 0,
            link_count: 0,
            total_xp: 0,
        };

        // Event emit et
        event::emit(ProfileCreated {
            profile_id: profile_addr,
            owner: sender,
            username,
        });

        // Profili kullanıcıya transfer et (owned object)
        transfer::transfer(profile, sender);
    }

    /// Profil bilgilerini güncelle
    entry fun update_profile(
        profile: &mut UserProfile,
        display_name: String,
        bio: String,
        ctx: &mut TxContext
    ) {
        // Sadece owner güncelleyebilir
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);

        profile.display_name = display_name;
        profile.bio = bio;

        // Event emit et
        event::emit(ProfileUpdated {
            profile_id: object::uid_to_address(&profile.id),
            display_name,
        });
    }

    /// Profil resmini güncelle
    entry fun update_profile_image(
        profile: &mut UserProfile,
        image_url: String,
        ctx: &mut TxContext
    ) {
        // Sadece owner güncelleyebilir
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);

        profile.image_url = image_url;

        // Event emit et
        event::emit(ProfileImageUpdated {
            profile_id: object::uid_to_address(&profile.id),
            image_url,
        });
    }

    // ============ Link CRUD Fonksiyonları ============

    /// Yeni bir link ekle (Dynamic Field olarak)
    entry fun add_link(
        profile: &mut UserProfile,
        title: String,
        url: String,
        icon: String,
        banner: String,
        ctx: &mut TxContext
    ) {
        // Sadece owner ekleyebilir
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);

        let link_id = profile.next_link_id;
        
        let link = Link {
            id: link_id,
            title,
            url,
            icon,
            banner,
            is_active: true,
            order: profile.link_count,
        };

        // Dynamic field olarak ekle
        df::add(&mut profile.id, LinkKey { id: link_id }, link);
        
        // Link ID'yi vector'e ekle
        vector::push_back(&mut profile.link_ids, link_id);
        
        // Counters'ı güncelle
        profile.next_link_id = profile.next_link_id + 1;
        profile.link_count = profile.link_count + 1;

        // Event emit et
        event::emit(LinkAdded {
            profile_id: object::uid_to_address(&profile.id),
            link_id,
            title,
            url,
        });
    }

    /// Link bilgilerini güncelle
    entry fun update_link(
        profile: &mut UserProfile,
        link_id: u64,
        title: String,
        url: String,
        icon: String,
        banner: String,
        ctx: &mut TxContext
    ) {
        // Sadece owner güncelleyebilir
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);

        // Link'i dynamic field'dan al
        let link_key = LinkKey { id: link_id };
        assert!(df::exists_(&profile.id, link_key), ELinkNotFound);

        let link = df::borrow_mut<LinkKey, Link>(&mut profile.id, link_key);
        
        // Güncelle
        link.title = title;
        link.url = url;
        link.icon = icon;
        link.banner = banner;

        // Event emit et
        event::emit(LinkUpdated {
            profile_id: object::uid_to_address(&profile.id),
            link_id,
            title,
        });
    }

    /// Link'i sil
    entry fun delete_link(
        profile: &mut UserProfile,
        link_id: u64,
        ctx: &mut TxContext
    ) {
        // Sadece owner silebilir
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);

        let link_key = LinkKey { id: link_id };
        assert!(df::exists_(&profile.id, link_key), ELinkNotFound);

        // Dynamic field'dan sil
        let _link = df::remove<LinkKey, Link>(&mut profile.id, link_key);

        // Vector'den link_id'yi çıkar
        let (exists, index) = vector::index_of(&profile.link_ids, &link_id);
        if (exists) {
            vector::remove(&mut profile.link_ids, index);
            profile.link_count = profile.link_count - 1;
        };

        // Event emit et
        event::emit(LinkDeleted {
            profile_id: object::uid_to_address(&profile.id),
            link_id,
        });
    }

    /// Link'i aktif/pasif yap
    entry fun toggle_link(
        profile: &mut UserProfile,
        link_id: u64,
        is_active: bool,
        ctx: &mut TxContext
    ) {
        // Sadece owner değiştirebilir
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);

        let link_key = LinkKey { id: link_id };
        assert!(df::exists_(&profile.id, link_key), ELinkNotFound);

        let link = df::borrow_mut<LinkKey, Link>(&mut profile.id, link_key);
        link.is_active = is_active;
    }

    /// Link sıralamasını değiştir
    entry fun reorder_link(
        profile: &mut UserProfile,
        link_id: u64,
        new_order: u64,
        ctx: &mut TxContext
    ) {
        // Sadece owner değiştirebilir
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);

        let link_key = LinkKey { id: link_id };
        assert!(df::exists_(&profile.id, link_key), ELinkNotFound);

        let link = df::borrow_mut<LinkKey, Link>(&mut profile.id, link_key);
        link.order = new_order;
    }

    // ============ View Functions (Getter'lar) ============

    /// Profilin sahibini döndür
    public fun get_owner(profile: &UserProfile): address {
        profile.owner
    }

    /// Link ID listesini döndür
    public fun get_link_ids(profile: &UserProfile): &vector<u64> {
        &profile.link_ids
    }

    /// Link sayısını döndür
    public fun get_link_count(profile: &UserProfile): u64 {
        profile.link_count
    }

    /// Tek bir link'i döndür (sadece okuma)
    public fun get_link(profile: &UserProfile, link_id: u64): &Link {
        let link_key = LinkKey { id: link_id };
        df::borrow<LinkKey, Link>(&profile.id, link_key)
    }

    /// Link var mı kontrol et
    public fun link_exists(profile: &UserProfile, link_id: u64): bool {
        df::exists_(&profile.id, LinkKey { id: link_id })
    }

    /// Profil image URL'ini döndür
    public fun get_image_url(profile: &UserProfile): &String {
        &profile.image_url
    }

    /// Username'i döndür
    public fun get_username(profile: &UserProfile): &String {
        &profile.username
    }

    /// Display name'i döndür
    public fun get_display_name(profile: &UserProfile): &String {
        &profile.display_name
    }

    /// Bio'yu döndür
    public fun get_bio(profile: &UserProfile): &String {
        &profile.bio
    }

    // ============ XP Sistemi ============

    /// Link tıklandığında XP ver (farklı link türleri için farklı XP)
    entry fun record_link_click(
        profile: &mut UserProfile,
        link_id: u64,
        link_type: u8, // 1=social, 2=media, 3=contact, 4=custom
        ctx: &mut TxContext
    ) {
        let clicker = tx_context::sender(ctx);
        let profile_addr = object::uid_to_address(&profile.id);
        
        // Link türüne göre XP hesapla
        let xp_earned = if (link_type == 1) {
            5 // Sosyal medya linkleri için 5 XP
        } else if (link_type == 2) {
            3 // Medya linkleri için 3 XP
        } else if (link_type == 3) {
            2 // İletişim linkleri için 2 XP
        } else {
            1 // Custom linkler için 1 XP
        };

        // XP'yi profile ekle
        profile.total_xp = profile.total_xp + xp_earned;

        // Event emit et
        event::emit(LinkClicked {
            profile_id: profile_addr,
            link_id,
            clicker,
            xp_earned,
        });
    }

    /// Toplam XP'yi döndür
    public fun get_total_xp(profile: &UserProfile): u64 {
        profile.total_xp
    }
}
