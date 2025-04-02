
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
