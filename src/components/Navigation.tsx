
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
    <nav className="fw-header border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and App Title */}
        <Link to="/" className="fw-nav-logo">
          <img
            src="/lovable-uploads/ff526cc9-9c59-471f-9937-ff92eadbc73e.png"
            alt="FRECH & WUEST Logo"
            className="h-9 w-9 rounded-xl shadow"
            style={{ background: 'white', padding: 2 }}
          />
          <span className="app-title fw-gradient-text text-2xl font-display font-bold tracking-tight select-none">
            Debattensystem
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <Link to="/debates" className="fw-nav-link">
                <Button variant="ghost" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden md:inline">Debatten</span>
                </Button>
              </Link>
              <Link to="/leaderboard" className="fw-nav-link">
                <Button variant="ghost" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  <span className="hidden md:inline">Rangliste</span>
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
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="fw-button-gradient"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Abmelden
              </Button>
            </div>
          ) : (
            <Link to="/auth" className="fw-nav-link">
              <Button
                variant="outline"
                className="fw-button-gradient"
              >
                Anmelden
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
