
import { useAuth } from '@/hooks/useAuth';
import { useDebates } from '@/hooks/useDebates';
import { Button } from '@/components/ui/button';
import { CreateDebateForm } from '@/components/CreateDebateForm';
import { TrendingDebates } from '@/components/TrendingDebates';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Clock, Trophy, TrendingUp, Award, Star, Brain } from 'lucide-react';
import { useTranslation } from '@/utils/i18n';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { debates, loading: debatesLoading } = useDebates();
  const { t, language } = useTranslation();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('index.welcome')}
          </h1>
          
          {user ? (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <p className="text-xl text-gray-700 mb-4">
                  {t('index.hello')}
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <CreateDebateForm />
                  <Link to="/debates">
                    <Button variant="outline" size="lg" className="gap-2">
                      <MessageSquare className="h-5 w-5" />
                      {t('index.viewAllDebates')}
                    </Button>
                  </Link>
                  <Link to="/leaderboard">
                    <Button variant="outline" size="lg" className="gap-2">
                      <Trophy className="h-5 w-5" />
                      {t('index.viewLeaderboard')}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center mb-2">
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{debates.length}</div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Aktive Debatten' : 'Active Debates'}
                    </div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center mb-2">
                      <Brain className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">AI</div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Qualitätsanalyse' : 'Quality Analysis'}
                    </div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center mb-2">
                      <Award className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">Merit</div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Basierte Reputation' : 'Based Reputation'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-200">
                <p className="text-xl text-gray-700 mb-6">
                  {t('index.structuredDiscussion')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <Brain className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">
                      {language === 'de' ? 'KI-Analyse' : 'AI Analysis'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' 
                        ? 'Jedes Argument wird auf Qualität und Logik analysiert'
                        : 'Every argument is analyzed for quality and logic'
                      }
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <Award className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">
                      {language === 'de' ? 'Merit-System' : 'Merit System'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' 
                        ? 'Reputation durch intellektuelle Ehrlichkeit'
                        : 'Reputation through intellectual honesty'
                      }
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <Star className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">
                      {language === 'de' ? 'Faire Diskussion' : 'Fair Discussion'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' 
                        ? 'Steel-Manning und konstruktive Kritik'
                        : 'Steel-manning and constructive criticism'
                      }
                    </p>
                  </div>
                </div>
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    {t('index.getStarted')}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {user && (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Latest Debates Preview */}
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">{t('index.latestDebates')}</h2>
              <Link to="/debates">
                <Button variant="outline" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {t('index.viewAll')}
                </Button>
              </Link>
            </div>

            {debatesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">{t('index.debatesLoading')}</p>
              </div>
            ) : debates.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">
                    {t('index.noDebatesYet')}
                  </h3>
                  <CreateDebateForm />
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {debates.slice(0, 3).map((debate) => (
                  <Card key={debate.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500/30 hover:border-l-blue-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{debate.titel}</CardTitle>
                          {debate.beschreibung && (
                            <CardDescription className="text-base">
                              {debate.beschreibung}
                            </CardDescription>
                          )}
                        </div>
                        <Link to={`/debate/${debate.id}`}>
                          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                            {t('index.participate')}
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(debate.erstellt_am).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {language === 'de' ? 'Aktiv' : 'Active'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
