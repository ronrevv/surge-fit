-- SurgeFit Initial Schema

CREATE TYPE user_role AS ENUM (
  'super_admin',
  'chain_owner',
  'chain_manager',
  'branch_manager',
  'trainer',
  'independent_trainer',
  'trainee'
);

CREATE TYPE org_type AS ENUM ('chain', 'independent');

CREATE TYPE plan_type AS ENUM ('workout', 'diet', 'schedule');

CREATE TYPE assignment_status AS ENUM ('active', 'completed', 'archived');

-- 1. Profiles (Extends Supabase Auth)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  role user_role NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Organizations
CREATE TABLE public.organizations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type org_type NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 3. Branches
CREATE TABLE public.branches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  location text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 4. Memberships (Maps users to Orgs/Branches)
CREATE TABLE public.memberships (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  org_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  branch_id uuid REFERENCES public.branches(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, org_id, branch_id)
);

-- 5. Trainer Plans (Templates)
CREATE TABLE public.trainer_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type plan_type NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 6. Assigned Plans
CREATE TABLE public.assigned_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  trainee_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type plan_type NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  status assignment_status DEFAULT 'active' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- RLS Setup
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assigned_plans ENABLE ROW LEVEL SECURITY;

-- Basic Policies (To be refined later)
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Assigned Plans Policies
CREATE POLICY "Trainees can view their own assigned plans" ON public.assigned_plans FOR SELECT USING (auth.uid() = trainee_id);
CREATE POLICY "Trainers can view plans they assigned" ON public.assigned_plans FOR SELECT USING (auth.uid() = trainer_id);
CREATE POLICY "Trainers can insert assigned plans" ON public.assigned_plans FOR INSERT WITH CHECK (auth.uid() = trainer_id);
CREATE POLICY "Trainers can update plans they assigned" ON public.assigned_plans FOR UPDATE USING (auth.uid() = trainer_id);

-- Trainer Plans Policies
CREATE POLICY "Trainers can manage their own templates" ON public.trainer_plans FOR ALL USING (auth.uid() = trainer_id);
