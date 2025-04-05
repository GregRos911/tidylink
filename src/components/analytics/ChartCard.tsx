
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onDownload?: () => void;
  isEmpty?: boolean;
  emptyMessage?: string;
  className?: string;
  heading?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  heading,
  description, 
  children, 
  onDownload, 
  isEmpty = false,
  emptyMessage = "No data available for this chart",
  className = ""
}) => {
  // Use heading if provided, otherwise fall back to title
  const displayTitle = heading || title;

  // Function to handle download (could be implemented to export chart as image or CSV)
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Default fallback for download functionality
      console.log('Download triggered for chart:', displayTitle);
      alert('Download functionality not implemented for this chart');
    }
  };

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg font-medium">{displayTitle}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleDownload}
          className={isEmpty ? 'opacity-50 cursor-not-allowed' : ''}
          disabled={isEmpty}
        >
          <Download className="h-4 w-4" />
          <span className="sr-only">Download {displayTitle} data</span>
        </Button>
      </CardHeader>
      
      <CardContent className="pt-2 h-[280px]">
        {isEmpty ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-center">
            <p>{emptyMessage}</p>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
