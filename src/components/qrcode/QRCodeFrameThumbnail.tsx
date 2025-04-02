
import React from 'react';
import { Lock, X } from 'lucide-react';

export type QRFrameType = 'none' | 'simple' | 'rounded' | 'scan-me-bottom' | 'scan-me-top' | 'scan-me-fancy';

interface FrameThumbnailProps { 
  type: QRFrameType;
  selected: boolean; 
  premium: boolean;
  onClick: () => void;
}

const QRCodeFrameThumbnail: React.FC<FrameThumbnailProps> = ({ 
  type, 
  selected, 
  premium,
  onClick 
}) => {
  return (
    <div 
      className={`relative w-14 h-14 border rounded cursor-pointer flex items-center justify-center
        ${selected ? 'border-blue-500 border-2' : 'border-gray-300'}
        ${premium ? 'opacity-80' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center">
        {renderFrame(type)}
      </div>
      {premium && (
        <div className="absolute top-1 right-1">
          <Lock className="h-3 w-3 text-gray-400" />
        </div>
      )}
    </div>
  );
};

// Helper function to render different frame styles
const renderFrame = (type: QRFrameType) => {
  switch (type) {
    case 'none':
      return (
        <div className="w-10 h-10 flex items-center justify-center">
          <X className="w-6 h-6" />
        </div>
      );
    
    case 'simple':
      return (
        <div className="w-10 h-10 border border-black">
          <div className="w-full h-full bg-gray-100"></div>
        </div>
      );
    
    case 'rounded':
      return (
        <div className="w-10 h-10 border border-black rounded-md">
          <div className="w-full h-full bg-gray-100 rounded-md"></div>
        </div>
      );
    
    case 'scan-me-bottom':
      return (
        <div className="flex flex-col items-center">
          <div className="w-10 h-8 border border-black">
            <div className="w-full h-full bg-gray-100"></div>
          </div>
          <div className="mt-1 text-[6px] font-bold">SCAN ME</div>
        </div>
      );
    
    case 'scan-me-top':
      return (
        <div className="flex flex-col items-center">
          <div className="mb-1 text-[6px] font-bold">SCAN ME</div>
          <div className="w-10 h-8 border border-black">
            <div className="w-full h-full bg-gray-100"></div>
          </div>
        </div>
      );
    
    case 'scan-me-fancy':
      return (
        <div className="relative w-10 h-10">
          <div className="w-10 h-10 border border-black">
            <div className="w-full h-full bg-gray-100"></div>
          </div>
          <div className="absolute -bottom-1 left-0 right-0 text-[6px] text-center bg-black text-white px-1 py-0.5 font-bold">
            SCAN ME
          </div>
        </div>
      );
    
    default:
      return (
        <div className="w-10 h-10 border border-black">
          <div className="w-full h-full bg-gray-100"></div>
        </div>
      );
  }
};

export default QRCodeFrameThumbnail;
