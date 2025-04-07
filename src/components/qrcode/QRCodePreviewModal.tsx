
import React from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogClose
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { LinkData } from '@/services/links';
import QRCodeModalContent from './QRCodeModalContent';

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
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <QRCodeModalContent 
          qrCodeData={qrCodeData} 
          onCustomize={onCustomize}
        />
      </DialogContent>
    </Dialog>
  );
};

export default QRCodePreviewModal;
