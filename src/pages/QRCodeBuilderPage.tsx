
import React, { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import QRCodeCustomizer from '@/components/qrcode/QRCodeCustomizer';
import { useUserLinks } from '@/services/links';
import { useUserUsage, FREE_PLAN_LIMITS } from '@/services/usage';
import { toast } from 'sonner';
import QRCodePreviewModal from '@/components/qrcode/QRCodePreviewModal';

const QRCodeBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const [generatedQRCodeData, setGeneratedQRCodeData] = useState<any>(null);
  
  // Fetch user's links
  const { data: links, isLoading: isLoadingLinks } = useUserLinks();
  
  // Fetch user's usage data
  const { data: usageData, isLoading: isLoadingUsage } = useUserUsage();
  
  // Check if user has reached their QR code limit
  const hasReachedQRLimit = usageData && 
    usageData.qr_codes_used >= FREE_PLAN_LIMITS.qrCodes;
  
  // QR code design state
  const [qrDesign, setQRDesign] = useState({
    pattern: 'square',
    cornerStyle: 'square',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    cornerColor: null,
    centerIcon: null,
    customText: null,
    frameStyle: null,
    logoUrl: null,
    name: 'My QR Code'
  });
  
  const handleGoBack = () => {
    navigate('/dashboard');
  };
  
  const handleGenerateQRCode = () => {
    if (!selectedLink) {
      toast.error('Please select a link to generate a QR code for');
      return;
    }
    
    if (hasReachedQRLimit) {
      toast.error(`You've reached your monthly limit of ${FREE_PLAN_LIMITS.qrCodes} QR codes. Please upgrade your plan.`);
      return;
    }
    
    // Set the QR code data for the preview modal
    setGeneratedQRCodeData({
      link: links?.find(link => link.id === selectedLink),
      design: qrDesign
    });
    
    // Show the preview modal
    setShowPreviewModal(true);
  };
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar - Hidden on mobile */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <DashboardTopBar setShowCreateLinkCard={() => {}} />
        
        {/* QR Code Builder Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header with back button */}
            <div className="mb-6 flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleGoBack}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold">QR Code Builder</h1>
            </div>
            
            {/* Link Selection Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Select a Link</CardTitle>
                <CardDescription>
                  Choose one of your shortened links to generate a QR code
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingLinks ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
                  </div>
                ) : !links || links.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">You don't have any links yet.</p>
                    <Button onClick={() => navigate('/dashboard')}>
                      Create a Link First
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {links.map((link) => (
                      <div 
                        key={link.id}
                        className={`p-3 border rounded-md cursor-pointer flex items-center ${
                          selectedLink === link.id ? 'border-brand-blue bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedLink(link.id)}
                      >
                        <div className="mr-2 w-4 h-4 rounded-full flex items-center justify-center">
                          {selectedLink === link.id && (
                            <div className="w-3 h-3 rounded-full bg-brand-blue" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{link.short_url.replace(window.location.origin + '/r/', 'ti.dy/')}</p>
                          <p className="text-sm text-gray-500 truncate">{link.original_url}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* QR Code Customizer */}
            <QRCodeCustomizer 
              design={qrDesign} 
              onDesignChange={setQRDesign}
              selectedLinkData={selectedLink ? links?.find(link => link.id === selectedLink) : null}
            />
            
            {/* Generate Button */}
            <div className="mt-6 flex justify-end">
              <Button 
                size="lg" 
                onClick={handleGenerateQRCode}
                disabled={!selectedLink || hasReachedQRLimit}
              >
                Generate QR Code
              </Button>
            </div>
            
            {/* Usage Information */}
            <div className="mt-6 text-center text-sm text-gray-500">
              {isLoadingUsage ? (
                <div className="flex justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading usage data...
                </div>
              ) : (
                <p>
                  You have used {usageData?.qr_codes_used || 0} of {FREE_PLAN_LIMITS.qrCodes} QR codes this month.
                  {hasReachedQRLimit && (
                    <Button 
                      variant="link" 
                      className="text-brand-blue pl-1 pr-0 py-0 h-auto"
                      onClick={() => navigate('/pricing')}
                    >
                      Upgrade to create more.
                    </Button>
                  )}
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* QR Code Preview Modal */}
      {showPreviewModal && generatedQRCodeData && (
        <QRCodePreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          qrCodeData={generatedQRCodeData}
        />
      )}
    </div>
  );
};

export default QRCodeBuilderPage;
