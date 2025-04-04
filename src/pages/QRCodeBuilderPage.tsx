
import React, { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import QRCodeCustomizer from '@/components/qrcode/QRCodeCustomizer';
import { useUserLinks } from '@/services/links';
import { useUserUsage, FREE_PLAN_LIMITS } from '@/services/usage';
import { toast } from 'sonner';
import QRCodePreviewModal from '@/components/qrcode/QRCodePreviewModal';
import LinkSelector from '@/components/qrcode/LinkSelector';
import CreateQRLinkCard from '@/components/qrcode/CreateQRLinkCard';

const QRCodeBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const [generatedQRCodeData, setGeneratedQRCodeData] = useState<any>(null);
  
  // Fetch user's links (only to get the selected link data)
  const { data: links } = useUserLinks();
  
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
  
  // Handle when a new link is created
  const handleLinkCreated = (linkId: string) => {
    // Set the selected link to the newly created link
    setSelectedLink(linkId);
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
            
            {/* Create QR Link Card */}
            <CreateQRLinkCard onLinkCreated={handleLinkCreated} />
            
            {/* Link Selection Component */}
            <LinkSelector 
              selectedLink={selectedLink} 
              onSelectLink={setSelectedLink} 
            />
            
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
