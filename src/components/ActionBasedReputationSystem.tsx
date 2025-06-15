
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Target, CheckCircle, Brain, Users } from 'lucide-react';

interface ActionBasedReputationSystemProps {
  userScore: number;
  recentActions?: Array<{
    action: string;
    points: number;
    timestamp: string;
    reason: string;
  }>;
  compact?: boolean;
}

export const ActionBasedReputationSystem = ({ 
  userScore, 
  recentActions = [], 
  compact = false 
}: ActionBasedReputationSystemProps) => {
  
  const getReputationLevel = (score: number) => {
    if (score >= 1000) return { level: 'Debattier-Meister', color: 'bg-purple-100 text-purple-800', icon: <Award className="h-4 w-4" /> };
    if (score >= 500) return { level: 'Diskurs-Experte', color: 'bg-blue-100 text-blue-800', icon: <Brain className="h-4 w-4" /> };
    if (score >= 200) return { level: 'Aktiver Teilnehmer', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> };
    if (score >= 50) return { level: 'Neuling', color: 'bg-yellow-100 text-yellow-800', icon: <Target className="h-4 w-4" /> };
    return { level: 'Anfänger', color: 'bg-gray-100 text-gray-800', icon: <Users className="h-4 w-4" /> };
  };

  const reputation = getReputationLevel(userScore);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'argument_conceded': return '🤝';
      case 'steel_manning': return '⚖️';
      case 'high_quality_argument': return '🎯';
      case 'source_provided': return '📚';
      case 'fallacy_penalty': return '⚠️';
      default: return '💡';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'argument_conceded': return 'Punkt zugestanden';
      case 'steel_manning': return 'Fair argumentiert';
      case 'high_quality_argument': return 'Qualitätsargument';
      case 'source_provided': return 'Quellen angegeben';
      case 'fallacy_penalty': return 'Fehlschluss erkannt';
      default: return action;
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge className={`${reputation.color} flex items-center gap-1`}>
          {reputation.icon}
          {userScore}
        </Badge>
        <span className="text-xs text-muted-foreground">{reputation.level}</span>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Badge className={`${reputation.color} flex items-center gap-2 px-3 py-1`}>
              {reputation.icon}
              <span className="font-bold">{userScore} Punkte</span>
            </Badge>
            <span className="font-medium">{reputation.level}</span>
          </div>
        </div>

        {recentActions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Letzte Aktionen:</h4>
            <div className="space-y-1">
              {recentActions.slice(0, 3).map((action, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span>{getActionIcon(action.action)}</span>
                    <span>{getActionLabel(action.action)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={action.points >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {action.points >= 0 ? '+' : ''}{action.points}
                    </Badge>
                    <span className="text-muted-foreground">
                      {new Date(action.timestamp).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h5 className="text-xs font-medium text-blue-900 mb-2">Wie Sie Reputation verdienen:</h5>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
            <div>🤝 Punkt zugestehen: +50</div>
            <div>⚖️ Fair argumentieren: +30</div>
            <div>🎯 Qualitätsargument: +20</div>
            <div>📚 Quellen angeben: +10</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
