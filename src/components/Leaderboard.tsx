
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReputationDisplay } from './ReputationDisplay';
import { useReputation } from '@/hooks/useReputation';
import { Trophy, Medal, Award, TrendingUp, Brain, Users } from 'lucide-react';

export const Leaderboard = () => {
  const { getLeaderboard } = useReputation();
  const [leaders, setLeaders] = useState<Array<{
    id: string;
    username: string;
    reputation_score: number;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await getLeaderboard();
      setLeaders(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getReputationTitle = (score: number) => {
    if (score >= 500) return { title: 'Wahrheits-Virtuose', icon: <Brain className="h-4 w-4" />, color: 'text-purple-600' };
    if (score >= 200) return { title: 'Meister-Debattierer', icon: <Trophy className="h-4 w-4" />, color: 'text-yellow-600' };
    if (score >= 100) return { title: 'Erfahrener Analyst', icon: <TrendingUp className="h-4 w-4" />, color: 'text-blue-600' };
    if (score >= 50) return { title: 'Aktiver Denker', icon: <Users className="h-4 w-4" />, color: 'text-green-600' };
    return { title: 'Neuer Debattierer', icon: <Users className="h-4 w-4" />, color: 'text-gray-600' };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meritokratie-Rangliste</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Wird geladen...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Meritokratie-Rangliste der konstruktivsten Denker
          </CardTitle>
          <CardDescription>
            Basierend auf intellektueller Ehrlichkeit und Argumentqualität
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leaders.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Noch keine Bewertungen vorhanden.
            </p>
          ) : (
            <div className="space-y-3">
              {leaders.map((leader, index) => {
                const reputationInfo = getReputationTitle(leader.reputation_score);
                return (
                  <div 
                    key={leader.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      index < 3 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200' : 'bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold">
                        {getRankIcon(index) || (index + 1)}
                      </div>
                      <div className="flex flex-col">
                        <ReputationDisplay 
                          score={leader.reputation_score} 
                          username={leader.username}
                          size="md"
                        />
                        <div className={`flex items-center gap-1 text-sm ${reputationInfo.color}`}>
                          {reputationInfo.icon}
                          <span>{reputationInfo.title}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Rang {index + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Erweiterte Erklärung des neuen Systems */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Das neue Meritokratie-System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-sm">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Aktionen für intellektuelle Tugenden:</h3>
              <div className="space-y-1 text-green-700">
                <div>🎯 <strong>+10 Punkte:</strong> Argument mit hoher KI-Qualitätsbewertung (≥70%)</div>
                <div>📚 <strong>+10 Punkte:</strong> Relevante Quelle für eine Behauptung geliefert</div>
                <div>🤝 <strong>+25 Punkte:</strong> Faire Steel-Manning-Darstellung eines Gegenarguments</div>
                <div>💎 <strong>+50 Punkte:</strong> Eigenes Argument zurückgezogen oder Gegenargument anerkannt</div>
                <div>👍 <strong>+1 Punkt:</strong> Upvote von einem anderen Nutzer erhalten</div>
              </div>
            </div>
            
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-800 mb-2">Abzüge für logische Fehlschlüsse:</h3>
              <div className="space-y-1 text-red-700">
                <div>⚠️ <strong>-5 Punkte:</strong> KI erkennt logischen Fehlschluss in Ihrem Argument</div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-blue-700">
                <strong>Ziel:</strong> Dieses System belohnt Wahrheitsfindung und intellektuelle Ehrlichkeit, 
                nicht Popularität. Hohe Reputation zeigt, dass Sie zur konstruktiven Debattenkultur beitragen.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
