
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QrCode, Link as LinkIcon } from 'lucide-react';

interface LinkHistoryEmptyProps {
  message?: string;
}

const LinkHistoryEmpty: React.FC<LinkHistoryEmptyProps> = ({ 
  message = "You haven't created any links yet" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-background border rounded-md">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <LinkIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No links found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {message}
      </p>
      <div className="flex gap-4">
        <Link to="/dashboard">
          <Button>
            Create a link
          </Button>
        </Link>
        <Link to="/qr-codes">
          <Button variant="outline" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            Create QR code
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LinkHistoryEmpty;
