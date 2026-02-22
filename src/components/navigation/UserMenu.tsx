
import React from 'react';
import type { User as AuthUser } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';

interface UserMenuProps {
  user: AuthUser | null;
  signOut: () => Promise<void> | void;
  language: 'de' | 'en';
}

export const UserMenu = ({ user, signOut, language }: UserMenuProps) => {
  const isGerman = language === 'de';

  if (!user) {
    return (
      <Link to="/auth">
        <Button 
          size="default"
          className="font-semibold text-lg"
        >
          {isGerman ? 'Anmelden' : 'Sign In'}
        </Button>
      </Link>
    );
  }

  return (
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
          {isGerman ? 'Abmelden' : 'Sign Out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
