-- Migration: Add trainer_clients relationship table
-- This stores the trainer → trainee roster relationship
-- Independent of assigned plans so trainers can manage roster first

CREATE TABLE IF NOT EXISTS public.trainer_clients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  goal text,
  weight_kg numeric,
  height_cm numeric,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(trainer_id, client_id)
);

ALTER TABLE public.trainer_clients ENABLE ROW LEVEL SECURITY;

-- Trainers can fully manage their own client list
CREATE POLICY "Trainers can manage their own clients"
  ON public.trainer_clients FOR ALL
  USING (auth.uid() = trainer_id);

-- Clients can see who their trainers are
CREATE POLICY "Clients can see their trainer relationships"
  ON public.trainer_clients FOR SELECT
  USING (auth.uid() = client_id);

-- Allow trainers to look up any profile by email (needed for adding clients)
CREATE POLICY "Allow users to search profiles by email"
  ON public.profiles FOR SELECT
  USING (true);

-- Allow trainers to insert plans for their clients
-- (Already covered by existing policy "Trainers can insert assigned plans")

-- Allow anyone with a valid trainer_id to insert trainer_plans
CREATE POLICY "Trainers can insert plans"
  ON public.trainer_plans FOR INSERT
  WITH CHECK (auth.uid() = trainer_id);
