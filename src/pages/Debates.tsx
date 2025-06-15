import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { CreateDebateForm } from '@/components/CreateDebateForm';
import { useLanguageConsistency } from '@/components/LanguageConsistencyProvider';
import { MessageSquare, Users, Clock, Plus, TrendingUp } from 'lucide-react';

interface Debate {
  id: string;
  titel: string;
  beschreibung?: string;
  erstellt_von: string;
  erstellt_am: string;
}

const Debates = () => {
  const [debates, setDebates] = useState<Debate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguageConsistency();

  const fetchDebates = async () => {
    try {
      const { data, error } = await supabase
        .from('debatten')
        .select('*')
        .order('erstellt_am', { ascending: false });

      if (error) throw error;
      setDebates(data || []);
    } catch (error) {
      console.error('Error fetching debates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebates();
  }, []);

  const handleDebateCreated = () => {
    fetchDebates();
    setShowCreateForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground font-medium">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {language === 'de' ? 'Intelligente Debatten' : 'Intelligent Debates'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'de' 
                ? 'Nehmen Sie an evidenzbasierten Diskussionen teil und entwickeln Sie Ihre Argumente durch KI-Feedback weiter.' 
                : 'Participate in evidence-based discussions and develop your arguments through AI feedback.'}
            </p>
          </div>
          
          {user && (
            <Button 
              onClick={() => setShowCreateForm(true)} 
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              {language === 'de' ? 'Neue Debatte' : 'New Debate'}
            </Button>
          )}
        </div>

        {showCreateForm && (
          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {language === 'de' ? 'Neue Debatte erstellen' : 'Create New Debate'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CreateDebateForm />
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
                className="mt-4"
              >
                {t('common.cancel')}
              </Button>
            </CardContent>
          </Card>
        )}

        {!user && (
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {language === 'de' ? 'Willkommen zur intelligenten Debattenplattform' : 'Welcome to the Intelligent Debate Platform'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === 'de' 
                  ? 'Melden Sie sich an, um an Debatten teilzunehmen und von KI-gestützter Argumentanalyse zu profitieren.' 
                  : 'Sign in to participate in debates and benefit from AI-powered argument analysis.'}
              </p>
              <Button onClick={() => navigate('/auth')} className="gap-2">
                <Users className="h-4 w-4" />
                {t('auth.signIn')}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {debates.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'de' ? 'Noch keine Debatten' : 'No debates yet'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'de' 
                    ? 'Seien Sie der Erste, der eine Debatte startet!' 
                    : 'Be the first to start a debate!'}
                </p>
              </CardContent>
            </Card>
          ) : (
            debates.map((debate) => (
              <Card 
                key={debate.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/debates/${debate.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 hover:text-primary transition-colors">
                        {debate.titel}
                      </CardTitle>
                      {debate.beschreibung && (
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {debate.beschreibung}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="ml-4 gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Aktiv
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(debate.erstellt_am).toLocaleDateString(
                            language === 'de' ? 'de-DE' : 'en-US'
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>
                          {language === 'de' ? 'Diskussion' : 'Discussion'}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                      {language === 'de' ? 'Teilnehmen' : 'Join Discussion'}
                      <Users className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Debates;
