
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DesktopNavigation } from './DesktopNavigation';
import { MobileNavigation } from './MobileNavigation';
import { useTranslation } from '@/utils/i18n';

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'de' ? 'en' : 'de');
  };

  return (
    <nav className="bg-fw-primary border-b border-fw-border shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              DebateWise
            </h1>
          </div>

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
