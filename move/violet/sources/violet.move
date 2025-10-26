module violet::violet {
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

    /// Emits when the profile is created
    public struct ProfileCreated has copy, drop {
        profile_id: address,
        owner: address,
        username: String,
    }

    /// Emits when a link is added
    public struct LinkAdded has copy, drop {
        profile_id: address,
        link_id: u64,
        title: String,
        url: String,
    }

    /// Emits when a link is updated
    public struct LinkUpdated has copy, drop {
        profile_id: address,
        link_id: u64,
        title: String,
    }

    /// Emits when a link is deleted
    public struct LinkDeleted has copy, drop {
        profile_id: address,
        link_id: u64,
    }

    /// Emits when the profile is updated
    public struct ProfileUpdated has copy, drop {
        profile_id: address,
        display_name: String,
    }


    /// Emits when the profile image is updated
    public struct ProfileImageUpdated has copy, drop {
        profile_id: address,
        image_url: String,
    }

    // ============ Struct'lar ============

    /// Single link field - Stored as Dynamic Field
    public struct Link has store, copy, drop {
        id: u64,
        title: String,        // "Instagram"
        url: String,          // "https://instagram.com/..."
        icon: String,         // "📸" veya icon URL
        banner: String,       // Link banner resmi URL (opsiyonel)
        is_active: bool,      // true/false
        order: u64,           // Sıralama için
    }

    /// Wrapper for Link ID, used as Dynamic Field key
    public struct LinkKey has copy, drop, store {
        id: u64
    }

    /// User profile, a blockchain object
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
    }

    // ============ Profile Functions ============

    /// Create a new profile
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
        };

        // Event emit et
        event::emit(ProfileCreated {
            profile_id: profile_addr,
            owner: sender,
            username,
        });

        // Transfer the ownership of the profile to the user (owned object)
        transfer::transfer(profile, sender);
    }

    /// Update profile info
    entry fun update_profile(
        profile: &mut UserProfile,
        display_name: String,
        bio: String,
        ctx: &mut TxContext
    ) {
        // Only owner can update the profile
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);

        profile.display_name = display_name;
        profile.bio = bio;

        // Emit the event
        event::emit(ProfileUpdated {
            profile_id: object::uid_to_address(&profile.id),
            display_name,
        });
    }

    /// Update profile picture
    entry fun update_profile_image(
        profile: &mut UserProfile,
        image_url: String,
        ctx: &mut TxContext
    ) {
        // Only the owner can update the profile picture
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);

        profile.image_url = image_url;

        // Emit the event
        event::emit(ProfileImageUpdated {
            profile_id: object::uid_to_address(&profile.id),
            image_url,
        });
    }

    // ============ Link CRUD Functions ============

    /// Create a new link (as Dynamic Field)
    entry fun add_link(
        profile: &mut UserProfile,
        title: String,
        url: String,
        icon: String,
        banner: String,
        ctx: &mut TxContext
    ) {
        // Only the owner can create a link
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

        // Use as Dynamic Field
        df::add(&mut profile.id, LinkKey { id: link_id }, link);
        
        // Add the Link ID to the vector
        vector::push_back(&mut profile.link_ids, link_id);
        
        // Update counters
        profile.next_link_id = profile.next_link_id + 1;
        profile.link_count = profile.link_count + 1;

        // Emit the event
        event::emit(LinkAdded {
            profile_id: object::uid_to_address(&profile.id),
            link_id,
            title,
            url,
        });
    }

    /// Update a link
    entry fun update_link(
        profile: &mut UserProfile,
        link_id: u64,
        title: String,
        url: String,
        icon: String,
        banner: String,
        ctx: &mut TxContext
    ) {
        // Only the owner can update the link
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);

        // Retrieve the link from the dynamic field
        let link_key = LinkKey { id: link_id };
        assert!(df::exists_(&profile.id, link_key), ELinkNotFound);

        let link = df::borrow_mut<LinkKey, Link>(&mut profile.id, link_key);
        
        // Update
        link.title = title;
        link.url = url;
        link.icon = icon;
        link.banner = banner;

        // Emit the event
        event::emit(LinkUpdated {
            profile_id: object::uid_to_address(&profile.id),
            link_id,
            title,
        });
    }

    /// Delete a link
    entry fun delete_link(
        profile: &mut UserProfile,
        link_id: u64,
        ctx: &mut TxContext
    ) {
        // Only the owner can delete the link
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);

        let link_key = LinkKey { id: link_id };
        assert!(df::exists_(&profile.id, link_key), ELinkNotFound);

        // Delete it from the dynamic field
        let _link = df::remove<LinkKey, Link>(&mut profile.id, link_key);

        // Remove the link_id from the vector
        let (exists, index) = vector::index_of(&profile.link_ids, &link_id);
        if (exists) {
            vector::remove(&mut profile.link_ids, index);
            profile.link_count = profile.link_count - 1;
        };

        // Emit the event
        event::emit(LinkDeleted {
            profile_id: object::uid_to_address(&profile.id),
            link_id,
        });
    }

    /// Toggle a link on/off
    entry fun toggle_link(
        profile: &mut UserProfile,
        link_id: u64,
        is_active: bool,
        ctx: &mut TxContext
    ) {
        // Only the owner can toggle a link
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);

        let link_key = LinkKey { id: link_id };
        assert!(df::exists_(&profile.id, link_key), ELinkNotFound);

        let link = df::borrow_mut<LinkKey, Link>(&mut profile.id, link_key);
        link.is_active = is_active;
    }

    /// Reorder the link
    entry fun reorder_link(
        profile: &mut UserProfile,
        link_id: u64,
        new_order: u64,
        ctx: &mut TxContext
    ) {
        // Only the owner can reorder the link
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);

        let link_key = LinkKey { id: link_id };
        assert!(df::exists_(&profile.id, link_key), ELinkNotFound);

        let link = df::borrow_mut<LinkKey, Link>(&mut profile.id, link_key);
        link.order = new_order;
    }

    // ============ View Functions (Getters) ============

    /// Get the profile owner
    public fun get_owner(profile: &UserProfile): address {
        profile.owner
    }

    /// Get the Link ID list
    public fun get_link_ids(profile: &UserProfile): &vector<u64> {
        &profile.link_ids
    }

    /// Get link count
    public fun get_link_count(profile: &UserProfile): u64 {
        profile.link_count
    }

    /// Get a single link (readonly)
    public fun get_link(profile: &UserProfile, link_id: u64): &Link {
        let link_key = LinkKey { id: link_id };
        df::borrow<LinkKey, Link>(&profile.id, link_key)
    }

    /// Check if a link exists
    public fun link_exists(profile: &UserProfile, link_id: u64): bool {
        df::exists_(&profile.id, LinkKey { id: link_id })
    }

    /// Get image url
    public fun get_image_url(profile: &UserProfile): &String {
        &profile.image_url
    }

    /// Get the username
    public fun get_username(profile: &UserProfile): &String {
        &profile.username
    }

    /// Get the display name
    public fun get_display_name(profile: &UserProfile): &String {
        &profile.display_name
    }

    /// Get the biography
    public fun get_bio(profile: &UserProfile): &String {
        &profile.bio
    }

}
