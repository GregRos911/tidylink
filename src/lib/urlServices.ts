
import { v4 as uuidv4 } from 'uuid';
import { generateRandomAlias, getBaseUrl } from './utils/urlUtils';
import { LinkItem } from './types/linkTypes';
import {
  getLinksFromStorage,
  saveLinksToStorage,
  isAliasInUseInStorage,
  getLinkFromStorage,
  incrementClickCountInStorage,
  deleteLinkFromStorage
} from './storage/localStorageService';
import {
  isAliasInUseInSupabase,
  getLinkFromSupabase,
  incrementClickCountInSupabase,
  getLinksFromSupabase,
  deleteLinkFromSupabase
} from './storage/supabaseService';

// Check if an alias is already in use (both Supabase and localStorage)
const isAliasInUse = async (alias: string): Promise<boolean> => {
  // First check Supabase for authenticated users
  const inSupabase = await isAliasInUseInSupabase(alias);
  if (inSupabase) return true;
  
  // Then check localStorage for non-authenticated users
  return isAliasInUseInStorage(alias);
};

export const urlServices = {
  // Shorten a URL
  shortenUrl: async (originalUrl: string, customAlias?: string): Promise<string> => {
    // Generate a unique ID and alias for the link
    const id = customAlias || generateRandomAlias();
    
    // Check if custom alias is already in use
    if (customAlias && await isAliasInUse(customAlias)) {
      throw new Error('This custom alias is already in use. Please choose another one.');
    }
    
    // Create the short URL
    const shortUrl = `${getBaseUrl()}/r/${id}`;
    
    // Create a new link item
    const newLink: LinkItem = {
      id: uuidv4(), // Unique identifier for the link
      originalUrl,
      shortUrl,
      createdAt: new Date().toISOString(),
      clicks: 0
    };
    
    // Get existing links
    const existingLinks = getLinksFromStorage();
    
    // Add the new link to the beginning of the array
    const updatedLinks = [newLink, ...existingLinks];
    
    // Save to localStorage
    saveLinksToStorage(updatedLinks);
    
    // Return the short URL
    return shortUrl;
  },
  
  // Get a link by its ID
  getLink: async (id: string): Promise<LinkItem | null> => {
    // First check Supabase for authenticated users
    const supabaseLink = await getLinkFromSupabase(id);
    if (supabaseLink) return supabaseLink;
    
    // Then check localStorage for non-authenticated users
    return getLinkFromStorage(id);
  },
  
  // Increment click count for a link
  incrementClickCount: async (id: string): Promise<void> => {
    // First try to increment in Supabase for authenticated users
    await incrementClickCountInSupabase(id);
    
    // Then try to increment in localStorage for non-authenticated users
    incrementClickCountInStorage(id);
  },
  
  // Get all links for history
  getLinkHistory: async (): Promise<LinkItem[]> => {
    // For authenticated users, merge links from Supabase and localStorage
    const supabaseLinks = await getLinksFromSupabase();
    
    if (supabaseLinks.length > 0) {
      // Return links from Supabase if available
      return supabaseLinks;
    }
    
    // Fallback to localStorage for non-authenticated users
    return getLinksFromStorage();
  },
  
  // Delete a link
  deleteLink: async (id: string): Promise<void> => {
    // First try to delete from Supabase for authenticated users
    await deleteLinkFromSupabase(id);
    
    // Then try to delete from localStorage for non-authenticated users
    deleteLinkFromStorage(id);
  }
};
