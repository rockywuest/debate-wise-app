
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface TranslationKey {
  en: string;
  de: string;
}

export const translations = {
  // Navigation
  'nav.debates': { en: 'Debates', de: 'Debatten' },
  'nav.leaderboard': { en: 'Leaderboard', de: 'Rangliste' },
  'nav.logout': { en: 'Sign Out', de: 'Abmelden' },
  'nav.login': { en: 'Sign In', de: 'Anmelden' },
  'nav.analytics': { en: 'Analytics', de: 'Analytics' },
  'nav.admin': { en: 'Admin', de: 'Admin' },

  // Debate page
  'debates.title': { en: 'Active Debates', de: 'Aktive Debatten' },
  'debates.subtitle': { en: 'Join the discourse, elevate the debate', de: 'Diskutieren Sie mit, verbessern Sie die Debatte' },
  'debates.create': { en: 'Create New Debate', de: 'Neue Debatte erstellen' },
  'debates.empty': { en: 'No debates yet. Be the first to start an intelligent discussion!', de: 'Noch keine Debatten. Seien Sie der Erste, der eine intelligente Diskussion startet!' },
  'debates.intelligentTitle': { en: 'Intelligent Debates', de: 'Intelligente Debatten' },
  'debates.intelligentSubtitle': {
    en: 'Participate in evidence-based discussions and develop your arguments through AI feedback.',
    de: 'Nehmen Sie an evidenzbasierten Diskussionen teil und entwickeln Sie Ihre Argumente durch KI-Feedback weiter.'
  },
  'debates.newDebate': { en: 'New Debate', de: 'Neue Debatte' },
  'debates.welcomeTitle': {
    en: 'Welcome to the Intelligent Debate Platform',
    de: 'Willkommen zur intelligenten Debattenplattform'
  },
  'debates.welcomeDescription': {
    en: 'Sign in to participate in debates and benefit from AI-powered argument analysis.',
    de: 'Melden Sie sich an, um an Debatten teilzunehmen und von KI-gestützter Argumentanalyse zu profitieren.'
  },
  'debates.noDebatesTitle': { en: 'No debates yet', de: 'Noch keine Debatten' },
  'debates.noDebatesDescription': { en: 'Be the first to start a debate!', de: 'Seien Sie der Erste, der eine Debatte startet!' },
  'debates.active': { en: 'Active', de: 'Aktiv' },
  'debates.discussion': { en: 'Discussion', de: 'Diskussion' },
  'debates.joinDiscussion': { en: 'Join Discussion', de: 'Teilnehmen' },

  // Debate detail
  'debate.proArguments': { en: 'Pro Arguments', de: 'Pro-Argumente' },
  'debate.contraArguments': { en: 'Contra Arguments', de: 'Contra-Argumente' },
  'debate.noProArguments': { en: 'No pro arguments yet. Be the first!', de: 'Noch keine Pro-Argumente vorhanden. Sei der Erste!' },
  'debate.noContraArguments': { en: 'No contra arguments yet. Start the discussion!', de: 'Noch keine Contra-Argumente vorhanden. Starte die Diskussion!' },
  'debate.notFound': { en: 'Debate not found', de: 'Debatte nicht gefunden' },
  'debate.notFoundDescription': { en: 'The requested debate does not exist or has been removed.', de: 'Die angeforderte Debatte existiert nicht oder wurde entfernt.' },
  'debate.loadingDebate': { en: 'Loading debate...', de: 'Lade Debatte...' },
  'debate.loadingArguments': { en: 'Loading arguments...', de: 'Lade Argumente...' },

  // Argument form
  'argument.add': { en: 'Add Argument', de: 'Argument hinzufügen' },
  'argument.type.pro': { en: 'Pro Argument', de: 'Pro-Argument' },
  'argument.type.contra': { en: 'Contra Argument', de: 'Contra-Argument' },
  'argument.type.neutral': { en: 'Neutral Thesis', de: 'Neutrale These' },
  'argument.placeholder': { en: 'Formulate your argument here. Think about relevance, evidence, specificity, and logical clarity...', de: 'Formulieren Sie hier Ihr Argument. Denken Sie an Relevanz, Belege, Spezifität und logische Klarheit...' },
  'argument.submit': { en: 'Add Argument', de: 'Argument hinzufügen' },
  'argument.cancel': { en: 'Cancel', de: 'Abbrechen' },
  'argument.chars': { en: 'characters', de: 'Zeichen' },
  'argument.min': { en: 'min.', de: 'min.' },

  // Index page
  'index.welcome': { en: 'Welcome to the Debate System', de: 'Willkommen zum Debattensystem' },
  'index.hello': { en: 'Hello! You are successfully logged in.', de: 'Hallo! Sie sind erfolgreich angemeldet.' },
  'index.createDebate': { en: 'Create Debate', de: 'Debatte erstellen' },
  'index.viewAllDebates': { en: 'View All Debates', de: 'Alle Debatten ansehen' },
  'index.viewLeaderboard': { en: 'View Leaderboard', de: 'Rangliste ansehen' },
  'index.structuredDiscussion': { en: 'Structured discussions with visual argument maps', de: 'Strukturierte Diskussionen mit visuellen Argumentkarten' },
  'index.getStarted': { en: 'Get Started', de: 'Jetzt starten' },
  'index.latestDebates': { en: 'Latest Debates', de: 'Neueste Debatten' },
  'index.viewAll': { en: 'View All', de: 'Alle ansehen' },
  'index.debatesLoading': { en: 'Loading debates...', de: 'Debatten werden geladen...' },
  'index.noDebatesYet': { en: 'No debates available yet. Create the first debate!', de: 'Noch keine Debatten vorhanden. Erstellen Sie die erste Debatte!' },
  'index.participate': { en: 'Participate', de: 'Teilnehmen' },

  // Auth page
  'auth.loading': { en: 'Loading...', de: 'Wird geladen...' },
  'auth.signIn': { en: 'Sign In', de: 'Anmelden' },
  'auth.signUp': { en: 'Sign Up', de: 'Registrieren' },
  'auth.signInDescription': { en: 'Sign in to your account', de: 'Melden Sie sich in Ihrem Konto an' },
  'auth.signUpDescription': { en: 'Create a new account', de: 'Erstellen Sie ein neues Konto' },
  'auth.username': { en: 'Username', de: 'Benutzername' },
  'auth.email': { en: 'Email', de: 'E-Mail' },
  'auth.password': { en: 'Password', de: 'Passwort' },
  'auth.usernamePlaceholder': { en: 'Your username', de: 'Ihr Benutzername' },
  'auth.emailPlaceholder': { en: 'your.email@example.com', de: 'ihre.email@beispiel.de' },
  'auth.passwordPlaceholder': { en: 'Your password', de: 'Ihr Passwort' },
  'auth.processing': { en: 'Processing...', de: 'Wird verarbeitet...' },
  'auth.noAccount': { en: "Don't have an account? Sign up", de: 'Noch kein Konto? Hier registrieren' },
  'auth.haveAccount': { en: 'Already have an account? Sign in', de: 'Bereits ein Konto? Hier anmelden' },

  // Create debate
  'createDebate.button': { en: 'Create New Debate', de: 'Neue Debatte erstellen' },
  'createDebate.title': { en: 'Create New Debate', de: 'Neue Debatte erstellen' },
  'createDebate.name': { en: 'Title *', de: 'Titel *' },
  'createDebate.description': { en: 'Description (optional)', de: 'Beschreibung (optional)' },
  'createDebate.namePlaceholder': { en: 'Enter the debate title...', de: 'Geben Sie den Titel der Debatte ein...' },
  'createDebate.descriptionPlaceholder': { en: 'Describe the debate topic...', de: 'Beschreiben Sie das Thema der Debatte...' },
  'createDebate.cancel': { en: 'Cancel', de: 'Abbrechen' },
  'createDebate.create': { en: 'Create Debate', de: 'Debatte erstellen' },
  'createDebate.creating': { en: 'Creating...', de: 'Erstelle...' },
  'createDebate.errorTitle': { en: 'Error', de: 'Fehler' },
  'createDebate.errorDescription': { en: 'Please enter a title.', de: 'Bitte geben Sie einen Titel ein.' },
  'createDebate.successTitle': { en: 'Debate created', de: 'Debatte erstellt' },
  'createDebate.successDescription': { en: 'The new debate was created successfully.', de: 'Die neue Debatte wurde erfolgreich erstellt.' },

  // Quality analysis
  'quality.title': { en: 'AI Quality Analysis', de: 'KI-Qualitätsanalyse' },
  'quality.relevance': { en: 'Relevance', de: 'Relevanz' },
  'quality.evidence': { en: 'Evidence', de: 'Substantiierung' },
  'quality.specificity': { en: 'Specificity', de: 'Spezifität' },
  'quality.logic': { en: 'Logic', de: 'Logik' },
  'quality.present': { en: 'Present', de: 'Vorhanden' },
  'quality.absent': { en: 'Absent', de: 'Nicht vorhanden' },
  'quality.concrete': { en: 'Concrete', de: 'Konkret' },
  'quality.vague': { en: 'Vague', de: 'Vage' },
  'quality.none': { en: 'None', de: 'Keiner' },

  // Reputation
  'reputation.leaderboard': { en: 'Meritocracy Leaderboard', de: 'Meritokratie-Rangliste' },
  'reputation.subtitle': { en: 'The most constructive thinkers in our intellectual community', de: 'Die konstruktivsten Denker unserer intellektuellen Gemeinschaft' },
  'reputation.rank': { en: 'Rank', de: 'Rang' },
  'reputation.points': { en: 'points', de: 'Punkte' },

  // Steel manning
  'steelman.title': { en: 'Steel-Manning: Fair Representation of Counter-Argument', de: 'Steel-Manning: Faire Darstellung des Gegenarguments' },
  'steelman.button': { en: 'Represent counter-argument fairly', de: 'Gegenargument fair darstellen' },
  'steelman.instructions': { en: 'To ensure you understand the opposing position, please reformulate the argument you are refuting in the strongest and fairest way:', de: 'Um sicherzustellen, dass du die Gegenposition verstehst, formuliere das Argument, das du widerlegst, bitte in der stärksten und fairsten Weise neu:' },
  'steelman.placeholder': { en: 'Write your fair and strong interpretation of the argument here...', de: 'Schreibe hier deine faire und starke Interpretation des Arguments...' },
  'steelman.evaluate': { en: 'Get evaluation', de: 'Bewerten lassen' },
  'steelman.evaluating': { en: 'Evaluating...', de: 'Prüfe...' },
  'steelman.close': { en: 'Close', de: 'Schließen' },

  // Onboarding
  'onboarding.welcome': { en: 'Welcome to Debate Wise', de: 'Willkommen bei Debate Wise' },
  'onboarding.intro': { en: 'A platform designed to elevate online discourse through AI-powered argument analysis and merit-based reputation.', de: 'Eine Plattform, die darauf ausgelegt ist, Online-Diskurse durch KI-gestützte Argumentanalyse und verdienstbasierte Reputation zu verbessern.' },
  'onboarding.step1.title': { en: 'AI Analysis', de: 'KI-Analyse' },
  'onboarding.step1.desc': { en: 'Every argument is analyzed for relevance, evidence, specificity, and logical validity.', de: 'Jedes Argument wird auf Relevanz, Belege, Spezifität und logische Gültigkeit analysiert.' },
  'onboarding.step2.title': { en: 'Merit-Based Reputation', de: 'Verdienstbasierte Reputation' },
  'onboarding.step2.desc': { en: 'Earn points for intellectual honesty, not popularity. Quality arguments and fair representations are rewarded.', de: 'Verdienen Sie Punkte für intellektuelle Ehrlichkeit, nicht für Popularität. Qualitätsargumente und faire Darstellungen werden belohnt.' },
  'onboarding.step3.title': { en: 'Steel-Manning', de: 'Steel-Manning' },
  'onboarding.step3.desc': { en: 'Represent opposing arguments in their strongest form before refuting them. This builds understanding and earns respect.', de: 'Stellen Sie gegnerische Argumente in ihrer stärksten Form dar, bevor Sie sie widerlegen. Das schafft Verständnis und verdient Respekt.' },
  'onboarding.start': { en: 'Start Debating', de: 'Debattieren beginnen' },
  'onboarding.skip': { en: 'Skip intro', de: 'Einführung überspringen' },

  // Common
  'common.loading': { en: 'Loading...', de: 'Wird geladen...' },
  'common.error': { en: 'Error', de: 'Fehler' },
  'common.success': { en: 'Success', de: 'Erfolg' },
  'common.cancel': { en: 'Cancel', de: 'Abbrechen' },
  'common.back': { en: 'Back', de: 'Zurück' },
  'common.next': { en: 'Next', de: 'Weiter' },
  'common.previous': { en: 'Previous', de: 'Zurück' },
} as const;

export type TranslationKeys = keyof typeof translations;
export type SupportedLanguage = 'en' | 'de';

interface I18nContextValue {
  language: SupportedLanguage;
  setLanguage: (newLanguage: SupportedLanguage) => void;
  t: (key: TranslationKeys) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const LANGUAGE_STORAGE_KEYS = ['debate-wise-language', 'debate-platform-language'] as const;

const isSupportedLanguage = (value: string | null): value is SupportedLanguage => {
  return value === 'en' || value === 'de';
};

const getStoredLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  for (const key of LANGUAGE_STORAGE_KEYS) {
    const value = window.localStorage.getItem(key);
    if (isSupportedLanguage(value)) {
      return value;
    }
  }

  return 'en';
};

const persistLanguage = (newLanguage: SupportedLanguage) => {
  if (typeof window === 'undefined') {
    return;
  }

  for (const key of LANGUAGE_STORAGE_KEYS) {
    window.localStorage.setItem(key, newLanguage);
  }
};

const createTranslator = (language: SupportedLanguage) => {
  return (key: TranslationKeys): string => translations[key][language];
};

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(getStoredLanguage);

  const setLanguage = useCallback((newLanguage: SupportedLanguage) => {
    persistLanguage(newLanguage);
    setLanguageState(newLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useMemo(() => createTranslator(language), [language]);
  const value = useMemo<I18nContextValue>(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return React.createElement(I18nContext.Provider, { value }, children);
};

export const useTranslation = (): I18nContextValue => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }

  return context;
};
