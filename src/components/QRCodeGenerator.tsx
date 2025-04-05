
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { Download, QrCode, Loader2 } from 'lucide-react';
import { useIncrementUsage } from '@/services/usage';
import { useUser } from '@clerk/clerk-react';

interface QRCodeGeneratorProps {
  url: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ url }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const incrementUsage = useIncrementUsage();
  const { isSignedIn } = useUser();
  
  useEffect(() => {
    if (url) {
      generateQRCode();
    }
  }, [url]);
  
  const generateQRCode = async () => {
    if (!url) {
      toast.error('Please shorten a URL first');
      return;
    }
    
    if (!isSignedIn) {
      toast.error('You need to sign in to generate QR codes');
      return;
    }
    
    setLoading(true);
    
    try {
      // Skip usage check - always allow QR code generation
      // Just record the usage without checking limits
      try {
        await incrementUsage.mutateAsync({ type: 'qrCode' });
      } catch (error) {
        console.log('Usage recording error, but continuing anyway');
      }
      
      // Generate QR code using an API
      const encodedUrl = encodeURIComponent(url);
      const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}`;
      setQrCodeUrl(qrCodeApiUrl);
    } catch (error: any) {
      console.error('Error generating QR code:', error);
      // Don't show error message about limits
      if (!error.message?.includes('limit')) {
        toast.error('Failed to generate QR code');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const downloadQRCode = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('QR code downloaded successfully');
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code');
    }
  };
  
  if (!url) {
    return null;
  }
  
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md mt-8">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          <span>QR Code</span>
        </CardTitle>
        <CardDescription>
          Scan to access your shortened URL on any device
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {loading ? (
          <div className="h-[200px] w-[200px] bg-muted rounded-md flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-blue" />
          </div>
        ) : qrCodeUrl ? (
          <div className="flex flex-col items-center gap-4">
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="h-[200px] w-[200px] border border-border rounded-md"
            />
            <Button 
              onClick={downloadQRCode}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download QR Code
            </Button>
          </div>
        ) : (
          <div className="h-[200px] w-[200px] bg-muted rounded-md flex items-center justify-center">
            <Button 
              onClick={generateQRCode}
              className="flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              Generate QR Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
