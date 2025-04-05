
import React from 'react';
import { InfoIcon } from 'lucide-react';

const EmailInfoAlert: React.FC = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <InfoIcon className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">Important</h3>
          <p className="text-sm text-yellow-700 mt-1">
            To prevent your emails from landing in spam, make sure:
          </p>
          <ul className="list-disc list-inside text-sm text-yellow-700 mt-1">
            <li>You've verified your domain with Resend</li>
            <li>Your 'From' email matches your verified domain</li>
            <li>Your email content is relevant to recipients</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailInfoAlert;
