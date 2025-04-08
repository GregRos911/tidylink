
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

  // Extract the short ID from the link
  const shortId = link.custom_backhalf || link.short_url.split('/').pop();
  
  // Construct the URL using the Supabase functions endpoint directly
  const supabaseUrl = "https://oeapevrjjgoinczpzfbt.supabase.co";
  const qrCodeUrl = `${supabaseUrl}/functions/v1/redirect/${shortId}`;
  
  return (
    <img 
      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`}
      alt="QR Code"
      className="h-48 w-48"
    />
  );
};

export default QRCodeImage;
