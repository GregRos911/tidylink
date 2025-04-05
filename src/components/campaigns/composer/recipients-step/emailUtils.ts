
/**
 * Email parsing and validation utilities
 */

/**
 * Parse emails from text input
 * @param input Text containing emails separated by commas, spaces, or newlines
 */
export const parseEmails = (input: string): string[] => {
  // Split by commas, semicolons, spaces, or newlines
  return input.split(/[,;\s\n]+/).filter(Boolean);
};

/**
 * Validate email addresses
 * @param emails Array of email addresses to validate
 * @returns Array of valid email addresses
 */
export const validateEmails = (emails: string[]): string[] => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emails.filter(email => emailRegex.test(email));
};

/**
 * Process a file containing emails
 * @param file CSV file to process
 * @returns Promise with an array of valid emails
 */
export const processEmailFile = (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    // Check if file is CSV
    if (!file.name.endsWith('.csv')) {
      reject(new Error('Please upload a CSV file'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split(/\r?\n/).filter(Boolean);
        
        // Assume header row and look for email
        let emailIndex = 0;
        const headers = rows[0].toLowerCase().split(',');
        
        // Try to find an email column
        const emailColumnIdx = headers.findIndex(h => 
          h.includes('email') || h === 'email' || h === 'e-mail' || h === 'mail'
        );
        
        if (emailColumnIdx >= 0) {
          emailIndex = emailColumnIdx;
        }
        
        // Extract emails from rows
        let emails: string[] = [];
        for (let i = 1; i < rows.length; i++) {
          const cells = rows[i].split(',');
          if (cells.length > emailIndex && cells[emailIndex]) {
            emails.push(cells[emailIndex].trim());
          }
        }
        
        // Validate and resolve
        const validEmails = validateEmails(emails);
        resolve(validEmails);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsText(file);
  });
};
