
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CampaignData } from '../CampaignComposer';
import { Campaign } from '@/services/campaigns/types';
import { 
  AlertCircle, 
  FileUp, 
  Users, 
  X, 
  Check, 
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RecipientsStepProps {
  campaignData: CampaignData;
  updateCampaignData: (data: Partial<CampaignData>) => void;
  campaign: Campaign;
}

const RecipientsStep: React.FC<RecipientsStepProps> = ({
  campaignData,
  updateCampaignData
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Handle manual email input
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
    
    // Check for duplicates
    const uniqueEmails = [...new Set([...campaignData.recipients, ...validEmails])];
    if (uniqueEmails.length > 500) {
      setErrorMessage('Maximum 500 recipients allowed');
      return;
    }
    
    // Update campaign data with unique emails
    updateCampaignData({ recipients: uniqueEmails });
    setInputValue('');
    setErrorMessage(null);
  };
  
  const handleRemoveEmail = (email: string) => {
    const updatedRecipients = campaignData.recipients.filter(r => r !== email);
    updateCampaignData({ recipients: updatedRecipients });
  };
  
  const parseEmails = (input: string): string[] => {
    // Split by commas, semicolons, spaces, or newlines
    return input.split(/[,;\s\n]+/).filter(Boolean);
  };
  
  const validateEmails = (emails: string[]): string[] => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emails.filter(email => emailRegex.test(email));
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    // Check if file is CSV or Excel
    const isCSV = file.name.endsWith('.csv');
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    
    if (!isCSV) {
      setErrorMessage('Please upload a CSV file');
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
        
        // Validate and update
        const validEmails = validateEmails(emails);
        if (validEmails.length === 0) {
          setErrorMessage('No valid emails found in the file');
          return;
        }
        
        // Check for duplicates and limit
        const uniqueEmails = [...new Set([...campaignData.recipients, ...validEmails])];
        if (uniqueEmails.length > 500) {
          setErrorMessage('Maximum 500 recipients allowed');
          return;
        }
        
        updateCampaignData({ recipients: uniqueEmails });
        setErrorMessage(null);
        
      } catch (error) {
        console.error('Error parsing file:', error);
        setErrorMessage('Error parsing file. Please check format and try again.');
      }
    };
    
    reader.onerror = () => {
      setErrorMessage('Error reading file');
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Add Recipients</AlertTitle>
        <AlertDescription>
          Add email addresses for your campaign (max 500). You can paste emails, upload a CSV, or add them one by one.
        </AlertDescription>
      </Alert>
      
      <div
        className={`border-2 border-dashed rounded-md p-6 transition-colors ${
          isDragging ? 'border-brand-blue bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <FileUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <h3 className="text-sm font-medium mb-1">Drag and drop a CSV file</h3>
          <p className="text-xs text-gray-500 mb-4">or</p>
          <label htmlFor="csv-upload" className="cursor-pointer">
            <span className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium">
              Browse Files
            </span>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileInput}
            />
          </label>
          
          <p className="mt-2 text-xs text-gray-500">CSV file should include an email column</p>
        </div>
      </div>
      
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
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium flex items-center">
            <Check className="h-4 w-4 mr-2" /> Recipient List ({campaignData.recipients.length}/500)
          </h3>
          {campaignData.recipients.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 h-auto py-1"
              onClick={() => updateCampaignData({ recipients: [] })}
            >
              Clear All
            </Button>
          )}
        </div>
        
        {campaignData.recipients.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-md">
            <p className="text-gray-500">No recipients added yet</p>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-md p-2 max-h-[200px] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {campaignData.recipients.map((email) => (
                <div 
                  key={email}
                  className="bg-white rounded flex items-center justify-between text-sm px-3 py-2 border"
                >
                  <span className="truncate">{email}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveEmail(email)}
                    className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {campaignData.recipients.length > 0 && campaignData.recipients.length < 10 && (
          <div className="mt-2 flex items-center text-amber-500 text-xs">
            <AlertTriangle className="h-3 w-3 mr-1" />
            <span>We recommend adding at least 10 recipients for better campaign analytics</span>
          </div>
        )}
        
        <div className="mt-3 text-xs text-gray-500 flex items-start gap-2">
          <HelpCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
          <span>
            Recipients will receive personalized emails with your message and tracking link.
            We'll automatically remove duplicates and validate email formats.
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecipientsStep;
