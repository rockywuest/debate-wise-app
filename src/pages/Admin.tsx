
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!user) {
        navigate('/auth');
        return;
      }

      if (!isAdmin()) {
        toast({
          title: language === 'de' ? 'Zugriff verweigert' : 'Access denied',
          description: language === 'de' 
            ? 'Sie haben keine Berechtigung für diesen Bereich.' 
            : 'You do not have permission to access this area.',
          variant: 'destructive'
        });
        navigate('/debates');
        return;
      }

      setChecking(false);
    }
  }, [user, role, authLoading, roleLoading, isAdmin, navigate, toast, language]);

  if (authLoading || roleLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            {language === 'de' ? 'Überprüfe Berechtigungen...' : 'Checking permissions...'}
          </p>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
};

export default Admin;
