
import React, { useEffect, useRef } from 'react';
import QRCodeStyling, { DrawType } from 'qr-code-styling';
import { Facebook, Instagram, Github } from 'lucide-react';

type QRCodeCornerType = 'square' | 'rounded' | 'dot';
type QRCodeDotsType = 'square' | 'rounded' | 'dot' | 'classy' | 'extra-rounded';

interface QRCodePreviewProps {
  url: string;
  size?: number;
  logo?: string;
  cornerType?: QRCodeCornerType;
  dotsType?: QRCodeDotsType;
  backgroundColor?: string;
  foregroundColor?: string;
}

const QRCodePreview: React.FC<QRCodePreviewProps> = ({
  url,
  size = 250,
  logo = '',
  cornerType = 'square',
  dotsType = 'square',
  backgroundColor = '#FFFFFF',
  foregroundColor = '#000000',
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!qrRef.current) return;

    // Clear any existing content
    if (qrRef.current.firstChild) {
      qrRef.current.removeChild(qrRef.current.firstChild);
    }

    // Convert string types to DrawType
    const cornerTypeValue = cornerType as DrawType;
    const dotsTypeValue = dotsType as DrawType;

    // Base options
    const options: any = {
      width: size,
      height: size,
      data: url,
      dotsOptions: {
        color: foregroundColor,
        type: dotsTypeValue,
      },
      cornersSquareOptions: {
        color: foregroundColor,
        type: cornerTypeValue,
      },
      backgroundOptions: {
        color: backgroundColor,
      },
    };

    // Handle different logo types
    if (logo) {
      // For social media icons, we'd ideally use SVGs or images
      // This is a simplified approach for the demo
      if (logo === 'instagram' || logo === 'facebook' || logo === 'github') {
        // In a real implementation, you'd use actual image URLs for these logos
        const logoPlaceholder = 'https://via.placeholder.com/150';
        
        options.imageOptions = {
          crossOrigin: 'anonymous',
          margin: 5,
        };
        options.image = logoPlaceholder;
      } else if (logo.startsWith('http')) {
        // For uploaded images or URLs
        options.imageOptions = {
          crossOrigin: 'anonymous',
          margin: 5,
        };
        options.image = logo;
      }
    }

    // Create new QR code
    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling(options);
      qrCode.current.append(qrRef.current);
    } else {
      qrCode.current.update(options);
    }
  }, [url, size, logo, cornerType, dotsType, backgroundColor, foregroundColor]);

  // Render the logo placeholder in the center for the preview
  const renderLogoPlaceholder = () => {
    if (!logo) return null;
    
    const logoStyle = {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      borderRadius: '50%',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      zIndex: 10,
    };
    
    if (logo === 'instagram') {
      return (
        <div style={logoStyle}>
          <Instagram size={24} />
        </div>
      );
    } else if (logo === 'facebook') {
      return (
        <div style={logoStyle}>
          <Facebook size={24} />
        </div>
      );
    } else if (logo === 'github') {
      return (
        <div style={logoStyle}>
          <Github size={24} />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="relative">
      <div ref={qrRef} className="flex justify-center items-center" />
      {renderLogoPlaceholder()}
    </div>
  );
};

export default QRCodePreview;
