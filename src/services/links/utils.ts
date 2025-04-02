
// Utility functions for links

/**
 * Generate a random alias for short URLs
 * @param length The length of the random alias (default: 7)
 * @returns A random alphanumeric string
 */
export const generateRandomAlias = (length = 7) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Format a URL for display by removing protocol and trailing slashes
 * @param url The URL to format
 * @returns Formatted URL string
 */
export const formatUrlForDisplay = (url: string) => {
  try {
    const urlObj = new URL(url);
    let result = urlObj.host + urlObj.pathname;
    // Remove trailing slash if it exists
    if (result.endsWith('/')) {
      result = result.slice(0, -1);
    }
    return result;
  } catch (error) {
    // If URL parsing fails, return the original
    return url;
  }
};

/**
 * Truncate text with ellipsis if longer than maxLength
 * @param text Text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get favicon URL for a domain
 * @param url The URL to get favicon for
 * @returns Google favicon service URL
 */
export const getFaviconUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
  } catch (error) {
    // Default favicon if URL parsing fails
    return `https://www.google.com/s2/favicons?sz=64&domain_url=example.com`;
  }
};

/**
 * Extract domain name from URL
 * @param url The URL to extract domain from
 * @returns Domain name
 */
export const getDomainFromUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return 'unknown';
  }
};

/**
 * Format a short URL to ti.dy format
 * @param shortUrl The full short URL 
 * @returns Formatted ti.dy URL
 */
export const formatTidyUrl = (shortUrl: string) => {
  try {
    const path = new URL(shortUrl).pathname;
    return `ti.dy${path}`;
  } catch {
    return shortUrl;
  }
};
