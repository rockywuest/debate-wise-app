import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/utils/i18n';
import { MessageSquare, Trophy, LogOut, User, TrendingUp } from 'lucide-react';

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">debate wise</span>
          </Link>

          {user && (
            <div className="flex items-center space-x-4">
              <Link to="/debates">
                <Button 
                  variant={isActive('/debates') ? 'default' : 'ghost'} 
                  size="sm"
                  className="gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  {t('nav.debates')}
                </Button>
              </Link>
              
              <Link to="/leaderboard">
                <Button 
                  variant={isActive('/leaderboard') ? 'default' : 'ghost'} 
                  size="sm"
                  className="gap-2"
                >
                  <Trophy className="h-4 w-4" />
                  {t('nav.leaderboard')}
                </Button>
              </Link>

              <Link to="/analytics">
                <Button 
                  variant={isActive('/analytics') ? 'default' : 'ghost'} 
                  size="sm"
                  className="gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Analytics
                </Button>
              </Link>

              <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {user.user_metadata?.username || 'User'}
                </span>
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => signOut()}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                {t('nav.logout')}
              </Button>
            </div>
          )}

          {!user && (
            <Link to="/auth">
              <Button size="sm">
                {t('nav.login')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
