
import React from 'react';
import QRCodePatternSelector from './QRCodePatternSelector';
import QRCodeCornerSelector from './QRCodeCornerSelector';

interface Pattern {
  value: string;
  premium: boolean;
}

interface CornerType {
  value: string;
  premium: boolean;
}

interface QRCodeStyleOptionsProps {
  pattern: string;
  setPattern: (pattern: string) => void;
  cornerType: string;
  setCornerType: (cornerType: string) => void;
  patterns: Pattern[];
  cornerTypes: CornerType[];
}

const QRCodeStyleOptions: React.FC<QRCodeStyleOptionsProps> = ({
  pattern,
  setPattern,
  cornerType,
  setCornerType,
  patterns,
  cornerTypes
}) => {
  // Create wrapper functions to ensure correct typing
  const handlePatternChange = (patternValue: string) => {
    setPattern(patternValue);
  };

  const handleCornerTypeChange = (cornerValue: string) => {
    setCornerType(cornerValue);
  };

  return (
    <div className="space-y-6 mb-8">
      <h2 className="text-xl font-semibold">Select styles</h2>
      
      {/* Patterns */}
      <QRCodePatternSelector 
        pattern={pattern}
        setPattern={handlePatternChange}
        patterns={patterns}
      />
      
      {/* Corners */}
      <QRCodeCornerSelector 
        cornerType={cornerType}
        setCornerType={handleCornerTypeChange}
        cornerTypes={cornerTypes}
      />
    </div>
  );
};

export default QRCodeStyleOptions;
