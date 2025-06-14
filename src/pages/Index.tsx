
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">
            Willkommen zum Debattensystem
          </h1>
          
          {user ? (
            <div className="space-y-4">
              <p className="text-xl text-muted-foreground">
                Hallo! Sie sind erfolgreich angemeldet.
              </p>
              <p className="text-muted-foreground">
                Das Debattensystem wird als nächstes implementiert.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-xl text-muted-foreground">
                Strukturierte Diskussionen mit visuellen Argumentkarten
              </p>
              <div>
                <Link to="/auth">
                  <Button size="lg">
                    Jetzt starten
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
