
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Flame } from 'lucide-react';

interface TrendingDebate {
  id: string;
  titel: string;
  beschreibung?: string;
  erstellt_am: string;
  activity_score: number;
  argument_count: number;
  participant_count: number;
  recent_activity: string;
}

interface DebateMetricsProps {
  debate: TrendingDebate;
}

export const DebateMetrics = ({ debate }: DebateMetricsProps) => {
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <MessageSquare className="h-3 w-3" />
        <span>{debate.argument_count}</span>
      </div>
      <div className="flex items-center gap-1">
        <Users className="h-3 w-3" />
        <span>{debate.participant_count}</span>
      </div>
      {debate.activity_score > 0 && (
        <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
          <Flame className="h-3 w-3 mr-1" />
          Hot
        </Badge>
      )}
    </div>
  );
};
