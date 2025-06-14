import React from 'react';
import { Scale } from 'lucide-react';

interface LegalClauseBadgeProps {
  clause: string;
}

const LegalClauseBadge: React.FC<LegalClauseBadgeProps> = ({ clause }) => {
  return (
    <div className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium text-blue-800">
      <Scale className="w-3 h-3" />
      <span>{clause}</span>
    </div>
  );
};

export default LegalClauseBadge;