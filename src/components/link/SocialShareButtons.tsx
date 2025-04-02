
import React from 'react';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Mail, 
  Youtube,
  MessageCircle,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SocialShareButtonsProps {
  url: string;
}

interface SharePlatform {
  name: string;
  icon: React.ReactNode;
  shareUrl: (url: string) => string;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ url }) => {
  // Format the URL to the ti.dy format for display
  const displayUrl = url.replace(window.location.origin + '/r/', 'ti.dy/');
  
  const sharePlatforms: SharePlatform[] = [
    {
      name: 'WhatsApp',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/><path d="M13.5 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/><path d="M9 13.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0-.5.5Z"/></svg>,
      shareUrl: (url) => `https://wa.me/?text=Check%20out%20this%20link:%20${encodeURIComponent(url)}`
    },
    {
      name: 'Facebook',
      icon: <Facebook className="text-blue-600" />,
      shareUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    },
    {
      name: 'Instagram',
      icon: <Instagram className="text-pink-500" />,
      shareUrl: () => {
        toast.info('Copy the link and paste it into your Instagram post or bio');
        return '#';
      }
    },
    {
      name: 'X',
      icon: <Twitter className="text-black" />,
      shareUrl: (url) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`
    },
    {
      name: 'Threads',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7.9c-1.3-1.4-3.2-2-5.3-1.6C11.5 6.7 10 8.2 9.5 10c-.1.5-.2 1-.2 1.5 0 1.2.4 2.4 1.2 3.3.7.7 1.6 1.2 2.6 1.3h.5c.5 0 1-.1 1.4-.3a4 4 0 0 0 1.3-.7"/><path d="M3 20c1.5-9 12.2-9.5 14.8-1.8"/><path d="M20 4v4"/><path d="M20 4h-4"/></svg>,
      shareUrl: () => {
        toast.info('Copy the link and paste it into your Threads post');
        return '#';
      }
    },
    {
      name: 'Email',
      icon: <Mail className="text-gray-500" />,
      shareUrl: (url) => `mailto:?subject=Check%20out%20this%20link&body=I%20thought%20you%20might%20find%20this%20interesting:%20${encodeURIComponent(url)}`
    },
    {
      name: 'TikTok',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>,
      shareUrl: () => {
        toast.info('Copy the link and paste it into your TikTok video description');
        return '#';
      }
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="text-blue-700" />,
      shareUrl: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },
    {
      name: 'YouTube',
      icon: <Youtube className="text-red-600" />,
      shareUrl: () => {
        toast.info('Copy the link and paste it into your YouTube video description');
        return '#';
      }
    },
    {
      name: 'Telegram',
      icon: <Send className="text-blue-500" />,
      shareUrl: (url) => `https://t.me/share/url?url=${encodeURIComponent(url)}`
    },
    {
      name: 'Messenger',
      icon: <MessageCircle className="text-blue-400" />,
      shareUrl: (url) => `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(window.location.href)}`
    }
  ];
  
  const handleShare = (platform: SharePlatform) => {
    const shareUrl = platform.shareUrl(url);
    
    if (shareUrl !== '#') {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <div>
      <p className="text-center font-medium mb-4">Share on</p>
      <div className="grid grid-cols-5 gap-4">
        {sharePlatforms.map((platform) => (
          <Button 
            key={platform.name}
            variant="outline"
            size="icon"
            className="flex flex-col items-center justify-center h-16 w-16 rounded-md hover:bg-gray-100"
            onClick={() => handleShare(platform)}
          >
            <div className="mb-1">{platform.icon}</div>
            <span className="text-xs">{platform.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SocialShareButtons;
