
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { Download, QrCode } from 'lucide-react';

interface QRCodeGeneratorProps {
  url: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ url }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
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
    
    setLoading(true);
    
    try {
      // Generate QR code using an API
      const encodedUrl = encodeURIComponent(url);
      const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}`;
      setQrCodeUrl(qrCodeApiUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
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
            Loading...
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
            No QR code available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
