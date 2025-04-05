
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface ManualEmailInputProps {
  onAddEmails: (emails: string[]) => void;
  parseEmails: (input: string) => string[];
  validateEmails: (emails: string[]) => string[];
}

const ManualEmailInput: React.FC<ManualEmailInputProps> = ({
  onAddEmails,
  parseEmails,
  validateEmails
}) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleAddEmails = () => {
    if (!inputValue.trim()) return;
    
    // Parse emails and filter out duplicates
    const newEmails = parseEmails(inputValue);
    const validEmails = validateEmails(newEmails);
    
    if (validEmails.length === 0) {
      setErrorMessage('No valid emails found');
      return;
    }
    
    // Update with valid emails
    onAddEmails(validEmails);
    setInputValue('');
    setErrorMessage(null);
  };
  
  return (
    <div className="border-t border-b py-4 my-4">
      <h3 className="mb-2 font-medium flex items-center">
        <Users className="h-4 w-4 mr-2" /> Manually Add Recipients
      </h3>
      <div className="space-y-2">
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter email addresses (separated by commas, spaces or new lines)"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
        />
        <div className="flex justify-between items-center">
          <div>
            {errorMessage && (
              <p className="text-red-500 text-xs">{errorMessage}</p>
            )}
          </div>
          <Button 
            type="button" 
            onClick={handleAddEmails} 
            size="sm"
            className="bg-brand-blue hover:bg-brand-blue/90"
          >
            Add Emails
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManualEmailInput;
