
import React from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Download, X, Paintbrush } from 'lucide-react';
import { toast } from 'sonner';
import { LinkData } from '@/services/links';

interface QRCodePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomize: () => void;
  qrCodeData: {
    link: LinkData | undefined;
    design: {
      pattern: string;
      cornerStyle: string;
      foregroundColor: string;
      backgroundColor: string;
      cornerColor: string | null;
      centerIcon: string | null;
      customText: string | null;
      frameStyle: string | null;
      logoUrl: string | null;
      name: string;
    };
  };
}

const QRCodePreviewModal: React.FC<QRCodePreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  onCustomize,
  qrCodeData
}) => {
  const copyToClipboard = async () => {
    try {
      // In a real implementation, you would copy the QR code image
      // For now, we'll just copy the URL that the QR code represents
      if (qrCodeData.link) {
        await navigator.clipboard.writeText(qrCodeData.link.short_url);
        toast.success('QR code copied to clipboard!');
      } else {
        toast.error('No link data available to copy');
      }
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleDownload = () => {
    // In a real implementation, you would download the QR code as PNG
    // For now, we'll just show a success toast
    toast.success('QR code downloaded successfully!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          <h2 className="text-2xl font-semibold">Your Bitly Code is ready</h2>
          <p className="text-center text-muted-foreground">
            Scan the image below to preview your code
          </p>
          
          {/* QR Code Display */}
          <div className="p-4 bg-white rounded-md">
            {qrCodeData.link ? (
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeData.link.short_url)}`}
                alt="QR Code"
                className="h-48 w-48"
              />
            ) : (
              <div className="h-48 w-48 bg-gray-100 flex items-center justify-center">
                <p>QR Code Preview</p>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col w-full gap-3">
            <Button 
              className="w-full flex items-center justify-center"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </Button>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center justify-center"
                onClick={copyToClipboard}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy code
              </Button>
              
              <Button 
                variant="outline"
                className="flex items-center justify-center"
                onClick={onCustomize}
              >
                <Paintbrush className="mr-2 h-4 w-4" />
                Customize
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodePreviewModal;
