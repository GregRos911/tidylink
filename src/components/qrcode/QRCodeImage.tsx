
import React from 'react';
import { LinkData } from '@/services/links';

interface QRCodeImageProps {
  link: LinkData | undefined;
}

const QRCodeImage: React.FC<QRCodeImageProps> = ({ link }) => {
  if (!link) {
    return (
      <div className="h-48 w-48 bg-gray-100 flex items-center justify-center">
        <p>QR Code Preview</p>
      </div>
    );
  }

  // Use either the short_url directly or construct a URL using the custom_backhalf
  const qrCodeUrl = link.custom_backhalf 
    ? `${window.location.origin}/go/${link.custom_backhalf}`
    : link.short_url.replace('/r/', '/go/');
  
  return (
    <img 
      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`}
      alt="QR Code"
      className="h-48 w-48"
    />
  );
};

export default QRCodeImage;
