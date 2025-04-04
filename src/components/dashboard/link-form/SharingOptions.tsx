
import React from 'react';
import { Switch } from '@/components/ui/switch';

interface SharingOptionsProps {
  generateQrCode: boolean;
  setGenerateQrCode: (value: boolean) => void;
  remainingQrCodes: number;
  canGenerateQrCode: boolean;
}

const SharingOptions: React.FC<SharingOptionsProps> = ({
  generateQrCode,
  setGenerateQrCode,
  remainingQrCodes,
  canGenerateQrCode
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Ways to share</h3>
      
      {/* QR Code toggle */}
      <div className="flex items-center justify-between py-3 border-b">
        <div>
          <h4 className="font-medium">QR Code</h4>
          <p className="text-sm text-gray-600">
            Generate a QR Code to share anywhere people can see it
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{remainingQrCodes} left</span>
          <Switch
            checked={generateQrCode}
            onCheckedChange={setGenerateQrCode}
            disabled={!canGenerateQrCode}
          />
        </div>
      </div>
      
      {/* TidyLink Page toggle (optional/future feature) */}
      <div className="flex items-center justify-between py-3">
        <div>
          <h4 className="font-medium">TidyLink Page</h4>
          <p className="text-sm text-gray-600">
            Add this link to your page for people to easily find
          </p>
        </div>
        <Switch disabled />
      </div>
    </div>
  );
};

export default SharingOptions;
