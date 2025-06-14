
import React from 'react';
import { ArgumentCard } from '@/components/ArgumentCard';
import { CreateArgumentForm } from '@/components/CreateArgumentForm';
import { useDebates } from '@/hooks/useDebates';
import { useArguments } from '@/hooks/useArguments';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Debate = () => {
  const { user } = useAuth();
  const { debates, loading: debatesLoading } = useDebates();
  
  // Verwende die erste verfügbare Debatte oder erstelle eine Standard-Debatte
  const currentDebate = debates[0];
  const { debateArguments, loading: argumentsLoading } = useArguments(currentDebate?.id);

  const handleReply = (parentId: string) => {
    console.log('Replying to argument:', parentId);
    // Die Reply-Funktionalität wird durch die CreateArgumentForm mit parentId implementiert
  };

  if (debatesLoading || argumentsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Debatten werden geladen...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">
              Debattensystem
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Bitte melden Sie sich an, um an Debatten teilzunehmen.
            </p>
            <Link to="/auth">
              <Button>
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
            <h1 className="text-4xl font-bold mb-4">
              Keine Debatten verfügbar
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Es gibt derzeit keine Debatten. Erstellen Sie die erste Debatte!
            </p>
            <Link to="/">
              <Button>
                Zur Startseite
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
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Debatte: {currentDebate.titel}
          </h1>
          {currentDebate.beschreibung && (
            <p className="text-xl text-muted-foreground mb-6">
              {currentDebate.beschreibung}
            </p>
          )}
          <CreateArgumentForm debateId={currentDebate.id} />
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {debateArguments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Diese Debatte hat noch keine Argumente. Seien Sie der Erste, der ein Argument hinzufügt!
              </p>
            </div>
          ) : (
            debateArguments.map((argument) => (
              <ArgumentCard
                key={argument.id}
                id={argument.id}
                title={argument.argument_text.substring(0, 100) + (argument.argument_text.length > 100 ? '...' : '')}
                content={argument.argument_text}
                type={argument.argument_typ === 'These' ? 'neutral' : argument.argument_typ === 'Pro' ? 'pro' : 'contra'}
                author={argument.autor_name || 'Unbekannter Autor'}
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

export default Debate;
