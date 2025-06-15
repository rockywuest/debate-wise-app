
import React from 'react';
import { MessageSquare } from 'lucide-react';

interface DebateEmptyStateProps {
  language: 'de' | 'en';
}

export const DebateEmptyState = ({ language }: DebateEmptyStateProps) => {
  return (
    <div className="text-center py-8">
      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">
        {language === 'de' ? 'Keine Debatten gefunden.' : 'No debates found.'}
      </p>
    </div>
  );
};
