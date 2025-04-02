
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
