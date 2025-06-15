
export interface TranslationKey {
  en: string;
  de: string;
}

export const translations = {
  // Navigation
  'nav.debates': { en: 'Debates', de: 'Debatten' },
  'nav.leaderboard': { en: 'Leaderboard', de: 'Rangliste' },
  'nav.logout': { en: 'Logout', de: 'Abmelden' },
  'nav.login': { en: 'Login', de: 'Anmelden' },

  // Debate page
  'debates.title': { en: 'Active Debates', de: 'Aktive Debatten' },
  'debates.subtitle': { en: 'Join the discourse, elevate the debate', de: 'Diskutieren Sie mit, verbessern Sie die Debatte' },
  'debates.create': { en: 'Create New Debate', de: 'Neue Debatte erstellen' },
  'debates.empty': { en: 'No debates yet. Be the first to start an intelligent discussion!', de: 'Noch keine Debatten. Seien Sie der Erste, der eine intelligente Diskussion startet!' },

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
  'common.back': { en: 'Back', de: 'Zurück' },
  'common.next': { en: 'Next', de: 'Weiter' },
  'common.previous': { en: 'Previous', de: 'Zurück' },
} as const;

export type TranslationKeys = keyof typeof translations;

export const useTranslation = () => {
  // For now, we'll detect language from browser or use a default
  // Later this can be expanded to user preferences
  const getLanguage = (): 'en' | 'de' => {
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('de') ? 'de' : 'en';
  };

  const language = getLanguage();

  const t = (key: TranslationKeys): string => {
    return translations[key][language];
  };

  return { t, language };
};
