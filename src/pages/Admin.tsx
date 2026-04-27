
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '@/components/AdminDashboard';
import { useLocalizedText } from '@/utils/i18n';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/components/ui/use-toast';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading, isAdmin } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const text = useLocalizedText();

  const authorized = !authLoading && !roleLoading && !!user && isAdmin();

  useEffect(() => {
    if (authLoading || roleLoading) return;

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
    }
  }, [user, role, authLoading, roleLoading, isAdmin, navigate, toast, text]);

  if (!authorized) {
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
