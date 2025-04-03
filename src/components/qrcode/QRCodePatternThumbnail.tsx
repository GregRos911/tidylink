
import React from 'react';
import { Lock } from 'lucide-react';

export type QRPatternType = 'square' | 'rounded' | 'dot' | 'classy' | 'extra-rounded' | 'circle' | 'edge-cut';

interface PatternThumbnailProps {
  type: QRPatternType;
  selected: boolean;
  premium: boolean;
  onClick: () => void;
}

const QRCodePatternThumbnail: React.FC<PatternThumbnailProps> = ({
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
        <div className="p-1">
          {renderPattern(type)}
        </div>
      </div>
      {premium && (
        <div className="absolute top-1 right-1">
          <Lock className="h-3 w-3 text-gray-400" />
        </div>
      )}
    </div>
  );
};

// Helper function to render different pattern styles
const renderPattern = (type: QRPatternType) => {
  // Create a 3x3 grid of dots to represent a QR code pattern
  const renderDot = (index: number) => {
    // Only render dots at specific positions for a simplified QR code look
    const shouldRenderDot = [0, 2, 3, 5, 6, 8].includes(index);
    
    if (!shouldRenderDot) return <div key={index} className="w-2 h-2"></div>;
    
    switch (type) {
      case 'square':
        return <div key={index} className="w-2 h-2 bg-black"></div>;
      
      case 'rounded':
        return <div key={index} className="w-2 h-2 bg-black rounded-sm"></div>;
      
      case 'dot':
        return <div key={index} className="w-2 h-2 bg-black rounded-full"></div>;
      
      case 'classy':
        return (
          <div 
            key={index} 
            className="w-2 h-2 bg-black" 
            style={{ 
              clipPath: index % 2 === 0 
                ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 25% 75%, 25% 25%, 75% 25%, 75% 75%)' 
                : '' 
            }}
          ></div>
        );
      
      case 'extra-rounded':
        return <div key={index} className="w-2 h-2 bg-black rounded-lg"></div>;
      
      case 'circle':
        return (
          <div key={index} className="w-2 h-2 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
          </div>
        );
        
      case 'edge-cut':
        return (
          <div 
            key={index} 
            className="w-2 h-2 bg-black" 
            style={{ 
              clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)' 
            }}
          ></div>
        );
        
      default:
        return <div key={index} className="w-2 h-2 bg-black"></div>;
    }
  };

  return (
    <div className="grid grid-cols-3 gap-[2px]">
      {[...Array(9)].map((_, i) => renderDot(i))}
    </div>
  );
};

export default QRCodePatternThumbnail;
