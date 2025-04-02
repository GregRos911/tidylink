
import React, { useEffect, useRef } from 'react';
import QRCodeStyling, { DrawType } from 'qr-code-styling';

type QRCodeCornerType = 'square' | 'rounded' | 'dot';
type QRCodeDotsType = 'square' | 'rounded' | 'dot' | 'classy';

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

    const options = {
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

    // Add logo if provided
    const fullOptions = logo ? {
      ...options,
      image: logo,
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 5,
      },
    } : options;

    // Create new QR code
    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling(fullOptions);
      qrCode.current.append(qrRef.current);
    } else {
      qrCode.current.update(fullOptions);
    }
  }, [url, size, logo, cornerType, dotsType, backgroundColor, foregroundColor]);

  return <div ref={qrRef} className="flex justify-center items-center" />;
};

export default QRCodePreview;
