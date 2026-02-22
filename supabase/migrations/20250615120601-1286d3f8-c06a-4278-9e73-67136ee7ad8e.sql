
-- Create validation function for argument creation
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

  -- Check for recent spam (max 3 arguments per hour)
  SELECT COUNT(*)
  INTO recent_argument_count
  FROM public.argumente
  WHERE benutzer_id = p_user_id
    AND erstellt_am > NOW() - INTERVAL '1 hour';

  IF recent_argument_count >= 3 THEN
    RETURN FALSE;
  END IF;

  -- Check total arguments per debate (max 50 per user per debate)
  SELECT COUNT(*)
  INTO user_argument_count
  FROM public.argumente
  WHERE benutzer_id = p_user_id
    AND debatten_id = p_debate_id;

  IF user_argument_count >= 50 THEN
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$;

-- Create secure rating function with additional validation
CREATE OR REPLACE FUNCTION public.secure_rate_argument(
  p_argument_id UUID,
  p_rating_type TEXT,
  p_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Enhanced reputation update function with additional security
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
  SET reputation_score = GREATEST(0, reputation_score + points)  -- Prevent negative reputation
  WHERE id = target_user_id;

  -- Log security event for monitoring
  INSERT INTO public.security_log (event_type, user_id, details, created_at)
  VALUES ('reputation_update', target_user_id, 
          json_build_object('points', points, 'reason', reason, 'granted_by', granted_by),
          NOW())
  ON CONFLICT DO NOTHING;  -- Ignore if security_log table doesn't exist
END;
$$;

-- Create security log table for monitoring
CREATE TABLE IF NOT EXISTS public.security_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on security log
ALTER TABLE public.security_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read security logs
CREATE POLICY "Only admins can view security logs" 
  ON public.security_log 
  FOR SELECT 
  USING (false);  -- Will be updated when admin roles are implemented

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_log_user_id ON public.security_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_log_event_type ON public.security_log(event_type);
CREATE INDEX IF NOT EXISTS idx_security_log_created_at ON public.security_log(created_at);

-- Add rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, action_type)
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Users can only see their own rate limits
CREATE POLICY "Users can view their own rate limits" 
  ON public.rate_limits 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create function to check and update rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
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
