
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';

interface UserMenuProps {
  user: any;
  signOut: () => void;
}

export const UserMenu = ({ user, signOut }: UserMenuProps) => {
  if (!user) {
    return (
      <Link to="/auth">
        <Button 
          size="default"
          className="font-semibold text-lg"
        >
          Anmelden
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
          Ausloggen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
