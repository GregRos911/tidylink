import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';

interface QRCodePreviewProps {
  value: string;
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
  };
  size?: number;
}

const QRCodePreview: React.FC<QRCodePreviewProps> = ({ 
  value, 
  design,
  size = 250
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    // Map our simple design options to qr-code-styling options
    const dotsType = design.pattern === 'dots' ? 'dots' :
                     design.pattern === 'rounded' ? 'rounded' :
                     design.pattern === 'classy' ? 'classy' :
                     design.pattern === 'classy-rounded' ? 'classy-rounded' :
                     design.pattern === 'extra-rounded' ? 'extra-rounded' :
                     'square';
                     
    const cornersType = design.cornerStyle === 'rounded' ? 'rounded' :
                       design.cornerStyle === 'dots' ? 'dots' :
                       design.cornerStyle === 'extra-rounded' ? 'extra-rounded' :
                       design.cornerStyle === 'circle' ? 'circle' :
                       'square';
                       
    const logoSrc = design.logoUrl ? design.logoUrl :
                    design.centerIcon === 'facebook' ? 'https://cdn.cdnlogo.com/logos/f/83/facebook.svg' :
                    design.centerIcon === 'instagram' ? 'https://cdn.cdnlogo.com/logos/i/4/instagram.svg' :
                    design.centerIcon === 'pinterest' ? 'https://cdn.cdnlogo.com/logos/p/20/pinterest.svg' :
                    '';
                    
    // Note: In a real app, you would use actual images for these icons and logos
                    
    const options = {
      width: size,
      height: size,
      data: value,
      type: 'svg', // svg is more flexible for styling
      image: logoSrc ? logoSrc : undefined,
      dotsOptions: {
        color: design.foregroundColor,
        type: dotsType
      },
      cornersSquareOptions: {
        color: design.cornerColor || design.foregroundColor,
        type: cornersType
      },
      backgroundOptions: {
        color: design.backgroundColor
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 10
      }
    };
    
    // If qrCode ref already exists, update it
    if (qrCode.current) {
      qrCode.current.update(options);
    } else {
      // Otherwise create a new instance
      import('qr-code-styling').then(({ default: QRCodeStyling }) => {
        qrCode.current = new QRCodeStyling(options);
        if (ref.current) {
          ref.current.innerHTML = '';
          qrCode.current.append(ref.current);
        }
      }).catch(err => {
        console.error('Failed to load QR code library:', err);
      });
    }
    
    // Cleanup
    return () => {
      if (ref.current) {
        ref.current.innerHTML = '';
      }
    };
  }, [value, design, size]);
  
  return (
    <div className="relative flex items-center justify-center bg-white p-4 rounded-md">
      <div ref={ref} className="flex items-center justify-center min-h-[250px] min-w-[250px]">
        <Loader2 className="h-10 w-10 animate-spin text-brand-blue" />
      </div>
      
      {/* This would be where you'd add frame styling if selected */}
      {design.frameStyle && (
        <div className="absolute bottom-2 left-0 right-0 text-center text-xs font-medium">
          {design.frameStyle.includes('scanme') && 'SCAN ME'}
        </div>
      )}
    </div>
  );
};

export default QRCodePreview;
