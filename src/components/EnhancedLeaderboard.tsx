
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ReputationDisplay } from './ReputationDisplay';
import { useReputation } from '@/hooks/useReputation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/utils/i18n';
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  TrendingUp, 
  Brain, 
  Users, 
  Star,
  Zap,
  Target,
  Shield,
  Sparkles
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  requirement: number;
}

export const EnhancedLeaderboard = () => {
  const { getLeaderboard } = useReputation();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [leaders, setLeaders] = useState<Array<{
    id: string;
    username: string;
    reputation_score: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [showAchievements, setShowAchievements] = useState(false);

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

  const achievements: Achievement[] = [
    {
      id: 'first_argument',
      title: 'Debattierer',
      description: 'Erstes Argument verfasst',
      icon: <Star className="h-4 w-4" />,
      color: 'text-blue-600',
      requirement: 1
    },
    {
      id: 'quality_contributor',
      title: 'Qualitäts-Beitragender',
      description: '10 hochwertige Argumente',
      icon: <Brain className="h-4 w-4" />,
      color: 'text-purple-600',
      requirement: 50
    },
    {
      id: 'fair_discussant',
      title: 'Fairer Diskutant',
      description: '5 Steel-Man Darstellungen',
      icon: <Shield className="h-4 w-4" />,
      color: 'text-green-600',
      requirement: 100
    },
    {
      id: 'truth_seeker',
      title: 'Wahrheitssucher',
      description: 'Eigenes Argument zurückgezogen',
      icon: <Target className="h-4 w-4" />,
      color: 'text-orange-600',
      requirement: 200
    },
    {
      id: 'master_debater',
      title: 'Meister-Debattierer',
      description: '200+ Reputationspunkte',
      icon: <Crown className="h-4 w-4" />,
      color: 'text-yellow-600',
      requirement: 200
    },
    {
      id: 'legend',
      title: 'Legende',
      description: '500+ Reputationspunkte',
      icon: <Sparkles className="h-4 w-4" />,
      color: 'text-pink-600',
      requirement: 500
    }
  ];

  const getRankDisplay = (rank: number) => {
    const baseClasses = "flex items-center justify-center w-12 h-12 rounded-full font-bold";
    
    switch (rank) {
      case 1:
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg`}>
            <Crown className="h-6 w-6" />
          </div>
        );
      case 2:
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-lg`}>
            <Medal className="h-6 w-6" />
          </div>
        );
      case 3:
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg`}>
            <Award className="h-6 w-6" />
          </div>
        );
      default:
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-blue-500 to-blue-600 text-white`}>
            <span className="text-lg font-bold">#{rank}</span>
          </div>
        );
    }
  };

  const getLeaderRowClasses = (rank: number, isCurrentUser: boolean) => {
    let baseClasses = "transition-all duration-300 hover:shadow-lg rounded-lg border";
    
    if (isCurrentUser) {
      return `${baseClasses} bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-md ring-2 ring-blue-200`;
    }
    
    switch (rank) {
      case 1:
        return `${baseClasses} bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 shadow-md`;
      case 2:
        return `${baseClasses} bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300 shadow-md`;
      case 3:
        return `${baseClasses} bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 shadow-md`;
      default:
        return `${baseClasses} bg-white border-gray-200 hover:bg-gray-50`;
    }
  };

  const getUserAchievements = (score: number) => {
    return achievements.filter(achievement => score >= achievement.requirement);
  };

  const getNextAchievement = (score: number) => {
    return achievements.find(achievement => score < achievement.requirement);
  };

  const getProgressToNext = (score: number) => {
    const next = getNextAchievement(score);
    if (!next) return 100;
    
    const previous = achievements
      .filter(a => a.requirement <= score)
      .sort((a, b) => b.requirement - a.requirement)[0];
    
    const prevReq = previous?.requirement || 0;
    const progress = ((score - prevReq) / (next.requirement - prevReq)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  if (loading) {
    return (
      <Card className="shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Trophy className="h-7 w-7" />
            {t('reputation.leaderboard')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground text-lg">Rangliste wird geladen...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Leaderboard */}
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-3xl">
                <Trophy className="h-8 w-8" />
                {t('reputation.leaderboard')}
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg mt-2">
                {t('reputation.subtitle')}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowAchievements(!showAchievements)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Award className="h-4 w-4 mr-2" />
              Erfolge
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {leaders.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-muted-foreground mb-2">
                Noch keine Bewertungen vorhanden
              </h3>
              <p className="text-muted-foreground text-lg">
                Starten Sie die erste Debatte und sammeln Sie Reputationspunkte!
              </p>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {leaders.map((leader, index) => {
                const rank = index + 1;
                const isCurrentUser = user?.id === leader.id;
                const userAchievements = getUserAchievements(leader.reputation_score);
                const nextAchievement = getNextAchievement(leader.reputation_score);
                const progress = getProgressToNext(leader.reputation_score);
                
                return (
                  <div 
                    key={leader.id} 
                    className={getLeaderRowClasses(rank, isCurrentUser)}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-6">
                        {/* Rank Display */}
                        <div className="flex-shrink-0">
                          {getRankDisplay(rank)}
                        </div>
                        
                        {/* User Info */}
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">
                              {leader.username}
                            </h3>
                            {isCurrentUser && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                <Users className="h-3 w-3 mr-1" />
                                Sie
                              </Badge>
                            )}
                          </div>
                          
                          {/* Achievements */}
                          <div className="flex items-center gap-2 mb-3">
                            {userAchievements.slice(-3).map((achievement) => (
                              <Badge 
                                key={achievement.id}
                                variant="outline" 
                                className={`${achievement.color} border-current`}
                              >
                                {achievement.icon}
                                <span className="ml-1 text-xs">{achievement.title}</span>
                              </Badge>
                            ))}
                            {userAchievements.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{userAchievements.length - 3} weitere
                              </Badge>
                            )}
                          </div>
                          
                          {/* Progress to Next Achievement */}
                          {nextAchievement && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Nächster Erfolg: {nextAchievement.title}
                                </span>
                                <span className="font-medium">
                                  {leader.reputation_score}/{nextAchievement.requirement}
                                </span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          )}
                        </div>
                        
                        {/* Reputation Score */}
                        <div className="text-right flex-shrink-0">
                          <div className="text-3xl font-bold text-primary mb-1">
                            {leader.reputation_score}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Punkte
                          </div>
                          <ReputationDisplay score={leader.reputation_score} size="sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievement System */}
      {showAchievements && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Award className="h-6 w-6" />
              Erfolgs-System
            </CardTitle>
            <CardDescription>
              Verdienen Sie sich Auszeichnungen durch intellektuelle Tugenden
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className={`${achievement.color} p-2 rounded-lg bg-current/10`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {achievement.requirement} Punkte
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reputation System Explanation */}
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
