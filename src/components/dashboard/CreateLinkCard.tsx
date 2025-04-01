
import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useUserUsage, FREE_PLAN_LIMITS } from '@/services/usageService';
import { useCreateLink, LinkData } from '@/services/linkService';
import { Lock } from 'lucide-react';
import LinkSuccessModal from './LinkSuccessModal';

const CreateLinkCard = () => {
  const { user } = useUser();
  const { data: usageData, isLoading: isLoadingUsage } = useUserUsage();
  const createLinkMutation = useCreateLink();
  
  // Form state
  const [destinationUrl, setDestinationUrl] = useState('');
  const [title, setTitle] = useState('');
  const [customBackHalf, setCustomBackHalf] = useState('');
  const [generateQrCode, setGenerateQrCode] = useState(false);
  
  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdLink, setCreatedLink] = useState<LinkData | null>(null);
  
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
      const newLink = await createLinkMutation.mutateAsync({ 
        originalUrl: destinationUrl,
        customBackhalf: customBackHalf || undefined,
        title: title || undefined,
        generateQrCode
      });
      
      // Store the created link for the success modal
      setCreatedLink(newLink);
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
        <div className="mb-4">
          <p className="text-gray-700">
            You can create <span className="font-semibold">{remainingLinks}</span> more links this month.{' '}
            <Link to="/pricing" className="text-brand-blue hover:underline">
              Upgrade for more
            </Link>.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Destination URL */}
          <div className="mb-4">
            <Label htmlFor="destination" className="block mb-2 font-medium">
              Destination
            </Label>
            <Input
              id="destination"
              placeholder="https://example.com/my-long-url"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              className="w-full"
              required
            />
          </div>
          
          {/* Title (optional) */}
          <div className="mb-6">
            <Label htmlFor="title" className="block mb-2 font-medium">
              Title <span className="text-gray-500 font-normal">(optional)</span>
            </Label>
            <Input
              id="title"
              placeholder="My awesome link"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>
          
          {/* Short link section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Short link</h3>
            
            <div className="flex items-center gap-2 mb-4">
              {/* Domain (locked) */}
              <div className="w-1/2">
                <Label htmlFor="domain" className="block mb-2 font-medium flex items-center">
                  Domain <Lock className="w-4 h-4 ml-1 text-gray-500" />
                </Label>
                <div className="relative">
                  <Input
                    id="domain"
                    value="tidy.link"
                    readOnly
                    className="w-full bg-gray-50"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="text-gray-500"
                    >
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center mt-6">
                <span className="text-gray-500 text-xl">/</span>
              </div>
              
              {/* Custom back-half */}
              <div className="w-1/2">
                <Label htmlFor="backhalf" className="block mb-2 font-medium">
                  Custom back-half <span className="text-gray-500 font-normal">(optional)</span>
                </Label>
                <Input
                  id="backhalf"
                  placeholder="my-brand"
                  value={customBackHalf}
                  onChange={(e) => setCustomBackHalf(e.target.value)}
                  className="w-full"
                  disabled={!canUseCustomBackHalf}
                />
              </div>
            </div>
            
            <p className="text-gray-700 text-sm">
              You can create <span className="font-semibold">{remainingCustomBackHalves}</span> more custom back-halves this month.{' '}
              <Link to="/pricing" className="text-brand-blue hover:underline">
                Upgrade for more
              </Link>.
            </p>
          </div>
          
          {/* Ways to share */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Ways to share</h3>
            
            {/* QR Code toggle */}
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h4 className="font-medium">QR Code</h4>
                <p className="text-sm text-gray-600">
                  Generate a QR Code to share anywhere people can see it
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{remainingQrCodes} left</span>
                <Switch
                  checked={generateQrCode}
                  onCheckedChange={setGenerateQrCode}
                  disabled={!canGenerateQrCode}
                />
              </div>
            </div>
            
            {/* TidyLink Page toggle (optional/future feature) */}
            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium">TidyLink Page</h4>
                <p className="text-sm text-gray-600">
                  Add this link to your page for people to easily find
                </p>
              </div>
              <Switch disabled />
            </div>
          </div>
          
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
      <LinkSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        link={createdLink}
      />
    </>
  );
};

export default CreateLinkCard;
