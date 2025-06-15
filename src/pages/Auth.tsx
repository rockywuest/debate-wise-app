
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/auth/AuthForm';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/utils/i18n';

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('auth.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <AuthForm mode={mode} onModeChange={setMode} />
    </div>
  );
};

export default Auth;
