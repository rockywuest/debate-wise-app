
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/utils/i18n';
import { 
  MessageSquare, 
  Trophy, 
  LogOut, 
  User, 
  TrendingUp, 
  Globe, 
  Menu,
  X
} from 'lucide-react';

export const MobileOptimizedNavigation = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { t, language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const toggleLanguage = () => {
    setLanguage(language === 'de' ? 'en' : 'de');
  };

  const navItems = [
    {
      path: '/debates',
      label: t('nav.debates'),
      icon: MessageSquare
    },
    {
      path: '/leaderboard',
      label: t('nav.leaderboard'),
      icon: Trophy
    },
    {
      path: '/analytics',
      label: t('nav.analytics'),
      icon: TrendingUp
    }
  ];

  const closeSheet = () => setIsOpen(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">debate wise</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleLanguage}
              className="gap-2"
            >
              <Globe className="h-4 w-4" />
              {language.toUpperCase()}
            </Button>

            {user && (
              <>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.path} to={item.path}>
                      <Button 
                        variant={isActive(item.path) ? 'default' : 'ghost'} 
                        size="sm"
                        className="gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}

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
              </>
            )}

            {!user && (
              <Link to="/auth">
                <Button size="sm">
                  {t('nav.login')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <span className="font-bold">debate wise</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={toggleLanguage}
                      className="gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      {language.toUpperCase()}
                    </Button>
                  </div>

                  {/* User Info */}
                  {user && (
                    <div className="bg-muted rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        <span className="font-medium">
                          {user.user_metadata?.username || 'User'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Navigation Items */}
                  <div className="flex-1 space-y-2">
                    {user ? (
                      <>
                        {navItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link 
                              key={item.path} 
                              to={item.path}
                              onClick={closeSheet}
                              className="block"
                            >
                              <Button 
                                variant={isActive(item.path) ? 'default' : 'ghost'} 
                                className="w-full justify-start gap-3 h-12 text-base"
                              >
                                <Icon className="h-5 w-5" />
                                {item.label}
                              </Button>
                            </Link>
                          );
                        })}
                        
                        <div className="pt-4 border-t">
                          <Button 
                            variant="ghost" 
                            onClick={() => {
                              signOut();
                              closeSheet();
                            }}
                            className="w-full justify-start gap-3 h-12 text-base"
                          >
                            <LogOut className="h-5 w-5" />
                            {t('nav.logout')}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Link to="/auth" onClick={closeSheet}>
                        <Button className="w-full h-12 text-base">
                          {t('nav.login')}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
