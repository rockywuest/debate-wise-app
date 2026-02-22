
-- 1. Verify and add missing constraints and indexes for performance optimization

-- Add missing foreign key constraints that weren't properly detected
ALTER TABLE public.argumente 
ADD CONSTRAINT fk_argumente_benutzer_id 
FOREIGN KEY (benutzer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.argument_ratings 
ADD CONSTRAINT fk_argument_ratings_argument_id 
FOREIGN KEY (argument_id) REFERENCES public.argumente(id) ON DELETE CASCADE;

ALTER TABLE public.argument_ratings 
ADD CONSTRAINT fk_argument_ratings_rated_by_user_id 
FOREIGN KEY (rated_by_user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.reputation_transactions 
ADD CONSTRAINT fk_reputation_transactions_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.reputation_transactions 
ADD CONSTRAINT fk_reputation_transactions_granted_by_user_id 
FOREIGN KEY (granted_by_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.reputation_transactions 
ADD CONSTRAINT fk_reputation_transactions_related_argument_id 
FOREIGN KEY (related_argument_id) REFERENCES public.argumente(id) ON DELETE SET NULL;

ALTER TABLE public.rate_limits 
ADD CONSTRAINT fk_rate_limits_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 2. Add performance indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_argumente_erstellt_am ON public.argumente(erstellt_am DESC);
CREATE INDEX IF NOT EXISTS idx_argumente_argument_typ ON public.argumente(argument_typ);
CREATE INDEX IF NOT EXISTS idx_argumente_benutzer_debatten ON public.argumente(benutzer_id, debatten_id);
CREATE INDEX IF NOT EXISTS idx_argument_ratings_created_at ON public.argument_ratings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_argument_ratings_compound ON public.argument_ratings(rated_by_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reputation_transactions_created_at ON public.reputation_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_reputation_score ON public.profiles(reputation_score DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_username_lookup ON public.profiles(username);

-- 3. Update RLS policies for better performance and security
-- Drop existing policies and recreate them with better performance
DROP POLICY IF EXISTS "Jeder kann Argumente einsehen" ON public.argumente;
DROP POLICY IF EXISTS "Angemeldete Benutzer können Argumente erstellen" ON public.argumente;
DROP POLICY IF EXISTS "Autoren können ihre Argumente aktualisieren" ON public.argumente;

-- Recreate argument policies with better indexing support
CREATE POLICY "Public can view arguments" 
  ON public.argumente 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create arguments" 
  ON public.argumente 
  FOR INSERT 
  WITH CHECK (auth.uid() = benutzer_id);

CREATE POLICY "Authors can update their arguments" 
  ON public.argumente 
  FOR UPDATE 
  USING (auth.uid() = benutzer_id);

-- Add missing RLS policies for profiles table
DROP POLICY IF EXISTS "Benutzer können ihr eigenes Profil einsehen" ON public.profiles;
DROP POLICY IF EXISTS "Benutzer können ihr eigenes Profil erstellen" ON public.profiles;
DROP POLICY IF EXISTS "Benutzer können ihr eigenes Profil aktualisieren" ON public.profiles;

CREATE POLICY "Public can view profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- 4. Optimize the security functions for better performance
CREATE OR REPLACE FUNCTION public.get_user_recent_arguments(
  p_user_id UUID,
  p_hours INTEGER DEFAULT 1
)
RETURNS INTEGER
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.argumente
  WHERE benutzer_id = p_user_id
    AND erstellt_am > NOW() - (p_hours * INTERVAL '1 hour');
$$;

CREATE OR REPLACE FUNCTION public.get_user_debate_arguments(
  p_user_id UUID,
  p_debate_id UUID
)
RETURNS INTEGER
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.argumente
  WHERE benutzer_id = p_user_id
    AND debatten_id = p_debate_id;
$$;

-- Update the validation function to use the optimized helper functions
CREATE OR REPLACE FUNCTION public.validate_argument_creation(
  p_user_id UUID,
  p_debate_id UUID,
  p_argument_text TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_argument_count INTEGER;
  recent_argument_count INTEGER;
BEGIN
  -- Check if user exists and is authenticated
  IF p_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check argument length (server-side validation)
  IF LENGTH(TRIM(p_argument_text)) < 10 OR LENGTH(p_argument_text) > 2000 THEN
    RETURN FALSE;
  END IF;

  -- Use optimized functions for counts
  recent_argument_count := public.get_user_recent_arguments(p_user_id, 1);
  IF recent_argument_count >= 3 THEN
    RETURN FALSE;
  END IF;

  user_argument_count := public.get_user_debate_arguments(p_user_id, p_debate_id);
  IF user_argument_count >= 50 THEN
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$;

-- 5. Clean up and optimize the rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit_optimized(
  p_user_id UUID,
  p_action_type TEXT,
  p_max_count INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_record RECORD;
  window_start_threshold TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate the window threshold
  window_start_threshold := NOW() - (p_window_minutes * INTERVAL '1 minute');
  
  -- Get current rate limit record with a single query
  SELECT count, window_start 
  INTO current_record
  FROM public.rate_limits
  WHERE user_id = p_user_id AND action_type = p_action_type;

  -- If no record exists or window has expired, create/reset
  IF current_record IS NULL OR current_record.window_start < window_start_threshold THEN
    INSERT INTO public.rate_limits (user_id, action_type, count, window_start)
    VALUES (p_user_id, p_action_type, 1, NOW())
    ON CONFLICT (user_id, action_type) 
    DO UPDATE SET count = 1, window_start = NOW();
    
    RETURN TRUE;
  END IF;

  -- Check if limit exceeded
  IF current_record.count >= p_max_count THEN
    RETURN FALSE;
  END IF;

  -- Increment counter
  UPDATE public.rate_limits
  SET count = count + 1
  WHERE user_id = p_user_id AND action_type = p_action_type;

  RETURN TRUE;
END;
$$;

-- 6. Add a function to clean up old rate limit records (optional maintenance)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS INTEGER
LANGUAGE SQL
SECURITY DEFINER
AS $$
  DELETE FROM public.rate_limits 
  WHERE window_start < NOW() - INTERVAL '1 day';
  SELECT 1;
$$;

-- 7. Ensure real-time is properly configured for all necessary tables
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Add missing tables to realtime if they aren't already added
DO $$
BEGIN
  -- Check if debatten is in realtime publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'debatten'
  ) THEN
    ALTER TABLE public.debatten REPLICA IDENTITY FULL;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.debatten;
  END IF;
END $$;

-- 8. Add a composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_argumente_debate_parent_created ON public.argumente(debatten_id, eltern_id, erstellt_am DESC);
CREATE INDEX IF NOT EXISTS idx_argument_ratings_arg_user_type ON public.argument_ratings(argument_id, rated_by_user_id, rating_type);

-- 9. Update statistics for better query planning
ANALYZE public.argumente;
ANALYZE public.argument_ratings;
ANALYZE public.reputation_transactions;
ANALYZE public.profiles;
ANALYZE public.rate_limits;
