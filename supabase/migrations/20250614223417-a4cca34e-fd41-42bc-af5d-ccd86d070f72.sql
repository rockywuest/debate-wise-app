
-- Erstelle die Debatten-Tabelle
CREATE TABLE public.debatten (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titel TEXT NOT NULL,
  beschreibung TEXT,
  erstellt_von UUID REFERENCES auth.users(id) NOT NULL,
  erstellt_am TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  aktualisiert_am TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Erstelle Enum für Argument-Typen
CREATE TYPE public.argument_typ AS ENUM ('These', 'Pro', 'Contra');

-- Erstelle die Argumente-Tabelle
CREATE TABLE public.argumente (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  debatten_id UUID REFERENCES public.debatten(id) ON DELETE CASCADE NOT NULL,
  eltern_id UUID REFERENCES public.argumente(id) ON DELETE CASCADE,
  argument_text TEXT NOT NULL,
  argument_typ public.argument_typ NOT NULL,
  benutzer_id UUID REFERENCES auth.users(id) NOT NULL,
  autor_name TEXT,
  erstellt_am TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  aktualisiert_am TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Aktiviere Row Level Security für beide Tabellen
ALTER TABLE public.debatten ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.argumente ENABLE ROW LEVEL SECURITY;

-- RLS-Richtlinien für Debatten (alle können lesen, nur angemeldete Benutzer können erstellen)
CREATE POLICY "Jeder kann Debatten einsehen" 
  ON public.debatten 
  FOR SELECT 
  USING (true);

CREATE POLICY "Angemeldete Benutzer können Debatten erstellen" 
  ON public.debatten 
  FOR INSERT 
  WITH CHECK (auth.uid() = erstellt_von);

CREATE POLICY "Ersteller können ihre Debatten aktualisieren" 
  ON public.debatten 
  FOR UPDATE 
  USING (auth.uid() = erstellt_von);

-- RLS-Richtlinien für Argumente (alle können lesen, nur angemeldete Benutzer können erstellen)
CREATE POLICY "Jeder kann Argumente einsehen" 
  ON public.argumente 
  FOR SELECT 
  USING (true);

CREATE POLICY "Angemeldete Benutzer können Argumente erstellen" 
  ON public.argumente 
  FOR INSERT 
  WITH CHECK (auth.uid() = benutzer_id);

CREATE POLICY "Autoren können ihre Argumente aktualisieren" 
  ON public.argumente 
  FOR UPDATE 
  USING (auth.uid() = benutzer_id);

-- Erstelle Indizes für bessere Performance
CREATE INDEX idx_argumente_debatten_id ON public.argumente(debatten_id);
CREATE INDEX idx_argumente_eltern_id ON public.argumente(eltern_id);
CREATE INDEX idx_argumente_benutzer_id ON public.argumente(benutzer_id);
