
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus } from 'lucide-react';

interface DebateEmptyStateProps {
  onAddArgument: () => void;
  language: 'en' | 'de';
}

export const DebateEmptyState = ({ onAddArgument, language }: DebateEmptyStateProps) => {
  const texts = {
    en: {
      title: "Start Discussion",
      description: "No arguments available yet. Start the discussion with your first contribution.",
      button: "Add First Argument"
    },
    de: {
      title: "Diskussion starten",
      description: "Noch keine Argumente vorhanden. Starten Sie die Diskussion mit Ihrem ersten Beitrag.",
      button: "Erstes Argument hinzufügen"
    }
  };

  const currentTexts = texts[language];

  return (
    <Card className="text-center py-16 border-dashed border-2">
      <CardContent>
        <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
        <h3 className="text-2xl font-bold mb-4">{currentTexts.title}</h3>
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          {currentTexts.description}
        </p>
        <Button 
          onClick={onAddArgument}
          className="modern-button modern-button-primary"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          {currentTexts.button}
        </Button>
      </CardContent>
    </Card>
  );
};
