
/**
 * Parse a string of emails into an array of unique, valid email addresses
 */
export const parseEmails = (input: string): string[] => {
  // Split by commas, semicolons, spaces, or newlines
  const parts = input.split(/[,;\s\n]+/);
  
  // Simple regex for valid emails
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Filter valid emails and remove duplicates
  return [...new Set(parts.filter(part => emailRegex.test(part.trim())))];
};
