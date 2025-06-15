
import React from 'react';
import { IntelligentArgumentForm } from './IntelligentArgumentForm';

interface ArgumentFormSectionProps {
  debateId: string;
  onSuccess: () => void;
}

export const ArgumentFormSection = ({ debateId, onSuccess }: ArgumentFormSectionProps) => {
  return (
    <div className="mb-8">
      <IntelligentArgumentForm 
        debateId={debateId} 
        onSuccess={onSuccess}
      />
    </div>
  );
};
