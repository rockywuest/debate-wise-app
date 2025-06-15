
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { EnhancedArgumentCard } from '@/components/EnhancedArgumentCard';
import { CreateArgumentForm } from '@/components/CreateArgumentForm';
import { useDebates } from '@/hooks/useDebates';
import { useArguments } from '@/hooks/useArguments';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const DebateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { debates, loading: debatesLoading } = useDebates();
  const { arguments: debateArguments, loading: argumentsLoading } = useArguments(id);

  const currentDebate = debates.find(debate => debate.id === id);

  const handleReply = (parentId: string) => {
    console.log('Replying to argument:', parentId);
  };

  if (debatesLoading || argumentsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Debatte wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 fw-gradient-text">
              debate wise
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Bitte melden Sie sich an, um an Debatten teilzunehmen.
            </p>
            <Link to="/auth">
              <Button className="fw-button-gradient">
                Jetzt anmelden
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentDebate) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 fw-gradient-text">
              Debatte nicht gefunden
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Die angeforderte Debatte existiert nicht oder wurde entfernt.
            </p>
            <Link to="/debates">
              <Button className="fw-button-gradient">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zu den Debatten
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/debates">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zu den Debatten
            </Button>
          </Link>
        </div>

        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-4 fw-gradient-text">
            {currentDebate.titel}
          </h1>
          {currentDebate.beschreibung && (
            <p className="text-xl text-muted-foreground mb-6">
              {currentDebate.beschreibung}
            </p>
          )}
          <div className="bg-fw-panel rounded-xl p-6 shadow-card">
            <CreateArgumentForm debateId={currentDebate.id} />
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {!debateArguments || debateArguments.length === 0 ? (
            <div className="text-center py-12 fw-card">
              <p className="text-muted-foreground">
                Diese Debatte hat noch keine Argumente. Seien Sie der Erste, der ein Argument hinzufügt!
              </p>
            </div>
          ) : (
            debateArguments.map((argument) => (
              <EnhancedArgumentCard
                key={argument.id}
                id={argument.id}
                title={argument.argument_text.substring(0, 100) + (argument.argument_text.length > 100 ? '...' : '')}
                content={argument.argument_text}
                type={argument.argument_typ === 'These' ? 'neutral' : argument.argument_typ === 'Pro' ? 'pro' : 'contra'}
                author={argument.autor_name || 'Unbekannter Autor'}
                authorUserId={argument.benutzer_id}
                createdAt={argument.erstellt_am}
                debateId={currentDebate.id}
                childArguments={argument.childArguments?.map(child => ({
                  id: child.id,
                  title: child.argument_text.substring(0, 50) + (child.argument_text.length > 50 ? '...' : ''),
                  content: child.argument_text,
                  type: child.argument_typ === 'These' ? 'neutral' : child.argument_typ === 'Pro' ? 'pro' : 'contra'
                })) || []}
                onReply={handleReply}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DebateDetail;
