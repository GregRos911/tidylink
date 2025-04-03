
import React from 'react';
import { Lock } from 'lucide-react';

export type QRCornerType = 'square' | 'dot' | 'rounded' | 'edge-cut' | 'extra-rounded' | 'circular' | 'pointed' | 'edge-round' | 'fancy';

interface CornerThumbnailProps { 
  type: QRCornerType; 
  selected: boolean; 
  premium: boolean;
  onClick: () => void;
}

const QRCodeCornerThumbnail: React.FC<CornerThumbnailProps> = ({ 
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
        {renderCorner(type)}
      </div>
      {premium && (
        <div className="absolute top-1 right-1">
          <Lock className="h-3 w-3 text-gray-400" />
        </div>
      )}
    </div>
  );
};

// Helper function to render different corner styles
const renderCorner = (type: QRCornerType) => {
  switch (type) {
    case 'square':
      return (
        <div className="w-8 h-8 border-t-2 border-l-2 border-black"></div>
      );
    
    case 'dot':
      return (
        <div className="w-8 h-8 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-black"></div>
        </div>
      );
    
    case 'rounded':
      return (
        <div className="w-8 h-8 border-t-2 border-l-2 border-black rounded-tl-md"></div>
      );
    
    case 'edge-cut':
      return (
        <div className="w-8 h-8 relative">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-black"
               style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)' }}></div>
        </div>
      );
    
    case 'extra-rounded':
      return (
        <div className="w-8 h-8 border-t-2 border-l-2 border-black rounded-tl-xl"></div>
      );
    
    case 'circular':
      return (
        <div className="w-8 h-8 border-2 border-black rounded-full"></div>
      );
    
    case 'pointed':
      return (
        <div className="w-8 h-8 relative">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-black"
               style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
        </div>
      );
    
    case 'edge-round':
      return (
        <div className="w-8 h-8 relative">
          <div className="w-6 h-6 border-t-2 border-l-2 border-black" 
               style={{ borderTopLeftRadius: '8px' }}></div>
        </div>
      );
    
    case 'fancy':
      return (
        <div className="w-8 h-8 relative">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-black"
               style={{ 
                 borderTopLeftRadius: '5px',
                 background: 'linear-gradient(135deg, black 0%, black 20%, transparent 20%)'
               }}></div>
        </div>
      );
    
    default:
      return (
        <div className="w-8 h-8 border-t-2 border-l-2 border-black"></div>
      );
  }
};

export default QRCodeCornerThumbnail;
