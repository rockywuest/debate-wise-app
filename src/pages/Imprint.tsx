
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Imprint = () => {
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
      title: "Impressum",
      backToHome: "Zurück zur Startseite",
      placeholder: "Hier können Sie Ihr Impressum eingeben...\n\nAngaben gemäß § 5 TMG:\n\nFRECH & WUEST GmbH\n[Adresse]\n[PLZ Ort]\n\nVertreten durch:\n[Geschäftsführer]\n\nKontakt:\nTelefon: [Telefonnummer]\nE-Mail: [E-Mail-Adresse]\n\nRegistereintrag:\nEintragung im Handelsregister.\nRegistergericht: [Registergericht]\nRegisternummer: [Registernummer]\n\nUmsatzsteuer-ID:\nUmsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:\n[USt-IdNr.]"
    },
    en: {
      title: "Imprint",
      backToHome: "Back to Home",
      placeholder: "You can enter your imprint information here...\n\nInformation according to § 5 TMG:\n\nFRECH & WUEST GmbH\n[Address]\n[Postal Code City]\n\nRepresented by:\n[Managing Director]\n\nContact:\nPhone: [Phone Number]\nEmail: [Email Address]\n\nRegister entry:\nEntry in the commercial register.\nRegister court: [Register Court]\nRegister number: [Register Number]\n\nVAT ID:\nVAT identification number according to §27 a VAT law:\n[VAT ID]"
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
              This is an editable area. You can modify the content above to add your legal imprint information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Imprint;
