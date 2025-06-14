
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { ReputationDisplay } from './ReputationDisplay';
import { User, LogOut, MessageSquare, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Debattensystem
        </Link>
        
        <div className="flex items-center gap-4">
          {user && (
            <>
              <Link to="/debate">
                <Button variant="ghost" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Debatte
                </Button>
              </Link>
              
              <Link to="/leaderboard">
                <Button variant="ghost" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Rangliste
                </Button>
              </Link>
            </>
          )}
          
          {user ? (
            <div className="flex items-center gap-4">
              {profile && (
                <ReputationDisplay 
                  score={profile.reputation_score} 
                  username={profile.username}
                  size="sm"
                />
              )}
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
