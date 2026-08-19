-- Migration: Allow users to insert their own profile row on first login.
-- Without this, the upsert in loadUserSession is blocked by RLS, which means
-- trainer_plans / assigned_plans / trainer_clients FK constraints keep failing
-- for any user who never had a profile row created.

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
