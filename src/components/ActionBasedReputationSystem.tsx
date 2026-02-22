
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Target, CheckCircle, Brain, Users } from 'lucide-react';
import { useTranslation } from '@/utils/i18n';

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
  const { language } = useTranslation();
  const text = (en: string, de: string) => (language === 'de' ? de : en);
  
  const getReputationLevel = (score: number) => {
    if (score >= 1000) return { level: text('Debate master', 'Debattier-Meister'), color: 'bg-purple-100 text-purple-800', icon: <Award className="h-4 w-4" /> };
    if (score >= 500) return { level: text('Discourse expert', 'Diskurs-Experte'), color: 'bg-blue-100 text-blue-800', icon: <Brain className="h-4 w-4" /> };
    if (score >= 200) return { level: text('Active participant', 'Aktiver Teilnehmer'), color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> };
    if (score >= 50) return { level: text('Newcomer', 'Neuling'), color: 'bg-yellow-100 text-yellow-800', icon: <Target className="h-4 w-4" /> };
    return { level: text('Beginner', 'Anfanger'), color: 'bg-gray-100 text-gray-800', icon: <Users className="h-4 w-4" /> };
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
      case 'argument_conceded': return text('Conceded a point', 'Punkt zugestanden');
      case 'steel_manning': return text('Fair representation', 'Fair argumentiert');
      case 'high_quality_argument': return text('High-quality argument', 'Qualitatsargument');
      case 'source_provided': return text('Provided sources', 'Quellen angegeben');
      case 'fallacy_penalty': return text('Fallacy detected', 'Fehlschluss erkannt');
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
              <span className="font-bold">{userScore} {text('points', 'Punkte')}</span>
            </Badge>
            <span className="font-medium">{reputation.level}</span>
          </div>
        </div>

        {recentActions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">{text('Recent actions:', 'Letzte Aktionen:')}</h4>
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
                      {new Date(action.timestamp).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h5 className="text-xs font-medium text-blue-900 mb-2">{text('How to earn reputation:', 'Wie Sie Reputation verdienen:')}</h5>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
            <div>{text('🤝 Concede a point: +50', '🤝 Punkt zugestehen: +50')}</div>
            <div>{text('⚖️ Fair representation: +30', '⚖️ Fair argumentieren: +30')}</div>
            <div>{text('🎯 High-quality argument: +20', '🎯 Qualitatsargument: +20')}</div>
            <div>{text('📚 Provide sources: +10', '📚 Quellen angeben: +10')}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
