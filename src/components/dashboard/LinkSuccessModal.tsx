
import React, { useState } from 'react';
import { X, Copy, BarChart2, Share2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { LinkData } from '@/services/linkService';
import { 
  FacebookIcon, 
  Instagram, 
  Linkedin, 
  Mail, 
  MessageCircle, 
  Send, 
  Twitter, 
  Youtube, 
  MessagesSquare, 
  Phone 
} from 'lucide-react';

interface LinkSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: LinkData | null;
}

const SharePlatform = ({ 
  icon, 
  name, 
  onClick 
}: { 
  icon: React.ReactNode; 
  name: string; 
  onClick: () => void;
}) => (
  <div className="flex flex-col items-center" onClick={onClick}>
    <div className="p-4 border rounded-md hover:bg-gray-100 cursor-pointer mb-2">
      {icon}
    </div>
    <span className="text-xs">{name}</span>
  </div>
);

const LinkSuccessModal: React.FC<LinkSuccessModalProps> = ({ isOpen, onClose, link }) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  
  if (!link) return null;
  
  const shortUrl = link.short_url;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };
  
  const viewDetails = () => {
    navigate('/links');
    onClose();
  };
  
  const shareToSocial = (platform: string) => {
    let shareUrl = '';
    const text = 'Check out this link I shortened with TidyLink!';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shortUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shortUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shortUrl)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(shortUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Shortened Link')}&body=${encodeURIComponent(text + ' ' + shortUrl)}`;
        break;
      default:
        toast.error('Sharing to this platform is not supported yet');
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            Your link is ready! 🎉
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <p className="text-center mb-6">
            Copy the link below to share it or choose a platform to share it to.
          </p>
          
          <div className="bg-blue-50 p-6 rounded-md text-center mb-6">
            <div className="text-blue-600 text-xl font-medium mb-4">
              {new URL(shortUrl).pathname.slice(1)}
            </div>
            
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={viewDetails}
                className="flex items-center gap-2"
              >
                <BarChart2 className="h-4 w-4" />
                View link details
              </Button>
              
              <Button
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-blue-600"
              >
                {copied ? "Copied!" : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy link
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-4">
            <SharePlatform 
              icon={<MessagesSquare className="h-5 w-5 text-green-500" />} 
              name="WhatsApp"
              onClick={() => shareToSocial('whatsapp')} 
            />
            <SharePlatform 
              icon={<FacebookIcon className="h-5 w-5 text-blue-600" />} 
              name="Facebook" 
              onClick={() => shareToSocial('facebook')}
            />
            <SharePlatform 
              icon={<Instagram className="h-5 w-5 text-pink-600" />} 
              name="Instagram" 
              onClick={() => shareToSocial('instagram')}
            />
            <SharePlatform 
              icon={<Twitter className="h-5 w-5 text-blue-400" />} 
              name="X" 
              onClick={() => shareToSocial('twitter')}
            />
            <SharePlatform 
              icon={<MessageCircle className="h-5 w-5 text-blue-500" />} 
              name="Threads" 
              onClick={() => shareToSocial('threads')}
            />
            <SharePlatform 
              icon={<Mail className="h-5 w-5 text-gray-600" />} 
              name="Email" 
              onClick={() => shareToSocial('email')}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkSuccessModal;
