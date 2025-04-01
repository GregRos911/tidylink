
import { LinkItem } from '../types/linkTypes';

// Local storage key
const LOCAL_STORAGE_KEY = 'linky_shortened_urls';

// Get all links from localStorage
export const getLinksFromStorage = (): LinkItem[] => {
  const storedLinks = localStorage.getItem(LOCAL_STORAGE_KEY);
  return storedLinks ? JSON.parse(storedLinks) : [];
};

// Save links to localStorage
export const saveLinksToStorage = (links: LinkItem[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(links));
};

// Check if an alias is already in use in localStorage
export const isAliasInUseInStorage = (alias: string): boolean => {
  const links = getLinksFromStorage();
  return links.some(link => {
    const path = new URL(link.shortUrl).pathname.slice(1);
    return path === alias;
  });
};

// Find a link by its ID in localStorage
export const getLinkFromStorage = (id: string): LinkItem | null => {
  const links = getLinksFromStorage();
  const link = links.find(link => {
    const path = new URL(link.shortUrl).pathname.slice(3); // Remove '/r/'
    return path === id;
  });
  
  return link || null;
};

// Increment click count for a link in localStorage
export const incrementClickCountInStorage = (id: string): void => {
  const links = getLinksFromStorage();
  const updatedLinks = links.map(link => {
    const path = new URL(link.shortUrl).pathname.slice(3); // Remove '/r/'
    if (path === id) {
      return { ...link, clicks: link.clicks + 1 };
    }
    return link;
  });
  
  saveLinksToStorage(updatedLinks);
};

// Delete a link from localStorage
export const deleteLinkFromStorage = (id: string): void => {
  const links = getLinksFromStorage();
  const updatedLinks = links.filter(link => link.id !== id);
  saveLinksToStorage(updatedLinks);
};
