
import React from 'react';
import { Lock, Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Frame {
  value: string;
  label: string;
  premium: boolean;
}

interface QRCodeFrameSelectorProps {
  selectedFrame: string;
  setSelectedFrame: (frame: string) => void;
  frames: Frame[];
}

const QRCodeFrameSelector: React.FC<QRCodeFrameSelectorProps> = ({
  selectedFrame,
  setSelectedFrame,
  frames
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Select a frame</h2>
      
      <div className="flex flex-wrap gap-2">
        {frames.map((frame) => (
          <div 
            key={frame.value}
            className={`relative w-16 h-16 border rounded cursor-pointer flex items-center justify-center
              ${selectedFrame === frame.value ? 'border-blue-500 border-2' : 'border-gray-300'}
              ${frame.premium ? 'opacity-80' : ''}`}
            onClick={() => !frame.premium && setSelectedFrame(frame.value)}
          >
            {frame.value === 'none' ? (
              <X className="h-5 w-5" />
            ) : (
              <div className="w-10 h-10 border border-black rounded-sm"></div>
            )}
            {frame.premium && (
              <div className="absolute top-1 right-1">
                <Lock className="h-3 w-3 text-gray-400" />
              </div>
            )}
          </div>
        ))}
        <Button variant="ghost" className="text-blue-600 flex items-center">
          <Plus className="h-4 w-4 mr-1" />
          More
        </Button>
      </div>
    </div>
  );
};

export default QRCodeFrameSelector;
