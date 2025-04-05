
import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface ResultSummaryProps {
  result: {
    sent: number;
    failed: number;
    total: number;
  };
  onClose: () => void;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ result, onClose }) => {
  return (
    <div className="space-y-6">
      <Alert variant={result.failed > 0 ? "destructive" : "default"}>
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Email sending completed</AlertTitle>
        <AlertDescription>
          Successfully sent {result.sent} of {result.total} emails
          {result.failed > 0 && ` (${result.failed} failed)`}.
        </AlertDescription>
      </Alert>
      
      <DialogFooter>
        <Button 
          type="button" 
          onClick={onClose}
          className="bg-brand-blue hover:bg-brand-blue/90 w-full"
        >
          Close
        </Button>
      </DialogFooter>
    </div>
  );
};

export default ResultSummary;
