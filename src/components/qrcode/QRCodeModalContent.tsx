
import React from 'react';
import { LinkData } from '@/services/links';
import QRCodeImage from './QRCodeImage';
import QRCodeActions from './QRCodeActions';

interface QRCodeModalContentProps {
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
  onCustomize: () => void;
}

const QRCodeModalContent: React.FC<QRCodeModalContentProps> = ({ 
  qrCodeData,
  onCustomize
}) => {
  return (
    <div className="flex flex-col items-center space-y-4 py-4">
      <h2 className="text-2xl font-semibold">Your Bitly Code is ready</h2>
      <p className="text-center text-muted-foreground">
        Scan the image below to preview your code
      </p>
      
      {/* QR Code Display */}
      <div className="p-4 bg-white rounded-md">
        <QRCodeImage link={qrCodeData.link} />
      </div>
      
      {/* Action Buttons */}
      <QRCodeActions 
        link={qrCodeData.link} 
        onCustomize={onCustomize}
      />
    </div>
  );
};

export default QRCodeModalContent;
