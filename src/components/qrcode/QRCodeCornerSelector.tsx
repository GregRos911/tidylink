
import React from 'react';
import { Lock } from 'lucide-react';

interface CornerType {
  value: string;
  premium: boolean;
}

interface QRCodeCornerSelectorProps {
  cornerType: string;
  setCornerType: (cornerType: string) => void;
  cornerTypes: CornerType[];
}

const QRCodeCornerSelector: React.FC<QRCodeCornerSelectorProps> = ({
  cornerType,
  setCornerType,
  cornerTypes,
}) => {
  return (
    <div>
      <h3 className="font-medium mb-2">Corners</h3>
      <div className="flex flex-wrap gap-2">
        {cornerTypes.map((cornerOption) => (
          <div 
            key={cornerOption.value}
            className={`relative w-12 h-12 border rounded cursor-pointer flex items-center justify-center
              ${cornerType === cornerOption.value ? 'border-blue-500 border-2' : 'border-gray-300'}
              ${cornerOption.premium ? 'opacity-80' : ''}`}
            onClick={() => !cornerOption.premium && setCornerType(cornerOption.value as any)}
          >
            <div className="w-6 h-6 border-2 border-black"></div>
            {cornerOption.premium && (
              <div className="absolute top-1 right-1">
                <Lock className="h-3 w-3 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRCodeCornerSelector;
