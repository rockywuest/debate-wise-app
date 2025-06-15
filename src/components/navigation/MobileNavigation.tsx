
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MessageSquare, LogOut, User, Globe, Menu } from 'lucide-react';
import { getNavItems } from './NavigationItems';
import { useUserRole } from '@/hooks/useUserRole';

interface MobileNavigationProps {
  user: any;
  signOut: () => void;
  language: string;
  toggleLanguage: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const MobileNavigation = ({ 
  user, 
  signOut, 
  language, 
  toggleLanguage, 
  isOpen, 
  setIsOpen 
}: MobileNavigationProps) => {
  const location = useLocation();
  const { isAdmin } = useUserRole();
  const navItems = getNavItems(isAdmin());
  
  const isActive = (path: string) => location.pathname === path;
  const closeSheet = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="default" className="text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 bg-fw-panel border-fw-border">
          <div className="flex flex-col h-full">
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
  );
};
