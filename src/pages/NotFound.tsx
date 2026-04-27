import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, LogIn, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/utils/i18n";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl text-gray-800 mb-2">{t('notFound.title')}</p>
        <p className="text-base text-gray-600 mb-8">{t('notFound.description')}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/debates">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              <MessagesSquare className="h-5 w-5" />
              {t('notFound.goToDebates')}
            </Button>
          </Link>
          <Link to="/auth">
            <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
              <LogIn className="h-5 w-5" />
              {t('notFound.signIn')}
            </Button>
          </Link>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-6"
        >
          <Home className="h-4 w-4" />
          {t('notFound.backHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
