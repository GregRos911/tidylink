
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { useCreateLink } from '@/services/links';
import { useUserUsage, FREE_PLAN_LIMITS } from '@/services/usage';
import { Link } from 'react-router-dom';

interface CreateQRLinkCardProps {
  onLinkCreated: (linkId: string) => void;
}

const CreateQRLinkCard: React.FC<CreateQRLinkCardProps> = ({ onLinkCreated }) => {
  const [destinationUrl, setDestinationUrl] = useState('');
  const [title, setTitle] = useState('');
  const createLinkMutation = useCreateLink();
  const { data: usageData, isLoading: isLoadingUsage } = useUserUsage();
  
  // Derived state for remaining usage limits
  const remainingLinks = usageData 
    ? FREE_PLAN_LIMITS.links - (usageData.links_used || 0)
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
  
  const isFormValid = destinationUrl && isValidUrl(destinationUrl);
  const isFormDisabled = remainingLinks <= 0 || createLinkMutation.isPending;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error("Please enter a valid destination URL");
      return;
    }
    
    if (remainingLinks <= 0) {
      toast.error("You've reached your monthly limit for short links");
      return;
    }
    
    try {
      const result = await createLinkMutation.mutateAsync({ 
        originalUrl: destinationUrl,
        generateQrCode: true
      });
      
      toast.success('Link created successfully');
      
      // Clear the form
      setDestinationUrl('');
      setTitle('');
      
      // Notify parent about the newly created link
      if (result && result.id) {
        onLinkCreated(result.id);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create link");
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create a New QR Code</CardTitle>
      </CardHeader>
      <CardContent>
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
          
          {/* Ways to share */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Ways to share</h3>
            
            {/* Short link toggle */}
            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium">Short link</h4>
                <p className="text-sm text-gray-600">
                  Create a link that directs users to the same destination as your QR Code
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{remainingLinks} left</span>
                <Switch checked={true} disabled />
              </div>
            </div>
          </div>
          
          {/* Submit button */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={isFormDisabled}
          >
            {createLinkMutation.isPending ? 'Creating...' : 'Create QR Code'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateQRLinkCard;
