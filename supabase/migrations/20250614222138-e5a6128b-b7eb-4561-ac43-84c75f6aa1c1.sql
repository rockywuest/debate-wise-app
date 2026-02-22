
-- Erstelle eine Profiltabelle für Benutzerdaten
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Aktiviere Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Erstelle RLS-Richtlinien für Profile
CREATE POLICY "Benutzer können ihr eigenes Profil einsehen" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Benutzer können ihr eigenes Profil erstellen" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Benutzer können ihr eigenes Profil aktualisieren" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Erstelle eine Funktion, die automatisch ein Profil erstellt wenn sich ein Benutzer registriert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'username', 'user_' || substring(new.id::text, 1, 8))
  );
  RETURN new;
END;
$$;

-- Erstelle einen Trigger, der die Funktion bei jeder neuen Benutzerregistrierung ausführt
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
