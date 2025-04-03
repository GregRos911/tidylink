
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Lock, 
  Plus, 
  X, 
  Upload, 
  Instagram, 
  Facebook, 
  Github, 
  Eye
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import QRCodePreview from '@/components/qrcode/QRCodePreview';
import QRCodeTemplateThumbnail from '@/components/qrcode/QRCodeTemplateThumbnail';
import { qrCodeTemplates } from '@/components/qrcode/qrCodeTemplates';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import { useIncrementUsage } from '@/services/usage';
import { useUserUsage } from '@/services/usage';
import { FREE_PLAN_LIMITS } from '@/services/usage/constants';

const QRCodeDesignPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { data: usageData, isLoading: isLoadingUsage } = useUserUsage();
  const incrementUsage = useIncrementUsage();
  
  // URL for QR code
  const [url, setUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState('design');
  
  // QR code customization options
  const [pattern, setPattern] = useState<'square' | 'rounded' | 'dot' | 'classy' | 'extra-rounded'>('square');
  const [cornerType, setCornerType] = useState<'square' | 'rounded' | 'dot'>('square');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [useCustomCornerColor, setUseCustomCornerColor] = useState(false);
  const [logo, setLogo] = useState<string>('');
  const [selectedFrame, setSelectedFrame] = useState<string>('none');
  const [hideBitlyLogo, setHideBitlyLogo] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  
  // Calculate remaining QR codes
  const qrCodesRemaining = usageData 
    ? FREE_PLAN_LIMITS.qrCodes - (usageData.qr_codes_used || 0)
    : 0;
  
  // Get URL from state if coming from another page
  useEffect(() => {
    if (location.state?.url) {
      setUrl(location.state.url);
    }
  }, [location]);
  
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
  
  // Function to select color from preset
  const handleColorPresetClick = (color: string) => {
    setForegroundColor(color);
  };
  
  // Function to handle logo selection
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
  
  // Handle QR code generation
  const handleGenerateQRCode = async () => {
    if (!url) {
      toast.error('Please enter a URL for your QR code');
      return;
    }
    
    try {
      // Increment usage counter
      await incrementUsage.mutateAsync({ type: 'qrCode' });
      
      // In a real app, we'd save the QR code to the database here
      toast.success('QR code generated successfully');
      
      // Redirect to dashboard or show download options
      // navigate('/dashboard');
    } catch (error: any) {
      console.error('Error generating QR code:', error);
      toast.error(error.message || 'Failed to generate QR code');
    }
  };

  // Filter templates to show only available ones
  const availableTemplates = qrCodeTemplates.filter(template => 
    !template.premium || (template.premium && user?.publicMetadata?.plan === 'premium')
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar - Hidden on mobile */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <DashboardTopBar setShowCreateLinkCard={() => navigate('/dashboard')} />
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Back button */}
            <div className="mb-4">
              <Button 
                variant="ghost" 
                className="flex items-center text-gray-500" 
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
            
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
                        <div className="space-y-6 mb-8">
                          <h2 className="text-xl font-semibold">Choose a design template</h2>
                          <div className="flex flex-wrap gap-3">
                            {availableTemplates.map((template) => (
                              <QRCodeTemplateThumbnail
                                key={template.id}
                                template={template}
                                isSelected={selectedTemplateId === template.id}
                                onClick={() => handleTemplateSelect(template.id)}
                              />
                            ))}
                          </div>
                        </div>
                        
                        {/* Select Styles Section - Only show if no template is selected */}
                        {!selectedTemplateId && (
                          <div className="space-y-6 mb-8">
                            <h2 className="text-xl font-semibold">Select styles</h2>
                            
                            {/* Patterns */}
                            <div>
                              <h3 className="font-medium mb-2">Patterns</h3>
                              <div className="flex flex-wrap gap-2">
                                {patterns.map((patternOption) => (
                                  <div 
                                    key={patternOption.value}
                                    className={`relative w-14 h-14 border rounded cursor-pointer flex items-center justify-center
                                      ${pattern === patternOption.value ? 'border-blue-500 border-2' : 'border-gray-300'}
                                      ${patternOption.premium ? 'opacity-80' : ''}`}
                                    onClick={() => !patternOption.premium && setPattern(patternOption.value as any)}
                                  >
                                    <div className="w-8 h-8 bg-black rounded-sm"></div>
                                    {patternOption.premium && (
                                      <div className="absolute top-1 right-1">
                                        <Lock className="h-4 w-4 text-gray-400" />
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
                            
                            {/* Corners */}
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
                          </div>
                        )}
                        
                        {/* Choose Colors Section - Only show if no template is selected */}
                        {!selectedTemplateId && (
                          <div className="space-y-6 mb-8">
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
                            
                            {/* Corners Color Toggle */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="corners-color"
                                  checked={useCustomCornerColor}
                                  onCheckedChange={setUseCustomCornerColor}
                                  disabled
                                />
                                <Label htmlFor="corners-color">Use QR Code color</Label>
                              </div>
                              <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        )}
                        
                        {/* Add Logo Section - Only show if no template is selected */}
                        {!selectedTemplateId && (
                          <div className="space-y-6 mb-8">
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
                        )}
                        
                        {/* Frame Selection - Only show if no template is selected */}
                        {!selectedTemplateId && (
                          <div className="space-y-6 mb-8">
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
                        )}
                        
                        {/* Advanced Options */}
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default QRCodeDesignPage;
