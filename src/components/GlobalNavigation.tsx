
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/utils/i18n';
import { DesktopNavigation } from './navigation/DesktopNavigation';
import { MobileNavigation } from './navigation/MobileNavigation';

export const GlobalNavigation = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'de' ? 'en' : 'de');
  };

  return (
    <nav className="bg-fw-panel border-b-2 border-fw-border sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/debates" className="flex items-center space-x-3">
            <MessageSquare className="h-8 w-8 text-fw-accent" />
            <span className="font-bold text-2xl text-white">debate wise</span>
          </Link>

          <DesktopNavigation 
            user={user}
            signOut={signOut}
            language={language}
            toggleLanguage={toggleLanguage}
          />

          <MobileNavigation 
            user={user}
            signOut={signOut}
            language={language}
            toggleLanguage={toggleLanguage}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>
      </div>
    </nav>
  );
};
