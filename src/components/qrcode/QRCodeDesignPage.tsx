
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIncrementUsage } from '@/services/usage';
import { useUserUsage } from '@/services/usage';
import { FREE_PLAN_LIMITS } from '@/services/usage/constants';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import QRCodeDesignContainer from './QRCodeDesignContainer';

const QRCodeDesignPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: usageData, isLoading: isLoadingUsage } = useUserUsage();
  const incrementUsage = useIncrementUsage();
  
  // URL for QR code
  const [url, setUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState('design');
  
  // Calculate remaining QR codes
  const qrCodesRemaining = usageData 
    ? FREE_PLAN_LIMITS.qrCodes - (usageData.qr_codes_used || 0)
    : 0;
  
  // Get URL from state if coming from another page
  useEffect(() => {
    if (location.state?.url) {
      setUrl(location.state.url);
    }
  }, [location]);
  
  // Handle QR code generation
  const handleGenerateQRCode = async () => {
    if (!url) {
      toast.error('Please enter a URL for your QR code');
      return;
    }
    
    try {
      // Increment usage counter
      await incrementUsage.mutateAsync({ type: 'qrCode' });
      
      // In a real app, we'd save the QR code to the database here
      toast.success('QR code generated successfully');
      
      // Redirect to dashboard or show download options
      // navigate('/dashboard');
    } catch (error: any) {
      console.error('Error generating QR code:', error);
      toast.error(error.message || 'Failed to generate QR code');
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
            
            <QRCodeDesignContainer 
              url={url}
              qrCodesRemaining={qrCodesRemaining}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleGenerateQRCode={handleGenerateQRCode}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default QRCodeDesignPage;
