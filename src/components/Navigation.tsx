
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { ReputationDisplay } from './ReputationDisplay';
import { User, LogOut, MessageSquare, Trophy, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const [language, setLanguage] = useState<'de' | 'en'>('en');

  // Load language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'de' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  const handleLanguageChange = (lang: 'de' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const translations = {
    de: {
      dashboard: "Dashboard",
      debates: "Debatten",
      leaderboard: "Rangliste",
      signOut: "Abmelden",
      signIn: "Anmelden",
      landing: "Startseite"
    },
    en: {
      dashboard: "Dashboard",
      debates: "Debates",
      leaderboard: "Leaderboard",
      signOut: "Sign Out",
      signIn: "Sign In",
      landing: "Home"
    }
  };

  const t = translations[language];

  return (
    <nav className="fw-header border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and App Title */}
        <Link to={user ? "/dashboard" : "/"} className="fw-nav-logo">
          <span className="app-title fw-gradient-text text-2xl font-display font-bold tracking-tight select-none">
            debate wise
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="fw-nav-link">
            <Button variant="ghost" className="gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden md:inline">{t.landing}</span>
            </Button>
          </Link>
          {user && (
            <>
              <Link to="/dashboard" className="fw-nav-link">
                <Button variant="ghost" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden md:inline">{t.dashboard}</span>
                </Button>
              </Link>
              <Link to="/debates" className="fw-nav-link">
                <Button variant="ghost" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden md:inline">{t.debates}</span>
                </Button>
              </Link>
              <Link to="/leaderboard" className="fw-nav-link">
                <Button variant="ghost" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  <span className="hidden md:inline">{t.leaderboard}</span>
                </Button>
              </Link>
            </>
          )}
          
          {/* Language Switcher */}
          <div className="flex space-x-2 text-sm font-semibold text-gray-500">
            <button 
              onClick={() => handleLanguageChange('de')}
              className={`hover:text-blue-600 ${language === 'de' ? 'font-bold text-[#2563EB] underline' : ''}`}
            >
              DE
            </button>
            <span>|</span>
            <button 
              onClick={() => handleLanguageChange('en')}
              className={`hover:text-blue-600 ${language === 'en' ? 'font-bold text-[#2563EB] underline' : ''}`}
            >
              EN
            </button>
          </div>

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
                {t.signOut}
              </Button>
            </div>
          ) : (
            <Link to="/auth" className="fw-nav-link">
              <Button
                variant="outline"
                className="fw-button-gradient"
              >
                {t.signIn}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
