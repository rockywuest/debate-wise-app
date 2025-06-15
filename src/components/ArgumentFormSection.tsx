
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedArgumentForm } from './EnhancedArgumentForm';

interface ArgumentFormSectionProps {
  debateId: string;
  onSuccess: () => void;
}

export const ArgumentFormSection = ({ debateId, onSuccess }: ArgumentFormSectionProps) => {
  return (
    <Card className="mb-8 subtle-shadow">
      <CardHeader>
        <CardTitle className="text-xl">Neues Argument hinzufügen</CardTitle>
      </CardHeader>
      <CardContent>
        <EnhancedArgumentForm 
          debateId={debateId} 
          onSuccess={onSuccess}
        />
      </CardContent>
    </Card>
  );
};
