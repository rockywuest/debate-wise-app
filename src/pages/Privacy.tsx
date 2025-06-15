
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  const [language, setLanguage] = useState<'de' | 'en'>('en');

  // Load language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'de' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const content = {
    de: {
      title: "Datenschutzerklärung",
      backToHome: "Zurück zur Startseite",
      placeholder: "Hier können Sie Ihre Datenschutzerklärung eingeben...\n\n1. Datenschutz auf einen Blick\n\nAllgemeine Hinweise\nDie folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.\n\n2. Allgemeine Hinweise und Pflichtinformationen\n\nDatenschutz\nDie Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst.\n\n3. Datenerfassung auf dieser Website\n\nWer ist verantwortlich für die Datenerfassung auf dieser Website?\nDie Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.\n\nVerantwortliche Stelle:\nFRECH & WUEST GmbH\n[Kontaktdaten]"
    },
    en: {
      title: "Privacy Policy",
      backToHome: "Back to Home",
      placeholder: "You can enter your privacy policy here...\n\n1. Privacy at a glance\n\nGeneral information\nThe following notes provide a simple overview of what happens to your personal data when you visit this website.\n\n2. General information and mandatory information\n\nData protection\nThe operators of this website take the protection of your personal data very seriously.\n\n3. Data collection on this website\n\nWho is responsible for data collection on this website?\nData processing on this website is carried out by the website operator.\n\nResponsible party:\nFRECH & WUEST GmbH\n[Contact details]"
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-gray-900">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link 
              to="/" 
              className="text-[#2563EB] hover:text-blue-700 font-semibold"
            >
              ← {t.backToHome}
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            {t.title}
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <textarea
              className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              placeholder={t.placeholder}
              defaultValue=""
            />
            <div className="mt-4 text-sm text-gray-500">
              This is an editable area. You can modify the content above to add your privacy policy information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
