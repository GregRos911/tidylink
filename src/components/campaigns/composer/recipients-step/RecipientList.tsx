
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Check, AlertTriangle, HelpCircle } from 'lucide-react';

interface RecipientListProps {
  recipients: string[];
  onRemoveEmail: (email: string) => void;
  onClearAll: () => void;
}

const RecipientList: React.FC<RecipientListProps> = ({
  recipients,
  onRemoveEmail,
  onClearAll
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium flex items-center">
          <Check className="h-4 w-4 mr-2" /> Recipient List ({recipients.length}/500)
        </h3>
        {recipients.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 h-auto py-1"
            onClick={onClearAll}
          >
            Clear All
          </Button>
        )}
      </div>
      
      {recipients.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-md">
          <p className="text-gray-500">No recipients added yet</p>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-md p-2 max-h-[200px] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {recipients.map((email) => (
              <div 
                key={email}
                className="bg-white rounded flex items-center justify-between text-sm px-3 py-2 border"
              >
                <span className="truncate">{email}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onRemoveEmail(email)}
                  className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {recipients.length > 0 && recipients.length < 10 && (
        <div className="mt-2 flex items-center text-amber-500 text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          <span>We recommend adding at least 10 recipients for better campaign analytics</span>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500 flex items-start gap-2">
        <HelpCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
        <span>
          Recipients will receive personalized emails with your message and tracking link.
          We'll automatically remove duplicates and validate email formats.
        </span>
      </div>
    </div>
  );
};

export default RecipientList;
