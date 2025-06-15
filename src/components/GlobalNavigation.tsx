
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
  Settings
} from 'lucide-react';

export const GlobalNavigation = () => {
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
      label: 'Debatten',
      icon: MessageSquare
    },
    {
      path: '/leaderboard',
      label: 'Rangliste',
      icon: Trophy
    },
    {
      path: '/analytics',
      label: 'Analytik',
      icon: TrendingUp
    },
    {
      path: '/admin',
      label: 'Admin',
      icon: Settings
    }
  ];

  const closeSheet = () => setIsOpen(false);

  return (
    <nav className="bg-fw-panel border-b-2 border-fw-border sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/debates" className="flex items-center space-x-3">
            <MessageSquare className="h-8 w-8 text-fw-accent" />
            <span className="font-bold text-2xl text-white">debate wise</span>
          </Link>

          {/* Desktop Navigation */}
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

            {/* Language Switcher */}
            <Button 
              variant="ghost" 
              size="default"
              onClick={toggleLanguage}
              className="gap-2 text-white hover:bg-fw-border/50 font-semibold"
            >
              <Globe className="h-5 w-5" />
              {language.toUpperCase()}
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="default"
                    className="gap-3 bg-fw-bg border-fw-border text-white hover:bg-fw-border/50 font-semibold"
                  >
                    <User className="h-5 w-5" />
                    {user.user_metadata?.username || 'User'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-fw-panel border-fw-border" align="end">
                  <DropdownMenuItem 
                    onClick={() => signOut()}
                    className="text-white hover:bg-fw-border/50 cursor-pointer gap-3"
                  >
                    <LogOut className="h-4 w-4" />
                    Ausloggen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button 
                  size="default"
                  className="font-semibold text-lg"
                >
                  Anmelden
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="default" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-fw-panel border-fw-border">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-6 w-6 text-fw-accent" />
                      <span className="font-bold text-white text-xl">debate wise</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={toggleLanguage}
                      className="gap-2 text-white"
                    >
                      <Globe className="h-4 w-4" />
                      {language.toUpperCase()}
                    </Button>
                  </div>

                  {/* User Info */}
                  {user && (
                    <div className="bg-fw-bg rounded-lg p-4 mb-8 border border-fw-border">
                      <div className="flex items-center gap-3">
                        <User className="h-6 w-6 text-white" />
                        <span className="font-semibold text-white text-lg">
                          {user.user_metadata?.username || 'User'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Navigation Items */}
                  <div className="flex-1 space-y-3">
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
                                className={`w-full justify-start gap-4 h-14 text-lg font-semibold ${
                                  isActive(item.path) 
                                    ? 'bg-fw-accent text-white' 
                                    : 'text-white hover:bg-fw-border/50'
                                }`}
                              >
                                <Icon className="h-6 w-6" />
                                {item.label}
                              </Button>
                            </Link>
                          );
                        })}
                        
                        <div className="pt-6 border-t border-fw-border">
                          <Button 
                            variant="ghost" 
                            onClick={() => {
                              signOut();
                              closeSheet();
                            }}
                            className="w-full justify-start gap-4 h-14 text-lg font-semibold text-white hover:bg-fw-border/50"
                          >
                            <LogOut className="h-6 w-6" />
                            Ausloggen
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Link to="/auth" onClick={closeSheet}>
                        <Button className="w-full h-14 text-lg font-semibold">
                          Anmelden
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
