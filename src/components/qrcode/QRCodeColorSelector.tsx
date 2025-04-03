
import React from 'react';
import { Lock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QRCodeColorSelectorProps {
  colorPresets: string[];
  foregroundColor: string;
  setForegroundColor: (color: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  useCustomCornerColor: boolean;
  setUseCustomCornerColor: (use: boolean) => void;
}

const QRCodeColorSelector: React.FC<QRCodeColorSelectorProps> = ({
  colorPresets,
  foregroundColor,
  setForegroundColor,
  backgroundColor,
  setBackgroundColor,
  useCustomCornerColor,
  setUseCustomCornerColor
}) => {
  const handleColorPresetClick = (color: string) => {
    setForegroundColor(color);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Choose your colors</h2>
      
      {/* Color Presets */}
      <div>
        <h3 className="font-medium mb-2">Preset</h3>
        <div className="flex flex-wrap gap-3">
          {colorPresets.map((color) => (
            <div 
              key={color}
              className={`w-10 h-10 rounded-full cursor-pointer 
                ${foregroundColor === color ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorPresetClick(color)}
            />
          ))}
        </div>
      </div>
      
      {/* Code Color */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <h3 className="font-medium mb-2">Code</h3>
          <Select value="single" disabled>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Single color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single color</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <h3 className="font-medium mb-2">Hex value</h3>
          <div className="flex">
            <div className="w-10 h-10 border rounded-l-md flex items-center justify-center">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: foregroundColor }}></div>
            </div>
            <Input 
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value)}
              className="rounded-l-none"
            />
            <div className="ml-2 flex items-center">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Color */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <h3 className="font-medium mb-2">Background</h3>
          <Select value="single" disabled>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Single color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single color</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <h3 className="font-medium mb-2">Hex value</h3>
          <div className="flex">
            <div className="w-10 h-10 border rounded-l-md flex items-center justify-center">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: backgroundColor }}></div>
            </div>
            <Input 
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="rounded-l-none"
            />
            <div className="ml-2 flex items-center">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeColorSelector;
