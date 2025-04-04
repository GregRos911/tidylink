
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';

const DomainInput: React.FC = () => {
  return (
    <div className="w-1/2">
      <Label htmlFor="domain" className="block mb-2 font-medium flex items-center">
        Domain <Lock className="w-4 h-4 ml-1 text-gray-500" />
      </Label>
      <div className="relative">
        <Input
          id="domain"
          value="ti.dy"
          readOnly
          className="w-full bg-gray-50"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-gray-500"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DomainInput;
