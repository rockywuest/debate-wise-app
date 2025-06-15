
-- Critical Security Fix: Update all database functions to use secure search paths
-- This prevents potential privilege escalation attacks

-- 1. Fix the handle_new_user function with secure search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
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

-- 2. Fix the secure_rate_argument function with secure search path
CREATE OR REPLACE FUNCTION public.secure_rate_argument(
  p_argument_id UUID,
  p_rating_type TEXT,
  p_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  argument_author_id UUID;
  existing_rating_count INTEGER;
  recent_rating_count INTEGER;
  points_to_award INTEGER;
  result JSON;
BEGIN
  -- Validate input parameters
  IF p_user_id IS NULL OR p_argument_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Ungültige Parameter');
  END IF;

  IF p_rating_type NOT IN ('insightful', 'concede_point') THEN
    RETURN json_build_object('success', false, 'message', 'Ungültiger Bewertungstyp');
  END IF;

  -- Get argument author
  SELECT benutzer_id INTO argument_author_id
  FROM public.argumente
  WHERE id = p_argument_id;

  IF argument_author_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Argument nicht gefunden');
  END IF;

  -- Prevent self-rating
  IF argument_author_id = p_user_id THEN
    RETURN json_build_object('success', false, 'message', 'Selbstbewertung nicht erlaubt');
  END IF;

  -- Check for existing rating
  SELECT COUNT(*) INTO existing_rating_count
  FROM public.argument_ratings
  WHERE argument_id = p_argument_id
    AND rated_by_user_id = p_user_id
    AND rating_type = p_rating_type;

  IF existing_rating_count > 0 THEN
    RETURN json_build_object('success', false, 'message', 'Bereits bewertet');
  END IF;

  -- Rate limiting: max 10 ratings per 5 minutes
  SELECT COUNT(*) INTO recent_rating_count
  FROM public.argument_ratings
  WHERE rated_by_user_id = p_user_id
    AND created_at > NOW() - INTERVAL '5 minutes';

  IF recent_rating_count >= 10 THEN
    RETURN json_build_object('success', false, 'message', 'Zu viele Bewertungen in kurzer Zeit');
  END IF;

  -- Determine points to award
  points_to_award := CASE
    WHEN p_rating_type = 'insightful' THEN 5
    WHEN p_rating_type = 'concede_point' THEN 20
    ELSE 0
  END;

  -- Create the rating
  INSERT INTO public.argument_ratings (argument_id, rated_by_user_id, rating_type)
  VALUES (p_argument_id, p_user_id, p_rating_type);

  -- Award reputation points
  PERFORM public.update_user_reputation(
    argument_author_id,
    points_to_award,
    CASE
      WHEN p_rating_type = 'insightful' THEN 'Argument als einsichtig bewertet'
      WHEN p_rating_type = 'concede_point' THEN 'Punkt zugestanden'
    END,
    p_argument_id,
    p_user_id
  );

  RETURN json_build_object(
    'success', true, 
    'message', 'Bewertung erfolgreich',
    'points_awarded', points_to_award
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', 'Unerwarteter Fehler aufgetreten');
END;
$$;

-- 3. Fix all other functions with secure search paths
CREATE OR REPLACE FUNCTION public.update_user_reputation(
  target_user_id UUID,
  points INTEGER,
  reason TEXT,
  argument_id UUID DEFAULT NULL,
  granted_by UUID DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Add the transaction
  INSERT INTO public.reputation_transactions (user_id, points, reason, related_argument_id, granted_by_user_id)
  VALUES (target_user_id, points, reason, argument_id, granted_by);
  
  -- Update the reputation score
  UPDATE public.profiles 
  SET reputation_score = reputation_score + points
  WHERE id = target_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_user_reputation_secure(
  target_user_id UUID,
  points INTEGER,
  reason TEXT,
  argument_id UUID DEFAULT NULL,
  granted_by UUID DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Validate input parameters
  IF target_user_id IS NULL OR points IS NULL OR reason IS NULL THEN
    RAISE EXCEPTION 'Invalid parameters provided';
  END IF;

  -- Limit point ranges to prevent abuse
  IF points < -100 OR points > 100 THEN
    RAISE EXCEPTION 'Point value out of allowed range';
  END IF;

  -- Limit reason length
  IF LENGTH(reason) > 500 THEN
    RAISE EXCEPTION 'Reason text too long';
  END IF;

  -- Add the transaction
  INSERT INTO public.reputation_transactions (user_id, points, reason, related_argument_id, granted_by_user_id)
  VALUES (target_user_id, points, reason, argument_id, granted_by);
  
  -- Update the reputation score
  UPDATE public.profiles 
  SET reputation_score = GREATEST(0, reputation_score + points)
  WHERE id = target_user_id;

  -- Log security event for monitoring
  INSERT INTO public.security_log (event_type, user_id, details, created_at)
  VALUES ('reputation_update', target_user_id, 
          json_build_object('points', points, 'reason', reason, 'granted_by', granted_by),
          NOW())
  ON CONFLICT DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_argument_creation(
  p_user_id UUID,
  p_debate_id UUID,
  p_argument_text TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.get_user_recent_arguments(
  p_user_id UUID,
  p_hours INTEGER DEFAULT 1
)
RETURNS INTEGER
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = 'public'
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
SET search_path = 'public'
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.argumente
  WHERE benutzer_id = p_user_id
    AND debatten_id = p_debate_id;
$$;

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id UUID,
  p_action_type TEXT,
  p_max_count INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_count INTEGER;
  window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get current rate limit record
  SELECT count, rate_limits.window_start 
  INTO current_count, window_start
  FROM public.rate_limits
  WHERE user_id = p_user_id AND action_type = p_action_type;

  -- If no record exists or window has expired, create/reset
  IF current_count IS NULL OR window_start < NOW() - (p_window_minutes * INTERVAL '1 minute') THEN
    INSERT INTO public.rate_limits (user_id, action_type, count, window_start)
    VALUES (p_user_id, p_action_type, 1, NOW())
    ON CONFLICT (user_id, action_type) 
    DO UPDATE SET count = 1, window_start = NOW();
    
    RETURN TRUE;
  END IF;

  -- Check if limit exceeded
  IF current_count >= p_max_count THEN
    RETURN FALSE;
  END IF;

  -- Increment counter
  UPDATE public.rate_limits
  SET count = count + 1
  WHERE user_id = p_user_id AND action_type = p_action_type;

  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_rate_limit_optimized(
  p_user_id UUID,
  p_action_type TEXT,
  p_max_count INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS INTEGER
LANGUAGE SQL
SECURITY DEFINER
SET search_path = 'public'
AS $$
  DELETE FROM public.rate_limits 
  WHERE window_start < NOW() - INTERVAL '1 day';
  SELECT 1;
$$;

-- 4. Enhance RLS policies for better security
-- Add more restrictive policies for sensitive operations
DROP POLICY IF EXISTS "Users can view their own rate limits" ON public.rate_limits;
CREATE POLICY "Users can view their own rate limits" 
  ON public.rate_limits 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage rate limits" 
  ON public.rate_limits 
  FOR ALL 
  USING (current_setting('role') = 'service_role');

-- 5. Add additional security logging
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type TEXT,
  user_id UUID,
  details JSONB DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.security_log (event_type, user_id, details, created_at)
  VALUES (event_type, user_id, details, NOW());
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail the main operation if logging fails
    NULL;
END;
$$;
