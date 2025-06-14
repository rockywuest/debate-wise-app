
-- Enable real-time replication for the argumente table
ALTER TABLE public.argumente REPLICA IDENTITY FULL;

-- Add the argumente table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.argumente;

-- Also enable real-time for argument_ratings to show rating updates
ALTER TABLE public.argument_ratings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.argument_ratings;

-- Enable real-time for reputation_transactions to show reputation changes
ALTER TABLE public.reputation_transactions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reputation_transactions;
