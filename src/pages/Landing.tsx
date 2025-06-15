
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();
  const [language, setLanguage] = useState<'de' | 'en'>('de');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const translations = {
    de: {
      nav_problem: "Das Problem",
      nav_solution: "Die Lösung",
      nav_features: "Funktionen",
      nav_cta: "Beta-Zugang anfordern",
      hero_tagline: "Die Revolution des Online-Diskurses",
      hero_title: "Diskutieren statt spalten.",
      hero_subtitle: "debate wise ist die erste Plattform, die entwickelt wurde, um Klarheit statt Klicks zu fördern. Erleben Sie Debatten, die auf Logik, Fakten und gegenseitigem Verständnis basieren – moderiert von einer neutralen KI.",
      hero_cta: "Jetzt exklusiven Beta-Zugang sichern",
      problem_title: "Warum Online-Debatten scheitern",
      problem_subtitle: "Das Problem liegt nicht an den Menschen. Es liegt in der Architektur der Plattformen.",
      problem_box1_title: "Heutige Plattformen: Die Eskalations-Maschine",
      problem_box1_p: "Soziale Netzwerke sind darauf optimiert, \"Engagement\" durch Empörung und Polarisierung zu maximieren. Algorithmen belohnen die lautesten und emotionalsten Stimmen, nicht die logischsten.",
      problem_box1_li1_strong: "Lineare Feeds:",
      problem_box1_li1_text: "Wichtige Argumente gehen im endlosen Scrollen verloren.",
      problem_box1_li2_strong: "Toxische Anreize:",
      problem_box1_li2_text: "\"Likes\" und Retweets fördern Spaltung statt Verständnis.",
      problem_box1_li3_strong: "Fehlende Struktur:",
      problem_box1_li3_text: "Emotionale Ausbrüche dominieren über strukturierte Gedanken.",
      problem_box2_title: "debate wise: Gebaut für Klarheit",
      problem_box2_p: "Wir haben die Plattform von Grund auf neu gedacht. debate wise belohnt intellektuelle Redlichkeit, das Verstehen der Gegenseite und evidenzbasierte Argumentation.",
      problem_box2_li1_strong: "Argumentationskarten:",
      problem_box2_li1_text: "Visualisieren Sie die gesamte Debatte auf einen Blick.",
      problem_box2_li2_strong: "Konstruktive Anreize:",
      problem_box2_li2_text: "Punkte für Logik, nicht für Lautstärke.",
      problem_box2_li3_strong: "KI-Moderation:",
      problem_box2_li3_text: "Ein neutraler Schiedsrichter sorgt für Fairness und Fakten.",
      solution_title: "Die Lösung aus ersten Prinzipien: debate wise",
      solution_subtitle: "Wir ändern nicht die Menschen. Wir ändern die Architektur des Raumes, in dem sie interagieren. Agora ist keine Social-Media-Plattform. Es ist eine Debatten-Engine.",
      solution_box_title: "Ein Raum für tiefgründiges Denken",
      solution_box_p: "Stellen Sie sich einen Ort vor, an dem jede Stimme gehört wird, aber jede Behauptung belegt werden muss. Wo das Ziel nicht ist, zu \"gewinnen\", sondern gemeinsam zu verstehen. Das ist Agora. Unsere Plattform zerlegt komplexe Themen in ihre logischen Bestandteile und macht den Gedankengang jeder Seite transparent und nachvollziehbar.",
      solution_map_thesis: "[These] Klimawandel ist die größte Herausforderung...",
      solution_map_pro: "[Pro] Anstieg der globalen Temperaturen...",
      solution_map_pro_proof: "↳ [Beweis] NASA-Daten...",
      solution_map_contra: "[Contra] Wirtschaftliche Kosten der Umstellung...",
      solution_map_contra_refute: "↳ [Widerlegung] Langfristige Kosten des Nichtstuns...",
      footer_imprint: "Impressum",
      footer_privacy: "Datenschutz",
      footer_copyright: "© 2025 FRECH & WUEST GmbH. Alle Rechte vorbehalten.",
      footer_disclaimer: "Dieses Projekt ist eine konzeptionelle Demonstration.",
      app_access: "Zur App"
    },
    en: {
      nav_problem: "The Problem",
      nav_solution: "The Solution",
      nav_features: "Features",
      nav_cta: "Request Beta Access",
      hero_tagline: "The Revolution of Online Discourse",
      hero_title: "Debate, Don't Divide.",
      hero_subtitle: "debate wise is the first platform designed to promote clarity over clicks. Experience debates based on logic, facts, and mutual understanding – moderated by a neutral AI.",
      hero_cta: "Secure Your Exclusive Beta Access Now",
      problem_title: "Why Online Debates Fail",
      problem_subtitle: "The problem isn't the people. It's the architecture of the platforms.",
      problem_box1_title: "Today's Platforms: The Escalation Machine",
      problem_box1_p: "Social networks are optimized to maximize \"engagement\" through outrage and polarization. Algorithms reward the loudest and most emotional voices, not the most logical ones.",
      problem_box1_li1_strong: "Linear Feeds:",
      problem_box1_li1_text: "Important arguments get lost in the endless scroll.",
      problem_box1_li2_strong: "Toxic Incentives:",
      problem_box1_li2_text: "\"Likes\" and retweets encourage division instead of understanding.",
      problem_box1_li3_strong: "Lack of Structure:",
      problem_box1_li3_text: "Emotional outbursts dominate over structured thoughts.",
      problem_box2_title: "Agora: Built for Clarity",
      problem_box2_p: "We rethought the platform from the ground up. Agora rewards intellectual honesty, understanding the opposing side, and evidence-based argumentation.",
      problem_box2_li1_strong: "Argument Maps:",
      problem_box2_li1_text: "Visualize the entire debate at a glance.",
      problem_box2_li2_strong: "Constructive Incentives:",
      problem_box2_li2_text: "Points for logic, not for loudness.",
      problem_box2_li3_strong: "AI Moderation:",
      problem_box2_li3_text: "A neutral referee ensures fairness and facts.",
      solution_title: "The Solution from First Principles: Agora",
      solution_subtitle: "We don't change the people. We change the architecture of the space where they interact. Agora is not a social media platform. It's a debate engine.",
      solution_box_title: "A Space for Deep Thinking",
      solution_box_p: "Imagine a place where every voice is heard, but every claim must be substantiated. Where the goal isn't to \"win,\" but to understand together. That's Agora. Our platform breaks down complex topics into their logical components, making each side's line of thought transparent and traceable.",
      solution_map_thesis: "[Thesis] Climate change is the greatest challenge...",
      solution_map_pro: "[Pro] Rise in global temperatures...",
      solution_map_pro_proof: "↳ [Proof] NASA data...",
      solution_map_contra: "[Contra] Economic costs of transition...",
      solution_map_contra_refute: "↳ [Refutation] Long-term costs of inaction...",
      footer_imprint: "Imprint",
      footer_privacy: "Privacy Policy",
      footer_copyright: "© 2025 FRECH & WUEST GmbH. All rights reserved.",
      footer_disclaimer: "This project is a conceptual demonstration.",
      app_access: "Access App"
    }
  };

  const t = translations[language];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-gray-900 font-sans antialiased">
      {/* Header / Navigation */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200/80">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800">Agora</Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('problem')} 
              className="nav-link text-gray-600 font-semibold hover:text-[#2563EB] relative transition-colors"
            >
              {t.nav_problem}
            </button>
            <button 
              onClick={() => scrollToSection('solution')} 
              className="nav-link text-gray-600 font-semibold hover:text-[#2563EB] relative transition-colors"
            >
              {t.nav_solution}
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="nav-link text-gray-600 font-semibold hover:text-[#2563EB] relative transition-colors"
            >
              {t.nav_features}
            </button>
            
            {user ? (
              <Link to="/debates">
                <Button className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg shadow-lg transition-colors duration-300">
                  {t.app_access}
                </Button>
              </Link>
            ) : (
              <button 
                onClick={() => scrollToSection('cta')} 
                className="bg-[#2563EB] text-white font-bold py-2 px-5 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300"
              >
                {t.nav_cta}
              </button>
            )}
            
            <div className="flex space-x-2 text-sm font-semibold text-gray-500">
              <button 
                onClick={() => setLanguage('de')}
                className={`hover:text-blue-600 ${language === 'de' ? 'font-bold text-[#2563EB] underline' : ''}`}
              >
                DE
              </button>
              <span>|</span>
              <button 
                onClick={() => setLanguage('en')}
                className={`hover:text-blue-600 ${language === 'en' ? 'font-bold text-[#2563EB] underline' : ''}`}
              >
                EN
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
        
        {mobileMenuOpen && (
          <div className="md:hidden px-6 pt-2 pb-4 border-t border-gray-200/80 bg-white">
            <button 
              onClick={() => scrollToSection('problem')} 
              className="block py-2 text-gray-600 font-semibold w-full text-left"
            >
              {t.nav_problem}
            </button>
            <button 
              onClick={() => scrollToSection('solution')} 
              className="block py-2 text-gray-600 font-semibold w-full text-left"
            >
              {t.nav_solution}
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="block py-2 text-gray-600 font-semibold w-full text-left"
            >
              {t.nav_features}
            </button>
            
            {user ? (
              <Link to="/debates" className="block mt-4">
                <Button className="w-full text-center bg-[#2563EB] text-white font-bold py-2 px-5 rounded-lg shadow-lg">
                  {t.app_access}
                </Button>
              </Link>
            ) : (
              <button 
                onClick={() => scrollToSection('cta')} 
                className="block mt-4 w-full text-center bg-[#2563EB] text-white font-bold py-2 px-5 rounded-lg shadow-lg"
              >
                {t.nav_cta}
              </button>
            )}
            
            <div className="flex justify-center space-x-2 text-sm font-semibold text-gray-500 mt-4">
              <button 
                onClick={() => setLanguage('de')}
                className={`hover:text-blue-600 ${language === 'de' ? 'font-bold text-[#2563EB] underline' : ''}`}
              >
                DE
              </button>
              <span>|</span>
              <button 
                onClick={() => setLanguage('en')}
                className={`hover:text-blue-600 ${language === 'en' ? 'font-bold text-[#2563EB] underline' : ''}`}
              >
                EN
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section id="hero" className="py-24 md:py-32" style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(248,247,244,1) 60%, rgba(37,99,235,0.05) 100%)'
        }}>
          <div className="container mx-auto px-6 text-center">
            <span className="text-sm font-semibold text-[#2563EB] uppercase tracking-wider">
              {t.hero_tagline}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mt-4 leading-tight">
              {t.hero_title}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t.hero_subtitle}
            </p>
            <div className="mt-10">
              {user ? (
                <Link to="/debates">
                  <Button className="bg-[#2563EB] text-white font-bold text-lg py-4 px-8 rounded-lg shadow-xl hover:bg-blue-700 transition-all transform hover:scale-105 duration-300">
                    {t.app_access}
                  </Button>
                </Link>
              ) : (
                <button 
                  onClick={() => scrollToSection('cta')}
                  className="bg-[#2563EB] text-white font-bold text-lg py-4 px-8 rounded-lg shadow-xl hover:bg-blue-700 transition-all transform hover:scale-105 duration-300"
                >
                  {t.hero_cta}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section id="problem" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {t.problem_title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                {t.problem_subtitle}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-2xl font-bold text-red-800 mb-4">
                  {t.problem_box1_title}
                </h3>
                <p className="text-red-700 mb-4">
                  {t.problem_box1_p}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 mt-1">✗</span>
                    <div>
                      <strong className="text-red-800">{t.problem_box1_li1_strong}</strong>{' '}
                      <span>{t.problem_box1_li1_text}</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 mt-1">✗</span>
                    <div>
                      <strong className="text-red-800">{t.problem_box1_li2_strong}</strong>{' '}
                      <span>{t.problem_box1_li2_text}</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 mt-1">✗</span>
                    <div>
                      <strong className="text-red-800">{t.problem_box1_li3_strong}</strong>{' '}
                      <span>{t.problem_box1_li3_text}</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="p-8 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-2xl font-bold text-blue-800 mb-4">
                  {t.problem_box2_title}
                </h3>
                <p className="text-blue-700 mb-4">
                  {t.problem_box2_p}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <div>
                      <strong className="text-blue-800">{t.problem_box2_li1_strong}</strong>{' '}
                      <span>{t.problem_box2_li1_text}</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <div>
                      <strong className="text-blue-800">{t.problem_box2_li2_strong}</strong>{' '}
                      <span>{t.problem_box2_li2_text}</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <div>
                      <strong className="text-blue-800">{t.problem_box2_li3_strong}</strong>{' '}
                      <span>{t.problem_box2_li3_text}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="solution" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t.solution_title}
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              {t.solution_subtitle}
            </p>
            <div className="mt-12 max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-8">
                  <h3 className="text-2xl font-bold text-left mb-4">
                    {t.solution_box_title}
                  </h3>
                  <p className="text-gray-600 text-left">
                    {t.solution_box_p}
                  </p>
                </div>
                <div className="md:w-1/2 mt-8 md:mt-0">
                  <div className="bg-gray-100 p-4 rounded-md text-left text-sm font-mono">
                    <div className="font-bold">{t.solution_map_thesis}</div>
                    <div className="ml-4 mt-2 border-l-2 border-green-400 pl-2">
                      <div className="text-green-700">{t.solution_map_pro}</div>
                      <div className="ml-4 mt-1 border-l-2 border-green-400 pl-2 text-xs">
                        {t.solution_map_pro_proof}
                      </div>
                    </div>
                    <div className="ml-4 mt-2 border-l-2 border-red-400 pl-2">
                      <div className="text-red-700">{t.solution_map_contra}</div>
                      <div className="ml-4 mt-1 border-l-2 border-red-400 pl-2 text-xs">
                        {t.solution_map_contra_refute}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features placeholder */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              {t.nav_features}
            </h2>
            <p className="text-lg text-gray-600">
              Features section can be expanded with specific functionality demonstrations.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="py-20 bg-[#2563EB] text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              {user ? t.app_access : t.hero_cta}
            </h2>
            {user ? (
              <Link to="/debates">
                <Button className="bg-white text-[#2563EB] font-bold text-lg py-4 px-8 rounded-lg shadow-xl hover:bg-gray-100 transition-all transform hover:scale-105 duration-300">
                  {t.app_access}
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button className="bg-white text-[#2563EB] font-bold text-lg py-4 px-8 rounded-lg shadow-xl hover:bg-gray-100 transition-all transform hover:scale-105 duration-300">
                  {t.nav_cta}
                </Button>
              </Link>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center space-x-6">
            <a href="#impressum" className="text-gray-400 hover:text-white transition-colors duration-300">
              {t.footer_imprint}
            </a>
            <a href="#datenschutz" className="text-gray-400 hover:text-white transition-colors duration-300">
              {t.footer_privacy}
            </a>
          </div>
          <p className="mt-6 text-gray-500">{t.footer_copyright}</p>
          <p className="text-xs mt-2 text-gray-600">{t.footer_disclaimer}</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
