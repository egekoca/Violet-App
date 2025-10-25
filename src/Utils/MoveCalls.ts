/**
 * Blockchain Functions
 * Frontend SDK wrapper
 */

import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { RPC_URL, TESTNET_PACKAGE_ID, MODULE_NAME } from '../constants';

// Type alias for compatibility
export type { Transaction };

// Sui Client
export const suiClient = new SuiClient({ url: RPC_URL });

// Types
export interface CreateProfileInput {
  username: string;
  display_name: string;
  bio: string;
}

export interface AddLinkInput {
  profileId: string;
  title: string;
  url: string;
  icon: string;
}

export interface UpdateProfileInput {
  profileId: string;
  display_name: string;
  bio: string;
}

/**
 * Profile creation transaction
 */
export function createProfileTransaction(input: CreateProfileInput): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${TESTNET_PACKAGE_ID}::${MODULE_NAME}::create_profile`,
    arguments: [
      tx.pure.string(input.username),
      tx.pure.string(input.display_name),
      tx.pure.string(input.bio),
    ],
  });

  return tx;
}

/**
 * Add link transaction
 */
export function addLinkTransaction(input: AddLinkInput): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${TESTNET_PACKAGE_ID}::${MODULE_NAME}::add_link`,
    arguments: [
      tx.object(input.profileId),
      tx.pure.string(input.title),
      tx.pure.string(input.url),
      tx.pure.string(input.icon),
    ],
  });

  return tx;
}

/**
 * Update profile transaction
 */
export function updateProfileTransaction(input: UpdateProfileInput): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${TESTNET_PACKAGE_ID}::${MODULE_NAME}::update_profile`,
    arguments: [
      tx.object(input.profileId),
      tx.pure.string(input.display_name),
      tx.pure.string(input.bio),
    ],
  });

  return tx;
}

/**
 * Get user profile data
 */
export async function getUserProfile(profileId: string) {
  try {
    const object = await suiClient.getObject({
      id: profileId,
      options: {
        showContent: true,
        showOwner: true,
      },
    });

    if (!object.data || object.data.content?.dataType !== 'moveObject') {
      return null;
    }

    const fields = object.data.content.fields as any;
    const owner = object.data.owner && typeof object.data.owner === 'object' && 'AddressOwner' in object.data.owner
      ? object.data.owner.AddressOwner
      : '';

    // Fix Links: From the {type, fields} format to {title, url, icon, is_active} format
    const links = Array.isArray(fields.links)
      ? fields.links.map((link: any) => {
          if (link.fields) {
            return {
              title: link.fields.title,
              url: link.fields.url,
              icon: link.fields.icon,
              is_active: link.fields.is_active,
            };
          }
          return link;
        })
      : [];

    return {
      id: profileId,
      owner,
      username: fields.username,
      display_name: fields.display_name,
      bio: fields.bio,
      links: links,
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

/**
 * Get all profiles belonging to an user
 */
export async function getUserProfiles(ownerAddress: string) {
  try {
    console.log('Called getUserProfiles:', {
      ownerAddress,
      packageId: TESTNET_PACKAGE_ID,
      structType: `${TESTNET_PACKAGE_ID}::${MODULE_NAME}::UserProfile`
    });

    const objects = await suiClient.getOwnedObjects({
      owner: ownerAddress,
      filter: {
        StructType: `${TESTNET_PACKAGE_ID}::${MODULE_NAME}::UserProfile`,
      },
      options: {
        showContent: true,
        showOwner: true,
        showType: true,
      },
    });

    console.log('Found objects:', {
      count: objects.data.length,
      objects: objects.data
    });

    const profiles = [];

    for (const obj of objects.data) {
      console.log('Inspecting the object: ', {
        objectId: obj.data?.objectId,
        dataType: obj.data?.content?.dataType,
        fields: obj.data?.content
      });

      if (obj.data?.content?.dataType === 'moveObject') {
        const fields = obj.data.content.fields as any;

        console.log('Profile fields:', fields);
        console.log('Links (raw):', fields.links);

        // Fix Links: From the {type, fields} format to the {title, url, icon, is_active} format
        const links = Array.isArray(fields.links)
          ? fields.links.map((link: any) => {
              // If link.fields exists (blockchain format), return according to that
              if (link.fields) {
                return {
                  title: link.fields.title,
                  url: link.fields.url,
                  icon: link.fields.icon,
                  is_active: link.fields.is_active,
                };
              }
              // If it's an object (which is the correct format), return it as it is
              return link;
            })
          : [];

        console.log('🔗 Links (parsed):', links);

        profiles.push({
          id: obj.data.objectId,
          owner: ownerAddress,
          username: fields.username,
          display_name: fields.display_name,
          bio: fields.bio,
          links: links,
        });
      }
    }

    console.log('Total profile count:', profiles.length);
    console.log('Profiles:', profiles);

    return profiles;
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    return [];
  }
}

/**
 * Search profile according to the Username (EVENT-BASED SOLUTION)
 * NOTE: It uses the ProfileCreated events to search a profile
 * TODO: Add Username Registry to Move contract for production (with Dynamic Fields)
 */
export async function getProfileByUsername(username: string) {
  try {
    console.log('Searching user:', username);

    // Query the ProfileCreated events
    const events = await suiClient.queryEvents({
      query: {
        MoveEventType: `${TESTNET_PACKAGE_ID}::${MODULE_NAME}::ProfileCreated`,
      },
      limit: 50, // Check the latest 50 profiles
    });

    console.log('The number of profiles found:', events.data.length);

    // Match usernames
    for (const event of events.data) {
      const eventData = event.parsedJson as any;

      if (eventData && eventData.username === username) {
        console.log('Found event: ', eventData);
        
        // Retrieve the profile ID from the event data
        const profileId = eventData.profile_id;

        // Fetch the profile data
        const profile = await getUserProfile(profileId);

        if (profile) {
          console.log('Fetched the profile data:', profile);
          return profile;
        }
      }
    }

    console.log('Couldn\'t find the user: ', username);
    return null;
  } catch (error) {
    console.error('Error searching profile by username:', error);
    return null;
  }
}
