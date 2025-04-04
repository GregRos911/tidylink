
import React from 'react';
import DomainInput from './DomainInput';
import CustomBackhalfInput from './CustomBackhalfInput';

interface ShortLinkSectionProps {
  customBackHalf: string;
  setCustomBackHalf: (value: string) => void;
  canUseCustomBackHalf: boolean;
  remainingCustomBackHalves: number;
}

const ShortLinkSection: React.FC<ShortLinkSectionProps> = ({
  customBackHalf,
  setCustomBackHalf,
  canUseCustomBackHalf,
  remainingCustomBackHalves
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Short link</h3>
      
      <div className="flex items-center gap-2 mb-4">
        {/* Domain (locked) */}
        <DomainInput />
        
        <div className="flex items-center justify-center mt-6">
          <span className="text-gray-500 text-xl">/</span>
        </div>
        
        {/* Custom back-half */}
        <CustomBackhalfInput 
          customBackHalf={customBackHalf}
          setCustomBackHalf={setCustomBackHalf}
          canUseCustomBackHalf={canUseCustomBackHalf}
          remainingCustomBackHalves={remainingCustomBackHalves}
        />
      </div>
    </div>
  );
};

export default ShortLinkSection;
