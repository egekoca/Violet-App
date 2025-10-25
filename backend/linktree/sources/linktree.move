module linktree::linktree {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use std::string::String;
    use std::vector;

    // ============ Events ============

    /// Emitted when a profile has been created
    public struct ProfileCreated has copy, drop {
        profile_id: address,
        owner: address,
        username: String,
    }

    /// Emitted when a link has been added
    public struct LinkAdded has copy, drop {
        profile_id: address,
        title: String,
        url: String,
    }

    /// Emitted when a profile has been updated
    public struct ProfileUpdated has copy, drop {
        profile_id: address,
        display_name: String,
    }

    // ============ Structs ============

    /// Singular link data
    public struct Link has store, copy, drop {
        title: String,      // "Instagram"
        url: String,        // "https://instagram.com/..."
        icon: String,       // "📸"
        is_active: bool,    // true/false
    }

    /// User profile - an object stored on the blockchain
    public struct UserProfile has key, store {
        id: UID,
        owner: address,         // Profil sahibi
        username: String,       // "ahmet123"
        display_name: String,   // "Ahmet Yılmaz"
        bio: String,           // "Tüm linklerim burada 🚀"
        links: vector<Link>,   // Link listesi
    }

    // ============ Functions ============

    /// Create a new profile
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

        // Emit an event
        event::emit(ProfileCreated {
            profile_id: profile_addr,
            owner: sender,
            username: username,
        });

        // Transfer the ownership of the profile to the user (owned object)
        transfer::transfer(profile, sender);
    }

    /// Add a new link to a profile
    public entry fun add_link(
        profile: &mut UserProfile,
        title: String,
        url: String,
        icon: String,
        ctx: &mut TxContext
    ) {
        // Only an owner can add a link
        assert!(profile.owner == tx_context::sender(ctx), 0);

        let link = Link {
            title: title,
            url: url,
            icon,
            is_active: true,
        };

        vector::push_back(&mut profile.links, link);

        // Emit an event
        event::emit(LinkAdded {
            profile_id: object::uid_to_address(&profile.id),
            title: title,
            url: url,
        });
    }

    /// Update profile data
    public entry fun update_profile(
        profile: &mut UserProfile,
        display_name: String,
        bio: String,
        ctx: &mut TxContext
    ) {
        // Only owner
        assert!(profile.owner == tx_context::sender(ctx), 0);

        profile.display_name = display_name;
        profile.bio = bio;

        // Emit event
        event::emit(ProfileUpdated {
            profile_id: object::uid_to_address(&profile.id),
            display_name: display_name,
        });
    }

    // ============ View Functions (Getters) ============

    /// Return profile links
    public fun get_links(profile: &UserProfile): &vector<Link> {
        &profile.links
    }

    /// Return the owner of a profile
    public fun get_owner(profile: &UserProfile): address {
        profile.owner
    }

    /// Return the link count
    public fun get_link_count(profile: &UserProfile): u64 {
        vector::length(&profile.links)
    }
}