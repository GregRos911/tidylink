
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, X } from 'lucide-react';
import { toast } from 'sonner';
import SocialShareButtons from './SocialShareButtons';
import { useNavigate } from 'react-router-dom';

interface LinkSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortUrl: string;
  linkId?: string;
}

const LinkSuccessModal: React.FC<LinkSuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  shortUrl,
  linkId
}) => {
  const navigate = useNavigate();
  
  // Format the URL to the ti.dy format for display
  const displayUrl = shortUrl.replace(window.location.origin + '/r/', 'ti.dy/');
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };
  
  const viewLinkDetails = () => {
    if (linkId) {
      navigate(`/links/${linkId}`);
    } else {
      navigate('/links');
    }
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            Your link is ready! 🎉
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="px-6 py-4">
          <p className="text-center mb-4">
            Copy the link below to share it or choose a platform to share it to.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-center text-lg font-medium text-brand-blue mb-4">
              {displayUrl}
            </p>
            
            <div className="flex gap-2 justify-center">
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={viewLinkDetails}
              >
                <ExternalLink className="h-4 w-4" />
                View link details
              </Button>
              <Button 
                className="flex items-center gap-2" 
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
                Copy link
              </Button>
            </div>
          </div>
          
          <SocialShareButtons url={shortUrl} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkSuccessModal;
