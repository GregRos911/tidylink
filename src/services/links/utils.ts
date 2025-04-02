
// Utility functions for links

/**
 * Generate a random alias for short URLs
 * @param length The length of the random alias (default: 7)
 * @returns A random alphanumeric string
 */
export const generateRandomAlias = (length = 7) => {
  // Use characters that are unlikely to cause confusion or spelling issues
  // Exclude: 0, O, 1, I, l to avoid confusion
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let result = '';
  
  // Use crypto.getRandomValues for better randomness when available
  if (window.crypto && window.crypto.getRandomValues) {
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(values[i] % chars.length);
    }
  } else {
    // Fallback to Math.random if crypto API is not available
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  
  return result;
};

/**
 * Format a URL to display in the ti.dy format
 * @param url The full URL to format
 * @returns The formatted URL in ti.dy format
 */
export const formatTidyUrl = (url: string): string => {
  try {
    // Extract the path part from the full URL
    const urlObj = new URL(url);
    const path = urlObj.pathname.split('/').pop();
    
    return `ti.dy/${path}`;
  } catch (error) {
    console.error('Error formatting URL:', error);
    return url;
  }
};
