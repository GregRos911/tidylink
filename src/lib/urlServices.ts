
import { v4 as uuidv4 } from 'uuid';

export interface LinkItem {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
}

// For simplicity, we'll use localStorage to store link data
const LOCAL_STORAGE_KEY = 'linky_shortened_urls';
const BASE_URL = window.location.origin;

// Generate a random alphanumeric string for short URLs
const generateRandomAlias = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Check if an alias is already in use
const isAliasInUse = (alias: string): boolean => {
  const links = getLinksFromStorage();
  return links.some(link => {
    const path = new URL(link.shortUrl).pathname.slice(1);
    return path === alias;
  });
};

// Get all links from localStorage
const getLinksFromStorage = (): LinkItem[] => {
  const storedLinks = localStorage.getItem(LOCAL_STORAGE_KEY);
  return storedLinks ? JSON.parse(storedLinks) : [];
};

// Save links to localStorage
const saveLinksToStorage = (links: LinkItem[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(links));
};

// Create a redirect page for the short URL
const createRedirectPage = (originalUrl: string, id: string): string => {
  // In a real implementation, this would create a server-side redirect
  // For this demo, we'll use a client-side redirect using the ID as the path
  return `${BASE_URL}/r/${id}`;
};

export const urlServices = {
  // Shorten a URL
  shortenUrl: async (originalUrl: string, customAlias?: string): Promise<string> => {
    // Generate a unique ID and alias for the link
    const id = customAlias || generateRandomAlias();
    
    // Check if custom alias is already in use
    if (customAlias && isAliasInUse(customAlias)) {
      throw new Error('This custom alias is already in use. Please choose another one.');
    }
    
    // Create the short URL
    const shortUrl = `${BASE_URL}/r/${id}`;
    
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
    const links = getLinksFromStorage();
    const link = links.find(link => {
      const path = new URL(link.shortUrl).pathname.slice(3); // Remove '/r/'
      return path === id;
    });
    
    return link || null;
  },
  
  // Increment click count for a link
  incrementClickCount: async (id: string): Promise<void> => {
    const links = getLinksFromStorage();
    const updatedLinks = links.map(link => {
      const path = new URL(link.shortUrl).pathname.slice(3); // Remove '/r/'
      if (path === id) {
        return { ...link, clicks: link.clicks + 1 };
      }
      return link;
    });
    
    saveLinksToStorage(updatedLinks);
  },
  
  // Get all links for history
  getLinkHistory: async (): Promise<LinkItem[]> => {
    return getLinksFromStorage();
  },
  
  // Delete a link
  deleteLink: async (id: string): Promise<void> => {
    const links = getLinksFromStorage();
    const updatedLinks = links.filter(link => link.id !== id);
    saveLinksToStorage(updatedLinks);
  }
};
