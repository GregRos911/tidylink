
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
  return (
    <div className="space-y-6 mb-8">
      <h2 className="text-xl font-semibold">Select styles</h2>
      
      {/* Patterns */}
      <QRCodePatternSelector 
        pattern={pattern}
        setPattern={setPattern}
        patterns={patterns}
      />
      
      {/* Corners */}
      <QRCodeCornerSelector 
        cornerType={cornerType}
        setCornerType={setCornerType}
        cornerTypes={cornerTypes}
      />
    </div>
  );
};

export default QRCodeStyleOptions;
