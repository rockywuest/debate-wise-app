
import React from 'react';
import type { User } from '@supabase/supabase-js';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { getNavItems } from './NavigationItems';
import { UserMenu } from './UserMenu';
import { useUserRole } from '@/hooks/useUserRole';

interface DesktopNavigationProps {
  user: User | null;
  signOut: () => Promise<void> | void;
  language: 'de' | 'en';
  toggleLanguage: () => void;
}

export const DesktopNavigation = ({ user, signOut, language, toggleLanguage }: DesktopNavigationProps) => {
  const location = useLocation();
  const { isAdmin } = useUserRole();
  const navItems = getNavItems(isAdmin(), language === 'de' ? 'de' : 'en');
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="hidden md:flex items-center space-x-6">
      {user && (
        <>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant={isActive(item.path) ? 'default' : 'ghost'} 
                  size="default"
                  className={`gap-3 text-lg font-semibold ${
                    isActive(item.path) 
                      ? 'bg-fw-accent text-white shadow-button' 
                      : 'text-white hover:bg-fw-border/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </>
      )}

      <Button 
        variant="ghost" 
        size="default"
        onClick={toggleLanguage}
        className="gap-2 text-white hover:bg-fw-border/50 font-semibold"
      >
        <Globe className="h-5 w-5" />
        {language.toUpperCase()}
      </Button>

      <UserMenu user={user} signOut={signOut} language={language === 'de' ? 'de' : 'en'} />
    </div>
  );
};
