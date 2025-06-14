
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReputationDisplay } from './ReputationDisplay';
import { useReputation } from '@/hooks/useReputation';
import { Trophy, Medal, Award } from 'lucide-react';

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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rangliste der konstruktivsten Debattierer</CardTitle>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Rangliste der konstruktivsten Debattierer
        </CardTitle>
        <CardDescription>
          Die besten Debattierer basierend auf Reputationspunkten
        </CardDescription>
      </CardHeader>
      <CardContent>
        {leaders.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Noch keine Bewertungen vorhanden.
          </p>
        ) : (
          <div className="space-y-3">
            {leaders.map((leader, index) => (
              <div 
                key={leader.id} 
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  index < 3 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200' : 'bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold">
                    {getRankIcon(index) || (index + 1)}
                  </div>
                  <ReputationDisplay 
                    score={leader.reputation_score} 
                    username={leader.username}
                    size="md"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Rang {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
