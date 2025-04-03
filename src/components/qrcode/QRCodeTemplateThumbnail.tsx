
import React from 'react';
import { Lock } from 'lucide-react';
import { QRTemplate } from './qrCodeTemplates';

interface QRCodeTemplateThumbnailProps {
  template: QRTemplate;
  isSelected: boolean;
  onClick: () => void;
}

const QRCodeTemplateThumbnail: React.FC<QRCodeTemplateThumbnailProps> = ({
  template,
  isSelected,
  onClick,
}) => {
  return (
    <div 
      className={`relative w-16 h-16 border rounded cursor-pointer flex items-center justify-center overflow-hidden
        ${isSelected ? 'border-blue-500 border-2' : 'border-gray-300'}
        ${template.premium ? 'opacity-80' : ''}`}
      onClick={onClick}
    >
      <img 
        src={template.image} 
        alt={template.name}
        className="w-full h-full object-contain"
      />
      {template.premium && (
        <div className="absolute top-1 right-1">
          <Lock className="h-4 w-4 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default QRCodeTemplateThumbnail;
