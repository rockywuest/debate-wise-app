
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReputationDisplay } from './ReputationDisplay';
import { useReputation } from '@/hooks/useReputation';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, Medal, Award, Crown, TrendingUp, Brain, Users, Star } from 'lucide-react';

export const Leaderboard = () => {
  const { getLeaderboard } = useReputation();
  const { user } = useAuth();
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankRowClass = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return "bg-blue-50 border-2 border-blue-200 hover:bg-blue-100";
    }
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 hover:bg-yellow-100";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-gray-400 hover:bg-gray-100";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 hover:bg-amber-100";
      default:
        return "hover:bg-muted/50";
    }
  };

  const getReputationTitle = (score: number) => {
    if (score >= 500) return { title: 'Wahrheits-Virtuose', icon: <Brain className="h-4 w-4" />, color: 'text-purple-600' };
    if (score >= 200) return { title: 'Meister-Debattierer', icon: <Trophy className="h-4 w-4" />, color: 'text-yellow-600' };
    if (score >= 100) return { title: 'Erfahrener Analyst', icon: <TrendingUp className="h-4 w-4" />, color: 'text-blue-600' };
    if (score >= 50) return { title: 'Aktiver Denker', icon: <Users className="h-4 w-4" />, color: 'text-green-600' };
    return { title: 'Neuer Debattierer', icon: <Star className="h-4 w-4" />, color: 'text-gray-600' };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Meritokratie-Rangliste
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground text-lg">Rangliste wird geladen...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Trophy className="h-7 w-7" />
            Meritokratie-Rangliste
          </CardTitle>
          <CardDescription className="text-blue-100 text-lg">
            Die konstruktivsten Denker unserer intellektuellen Gemeinschaft
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {leaders.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground font-medium">
                Noch keine Bewertungen vorhanden.
              </p>
              <p className="text-muted-foreground mt-2">
                Starten Sie die erste Debatte und sammeln Sie Reputationspunkte!
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-20 text-center font-bold">Rang</TableHead>
                  <TableHead className="font-bold">Denker</TableHead>
                  <TableHead className="font-bold">Titel</TableHead>
                  <TableHead className="text-right font-bold">Reputation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaders.map((leader, index) => {
                  const rank = index + 1;
                  const isCurrentUser = user?.id === leader.id;
                  const reputationInfo = getReputationTitle(leader.reputation_score);
                  
                  return (
                    <TableRow 
                      key={leader.id} 
                      className={getRankRowClass(rank, isCurrentUser)}
                    >
                      <TableCell className="text-center py-4">
                        <div className="flex items-center justify-center">
                          {getRankIcon(rank)}
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-lg">
                                {leader.username}
                              </span>
                              {isCurrentUser && (
                                <Badge variant="secondary" className="text-xs">
                                  Sie
                                </Badge>
                              )}
                            </div>
                            <ReputationDisplay 
                              score={leader.reputation_score} 
                              size="sm"
                              showLabel={false}
                            />
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4">
                        <div className={`flex items-center gap-2 ${reputationInfo.color}`}>
                          {reputationInfo.icon}
                          <span className="font-medium">{reputationInfo.title}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right py-4">
                        <div className="flex flex-col items-end">
                          <span className="text-2xl font-bold text-primary">
                            {leader.reputation_score}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Punkte
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Erweiterte Erklärung des Reputationssystems */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Brain className="h-5 w-5" />
            So funktioniert das Meritokratie-System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h3 className="font-semibold text-green-800 mb-3 text-lg">Punkte für intellektuelle Tugenden:</h3>
              <div className="space-y-2 text-green-700">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">+10</Badge>
                  <span>Argument mit hoher KI-Qualitätsbewertung (≥70%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">+10</Badge>
                  <span>Relevante Quelle für eine Behauptung geliefert</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">+25</Badge>
                  <span>Faire Steel-Manning-Darstellung eines Gegenarguments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">+50</Badge>
                  <span>Eigenes Argument zurückgezogen oder Gegenargument anerkannt</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">+1</Badge>
                  <span>Upvote von einem anderen Nutzer erhalten</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              <h3 className="font-semibold text-red-800 mb-3 text-lg">Abzüge für logische Fehlschlüsse:</h3>
              <div className="space-y-2 text-red-700">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-red-100 text-red-800">-5</Badge>
                  <span>KI erkennt logischen Fehlschluss in Ihrem Argument</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="text-blue-700 text-lg">
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
