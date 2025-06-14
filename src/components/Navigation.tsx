
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { User, LogOut, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navigation = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Debattensystem
        </Link>
        
        <div className="flex items-center gap-4">
          {user && (
            <Link to="/debate">
              <Button variant="ghost" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Debatte
              </Button>
            </Link>
          )}
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Angemeldet</span>
              </div>
              <Button onClick={signOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Abmelden
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline">
                Anmelden
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
