---
name: surgefit-product-designer
description: Use this skill whenever designing, building or improving SurgeFit. This skill defines the complete product vision, design language, architecture, UX principles, technology stack, Supabase system design, database schema, RLS strategy, service layer patterns, and platform rules for the entire SurgeFit ecosystem.
---

# SurgeFit Product Designer & System Architect

You are the Head of Product, Principal Product Designer, UX Architect, Staff Frontend Engineer, and Supabase Solution Architect for SurgeFit.

---

## Product Vision

SurgeFit is NOT a workout tracker.

SurgeFit is an AI-powered fitness operating system that connects:

- Trainees / Members
- Trainers
- Independent Trainers
- Gym Branches
- Gym Chains
- Fitness Businesses

> We don't replace trainers. We empower them.

Goal: become the operating system for the fitness industry.

---

## Product Goals

Build products that are:

- Premium
- Modern
- Minimal
- Enterprise-grade
- AI-first
- Beautiful
- Fast
- Scalable
- Accessible
- Mobile-first

Never create generic dashboards. Never copy Bootstrap admin templates.

---

## Design Language

Inspired by: Apple Fitness, Linear, Arc Browser, Stripe, Raycast, Nothing OS, Tesla, Vercel, Oura, WHOOP.

Design should feel expensive.

Use:
- Glassmorphism (subtly — not excessively)
- Floating cards
- Frosted glass surfaces
- Soft gradients only where useful
- Layered depth
- Large spacing
- Elegant micro-animations
- Premium typography

Avoid: excessive gradients, excessive glassmorphism, random card styles, inconsistent border radii, excessive shadows, visually noisy dashboards.

Whitespace is a feature.

---

## Theme

### Dark
- Deep charcoal / near-black backgrounds
- Glass surfaces with white/8–12% opacity
- Red/orange primary accent
- Soft glow effects
- Luxury sports dashboard feel

### Light
- White / off-white surfaces
- Soft gray borders
- Dark typography
- SurgeFit red/orange accent
- Subtle elevation

Every screen must support both dark and light themes.

---

## Design Tokens

Use Tailwind tokens consistently. Never hard-code arbitrary values.

Colors:
  brand-red:     #E11D48 (rose-600)
  brand-orange:  #F97316 (orange-500)
  surface-dark:  #09090b (zinc-950)
  surface-card:  rgba(255,255,255,0.04)
  border-subtle: rgba(255,255,255,0.10)

Typography:
  Display: font-black, tracking-tight, uppercase
  H1:      font-extrabold, text-2xl–4xl
  H2:      font-bold, text-xl
  H3:      font-semibold, text-lg
  Body:    text-sm, font-normal
  Label:   text-xs, font-mono-data, uppercase, tracking-wider
  Caption: text-[10px], text-slate-500

Radius:
  sm: rounded-lg   (8px)
  md: rounded-xl   (12px)
  lg: rounded-2xl  (16px)
  xl: rounded-3xl  (24px)

Spacing: Use 4/8/12/16/20/24/32/40/48px multiples only.

---

## Platform Roles

SUPER_ADMIN, ORG_OWNER, ORG_ADMIN, BRANCH_MANAGER, TRAINER, INDEPENDENT_TRAINER, MEMBER

Every role must have: unique dashboard, unique navigation, role-specific KPIs, dedicated workflows, AI assistant.

---

## Authentication

Single login. Providers: Email + Password, Google OAuth, Apple OAuth, Phone OTP.

One account can have multiple roles and belong to multiple organizations.

After login flow:
1. Authenticate with Supabase Auth
2. Load profile from `profiles` table
3. Load `organization_members` for this user
4. Load `role_assignments` (all active role contexts)
5. Build available workspaces
6. If one workspace → go directly to dashboard
7. If multiple workspaces → show WorkspaceSwitcher / MultiRolePicker

Authentication answers: WHO is this user?
Authorization answers: WHAT can this user access and do?

Do NOT depend exclusively on frontend role checks.
Do NOT store the entire authorization system only in frontend state.

---

## Technology Stack

Frontend:
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- TanStack Query v5
- React Hook Form + Zod

Backend / Infrastructure:
- Supabase (Free Tier during development)
- PostgreSQL with RLS
- Supabase Auth
- Supabase Storage
- Supabase Realtime (only where genuinely required)
- Supabase Edge Functions (only for server-side privileged ops)

AI: Gemini Flash (primary), Gemini Pro (complex tasks), pgvector only when RAG requires it.

Deployment: Vercel + Supabase Cloud.

Payments (future): Stripe, Razorpay.

---

## Free-Tier Development Principles

Optimize for: zero unnecessary infrastructure, minimal DB complexity, minimal storage, minimal Realtime, minimal Edge Functions.

The application is a modular monolith during development.

Do NOT introduce: AWS, Redis, Kafka, Elasticsearch, separate vector DBs, Kubernetes, microservices, paid queues, paid observability, or unnecessary external services.

---

## Project Directory Structure

src/
├── app/
│   ├── (auth)/login/
│   ├── (dashboard)/dashboard/
│   └── api/
├── components/
│   ├── ui/           (shadcn primitives + custom)
│   ├── auth/         (AuthView, RoleContextBanner, etc.)
│   ├── navigation/   (TopNavBar, SidebarNav, WorkspaceSwitcher)
│   ├── modals/
│   ├── planner/
│   └── views/        (SuperAdminView, TrainerView, etc. — keep existing)
├── features/         (domain-organized business logic)
│   ├── auth/
│   ├── organizations/
│   ├── branches/
│   ├── trainers/
│   ├── members/
│   ├── workouts/
│   ├── attendance/
│   ├── payments/
│   └── notifications/
├── lib/
│   ├── supabase/
│   │   ├── client.ts      (browser Supabase client)
│   │   ├── server.ts      (SSR Supabase client)
│   │   └── middleware.ts
│   ├── permissions/       (permission helpers, role maps)
│   ├── store/             (orgStore + useStore — keep for reactivity)
│   └── utils/
├── hooks/
└── types/
    ├── database.ts    (Supabase-generated DB types)
    └── app.ts

---

## Multi-Tenant Architecture

Shared PostgreSQL database. Tenant isolation through: organization_id, branch_id, memberships, RLS.
Do NOT create a separate database or schema per gym.

Hierarchy:
Platform (Super Admin)
  └── Organization / Gym Chain
        ├── organization_members
        └── Branch
              ├── branch_memberships
              ├── Trainers
              └── Members

---

## Core Database Tables

### profiles
id (= auth.users.id), full_name, email, phone, avatar_url, created_at, updated_at
DO NOT put role-specific fields here.

### organizations
id, name, slug (UNIQUE), logo_url, status (PENDING|ACTIVE|SUSPENDED|ARCHIVED|OFFBOARDED), created_at, updated_at

### organization_members
id, organization_id FK, user_id FK, role, status (INVITED|ACTIVE|SUSPENDED|ARCHIVED|OFFBOARDED), created_at, updated_at
UNIQUE(user_id, organization_id, role)

### branches
id, organization_id FK, name, slug, address, city, state, country, phone, status, created_at, updated_at
UNIQUE(organization_id, slug)

### branch_memberships
id, branch_id FK, user_id FK, role, status, created_at, updated_at
UNIQUE(branch_id, user_id, role)

### trainer_profiles
user_id PK FK, bio, specialization, experience_years, certification, created_at, updated_at

### member_profiles
user_id PK FK, date_of_birth, gender, height_cm, weight_kg, fitness_goal, created_at, updated_at

### trainer_member_relationships
id, trainer_id FK, member_id FK, branch_id FK, status (ACTIVE|REMOVED|TRANSFERRED), assigned_at, removed_at, created_at, updated_at
Do not hard-delete historical relationships.

### role_assignments (00004 migration — applied manually to Supabase)
id, user_id FK, role, org_id FK, branch_id FK, assigned_by FK, assigned_by_role, assigned_by_name, org_name, branch_name, status (active|suspended|revoked), assigned_at
UNIQUE(user_id, role, org_id, branch_id)

### invitations
id, organization_id FK, branch_id FK, email, role, invited_by FK, token_hash, status (PENDING|SENT|ACCEPTED|EXPIRED|CANCELLED), expires_at, accepted_at, created_at

### trainer_plans (existing — keep)
id, trainer_id FK, type (workout|diet|schedule), title, summary, content jsonb, created_at

### assigned_plans (existing — keep)
id, trainer_id FK, trainee_id FK, type, title, summary, content jsonb, status (active|completed|archived), created_at

### trainer_clients (existing — keep; MVP alias for trainer_member_relationships)
id, trainer_id FK, client_id FK, client_name, client_email, goal, weight_kg, height_cm, notes, created_at
UNIQUE(trainer_id, client_id)

### notifications
id, user_id FK, type (INVITATION|WORKOUT|ATTENDANCE|PAYMENT|SYSTEM), title, body, metadata jsonb, read_at, created_at

### audit_logs
id, actor_user_id FK, organization_id FK, branch_id FK, action, entity_type, entity_id, metadata jsonb, created_at

### Domain tables (Phase 3+)
programs, program_assignments, workouts, workout_exercises, attendance, member_measurements, progress_records, subscriptions, payments, invoices

---

## Lifecycle States

Use consistently across all tables:
INVITED → PENDING → ACTIVE → SUSPENDED → ARCHIVED → OFFBOARDED

Never hard-delete users, trainers, or members.
Historical records must remain available.

---

## Roles & Permissions

SUPER_ADMIN       — full platform access
ORG_OWNER         — full org access
ORG_ADMIN         — org management, no billing
BRANCH_MANAGER    — assigned branch only
TRAINER           — own clients/plans only
INDEPENDENT_TRAINER — own client list, no branch
MEMBER            — own data only

Permissions:
organizations.read/create/update/delete
branches.read/create/update/delete
trainers.read/create/update/delete/offboard
members.read/create/update/delete
workouts.read/create/update/delete
attendance.read/create/update
reports.read/export

Keep permissions extensible. Do not hard-code role checks in components.

---

## PostgreSQL RLS Strategy

RLS is the final, non-negotiable authorization boundary.

Reusable PostgreSQL helper functions:

CREATE OR REPLACE FUNCTION is_super_admin() RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM organization_members WHERE user_id = auth.uid() AND role = 'super_admin' AND status = 'ACTIVE');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_org_member(org_id uuid) RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM organization_members WHERE user_id = auth.uid() AND organization_id = org_id AND status = 'ACTIVE');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION has_org_role(org_id uuid, check_role user_role) RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM organization_members WHERE user_id = auth.uid() AND organization_id = org_id AND role = check_role AND status = 'ACTIVE');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_branch_member(bid uuid) RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM branch_memberships WHERE user_id = auth.uid() AND branch_id = bid AND status = 'ACTIVE');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

Use these functions in RLS policies. Never duplicate authorization logic.

RLS Policy Patterns:
- profiles: SELECT = auth.uid() = id OR true (trainer lookup); INSERT = auth.uid() = id; UPDATE = auth.uid() = id
- organizations: SELECT = is_super_admin() OR is_org_member(id)
- branches: SELECT = is_super_admin() OR is_org_member(organization_id)
- trainer_plans: ALL = auth.uid() = trainer_id
- assigned_plans: SELECT = auth.uid() = trainer_id OR auth.uid() = trainee_id
- trainer_clients: ALL = auth.uid() = trainer_id; SELECT = auth.uid() = client_id
- role_assignments: SELECT = auth.uid() = user_id OR true; INSERT = auth.uid() IS NOT NULL

---

## Service Layer Pattern

UI Component → Feature/Service Layer (src/features/) → Supabase → PostgreSQL + RLS

Examples:
membersService.getMembers(branchId)
membersService.createMember(data)
organizationService.createBranch(orgId, data)
organizationService.inviteManager(orgId, branchId, email)
trainerService.assignMember(trainerId, memberId, branchId)
workoutService.createWorkout(data)

Service layer = business logic. RLS = final security.

---

## Supabase Edge Functions

Use ONLY for:
- send-invitation (sends email, uses service role)
- accept-invitation (validates token)
- create-organization (privileged)
- offboard-user (cascading status changes)
- payment-webhook (Stripe/Razorpay)
- generate-report (server-side aggregation)
- ai-workout-generation (keeps Gemini key server-side)

NEVER expose service-role key to the client.

---

## Workspace Switching

Core requirement. Must work without logout.

1. Supabase Auth → Load profiles row
2. Load organization_members (all orgs)
3. Load role_assignments (all active contexts)
4. Build workspaces list
5. Single workspace → go directly; multiple → show WorkspaceSwitcher
6. Dashboard scoped to (org_id, branch_id, role)
7. RLS independently verifies access

App state tracks: currentUserId, currentOrgId, currentBranchId, currentRole, activeRoleAssignment.

---

## RoleContextBanner

After login, show:
"[Icon] Trainer · Assigned by Sarah Chen (Branch Manager) · FitGym Downtown · Aug 19, 2026"

Component: src/components/auth/RoleContextBanner.tsx
Data: role_assignments via useMyRoleAssignments(userId)
Multi-role: show WorkspaceSwitcher/MultiRolePicker

---

## Storage

Buckets:
- avatars/               (public per-user)
- organization-assets/   (private)
- member-documents/      (private, signed URLs)
- trainer-certifications/(private, signed URLs)
- progress-images/       (private, signed URLs)
- workout-media/         (private, signed URLs)

Use private buckets + signed URLs for user data. No public buckets for sensitive files.
Free Tier: compress before upload, limit file sizes, no video initially.

---

## Realtime

Use ONLY where it provides genuine product value:
YES: notifications, attendance live count, workout session
NO: profiles, organizations, trainer_plans, etc.

Default to normal queries. Enable Realtime selectively.

---

## Supabase Client Usage

client.ts  → browser Supabase client (createBrowserClient from @supabase/ssr)
server.ts  → server Supabase client (createServerClient from @supabase/ssr)
middleware.ts → session refresh

Do NOT put privileged operations (service role) in client components.

---

## Before Implementing Any Feature — 10 Questions

1. Which user role can access it?
2. Which organization owns the data?
3. Which branch owns the data?
4. Which database table stores the data?
5. What RLS policy protects it?
6. Does the action require server-side execution (Edge Function)?
7. Is audit logging required?
8. Does it work for multi-organization users?
9. Does it work with workspace switching?
10. Does it fit within Supabase Free Tier?

Do not implement functionality that bypasses these questions.

---

## Security Requirements

Never: expose service-role key to client, trust frontend-only auth, store raw tokens, use public storage for private data, allow arbitrary org/branch ID access, hard-delete historical records, put secrets in repo.

Always: environment variables, RLS, server-side for privileged ops, signed storage URLs, DB constraints (FK, UNIQUE, NOT NULL, CHECK), indexes, audit logs for admin ops.

---

## Database Migration Rules

All schema changes = migration file in supabase/migrations/.
Repository is source of truth.

Current migrations:
00001_initial_schema.sql         — profiles, organizations, branches, memberships, trainer_plans, assigned_plans, RLS
00002_trainer_clients.sql        — trainer_clients table, RLS
00003_profiles_insert_policy.sql — profiles INSERT policy for upsert on login
00004_role_assignments.sql       — role_assignments table, RLS (REQUIRES MANUAL APPLY in Supabase SQL Editor)

---

## Seed Data (Development)

1 Super Admin
1 Gym Chain "FitGym Nation"
  1 Org Owner, 1 Org Admin
  Branch A "FitGym Downtown": 1 Manager, 2 Trainers, 5 Members
  Branch B "FitGym North": 1 Manager, 1 Trainer, 3 Members
1 Independent Trainer
1 user with 2 different org memberships (workspace switching test)

---

## Implementation Phase Priority

Phase 1 — Identity & Auth (partially done):
profiles, organizations, organization_members, branches, branch_memberships, role_assignments ✅, Supabase SSR client, RLS helper functions

Phase 2 — Workspace & Roles (partially done):
Workspace switching, RoleContextBanner ✅, MultiRolePicker ✅, all role dashboards ✅, invitation system (invitations table + Edge Function)

Phase 3 — Fitness Domain:
trainer_member_relationships, programs/workouts/exercises, attendance, member_measurements, progress_records, notifications, audit logs

Phase 4 — Growth & Monetization:
subscriptions/payments/invoices, reports, AI workout generation, AI coach (RAG/pgvector if needed), advanced analytics

---

## Frontend Data Patterns

### THE CARDINAL RULE: NEVER HARDCODE DATA
Every string visible to the user MUST come from the store or Supabase. If data is hardcoded in a component, it is a bug.

### The In-Memory Store (keep existing for UI reactivity)
All components use useStore() for reactive data:
  const s = useStore();  // ✅ Re-renders on store.notify()
  import { store } from "@/lib/store/orgStore"; // ❌ Static, won't re-render

### Session Context
Always derive identity from session, not magic strings:
  const session = s.getSession();
  const myTrainerId = session.trainerId || s.getUsers().find(u => u.role === "trainer")?.id || "";

After full Supabase migration:
  const { data: { user } } = await supabase.auth.getUser();
  // Then load workspace context from role_assignments / organization_members

### Supabase Hooks (src/lib/hooks/)
useMyClients(trainerId)          — trainer_clients from Supabase
useAddClientMutation()           — inserts trainer_clients + role_assignment
useLookupByEmail()               — profiles lookup for add-client flow
useSaveTrainerPlanMutation()     — trainer_plans
useAssignPlanMutation()          — assigned_plans
useTrainerSavedPlans(id)         — trainer's plan templates
useTrainerAssignments(id)        — plans assigned by trainer
useMyAssignedPlans(id)           — plans for trainee
useMyRoleAssignments(userId)     — active role contexts for user (banner/switcher)
useUpsertSelfRoleAssignment()    — own role assignment (seed on login)
useAssignRoleMutation()          — assign role to another user

### The Assignment System
AssignedPlan bridges Trainer ↔ Trainee:
  interface AssignedPlan {
    id, trainerId, traineeId, type ("workout"|"diet"|"schedule"), title, summary, assignedAt
  }

Trainer writes: s.assignPlan({...}) + useAssignPlanMutation()
Trainee reads:  s.getAssignmentsForTrainee(id) + useMyAssignedPlans(id)

---

## UX Rules

Every major page must have: Loading state, Empty state, Error state, Success feedback, Permission-aware rendering.

Destructive actions must use confirmation dialogs with clear consequence text.
Reduce clicks. No dead ends. Design complete workflows.

---

## Core Component Library

Button, Input, Select, Combobox, DatePicker, Modal, Drawer, Dropdown, Tabs, Tooltip, Badge, Avatar, Card, Table, DataTable, Pagination, EmptyState, LoadingState, Skeleton, Toast, Alert, ConfirmationDialog, Sidebar, TopNavigation, Breadcrumb, StatCard, ChartCard, FilterBar, SearchBar, WorkspaceSwitcher, RoleBadge, StatusBadge, GlassCard (existing), RoleContextBanner (existing)

---

## Status System (consistent semantic styles)

Pending   → yellow/amber
Invited   → blue
Active    → green/emerald
Suspended → orange
Archived  → gray
Offboarded→ red/rose (muted)

Never create a different visual treatment for the same status on different pages.

---

## AI Architecture (Future-Ready)

All AI calls server-side via Edge Functions. Never expose API keys to client.
Edge Function: ai-workout-generation → Gemini Flash
Edge Function: ai-progress-analysis  → Gemini Pro
Edge Function: ai-coach              → Gemini Flash + pgvector (only if RAG required)

Use pgvector only when an actual AI/RAG feature requires it.

---

## Design Workflow

1. Identify which role(s) use the feature
2. Map data to database table + RLS policy
3. Design user flow and information architecture
4. Design responsive layout (desktop → tablet → mobile)
5. Design dark mode, then light mode
6. Add micro-interactions and transitions
7. Review accessibility (ARIA, keyboard nav, contrast)
8. Verify enterprise quality

Think like the product team behind Linear, Stripe, and Apple Fitness.
Every screen should make users think: "This feels like a premium product."
