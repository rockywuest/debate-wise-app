
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getPreferredLanguage, localizeText } from '@/utils/i18n';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, username: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const getText = (en: string, de: string) => localizeText(getPreferredLanguage(), en, de);

  useEffect(() => {
    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: username
          }
        }
      });
      
      if (error) {
        toast({
          title: getText('Sign-up failed', 'Registrierung fehlgeschlagen'),
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: getText('Sign-up successful', 'Registrierung erfolgreich'),
          description: getText('Please check your email to confirm your account.', 'Bitte uberprufen Sie Ihre E-Mail zur Bestatigung.')
        });
      }
      
      return { error };
    } catch (error: unknown) {
      const description = error instanceof Error
        ? error.message
        : getText('An unexpected error occurred.', 'Ein unerwarteter Fehler ist aufgetreten');
      toast({
        title: getText('Error', 'Fehler'),
        description,
        variant: "destructive"
      });
      return { error: null };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: getText('Sign-in failed', 'Anmeldung fehlgeschlagen'),
          description: error.message,
          variant: "destructive"
        });
      }
      
      return { error };
    } catch (error: unknown) {
      const description = error instanceof Error
        ? error.message
        : getText('An unexpected error occurred.', 'Ein unerwarteter Fehler ist aufgetreten');
      toast({
        title: getText('Error', 'Fehler'),
        description,
        variant: "destructive"
      });
      return { error: null };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: getText('Signed out', 'Abgemeldet'),
      description: getText('You have been signed out successfully.', 'Sie wurden erfolgreich abgemeldet')
    });
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
