
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, MessageSquare, Activity, Plus } from 'lucide-react';

interface DebateHeaderProps {
  debate: {
    id: string;
    titel: string;
    beschreibung?: string;
    erstellt_von: string;
    erstellt_am: string;
  };
  argumentsCount: number;
  participantsCount: number;
  language: string;
  onShowForm: () => void;
}

export const DebateHeader = ({ 
  debate, 
  argumentsCount, 
  participantsCount, 
  language, 
  onShowForm 
}: DebateHeaderProps) => {
  return (
    <div className="debate-header p-8 mb-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold text-balance leading-tight">{debate.titel}</h1>
          {debate.beschreibung && (
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">{debate.beschreibung}</p>
          )}
        </div>
        <Badge variant="secondary" className="ml-6 px-4 py-2 text-sm">
          <Clock className="h-4 w-4 mr-2" />
          {new Date(debate.erstellt_am).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span className="font-medium">{argumentsCount} Argumente</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span className="font-medium">{participantsCount} Teilnehmer</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <span className="font-medium">Aktive Diskussion</span>
          </div>
        </div>
        
        <Button 
          onClick={onShowForm}
          className="modern-button modern-button-primary"
        >
          <Plus className="h-4 w-4" />
          Argument beitragen
        </Button>
      </div>
    </div>
  );
};
