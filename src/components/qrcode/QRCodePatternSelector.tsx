
import React from 'react';
import { Lock, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { qrCodeTemplates } from './qrCodeTemplates';

interface Pattern {
  value: string;
  premium: boolean;
}

interface QRCodePatternSelectorProps {
  pattern: string;
  setPattern: (pattern: string) => void;
  patterns: Pattern[];
}

const QRCodePatternSelector: React.FC<QRCodePatternSelectorProps> = ({
  pattern,
  setPattern,
  patterns,
}) => {
  return (
    <div>
      <h3 className="font-medium mb-2">Patterns</h3>
      <div className="flex flex-wrap gap-2">
        {patterns.map((patternOption) => {
          // Find matching template from qrCodeTemplates
          const template = qrCodeTemplates.find(t => t.id === `template-${patternOption.value}`);
          
          return (
            <div 
              key={patternOption.value}
              className={`relative w-14 h-14 border rounded cursor-pointer flex items-center justify-center
                ${pattern === patternOption.value ? 'border-blue-500 border-2' : 'border-gray-300'}
                ${patternOption.premium ? 'opacity-80' : ''}`}
              onClick={() => !patternOption.premium && setPattern(patternOption.value)}
            >
              {template ? (
                <div className="w-10 h-10 flex items-center justify-center">
                  <img 
                    src={template.image} 
                    alt={`Pattern ${patternOption.value}`}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      console.error(`Failed to load image: ${template.image}`);
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-8 h-8 bg-black rounded-sm"></div>';
                    }}
                  />
                </div>
              ) : (
                <div className="w-8 h-8 bg-black rounded-sm"></div>
              )}
              
              {patternOption.premium && (
                <div className="absolute top-1 right-1">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
          );
        })}
        <Button variant="ghost" className="text-blue-600 flex items-center">
          <Plus className="h-4 w-4 mr-1" />
          More
        </Button>
      </div>
    </div>
  );
};

export default QRCodePatternSelector;
