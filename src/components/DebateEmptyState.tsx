
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus } from 'lucide-react';

interface DebateEmptyStateProps {
  onAddArgument: () => void;
}

export const DebateEmptyState = ({ onAddArgument }: DebateEmptyStateProps) => {
  return (
    <Card className="text-center py-16 border-dashed border-2">
      <CardContent>
        <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
        <h3 className="text-2xl font-bold mb-4">Diskussion starten</h3>
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          Noch keine Argumente vorhanden. Starten Sie die Diskussion mit Ihrem ersten Beitrag.
        </p>
        <Button 
          onClick={onAddArgument}
          className="modern-button modern-button-primary"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          Erstes Argument hinzufügen
        </Button>
      </CardContent>
    </Card>
  );
};
