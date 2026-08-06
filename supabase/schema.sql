-- ⚡ SURGEFIT ENTERPRISE ECOSYSTEM - SUPABASE SCHEMA MIGRATION
-- Multi-Tenant RBAC Database Architecture with Row Level Security (RLS)

-- 1. ORGANIZATIONS TABLE (Gym Chains & Independent Practices)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('chain', 'independent')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'invited', 'active', 'suspended', 'archived')),
    mrr_usd NUMERIC(12,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. BRANCHES TABLE (Gym Locations under Chains)
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'closed')),
    capacity_limit INT DEFAULT 250,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. USER WORKSPACES & RBAC (Multi-Role Support per Single User Account)
CREATE TABLE IF NOT EXISTS public.user_workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    role TEXT NOT NULL CHECK (role IN (
        'super_admin', 'chain_owner', 'chain_manager', 
        'branch_manager', 'trainer', 'independent_trainer', 'trainee'
    )),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'invited', 'active', 'suspended', 'archived')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, organization_id, role)
);

-- 4. WORKOUT ROUTINES & EXERCISES TABLE
CREATE TABLE IF NOT EXISTS public.workout_routines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    trainer_id UUID NOT NULL,
    trainee_id UUID,
    title TEXT NOT NULL,
    target_goal TEXT NOT NULL,
    exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_template BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. ATTENDANCE & TURNSTILE CHECK-INS TABLE
CREATE TABLE IF NOT EXISTS public.turnstile_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    check_in_time TIMESTAMPTZ DEFAULT now(),
    check_out_time TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'checked_in' CHECK (status IN ('checked_in', 'checked_out'))
);

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turnstile_checkins ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES FOR TENANT ISOLATION
CREATE POLICY super_admin_all_organizations ON public.organizations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_workspaces 
            WHERE user_id = auth.uid() AND role = 'super_admin' AND status = 'active'
        )
    );

CREATE POLICY tenant_isolation_user_workspaces ON public.user_workspaces
    FOR SELECT USING (user_id = auth.uid());
