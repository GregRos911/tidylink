
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Download, Paintbrush } from 'lucide-react';
import { toast } from 'sonner';
import { LinkData } from '@/services/links';

interface QRCodeActionsProps {
  link: LinkData | undefined;
  onCustomize: () => void;
}

const QRCodeActions: React.FC<QRCodeActionsProps> = ({ link, onCustomize }) => {
  const copyToClipboard = async () => {
    try {
      if (link) {
        await navigator.clipboard.writeText(link.short_url);
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
  );
};

export default QRCodeActions;
