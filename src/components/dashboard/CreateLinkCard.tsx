
import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useUserUsage, FREE_PLAN_LIMITS } from '@/services/usage';
import { useCreateLink } from '@/services/links';
import LinkSuccessModal from '../link/LinkSuccessModal';

// Import our new components
import UsageLimitInfo from './link-form/UsageLimitInfo';
import DestinationUrlInput from './link-form/DestinationUrlInput';
import TitleInput from './link-form/TitleInput';
import ShortLinkSection from './link-form/ShortLinkSection';
import SharingOptions from './link-form/SharingOptions';

const CreateLinkCard = () => {
  const { user } = useUser();
  const { data: usageData, isLoading: isLoadingUsage } = useUserUsage();
  const createLinkMutation = useCreateLink();
  
  // Modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Form state
  const [destinationUrl, setDestinationUrl] = useState('');
  const [title, setTitle] = useState('');
  const [customBackHalf, setCustomBackHalf] = useState('');
  const [generateQrCode, setGenerateQrCode] = useState(false);
  
  // Derived state for remaining usage limits
  const remainingLinks = usageData 
    ? FREE_PLAN_LIMITS.links - (usageData.links_used || 0)
    : 0;
  
  const remainingCustomBackHalves = usageData 
    ? FREE_PLAN_LIMITS.customBackHalves - (usageData.custom_backhalves_used || 0) 
    : 0;
  
  const remainingQrCodes = usageData 
    ? FREE_PLAN_LIMITS.qrCodes - (usageData.qr_codes_used || 0)
    : 0;
  
  // Validation
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const canCreateLink = remainingLinks > 0;
  const canUseCustomBackHalf = remainingCustomBackHalves > 0;
  const canGenerateQrCode = remainingQrCodes > 0;
  
  const isFormValid = destinationUrl && isValidUrl(destinationUrl);
  const isFormDisabled = !canCreateLink || createLinkMutation.isPending;
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to create links");
      return;
    }
    
    if (!isFormValid) {
      toast.error("Please enter a valid destination URL");
      return;
    }
    
    if (!canCreateLink) {
      toast.error("You've reached your monthly limit for short links");
      return;
    }
    
    if (customBackHalf && !canUseCustomBackHalf) {
      toast.error("You've reached your monthly limit for custom back-halves");
      return;
    }
    
    if (generateQrCode && !canGenerateQrCode) {
      toast.error("You've reached your monthly limit for QR codes");
      return;
    }
    
    try {
      await createLinkMutation.mutateAsync({ 
        originalUrl: destinationUrl,
        customBackhalf: customBackHalf || undefined,
        generateQrCode
      });
      
      // Open success modal
      setShowSuccessModal(true);
      
      // Reset form
      setDestinationUrl('');
      setTitle('');
      setCustomBackHalf('');
      setGenerateQrCode(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create link");
    }
  };
  
  // Handle modal close
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    createLinkMutation.clearCreatedLink();
  };
  
  if (isLoadingUsage) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </Card>
    );
  }
  
  return (
    <>
      <Card className="p-6">
        <UsageLimitInfo remainingLinks={remainingLinks} />
        
        <form onSubmit={handleSubmit}>
          {/* Destination URL */}
          <DestinationUrlInput 
            destinationUrl={destinationUrl}
            setDestinationUrl={setDestinationUrl}
          />
          
          {/* Title (optional) */}
          <TitleInput 
            title={title}
            setTitle={setTitle}
          />
          
          {/* Short link section */}
          <ShortLinkSection 
            customBackHalf={customBackHalf}
            setCustomBackHalf={setCustomBackHalf}
            canUseCustomBackHalf={canUseCustomBackHalf}
            remainingCustomBackHalves={remainingCustomBackHalves}
          />
          
          {/* Ways to share */}
          <SharingOptions 
            generateQrCode={generateQrCode}
            setGenerateQrCode={setGenerateQrCode}
            remainingQrCodes={remainingQrCodes}
            canGenerateQrCode={canGenerateQrCode}
          />
          
          {/* Submit button */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={isFormDisabled}
          >
            {createLinkMutation.isPending ? 'Creating...' : 'Create link'}
          </Button>
        </form>
      </Card>
      
      {/* Success Modal */}
      {createLinkMutation.createdLink && (
        <LinkSuccessModal
          isOpen={showSuccessModal}
          onClose={handleCloseSuccessModal}
          shortUrl={createLinkMutation.createdLink.short_url}
          linkId={createLinkMutation.createdLink.id}
        />
      )}
    </>
  );
};

export default CreateLinkCard;
