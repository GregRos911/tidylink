
import React, { useEffect, useRef } from 'react';
import QRCodeStyling, { DrawType, Options } from 'qr-code-styling';
import { Facebook, Instagram, Github } from 'lucide-react';
import { QRPatternType } from './QRCodePatternThumbnail';
import { QRCornerType } from './QRCodeCornerThumbnail';
import { QRFrameType } from './QRCodeFrameThumbnail';

interface QRCodePreviewProps {
  url: string;
  size?: number;
  logo?: string;
  cornerType?: QRCornerType;
  dotsType?: QRPatternType;
  backgroundColor?: string;
  foregroundColor?: string;
  frameType?: QRFrameType;
  frameText?: string;
}

const QRCodePreview: React.FC<QRCodePreviewProps> = ({
  url,
  size = 250,
  logo = '',
  cornerType = 'square',
  dotsType = 'square',
  backgroundColor = '#FFFFFF',
  foregroundColor = '#000000',
  frameType = 'none',
  frameText = 'SCAN ME',
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
    const cornerTypeValue = getCornerType(cornerType);
    const dotsTypeValue = getDotsType(dotsType);

    // Base options
    const options: Options = {
      width: size,
      height: size,
      data: url || 'https://example.com',
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
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 5,
      },
    };

    // Handle frame if specified
    if (frameType !== 'none') {
      options.frameOptions = {
        style: getFrameStyle(frameType),
        text: frameText || 'SCAN ME',
        textColor: foregroundColor,
        backgroundColor: backgroundColor,
        borderColor: foregroundColor,
        borderWidth: 1,
      };
    }

    // Handle different logo types
    if (logo) {
      // For social media icons (would use placeholders in real implementation)
      if (logo === 'instagram' || logo === 'facebook' || logo === 'github') {
        // Use placeholders for these icons since we can't directly use SVGs
        // In a real implementation, we'd have actual image URLs for these icons
        const logoPlaceholder = 'https://via.placeholder.com/150';
        options.image = logoPlaceholder;
      } else if (logo.startsWith('http')) {
        // For uploaded images or URLs
        options.image = logo;
      }
    }

    try {
      // Create new QR code
      if (!qrCode.current) {
        qrCode.current = new QRCodeStyling(options);
        qrCode.current.append(qrRef.current);
      } else {
        qrCode.current.update(options);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }, [url, size, logo, cornerType, dotsType, backgroundColor, foregroundColor, frameType, frameText]);

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

  // Helper function to convert corner type to compatible QR styling type
  const getCornerType = (type: QRCornerType): DrawType => {
    switch (type) {
      case 'dot':
        return 'dot';
      case 'rounded':
        return 'rounded';
      case 'edge-cut':
      case 'extra-rounded':
        return 'extra-rounded';
      case 'circular':
        return 'dot';
      case 'pointed':
      case 'edge-round':
      case 'fancy':
        return 'rounded'; // Fallback for types not directly supported
      default:
        return 'square';
    }
  };

  // Helper function to convert dots type to compatible QR styling type
  const getDotsType = (type: QRPatternType): DrawType => {
    switch (type) {
      case 'dot':
        return 'dot';
      case 'rounded':
        return 'rounded';
      case 'classy':
        return 'classy';
      case 'extra-rounded':
        return 'extra-rounded';
      case 'circle':
        return 'dot'; // Close approximation
      case 'edge-cut':
        return 'classy'; // Close approximation
      default:
        return 'square';
    }
  };

  // Helper function to convert frame type to compatible QR styling frame style
  const getFrameStyle = (type: QRFrameType): 'standard' | 'circle' | 'rounded' => {
    switch (type) {
      case 'rounded':
        return 'rounded';
      case 'scan-me-bottom':
      case 'scan-me-top':
      case 'scan-me-fancy':
        return 'standard';
      default:
        return 'standard';
    }
  };

  return (
    <div className="relative">
      <div ref={qrRef} className="flex justify-center items-center" />
      {renderLogoPlaceholder()}
    </div>
  );
};

export default QRCodePreview;
