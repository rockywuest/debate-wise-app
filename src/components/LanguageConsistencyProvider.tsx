
import React, { createContext, useContext, useEffect, useState } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  de: {
    // Navigation
    'nav.debates': 'Debatten',
    'nav.leaderboard': 'Rangliste',
    'nav.analytics': 'Analytik',
    'nav.admin': 'Admin',
    'nav.login': 'Anmelden',
    'nav.logout': 'Abmelden',
    
    // Common
    'common.loading': 'Lädt...',
    'common.error': 'Fehler',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.submit': 'Absenden',
    'common.edit': 'Bearbeiten',
    'common.delete': 'Löschen',
    
    // Arguments
    'argument.add': 'Argument hinzufügen',
    'argument.placeholder': 'Formulieren Sie Ihr Argument ausführlich...',
    'argument.submit': 'Argument einreichen',
    'argument.type.pro': 'Pro',
    'argument.type.contra': 'Contra',
    'argument.chars': 'Zeichen',
    'argument.min': 'Mindestens',
    
    // Quality
    'quality.relevance': 'Relevanz',
    'quality.evidence': 'Substantiierung',
    'quality.specificity': 'Spezifität',
    'quality.logic': 'Logik',
    
    // Debate
    'debate.notFound': 'Debatte nicht gefunden',
    'debate.notFoundDescription': 'Die angeforderte Debatte existiert nicht oder wurde gelöscht.',
    'debate.loadingDebate': 'Lade Debatte...',
    'debate.loadingArguments': 'Lade Argumente...',
    
    // Auth
    'auth.signIn': 'Anmelden',
    'auth.signUp': 'Registrieren',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.confirmPassword': 'Passwort bestätigen',
  },
  en: {
    // Navigation
    'nav.debates': 'Debates',
    'nav.leaderboard': 'Leaderboard',
    'nav.analytics': 'Analytics',
    'nav.admin': 'Admin',
    'nav.login': 'Sign In',
    'nav.logout': 'Sign Out',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    
    // Arguments
    'argument.add': 'Add Argument',
    'argument.placeholder': 'Formulate your argument in detail...',
    'argument.submit': 'Submit Argument',
    'argument.type.pro': 'Pro',
    'argument.type.contra': 'Contra',
    'argument.chars': 'characters',
    'argument.min': 'Minimum',
    
    // Quality
    'quality.relevance': 'Relevance',
    'quality.evidence': 'Evidence',
    'quality.specificity': 'Specificity',
    'quality.logic': 'Logic',
    
    // Debate
    'debate.notFound': 'Debate not found',
    'debate.notFoundDescription': 'The requested debate does not exist or has been deleted.',
    'debate.loadingDebate': 'Loading debate...',
    'debate.loadingArguments': 'Loading arguments...',
    
    // Auth
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
  }
};

export const LanguageConsistencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('debate-platform-language') || 'de';
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('debate-platform-language', lang);
  };

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.de] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageConsistency = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageConsistency must be used within LanguageConsistencyProvider');
  }
  return context;
};
