
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '@/components/AdminDashboard';
import { useTranslation } from '@/utils/i18n';

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language } = useTranslation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else {
        // TODO: Add proper admin role check here
        // For now, allow any authenticated user to access admin
        // In production, check user roles/permissions
        setChecking(false);
      }
    }
  }, [user, loading, navigate]);

  if (loading || checking) {
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
