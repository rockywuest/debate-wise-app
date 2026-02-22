
-- Füge der profiles Tabelle eine Reputations_Score Spalte hinzu
ALTER TABLE public.profiles 
ADD COLUMN reputation_score INTEGER NOT NULL DEFAULT 0;

-- Erstelle eine Tabelle für Reputation-Transaktionen (um Änderungen nachzuvollziehen)
CREATE TABLE public.reputation_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  related_argument_id UUID REFERENCES public.argumente(id) ON DELETE SET NULL,
  granted_by_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Erstelle eine Tabelle für "einsichtig" Bewertungen
CREATE TABLE public.argument_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  argument_id UUID REFERENCES public.argumente(id) ON DELETE CASCADE NOT NULL,
  rated_by_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating_type TEXT NOT NULL CHECK (rating_type IN ('insightful', 'concede_point')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(argument_id, rated_by_user_id, rating_type)
);

-- Aktiviere Row Level Security für die neuen Tabellen
ALTER TABLE public.reputation_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.argument_ratings ENABLE ROW LEVEL SECURITY;

-- RLS-Richtlinien für reputation_transactions
CREATE POLICY "Jeder kann Reputation-Transaktionen einsehen" 
  ON public.reputation_transactions 
  FOR SELECT 
  USING (true);

CREATE POLICY "System kann Reputation-Transaktionen erstellen" 
  ON public.reputation_transactions 
  FOR INSERT 
  WITH CHECK (true);

-- RLS-Richtlinien für argument_ratings
CREATE POLICY "Jeder kann Bewertungen einsehen" 
  ON public.argument_ratings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Angemeldete Benutzer können bewerten" 
  ON public.argument_ratings 
  FOR INSERT 
  WITH CHECK (auth.uid() = rated_by_user_id);

-- Funktion zur Aktualisierung des Reputation-Scores
CREATE OR REPLACE FUNCTION update_user_reputation(
  target_user_id UUID,
  points INTEGER,
  reason TEXT,
  argument_id UUID DEFAULT NULL,
  granted_by UUID DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Füge die Transaktion hinzu
  INSERT INTO public.reputation_transactions (user_id, points, reason, related_argument_id, granted_by_user_id)
  VALUES (target_user_id, points, reason, argument_id, granted_by);
  
  -- Aktualisiere den Reputation-Score
  UPDATE public.profiles 
  SET reputation_score = reputation_score + points
  WHERE id = target_user_id;
END;
$$;

-- Erstelle Indizes für bessere Performance
CREATE INDEX idx_reputation_transactions_user_id ON public.reputation_transactions(user_id);
CREATE INDEX idx_argument_ratings_argument_id ON public.argument_ratings(argument_id);
CREATE INDEX idx_argument_ratings_user_id ON public.argument_ratings(rated_by_user_id);
