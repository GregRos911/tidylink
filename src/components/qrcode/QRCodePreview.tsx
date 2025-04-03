
import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling, { DrawType } from 'qr-code-styling';
import { Facebook, Instagram, Github } from 'lucide-react';
import { getTemplateById } from './qrCodeTemplates';

type QRCodeCornerType = 'square' | 'rounded' | 'dot';
type QRCodeDotsType = 'square' | 'rounded' | 'dot' | 'classy' | 'extra-rounded';

interface QRCodePreviewProps {
  url: string;
  size?: number;
  logo?: string;
  cornerType?: QRCodeCornerType;
  dotsType?: string; // Changed to string to accept pattern values like '1', '2', etc.
  backgroundColor?: string;
  foregroundColor?: string;
  templateId?: string;
}

const QRCodePreview: React.FC<QRCodePreviewProps> = ({
  url,
  size = 250,
  logo = '',
  cornerType = 'square',
  dotsType = 'square',
  backgroundColor = '#FFFFFF',
  foregroundColor = '#000000',
  templateId,
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);
  const [isUsingTemplate, setIsUsingTemplate] = useState<boolean>(false);

  useEffect(() => {
    if (!qrRef.current) return;

    // Clear any existing content
    if (qrRef.current.firstChild) {
      qrRef.current.removeChild(qrRef.current.firstChild);
    }

    // If we're using a template ID directly
    if (templateId) {
      const template = getTemplateById(templateId);
      if (template) {
        setIsUsingTemplate(true);
        
        // Create an image element
        const img = document.createElement('img');
        img.src = template.image;
        img.alt = template.name;
        img.style.width = `${size}px`;
        img.style.height = `${size}px`;
        img.onerror = () => {
          console.error(`Failed to load template image: ${template.image}`);
          // Fallback to standard QR code
          createStandardQRCode();
        };
        
        qrRef.current.appendChild(img);
        return;
      }
    }
    
    // If we're using a pattern as a template (numbered patterns like '1', '2', etc.)
    if (dotsType && !isNaN(Number(dotsType))) {
      const patternTemplateId = `template-${dotsType}`;
      const template = getTemplateById(patternTemplateId);
      
      if (template) {
        setIsUsingTemplate(true);
        
        // Create an image element
        const img = document.createElement('img');
        img.src = template.image;
        img.alt = template.name;
        img.style.width = `${size}px`;
        img.style.height = `${size}px`;
        
        // Add error handling
        img.onerror = () => {
          console.error(`Failed to load pattern image: ${template.image}`);
          // Fallback to standard QR code
          createStandardQRCode();
        };
        
        qrRef.current.appendChild(img);
        return;
      }
    }

    // Create standard QR code
    createStandardQRCode();

  }, [url, size, logo, cornerType, dotsType, backgroundColor, foregroundColor, templateId]);

  // Function to create a standard QR code
  const createStandardQRCode = () => {
    setIsUsingTemplate(false);

    // Convert string types to DrawType for standard QR code styling
    // If dotsType is a number (pattern ID), default to 'square'
    const dotsTypeValue = (isNaN(Number(dotsType)) ? dotsType : 'square') as DrawType;
    const cornerTypeValue = cornerType as DrawType;

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
      qrCode.current.append(qrRef.current!);
    } else {
      qrCode.current.update(options);
    }
  };

  // Render the logo placeholder in the center for the preview
  const renderLogoPlaceholder = () => {
    if (!logo || isUsingTemplate) return null;
    
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
