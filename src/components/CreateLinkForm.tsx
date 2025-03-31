
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, AlertTriangle } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { toast } from 'sonner';
import { useUserUsage, FREE_PLAN_LIMITS } from '@/services/usageService';
import { useCreateLink } from '@/services/linkService';

const CreateLinkForm: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { data: usageData, isLoading: isUsageLoading } = useUserUsage();
  const createLink = useCreateLink();
  
  // Form states
  const [destination, setDestination] = useState('');
  const [title, setTitle] = useState('');
  const [customBackhalf, setCustomBackhalf] = useState('');
  const [generateQR, setGenerateQR] = useState(false);
  
  // Usage calculations
  const linksUsed = usageData?.links_used || 0;
  const qrCodesUsed = usageData?.qr_codes_used || 0;
  const customBackhalvesUsed = usageData?.custom_backhalves_used || 0;

  const linksRemaining = Math.max(0, FREE_PLAN_LIMITS.links - linksUsed);
  const qrCodesRemaining = Math.max(0, FREE_PLAN_LIMITS.qrCodes - qrCodesUsed);
  const customBackhalvesRemaining = Math.max(0, FREE_PLAN_LIMITS.customBackHalves - customBackhalvesUsed);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL
    if (!destination) {
      toast.error('Please enter a destination URL');
      return;
    }
    
    if (!destination.match(/^(http|https):\/\/[^ "]+$/)) {
      toast.error('Please enter a valid URL including http:// or https://');
      return;
    }
    
    // Check limits
    if (linksRemaining <= 0) {
      toast.error('You\'ve reached your monthly limit for short links. Please upgrade for more.');
      return;
    }
    
    if (customBackhalf && customBackhalvesRemaining <= 0) {
      toast.error('You\'ve reached your monthly limit for custom back-halves. Please upgrade for more.');
      return;
    }
    
    if (generateQR && qrCodesRemaining <= 0) {
      toast.error('You\'ve reached your monthly limit for QR codes. Please upgrade for more.');
      return;
    }
    
    try {
      // Create link
      const newLink = await createLink.mutateAsync({
        originalUrl: destination,
        customBackhalf: customBackhalf || undefined,
        title: title || undefined
      });
      
      toast.success('Link created successfully!');
      
      // Add QR code logic here if needed
      
      // Redirect to links page
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create link');
      console.error('Error creating link:', error);
    }
  };

  const navigateToPricing = () => {
    navigate('/pricing');
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Link2 className="mr-2 h-5 w-5 text-primary" />
          Create a short link
        </CardTitle>
        <CardDescription>
          Turn a long URL into a short, memorable link
        </CardDescription>
      </CardHeader>
      
      {/* Usage limits section */}
      {!isUsageLoading && (
        <div className="px-6 mb-2">
          <div className="bg-muted p-3 rounded-md space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span>You can create {linksRemaining} more links this month.</span>
              <Button 
                variant="link" 
                size="sm" 
                className="text-primary p-0 h-auto"
                onClick={navigateToPricing}
              >
                Upgrade for more
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <span>You can create {customBackhalvesRemaining} more custom back-halves this month.</span>
              <Button 
                variant="link" 
                size="sm" 
                className="text-primary p-0 h-auto"
                onClick={navigateToPricing}
              >
                Upgrade for more
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <span>{qrCodesRemaining} QR codes left.</span>
              <Button 
                variant="link" 
                size="sm" 
                className="text-primary p-0 h-auto"
                onClick={navigateToPricing}
              >
                Upgrade for more
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Destination URL */}
          <FormItem>
            <FormLabel>Destination</FormLabel>
            <FormControl>
              <Input
                type="url"
                placeholder="https://example.com/my-long-url"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </FormControl>
            <FormDescription>
              Enter the long URL you want to shorten
            </FormDescription>
          </FormItem>
          
          {/* Title (optional) */}
          <FormItem>
            <FormLabel>Title (optional)</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="My awesome link"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <FormDescription>
              Add a title to help organize your links
            </FormDescription>
          </FormItem>
          
          {/* Short link customization */}
          <FormItem>
            <FormLabel>Short Link</FormLabel>
            <div className="flex space-x-2">
              <div className="flex-shrink-0 w-1/3">
                <Input
                  value="tidy.link"
                  disabled
                  className="bg-muted text-muted-foreground"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="custom-back-half"
                  value={customBackhalf}
                  onChange={(e) => setCustomBackhalf(e.target.value)}
                  disabled={customBackhalvesRemaining <= 0}
                />
              </div>
            </div>
            <FormDescription>
              {customBackhalvesRemaining <= 0 ? (
                <span className="flex items-center text-destructive">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  You've reached your custom back-half limit
                </span>
              ) : (
                "Customize the end of your short URL (optional)"
              )}
            </FormDescription>
          </FormItem>
          
          {/* QR Code toggle */}
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Generate QR Code</FormLabel>
              <FormDescription>
                Create a QR code for this short link
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={generateQR}
                onCheckedChange={setGenerateQR}
                disabled={qrCodesRemaining <= 0}
              />
            </FormControl>
          </FormItem>
          
          {/* Submit button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink hover:opacity-90 transition-opacity"
            disabled={createLink.isPending || isUsageLoading}
          >
            {createLink.isPending ? 'Creating...' : 'Create Link'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateLinkForm;
