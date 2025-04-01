
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { Copy, Check, Link2, QrCode } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateLink } from '@/services/linkService';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useUserUsage, FREE_PLAN_LIMITS } from '@/services/usage';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const LinkShortener: React.FC = () => {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [generateQrCode, setGenerateQrCode] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  
  const createLink = useCreateLink();
  const { data: usageData } = useUserUsage();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error('Please enter a URL to shorten');
      return;
    }
    
    if (!url.match(/^(http|https):\/\/[^ "]+$/)) {
      toast.error('Please enter a valid URL including http:// or https://');
      return;
    }
    
    // Check if user is signed in
    if (!isLoaded) {
      return; // Still loading auth state
    }
    
    if (!isSignedIn) {
      toast.error('You need to sign in to create a short link');
      navigate('/sign-in');
      return;
    }
    
    try {
      const newLink = await createLink.mutateAsync({
        originalUrl: url,
        customBackhalf: customAlias || undefined,
        generateQrCode: generateQrCode
      });
      
      setShortenedUrl(newLink.short_url);
      toast.success('Link shortened successfully!');
      
      // Navigate to the QR code page if the user opted to generate one
      if (generateQrCode) {
        navigate(`/links?id=${newLink.id}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create link');
      console.error('Error creating link:', error);
    }
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };
  
  const navigateToPricing = () => {
    navigate('/pricing');
  };
  
  const customAliasesUsed = usageData?.custom_backhalves_used || 0;
  const customAliasesTotal = FREE_PLAN_LIMITS.customBackHalves;
  const qrCodesUsed = usageData?.qr_codes_used || 0;
  const qrCodesTotal = FREE_PLAN_LIMITS.qrCodes;
  
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Shorten Your URL</CardTitle>
        <CardDescription>
          Create short links that never expire and track every click
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="long-url" className="text-sm font-medium">
              Paste a long URL
            </label>
            <Input
              id="long-url"
              type="url"
              placeholder="https://example.com/very-long-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
              required
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="custom-alias" className="text-sm font-medium">
              Custom alias (optional)
            </label>
            <Input
              id="custom-alias"
              type="text"
              placeholder="my-custom-url"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Free plan: {customAliasesUsed}/{customAliasesTotal} custom aliases used this month
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="generate-qr"
              checked={generateQrCode}
              onCheckedChange={(checked) => setGenerateQrCode(checked as boolean)}
            />
            <Label 
              htmlFor="generate-qr" 
              className="text-sm font-medium cursor-pointer flex items-center"
            >
              <QrCode className="h-4 w-4 mr-1" /> 
              Generate QR Code
            </Label>
            <p className="text-xs text-muted-foreground ml-auto">
              {qrCodesUsed}/{qrCodesTotal} QR codes used this month
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink hover:opacity-90 transition-opacity"
            disabled={createLink.isPending}
          >
            {createLink.isPending ? 'Creating...' : 'Create a secure short link'}
          </Button>
          
          {shortenedUrl && (
            <div className="p-4 mt-4 bg-muted rounded-md">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Link2 className="h-4 w-4 text-primary" />
                  <a
                    href={shortenedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate max-w-[250px] sm:max-w-md"
                  >
                    {shortenedUrl}
                  </a>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span className="sr-only sm:not-sr-only">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only sm:not-sr-only">Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default LinkShortener;
