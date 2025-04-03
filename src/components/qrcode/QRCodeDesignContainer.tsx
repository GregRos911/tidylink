
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { QRTemplate, qrCodeTemplates } from './qrCodeTemplates';
import QRCodeTemplateSelector from './QRCodeTemplateSelector';
import QRCodeStyleOptions from './QRCodeStyleOptions';
import QRCodeColorSelector from './QRCodeColorSelector';
import QRCodeLogoSelector from './QRCodeLogoSelector';
import QRCodeFrameSelector from './QRCodeFrameSelector';
import QRCodeAdvancedOptions from './QRCodeAdvancedOptions';
import QRCodePreview from './QRCodePreview';

interface QRCodeDesignContainerProps {
  url: string;
  qrCodesRemaining: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleGenerateQRCode: () => void;
}

const QRCodeDesignContainer: React.FC<QRCodeDesignContainerProps> = ({
  url,
  qrCodesRemaining,
  activeTab,
  setActiveTab,
  handleGenerateQRCode
}) => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  // QR code customization options
  const [pattern, setPattern] = React.useState<'square' | 'rounded' | 'dot' | 'classy' | 'extra-rounded'>('square');
  const [cornerType, setCornerType] = React.useState<'square' | 'rounded' | 'dot'>('square');
  const [foregroundColor, setForegroundColor] = React.useState('#000000');
  const [backgroundColor, setBackgroundColor] = React.useState('#FFFFFF');
  const [useCustomCornerColor, setUseCustomCornerColor] = React.useState(false);
  const [logo, setLogo] = React.useState<string>('');
  const [selectedFrame, setSelectedFrame] = React.useState<string>('none');
  const [hideBitlyLogo, setHideBitlyLogo] = React.useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>('');
  
  // QR code patterns with premium indicators
  const patterns = [
    { value: 'square', premium: false },
    { value: 'dot', premium: false },
    { value: 'rounded', premium: true },
    { value: 'classy', premium: true },
    { value: 'extra-rounded', premium: true },
  ];
  
  // Corner types with premium indicators
  const cornerTypes = [
    { value: 'square', premium: false },
    { value: 'dot', premium: false },
    { value: 'rounded', premium: true },
  ];
  
  // Color presets
  const colorPresets = [
    '#000000', // Black
    '#E74C3C', // Red
    '#F39C12', // Orange
    '#27AE60', // Green
    '#3498DB', // Blue
    '#2980B9', // Dark Blue
    '#8E44AD', // Purple
    '#E91E63', // Pink
  ];
  
  // Frames with premium indicators
  const frames = [
    { value: 'none', label: 'None', premium: false },
    { value: 'simple', label: 'Simple', premium: false },
    { value: 'rounded', label: 'Rounded', premium: false },
    { value: 'scan-me-bottom', label: 'Scan Me (Bottom)', premium: true },
    { value: 'scan-me-fancy', label: 'Scan Me (Fancy)', premium: true },
    { value: 'scan-me-top', label: 'Scan Me (Top)', premium: true },
  ];
  
  // Function to handle template selection
  const handleTemplateSelect = (templateId: string) => {
    // Reset pattern selection if a template is selected
    if (templateId) {
      setPattern('square');
      setCornerType('square');
    }
    
    // Toggle template if clicking the same one again
    if (selectedTemplateId === templateId) {
      setSelectedTemplateId('');
    } else {
      setSelectedTemplateId(templateId);
    }
  };

  // Filter templates to show only available ones
  const availableTemplates = qrCodeTemplates.filter(template => 
    !template.premium || (template.premium && user?.publicMetadata?.plan === 'premium')
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Column - QR Code Configuration */}
      <div className="flex-1">
        <Tabs defaultValue="design" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Design QR Code
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="design" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <h1 className="text-2xl font-bold mb-2">Customize Your QR Code</h1>
                <p className="text-muted-foreground mb-4">
                  You can create {qrCodesRemaining} more codes this month.
                </p>
                
                {/* Template Selection Section */}
                <QRCodeTemplateSelector 
                  availableTemplates={availableTemplates}
                  selectedTemplateId={selectedTemplateId}
                  handleTemplateSelect={handleTemplateSelect}
                />
                
                {/* Select Styles Section - Only show if no template is selected */}
                {!selectedTemplateId && (
                  <QRCodeStyleOptions 
                    pattern={pattern}
                    setPattern={setPattern}
                    cornerType={cornerType}
                    setCornerType={setCornerType}
                    patterns={patterns}
                    cornerTypes={cornerTypes}
                  />
                )}
                
                {/* Choose Colors Section - Only show if no template is selected */}
                {!selectedTemplateId && (
                  <QRCodeColorSelector 
                    colorPresets={colorPresets}
                    foregroundColor={foregroundColor}
                    setForegroundColor={setForegroundColor}
                    backgroundColor={backgroundColor}
                    setBackgroundColor={setBackgroundColor}
                    useCustomCornerColor={useCustomCornerColor}
                    setUseCustomCornerColor={setUseCustomCornerColor}
                  />
                )}
                
                {/* Add Logo Section - Only show if no template is selected */}
                {!selectedTemplateId && (
                  <QRCodeLogoSelector 
                    logo={logo}
                    setLogo={setLogo}
                  />
                )}
                
                {/* Frame Selection - Only show if no template is selected */}
                {!selectedTemplateId && (
                  <QRCodeFrameSelector 
                    selectedFrame={selectedFrame}
                    setSelectedFrame={setSelectedFrame}
                    frames={frames}
                  />
                )}
                
                {/* Advanced Options */}
                <QRCodeAdvancedOptions 
                  hideBitlyLogo={hideBitlyLogo}
                  setHideBitlyLogo={setHideBitlyLogo}
                />
              </CardContent>
            </Card>
            
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerateQRCode}
                disabled={!url}
                className="bg-brand-blue hover:bg-brand-blue/90"
              >
                Generate QR code
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Right Column - QR Code Preview */}
      <div className="w-full lg:w-[350px]">
        <div className="bg-white p-4 rounded-lg border sticky top-20">
          <h3 className="text-center text-lg font-medium mb-4">Preview</h3>
          <div className="flex justify-center">
            <QRCodePreview
              url={url || 'https://example.com'}
              size={250}
              logo={logo}
              cornerType={cornerType}
              dotsType={pattern}
              backgroundColor={backgroundColor}
              foregroundColor={foregroundColor}
              templateId={selectedTemplateId}
            />
          </div>
          {url && (
            <div className="mt-4">
              <Button className="w-full" onClick={() => window.open(url, '_blank')}>
                View QR Code
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeDesignContainer;
