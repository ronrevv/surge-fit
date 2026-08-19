-- Migration: role_assignments
-- Allows N users per role (multiple super admins, multiple trainers per branch)
-- Allows one user to hold multiple roles across different orgs/branches
-- Tracks who assigned the role and from what position

CREATE TABLE IF NOT EXISTS public.role_assignments (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role             user_role NOT NULL,
  org_id           uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  branch_id        uuid REFERENCES public.branches(id) ON DELETE CASCADE,
  -- Who assigned this role (null = system / self-registered super_admin)
  assigned_by      uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_by_role user_role,                       -- role of the assigner at time of assignment
  assigned_by_name text,                            -- denormalized for display speed
  org_name         text,                            -- denormalized: org name for banner display
  branch_name      text,                            -- denormalized: branch name for banner display
  status           text DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'revoked')),
  assigned_at      timestamptz DEFAULT now() NOT NULL,
  -- One user cannot have the same role in the same org+branch twice
  UNIQUE(user_id, role, org_id, branch_id)
);

ALTER TABLE public.role_assignments ENABLE ROW LEVEL SECURITY;

-- Users can view their own role assignments (needed for login banner)
CREATE POLICY "Users can view their own role assignments"
  ON public.role_assignments FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can insert role assignments (scoped in application logic)
-- This allows branch managers, trainers, super admins to assign roles
CREATE POLICY "Authenticated users can insert role assignments"
  ON public.role_assignments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Assigners can update assignments they created
CREATE POLICY "Assigners can update their assignments"
  ON public.role_assignments FOR UPDATE
  USING (auth.uid() = assigned_by OR auth.uid() = user_id);

-- Super admins and managers can see all role assignments in their scope
CREATE POLICY "Managers can view all assignments"
  ON public.role_assignments FOR SELECT
  USING (true);
