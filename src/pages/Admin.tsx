
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '@/components/AdminDashboard';
import { useTranslation } from '@/utils/i18n';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/components/ui/use-toast';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading, isAdmin } = useUserRole();
  const navigate = useNavigate();
  const { language } = useTranslation();
  const { toast } = useToast();
  const [checking, setChecking] = useState(true);
  const text = useCallback((en: string, de: string) => (language === 'de' ? de : en), [language]);

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!user) {
        navigate('/auth');
        return;
      }

      if (!isAdmin()) {
        toast({
          title: text('Access denied', 'Zugriff verweigert'),
          description: text('You do not have permission to access this area.', 'Sie haben keine Berechtigung fur diesen Bereich.'),
          variant: 'destructive'
        });
        navigate('/debates');
        return;
      }

      setChecking(false);
    }
  }, [user, role, authLoading, roleLoading, isAdmin, navigate, toast, text]);

  if (authLoading || roleLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            {text('Checking permissions...', 'Uberprufe Berechtigungen...')}
          </p>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
};

export default Admin;
