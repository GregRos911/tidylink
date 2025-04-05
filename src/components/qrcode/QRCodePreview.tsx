
import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import QRCodeStyling, { DrawType, Options } from 'qr-code-styling';

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
    frameDarkness?: number;
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
    const dotsType = getDotType(design.pattern);
    const cornersType = getCornerType(design.cornerStyle);
                       
    const logoSrc = design.logoUrl ? design.logoUrl :
                    design.centerIcon === 'facebook' ? 'https://cdn.cdnlogo.com/logos/f/83/facebook.svg' :
                    design.centerIcon === 'instagram' ? 'https://cdn.cdnlogo.com/logos/i/4/instagram.svg' :
                    design.centerIcon === 'pinterest' ? 'https://cdn.cdnlogo.com/logos/p/20/pinterest.svg' :
                    '';
                    
    // Note: In a real app, you would use actual images for these icons and logos
                    
    const options: Partial<Options> = {
      width: size,
      height: size,
      data: value,
      type: 'svg' as DrawType, // Explicitly cast to DrawType
      image: logoSrc ? logoSrc : undefined,
      dotsOptions: {
        color: design.foregroundColor,
        type: dotsType as any // Using any here as a temporary solution
      },
      cornersSquareOptions: {
        color: design.cornerColor || design.foregroundColor,
        type: cornersType as any // Using any here as a temporary solution
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

  // Helper function to get the correct dot type
  function getDotType(pattern: string): string {
    switch (pattern) {
      case 'dots': return 'dots';
      case 'rounded': return 'rounded';
      case 'classy': return 'classy';
      case 'classy-rounded': return 'classy-rounded';
      case 'extra-rounded': return 'extra-rounded';
      default: return 'square';
    }
  }

  // Helper function to get the correct corner type
  function getCornerType(cornerStyle: string): string {
    switch (cornerStyle) {
      case 'rounded': return 'rounded';
      case 'dots': return 'dots';
      case 'extra-rounded': return 'extra-rounded';
      case 'circle': return 'circle';
      default: return 'square';
    }
  }

  // Calculate opacity based on frame darkness (10-100)
  const frameOpacity = design.frameDarkness ? design.frameDarkness / 100 : 0.5;
  const frameColor = `rgba(0, 0, 0, ${frameOpacity})`;
  
  // Get frame styles based on the selected frame type
  const getFrameStyles = () => {
    if (!design.frameStyle) return {};
    
    const baseStyles = {
      position: 'absolute',
      inset: 0,
      borderWidth: '4px',
      borderStyle: 'solid',
      borderColor: frameColor
    } as React.CSSProperties;
    
    switch (design.frameStyle) {
      case 'simple':
        return baseStyles;
      case 'rounded':
        return {
          ...baseStyles,
          borderRadius: '16px'
        };
      case 'scanme-bottom':
      case 'scanme-top':
      case 'scanme-cursive':
        return {
          ...baseStyles,
          borderRadius: '8px'
        };
      default:
        return {};
    }
  };
  
  return (
    <div className="relative flex items-center justify-center bg-white p-4 rounded-md">
      {/* Frame container */}
      {design.frameStyle && (
        <div 
          className="absolute inset-8 pointer-events-none"
          style={getFrameStyles()}
        />
      )}
      
      {/* QR Code container */}
      <div ref={ref} className="flex items-center justify-center min-h-[250px] min-w-[250px] z-10">
        <Loader2 className="h-10 w-10 animate-spin text-brand-blue" />
      </div>
      
      {/* Scan me text */}
      {design.frameStyle && design.frameStyle.includes('scanme') && (
        <div 
          className="absolute bottom-2 left-0 right-0 text-center text-xs font-medium"
          style={{ 
            opacity: frameOpacity,
            fontWeight: design.frameStyle === 'scanme-cursive' ? 'normal' : 'bold',
            fontFamily: design.frameStyle === 'scanme-cursive' ? 'cursive, serif' : 'inherit',
            bottom: design.frameStyle === 'scanme-top' ? 'auto' : '12px',
            top: design.frameStyle === 'scanme-top' ? '12px' : 'auto'
          }}
        >
          SCAN ME
        </div>
      )}
    </div>
  );
};

export default QRCodePreview;
