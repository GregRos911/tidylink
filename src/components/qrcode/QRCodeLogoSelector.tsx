
import React from 'react';
import { Lock, Upload, X, Github, Facebook, Instagram, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface QRCodeLogoSelectorProps {
  logo: string;
  setLogo: (logo: string) => void;
}

const QRCodeLogoSelector: React.FC<QRCodeLogoSelectorProps> = ({
  logo,
  setLogo
}) => {
  const handleLogoSelect = (logoType: string) => {
    // Premium check would normally go here
    if (logoType === 'upload') {
      // Mock file upload - in a real app this would open a file picker
      toast.info('File upload would open here');
    } else if (logoType === 'remove') {
      setLogo('');
    } else if (logoType === 'instagram') {
      setLogo('instagram');
    } else if (logoType === 'facebook') {
      setLogo('facebook');
    } else if (logoType === 'github') {
      setLogo('github');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Add a logo or center text</h2>
        <Button variant="outline" size="sm" className="bg-gray-700 text-white" disabled>
          <Lock className="h-3 w-3 mr-1" />
          Upgrade
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="lg" className="h-16 w-16 p-0" onClick={() => handleLogoSelect('remove')}>
          <X className="h-6 w-6" />
        </Button>
        <Button variant="outline" size="lg" className="h-16 w-16 p-0" onClick={() => handleLogoSelect('upload')}>
          <Upload className="h-6 w-6" />
        </Button>
        <Button variant="outline" size="lg" className="h-16 w-16 p-0 flex flex-col items-center justify-center">
          <span className="text-xs">CUSTOM</span>
          <span className="text-xs">TEXT</span>
        </Button>
        <Button variant="outline" size="lg" className="h-16 w-16 p-0" onClick={() => handleLogoSelect('github')}>
          <Github className="h-6 w-6" />
        </Button>
        <Button variant="outline" size="lg" className="h-16 w-16 p-0" onClick={() => handleLogoSelect('facebook')}>
          <Facebook className="h-6 w-6" />
        </Button>
        <Button variant="outline" size="lg" className="h-16 w-16 p-0" onClick={() => handleLogoSelect('instagram')}>
          <Instagram className="h-6 w-6" />
        </Button>
        <Button variant="ghost" className="text-blue-600 flex items-center">
          <Plus className="h-4 w-4 mr-1" />
          More
        </Button>
      </div>
      
      <p className="text-sm text-gray-500">
        File type: PNG. 1:1 aspect ratio. Max size: 5MB, 2500x2500px
      </p>
    </div>
  );
};

export default QRCodeLogoSelector;
