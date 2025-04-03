
import React from 'react';
import { Lock } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface QRCodeAdvancedOptionsProps {
  hideBitlyLogo: boolean;
  setHideBitlyLogo: (hide: boolean) => void;
}

const QRCodeAdvancedOptions: React.FC<QRCodeAdvancedOptionsProps> = ({
  hideBitlyLogo,
  setHideBitlyLogo
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Advanced options</h2>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="hide-bitly-logo"
            checked={hideBitlyLogo}
            onCheckedChange={setHideBitlyLogo}
            disabled
          />
          <Label htmlFor="hide-bitly-logo">TidyLink logo</Label>
        </div>
        <Button variant="outline" size="sm" className="bg-gray-700 text-white" disabled>
          <Lock className="h-3 w-3 mr-1" />
          Upgrade
        </Button>
      </div>
    </div>
  );
};

export default QRCodeAdvancedOptions;
