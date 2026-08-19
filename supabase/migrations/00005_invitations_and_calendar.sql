-- Migration 00005: Invitations and Calendar support

CREATE TABLE IF NOT EXISTS public.invitations (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  branch_id       uuid REFERENCES public.branches(id) ON DELETE CASCADE,
  email           text NOT NULL,
  role            user_role NOT NULL,
  invited_by      uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  token_hash      text,
  status          text DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'ACCEPTED', 'EXPIRED', 'CANCELLED')),
  expires_at      timestamptz,
  accepted_at     timestamptz,
  created_at      timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invitations they sent"
  ON public.invitations FOR SELECT
  USING (auth.uid() = invited_by);

CREATE POLICY "Users can create invitations"
  ON public.invitations FOR INSERT
  WITH CHECK (auth.uid() = invited_by);

CREATE POLICY "Users can update invitations they sent"
  ON public.invitations FOR UPDATE
  USING (auth.uid() = invited_by);

-- Add scheduled_date to assigned_plans for Calendar Sync
ALTER TABLE public.assigned_plans
ADD COLUMN IF NOT EXISTS scheduled_date date;

-- Add scheduled_date to trainer_plans (optional, usually plans are templates, but maybe useful)
-- We will just use scheduled_date in assigned_plans.
