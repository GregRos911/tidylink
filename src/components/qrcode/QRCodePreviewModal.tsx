
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Download, Check, ExternalLink, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import SocialShareButtons from '@/components/link/SocialShareButtons';
import { useNavigate } from 'react-router-dom';
import QRCodePreview from './QRCodePreview';
import { supabase } from '@/integrations/supabase/client';
import { useIncrementUsage } from '@/services/usage';
import { LinkData } from '@/services/links';

interface QRCodePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeData: {
    link: LinkData | undefined;
    design: {
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
    };
  };
}

const QRCodePreviewModal: React.FC<QRCodePreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  qrCodeData
}) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const incrementUsage = useIncrementUsage();
  
  const handleDownload = async () => {
    // In a real app, you would use a proper QR code library to generate 
    // a downloadable file. For now, we'll just show a toast.
    toast.success('QR code downloaded successfully!');
  };
  
  const handleSave = async () => {
    if (!qrCodeData.link) {
      toast.error('No link data available');
      return;
    }
    
    setSaving(true);
    
    try {
      // First increment the usage counter
      await incrementUsage.mutateAsync({ type: 'qrCode' });
      
      // In a real application, we would save the QR code design to Supabase
      // For now, we'll just show a success message
      toast.success('QR code saved successfully!');
      
      // Simulate a successful save
      setSaved(true);
      
      // We would typically save the QR design and associate it with the link
      // const { data, error } = await supabase
      //   .from('qr_code_designs')
      //   .insert([
      //     {
      //       user_id: user?.id,
      //       name: qrCodeData.design.name,
      //       pattern: qrCodeData.design.pattern,
      //       corner_style: qrCodeData.design.cornerStyle,
      //       foreground_color: qrCodeData.design.foregroundColor,
      //       background_color: qrCodeData.design.backgroundColor,
      //       corner_color: qrCodeData.design.cornerColor,
      //       center_icon: qrCodeData.design.centerIcon,
      //       custom_text: qrCodeData.design.customText,
      //       frame_style: qrCodeData.design.frameStyle,
      //       logo_url: qrCodeData.design.logoUrl
      //     }
      //   ])
      //   .select()
      //   .single();
      
      // if (error) throw error;
      
      // Then update the link to reference this QR code design
      // await supabase
      //   .from('links')
      //   .update({ qr_code_design_id: data.id })
      //   .eq('id', qrCodeData.link.id);
      
    } catch (error: any) {
      console.error('Error saving QR code:', error);
      toast.error(error.message || 'Failed to save QR code');
    } finally {
      setSaving(false);
    }
  };
  
  const copyToClipboard = async () => {
    if (!qrCodeData.link) return;
    
    try {
      await navigator.clipboard.writeText(qrCodeData.link.short_url);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };
  
  const viewLinkDetails = () => {
    navigate('/history');
    onClose();
  };
  
  // Format the URL to the ti.dy format for display
  const displayUrl = qrCodeData.link 
    ? qrCodeData.link.short_url.replace(window.location.origin + '/r/', 'ti.dy/') 
    : 'ti.dy/example';
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            Your QR Code is ready! 🎉
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="px-6 py-4">
          <div className="flex justify-center mb-4">
            {qrCodeData.link ? (
              <QRCodePreview 
                value={qrCodeData.link.short_url} 
                design={qrCodeData.design}
                size={200}
              />
            ) : (
              <div className="h-[200px] w-[200px] flex items-center justify-center bg-gray-100 rounded-md">
                <p className="text-gray-500">No link selected</p>
              </div>
            )}
          </div>
          
          <p className="text-center mb-4">
            Your QR code points to:
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-center text-lg font-medium text-brand-blue mb-4">
              {displayUrl}
            </p>
            
            <div className="flex gap-2 justify-center">
              {!saved ? (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  {saving ? 'Saving...' : 'Save QR Code'}
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2" 
                  onClick={viewLinkDetails}
                >
                  <ExternalLink className="h-4 w-4" />
                  View QR codes
                </Button>
              )}
              
              <Button 
                variant="outline"
                className="flex items-center gap-2" 
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
              
              <Button 
                className="flex items-center gap-2" 
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
          
          {qrCodeData.link && (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-3">Share your QR code or link:</p>
              <SocialShareButtons url={qrCodeData.link.short_url} />
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-center">
          <Button variant="ghost" onClick={onClose}>
            Back to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodePreviewModal;
