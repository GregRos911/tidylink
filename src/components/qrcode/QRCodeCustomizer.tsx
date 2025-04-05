
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Lock, Upload, X, Image, Facebook, Instagram, Twitter, Linkedin, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { LinkData } from '@/services/links';
import QRCodePreview from './QRCodePreview';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface QRCodeDesign {
  pattern: string;
  cornerStyle: string;
  foregroundColor: string;
  backgroundColor: string;
  cornerColor: string | null;
  centerIcon: string | null;
  customText: string | null;
  frameStyle: string | null;
  logoUrl: string | null;
  name: string;
}

interface QRCodeCustomizerProps {
  design: QRCodeDesign;
  onDesignChange: (design: QRCodeDesign) => void;
  selectedLinkData: LinkData | null;
}

const QRCodeCustomizer: React.FC<QRCodeCustomizerProps> = ({ 
  design, 
  onDesignChange,
  selectedLinkData
}) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  // Color presets
  const colorPresets = [
    '#000000', // Black
    '#ea384c', // Red
    '#F97316', // Orange
    '#10B981', // Green
    '#0EA5E9', // Blue
    '#4F46E5', // Indigo
    '#8B5CF6', // Purple
    '#EC4899', // Pink
  ];
  
  // QR patterns - All available now (removed premium flag)
  const patterns = [
    { id: 'square', name: 'Square' },
    { id: 'rounded', name: 'Rounded' },
    { id: 'dots', name: 'Dots' },
    { id: 'classy', name: 'Classy' },
    { id: 'classy-rounded', name: 'Classy Rounded' },
    { id: 'extra-rounded', name: 'Extra Rounded' },
  ];
  
  // Corner styles - All available now
  const cornerStyles = [
    { id: 'square', name: 'Square' },
    { id: 'rounded', name: 'Rounded' },
    { id: 'dots', name: 'Dots' },
    { id: 'extra-rounded', name: 'Extra Rounded' },
    { id: 'circle', name: 'Circle' },
  ];
  
  // Frame styles - All available now
  const frameStyles = [
    { id: null, name: 'None' },
    { id: 'simple', name: 'Simple' },
    { id: 'rounded', name: 'Rounded' },
    { id: 'scanme-bottom', name: 'Scan Me (Bottom)' },
    { id: 'scanme-cursive', name: 'Scan Me (Cursive)' },
    { id: 'scanme-top', name: 'Scan Me (Top)' },
  ];
  
  // Center icons - All available now
  const centerIcons = [
    { id: null, name: 'None', icon: <X className="h-5 w-5" /> },
    { id: 'upload', name: 'Upload', icon: <Upload className="h-5 w-5" /> },
    { id: 'custom-text', name: 'Custom Text', icon: <span className="text-xs font-bold">TEXT</span> },
    { id: 'pinterest', name: 'Pinterest', icon: <div className="h-5 w-5 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs">P</div> },
    { id: 'facebook', name: 'Facebook', icon: <Facebook className="h-5 w-5 text-blue-600" /> },
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="h-5 w-5 text-pink-600" /> },
  ];
  
  const handleColorChange = (type: 'foreground' | 'background' | 'corner', color: string) => {
    if (type === 'foreground') {
      onDesignChange({ ...design, foregroundColor: color });
    } else if (type === 'background') {
      onDesignChange({ ...design, backgroundColor: color });
    } else {
      onDesignChange({ ...design, cornerColor: color });
    }
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Logo file is too large. Maximum size is 5MB.');
        return;
      }
      
      setLogoFile(file);
      // In a real application, you would upload this to storage
      // For now, we'll just create a temporary URL
      const logoUrl = URL.createObjectURL(file);
      onDesignChange({ ...design, logoUrl });
    }
  };
  
  return (
    <div className="grid md:grid-cols-5 gap-6">
      {/* QR Code Preview */}
      <div className="md:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <QRCodePreview 
              design={design} 
              value={selectedLinkData ? selectedLinkData.short_url : "https://ti.dy/example"}
            />
            <Input
              className="mt-4 text-center"
              value={design.name}
              onChange={(e) => onDesignChange({ ...design, name: e.target.value })}
              placeholder="QR Code Name"
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Customization Options */}
      <div className="md:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Customize Your QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="style">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
                <TabsTrigger value="colors" className="flex-1">Colors</TabsTrigger>
                <TabsTrigger value="logo" className="flex-1">Logo & Icon</TabsTrigger>
                <TabsTrigger value="frame" className="flex-1">Frame</TabsTrigger>
              </TabsList>
              
              {/* Styles Tab */}
              <TabsContent value="style" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Patterns</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {patterns.map((pattern) => (
                      <div
                        key={pattern.id}
                        className={`
                          border rounded-md p-2 flex items-center justify-center cursor-pointer
                          ${design.pattern === pattern.id ? 'border-brand-blue' : 'border-gray-200'}
                        `}
                        onClick={() => onDesignChange({ ...design, pattern: pattern.id })}
                      >
                        <div className="w-12 h-12 flex items-center justify-center">
                          {/* Pattern preview would go here */}
                          <span className="text-xs">{pattern.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Corner Styles</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {cornerStyles.map((corner) => (
                      <div
                        key={corner.id}
                        className={`
                          border rounded-md p-2 flex items-center justify-center cursor-pointer
                          ${design.cornerStyle === corner.id ? 'border-brand-blue' : 'border-gray-200'}
                        `}
                        onClick={() => onDesignChange({ ...design, cornerStyle: corner.id })}
                      >
                        <div className="w-12 h-12 flex items-center justify-center">
                          {/* Corner style preview would go here */}
                          <span className="text-xs">{corner.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              {/* Colors Tab */}
              <TabsContent value="colors" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">QR Code Color</h3>
                  <div className="grid grid-cols-8 gap-2 mb-4">
                    {colorPresets.map((color) => (
                      <div
                        key={color}
                        className={`
                          w-10 h-10 rounded-full cursor-pointer
                          ${design.foregroundColor === color ? 'ring-2 ring-offset-2 ring-brand-blue' : ''}
                        `}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange('foreground', color)}
                      />
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Label htmlFor="fg-color" className="min-w-24">Custom color</Label>
                    <div className="flex-1 relative">
                      <Input
                        id="fg-color"
                        type="color"
                        value={design.foregroundColor}
                        className="pl-12"
                        onChange={(e) => handleColorChange('foreground', e.target.value)}
                      />
                      <div 
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-sm"
                        style={{ backgroundColor: design.foregroundColor }}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Background Color</h3>
                  <div className="grid grid-cols-8 gap-2 mb-4">
                    {['#FFFFFF', '#F1F0FB', '#FEF7CD', '#F2FCE2', '#FDE1D3', '#D3E4FD', '#E5DEFF', '#FFDEE2'].map((color) => (
                      <div
                        key={color}
                        className={`
                          w-10 h-10 rounded-full cursor-pointer border border-gray-200
                          ${design.backgroundColor === color ? 'ring-2 ring-offset-2 ring-brand-blue' : ''}
                        `}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange('background', color)}
                      />
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Label htmlFor="bg-color" className="min-w-24">Custom color</Label>
                    <div className="flex-1 relative">
                      <Input
                        id="bg-color"
                        type="color"
                        value={design.backgroundColor}
                        className="pl-12"
                        onChange={(e) => handleColorChange('background', e.target.value)}
                      />
                      <div 
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-sm border border-gray-200"
                        style={{ backgroundColor: design.backgroundColor }}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium">Corner Color</h3>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="use-corner-color">Use QR Code color</Label>
                      <Switch 
                        id="use-corner-color" 
                        checked={!design.cornerColor}
                        onCheckedChange={(checked) => 
                          onDesignChange({ ...design, cornerColor: checked ? null : design.foregroundColor })
                        }
                      />
                    </div>
                  </div>
                  
                  {design.cornerColor !== null && (
                    <>
                      <div className="grid grid-cols-8 gap-2 mb-4">
                        {colorPresets.map((color) => (
                          <div
                            key={color}
                            className={`
                              w-10 h-10 rounded-full cursor-pointer
                              ${design.cornerColor === color ? 'ring-2 ring-offset-2 ring-brand-blue' : ''}
                            `}
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange('corner', color)}
                          />
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Label htmlFor="corner-color" className="min-w-24">Custom color</Label>
                        <div className="flex-1 relative">
                          <Input
                            id="corner-color"
                            type="color"
                            value={design.cornerColor || '#000000'}
                            className="pl-12"
                            onChange={(e) => handleColorChange('corner', e.target.value)}
                          />
                          <div 
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-sm"
                            style={{ backgroundColor: design.cornerColor || '#000000' }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
              
              {/* Logo & Icon Tab */}
              <TabsContent value="logo" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Add a Logo or Center Icon</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {centerIcons.map((icon) => (
                      <div
                        key={icon.id || 'none'}
                        className={`
                          border rounded-md p-4 flex items-center justify-center cursor-pointer
                          ${design.centerIcon === icon.id ? 'border-brand-blue' : 'border-gray-200'}
                        `}
                        onClick={() => onDesignChange({ ...design, centerIcon: icon.id })}
                      >
                        {icon.icon}
                      </div>
                    ))}
                  </div>
                  
                  {design.centerIcon === 'upload' && (
                    <div className="mt-4">
                      <Label htmlFor="logo-upload" className="block mb-2">Upload Logo</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                        <Input 
                          id="logo-upload" 
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                        <Label htmlFor="logo-upload" className="cursor-pointer block">
                          <Image className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500 mb-1">PNG, JPG up to 5MB</p>
                          <p className="text-xs text-gray-400">1:1 aspect ratio recommended</p>
                        </Label>
                      </div>
                    </div>
                  )}
                  
                  {design.centerIcon === 'custom-text' && (
                    <div className="mt-4">
                      <Label htmlFor="custom-text" className="block mb-2">Custom Text</Label>
                      <Input 
                        id="custom-text" 
                        placeholder="Enter text (max 5 chars)" 
                        maxLength={5}
                        value={design.customText || ''}
                        onChange={(e) => onDesignChange({ ...design, customText: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Frame Tab */}
              <TabsContent value="frame" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Select a Frame</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {frameStyles.map((frame) => (
                      <div
                        key={frame.id || 'none'}
                        className={`
                          border rounded-md p-4 flex items-center justify-center cursor-pointer
                          ${design.frameStyle === frame.id ? 'border-brand-blue' : 'border-gray-200'}
                        `}
                        onClick={() => onDesignChange({ ...design, frameStyle: frame.id })}
                      >
                        <div className="w-16 h-16 flex items-center justify-center border border-gray-200">
                          {frame.id?.includes('scanme') && (
                            <div className="text-xs font-semibold">SCAN ME</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRCodeCustomizer;
