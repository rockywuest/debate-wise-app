
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReputationDisplay } from './ReputationDisplay';
import { useReputation } from '@/hooks/useReputation';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, Medal, Award, Crown, TrendingUp, Brain, Users, Star } from 'lucide-react';

export const EnhancedLeaderboard = () => {
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

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center gap-2">
            <Crown className="h-8 w-8 text-yellow-500" />
            <span className="text-3xl font-bold text-yellow-600">#1</span>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center gap-2">
            <Medal className="h-7 w-7 text-gray-500" />
            <span className="text-2xl font-bold text-gray-600">#2</span>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center gap-2">
            <Award className="h-7 w-7 text-amber-600" />
            <span className="text-2xl font-bold text-amber-700">#3</span>
          </div>
        );
      default:
        return <span className="text-2xl font-bold text-white">#{rank}</span>;
    }
  };

  const getRowBackgroundClass = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return "bg-blue-600 border-2 border-blue-400 text-white";
    }
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500 to-amber-500 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-400 to-slate-500 text-white";
      case 3:
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white";
      default:
        return "bg-fw-panel text-white hover:bg-fw-border/50";
    }
  };

  const getReputationTitle = (score: number) => {
    if (score >= 500) return { title: 'Wahrheits-Virtuose', icon: <Brain className="h-5 w-5" />, color: 'text-purple-300' };
    if (score >= 200) return { title: 'Meister-Debattierer', icon: <Trophy className="h-5 w-5" />, color: 'text-yellow-300' };
    if (score >= 100) return { title: 'Erfahrener Analyst', icon: <TrendingUp className="h-5 w-5" />, color: 'text-blue-300' };
    if (score >= 50) return { title: 'Aktiver Denker', icon: <Users className="h-5 w-5" />, color: 'text-green-300' };
    return { title: 'Neuer Debattierer', icon: <Star className="h-5 w-5" />, color: 'text-gray-300' };
  };

  if (loading) {
    return (
      <Card className="bg-fw-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-3xl">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Meritokratie-Rangliste
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-500 mx-auto"></div>
            <p className="mt-6 text-white text-xl">Rangliste wird geladen...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="bg-fw-panel border-fw-border shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-3xl font-bold">
            <Trophy className="h-10 w-10 text-yellow-300" />
            Meritokratie-Rangliste
          </CardTitle>
          <CardDescription className="text-blue-100 text-xl">
            Die konstruktivsten Denker unserer intellektuellen Gemeinschaft
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {leaders.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
              <p className="text-2xl text-white font-medium mb-4">
                Noch keine Bewertungen vorhanden.
              </p>
              <p className="text-gray-300 text-lg">
                Starten Sie die erste Debatte und sammeln Sie Reputationspunkte!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-fw-bg border-b-2 border-fw-border">
                    <TableHead className="text-center font-bold text-white text-lg py-4 w-32">
                      Rang
                    </TableHead>
                    <TableHead className="font-bold text-white text-lg py-4">
                      Denker
                    </TableHead>
                    <TableHead className="font-bold text-white text-lg py-4 min-w-48">
                      Titel
                    </TableHead>
                    <TableHead className="text-right font-bold text-white text-lg py-4 w-32">
                      Reputation
                    </TableHead>
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
                        className={`${getRowBackgroundClass(rank, isCurrentUser)} border-b border-fw-border/30`}
                      >
                        <TableCell className="text-center py-6">
                          {getRankDisplay(rank)}
                        </TableCell>
                        
                        <TableCell className="py-6">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-xl">
                                  {leader.username}
                                </span>
                                {isCurrentUser && (
                                  <Badge variant="secondary" className="bg-blue-800 text-blue-100 font-semibold text-sm px-3 py-1">
                                    Sie
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="py-6">
                          <div className={`flex items-center gap-3 ${reputationInfo.color}`}>
                            {reputationInfo.icon}
                            <span className="font-semibold text-lg">{reputationInfo.title}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-right py-6">
                          <div className="flex flex-col items-end">
                            <span className="text-3xl font-bold">
                              {leader.reputation_score}
                            </span>
                            <span className="text-sm opacity-75">
                              Punkte
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System explanation card */}
      <Card className="bg-fw-panel border-fw-border shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white text-2xl">
            <Brain className="h-7 w-7 text-blue-400" />
            So funktioniert das Meritokratie-System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="p-6 bg-green-800/30 rounded-lg border-l-4 border-green-400">
              <h3 className="font-bold text-green-300 mb-4 text-xl">Punkte für intellektuelle Tugenden:</h3>
              <div className="space-y-3 text-green-200">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-green-700 text-green-100 font-semibold">+10</Badge>
                  <span className="text-lg">Argument mit hoher KI-Qualitätsbewertung (≥70%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-green-700 text-green-100 font-semibold">+10</Badge>
                  <span className="text-lg">Relevante Quelle für eine Behauptung geliefert</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-green-700 text-green-100 font-semibold">+25</Badge>
                  <span className="text-lg">Faire Steel-Manning-Darstellung eines Gegenarguments</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-green-700 text-green-100 font-semibold">+50</Badge>
                  <span className="text-lg">Eigenes Argument zurückgezogen oder Gegenargument anerkannt</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-green-700 text-green-100 font-semibold">+1</Badge>
                  <span className="text-lg">Upvote von einem anderen Nutzer erhalten</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-red-800/30 rounded-lg border-l-4 border-red-400">
              <h3 className="font-bold text-red-300 mb-4 text-xl">Abzüge für logische Fehlschlüsse:</h3>
              <div className="space-y-3 text-red-200">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-red-700 text-red-100 font-semibold">-5</Badge>
                  <span className="text-lg">KI erkennt logischen Fehlschluss in Ihrem Argument</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-800/30 rounded-lg border-l-4 border-blue-400">
              <div className="text-blue-200 text-xl leading-relaxed">
                <strong className="text-blue-100">Ziel:</strong> Dieses System belohnt Wahrheitsfindung und intellektuelle Ehrlichkeit, 
                nicht Popularität. Hohe Reputation zeigt, dass Sie zur konstruktiven Debattenkultur beitragen.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
