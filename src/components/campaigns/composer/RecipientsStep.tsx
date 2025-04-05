
import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ComposerStepProps } from './types';
import FileUploadArea from './recipients-step/FileUploadArea';
import ManualEmailInput from './recipients-step/ManualEmailInput';
import RecipientList from './recipients-step/RecipientList';
import { parseEmails, validateEmails, processEmailFile } from './recipients-step/emailUtils';

const RecipientsStep: React.FC<ComposerStepProps> = ({
  campaignData,
  updateCampaignData
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Handle adding emails (from manual input or file)
  const handleAddEmails = (newEmails: string[]) => {
    // Check for limit
    const uniqueEmails = [...new Set([...campaignData.recipients, ...newEmails])];
    
    if (uniqueEmails.length > 500) {
      setErrorMessage('Maximum 500 recipients allowed');
      return;
    }
    
    // Update campaign data with unique emails
    updateCampaignData({ recipients: uniqueEmails });
    setErrorMessage(null);
  };
  
  const handleRemoveEmail = (email: string) => {
    const updatedRecipients = campaignData.recipients.filter(r => r !== email);
    updateCampaignData({ recipients: updatedRecipients });
  };
  
  const handleClearAll = () => {
    updateCampaignData({ recipients: [] });
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
      
      <FileUploadArea 
        onFileProcessed={handleAddEmails}
        onError={setErrorMessage}
        processFile={processEmailFile}
      />
      
      <ManualEmailInput 
        onAddEmails={handleAddEmails}
        parseEmails={parseEmails}
        validateEmails={validateEmails}
      />
      
      {errorMessage && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      )}
      
      <RecipientList 
        recipients={campaignData.recipients}
        onRemoveEmail={handleRemoveEmail}
        onClearAll={handleClearAll}
      />
    </div>
  );
};

export default RecipientsStep;
