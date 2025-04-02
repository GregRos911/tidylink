
import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Link as LinkIcon, Upload, ChevronRight, ArrowLeft, Palette } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useCreateLink } from '@/services/links';
import { useIncrementUsage } from '@/services/usage';
import { FREE_PLAN_LIMITS } from '@/services/usage/constants';
import { useUserUsage } from '@/services/usage';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import QRCodePreview from '@/components/qrcode/QRCodePreview';

const QRCodePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { data: usageData, isLoading: isLoadingUsage } = useUserUsage();
  const incrementUsage = useIncrementUsage();
  const createLink = useCreateLink();
  
  const [activeTab, setActiveTab] = useState('configure');
  const [originalUrl, setOriginalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [createShortLink, setCreateShortLink] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQRCodeUrl, setGeneratedQRCodeUrl] = useState('');
  
  // Calculate remaining QR codes
  const qrCodesRemaining = usageData 
    ? FREE_PLAN_LIMITS.qrCodes - (usageData.qr_codes_used || 0)
    : 0;
  
  const handleCreateQRCode = async () => {
    if (!originalUrl) {
      toast.error('Please enter a URL');
      return;
    }
    
    if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
      setOriginalUrl(`https://${originalUrl}`);
    }
    
    setIsLoading(true);
    
    try {
      // If we need to create a short link first
      if (createShortLink) {
        const linkResult = await createLink.mutateAsync({ 
          originalUrl: originalUrl,
          generateQrCode: true
        });
        
        if (linkResult) {
          // Use the short URL for the QR code
          setGeneratedQRCodeUrl(linkResult.short_url);
          
          // Show option to customize QR code
          toast.success('QR code created! Would you like to customize it?', {
            action: {
              label: 'Customize',
              onClick: () => navigate('/qr-design', { state: { url: linkResult.short_url } })
            }
          });
        }
      } else {
        // Just increment QR code usage and use the original URL
        await incrementUsage.mutateAsync({ type: 'qrCode' });
        setGeneratedQRCodeUrl(originalUrl);
        
        // Show option to customize QR code
        toast.success('QR code created! Would you like to customize it?', {
          action: {
            label: 'Customize',
            onClick: () => navigate('/qr-design', { state: { url: originalUrl } })
          }
        });
      }
      
    } catch (error: any) {
      console.error('Error creating QR code:', error);
      toast.error(error.message || 'Failed to create QR code');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCustomizeQRCode = () => {
    if (generatedQRCodeUrl) {
      navigate('/qr-design', { state: { url: generatedQRCodeUrl } });
    } else if (originalUrl) {
      navigate('/qr-design', { state: { url: originalUrl } });
    } else {
      navigate('/qr-design');
    }
  };
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar - Hidden on mobile */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <DashboardTopBar setShowCreateLinkCard={() => navigate('/dashboard')} />
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Back button */}
            <div className="mb-4">
              <Button 
                variant="ghost" 
                className="flex items-center text-gray-500" 
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column - QR Code Configuration */}
              <div className="flex-1">
                <Tabs defaultValue="configure" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="configure" className="flex items-center gap-2">
                      <QrCode className="h-4 w-4" />
                      Configure code
                    </TabsTrigger>
                    <TabsTrigger value="customize" className="flex items-center gap-2" onClick={handleCustomizeQRCode}>
                      <div className="flex items-center gap-1">
                        <Palette className="h-4 w-4" />
                        Customize design
                      </div>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="configure" className="mt-0">
                    <Card>
                      <CardContent className="pt-6">
                        <h1 className="text-2xl font-bold mb-2">Create a TidyLink QR Code</h1>
                        <p className="text-muted-foreground mb-4">
                          You can create {qrCodesRemaining} more codes this month. 
                          <Link to="/pricing" className="text-brand-blue ml-1 hover:underline">
                            Upgrade for more.
                          </Link>
                        </p>
                        
                        <div className="space-y-6">
                          <div>
                            <Label htmlFor="destination">Destination</Label>
                            <div className="text-xs text-muted-foreground mb-1">
                              Hit <kbd className="px-1 py-0.5 bg-gray-100 border rounded text-xs">ENTER</kbd> to quick create
                            </div>
                            <Input
                              id="destination"
                              placeholder="https://example.com/my-long-url"
                              value={originalUrl}
                              onChange={(e) => setOriginalUrl(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleCreateQRCode()}
                              className="w-full"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="title">Title (optional)</Label>
                            <Input
                              id="title"
                              placeholder="Add a title to help identify this QR code"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="w-full"
                            />
                          </div>
                          
                          <div className="border-t pt-4">
                            <h3 className="text-lg font-medium mb-4">Ways to share</h3>
                            
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-medium flex items-center">
                                  <LinkIcon className="h-4 w-4 mr-2" />
                                  Short link
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Create a link that directs users to the same destination as your QR Code
                                </p>
                              </div>
                              <Switch 
                                checked={createShortLink} 
                                onCheckedChange={setCreateShortLink} 
                              />
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <h3 className="text-lg font-medium mb-4">Advanced features</h3>
                            
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-medium flex items-center">
                                  UTM parameters
                                  <span className="ml-2 text-xs bg-teal-600 text-white px-1 rounded">
                                    Upgrade
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Add UTMs to track web traffic in analytics tools
                                </p>
                              </div>
                              <Switch disabled />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="mt-6 flex justify-between">
                      <Button variant="outline" onClick={() => navigate('/dashboard')}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCreateQRCode}
                        disabled={!originalUrl || isLoading}
                        className="bg-brand-blue hover:bg-brand-blue/90"
                      >
                        {isLoading ? 'Creating...' : 'Create QR code'}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Right Column - QR Code Preview */}
              <div className="w-full lg:w-[350px]">
                <div className="bg-white p-4 rounded-lg border sticky top-20">
                  <h3 className="text-center text-lg font-medium mb-4">Preview</h3>
                  <div className="flex justify-center">
                    <QRCodePreview
                      url={generatedQRCodeUrl || originalUrl || 'https://example.com'}
                      logo=""
                      cornerType="square"
                      dotsType="square"
                      backgroundColor="#FFFFFF"
                      foregroundColor="#000000"
                    />
                  </div>
                  {generatedQRCodeUrl && (
                    <div className="mt-4 space-y-2">
                      <Button className="w-full" onClick={() => window.open(generatedQRCodeUrl, '_blank')}>
                        View QR Code
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={handleCustomizeQRCode}
                      >
                        <Palette className="h-4 w-4" />
                        Customize Design
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QRCodePage;
