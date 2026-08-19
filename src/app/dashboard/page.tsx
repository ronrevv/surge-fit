"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AuthView } from "@/components/auth/AuthView";
import { OnboardingView } from "@/components/auth/OnboardingView";
import { TopNavBar, RoleType } from "@/components/navigation/TopNavBar";
import { SidebarNav, ROLE_NAVIGATION } from "@/components/navigation/SidebarNav";
import { CommandPalette } from "@/components/navigation/CommandPalette";
import { OnboardChainModal } from "@/components/modals/OnboardChainModal";
import { RoleContextBanner, RoleContextBannerSkeleton } from "@/components/auth/RoleContextBanner";
import { store } from "@/lib/store/orgStore";
import { supabase } from "@/lib/supabase/client";
import { useMyRoleAssignments, useUpsertSelfRoleAssignment } from "@/lib/hooks/useRoleAssignments";
import type { RoleAssignment } from "@/lib/hooks/useRoleAssignments";

// Workspace Views
import { SuperAdminView } from "@/components/views/SuperAdminView";
import { ChainOwnerView } from "@/components/views/ChainOwnerView";
import { ChainManagerView } from "@/components/views/ChainManagerView";
import { BranchManagerView } from "@/components/views/BranchManagerView";
import { TrainerView } from "@/components/views/TrainerView";
import { IndependentTrainerView } from "@/components/views/IndependentTrainerView";
import { TraineeView } from "@/components/views/TraineeView";
import { PersonaPickerModal } from "@/components/navigation/PersonaPickerModal";
import { LogOut, Loader2, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type AppState = "loading" | "auth" | "onboarding" | "app";

/**
 * Multi-role picker modal — shown when user has 2+ active role assignments.
 * Lets them choose which workspace to enter.
 */
function MultiRolePicker({
  assignments,
  onSelect,
}: {
  assignments: RoleAssignment[];
  onSelect: (a: RoleAssignment) => void;
}) {
  const ROLE_COLORS: Record<string, string> = {
    super_admin: "from-rose-500 to-orange-500",
    chain_owner: "from-violet-500 to-purple-600",
    chain_manager: "from-blue-500 to-indigo-600",
    branch_manager: "from-sky-400 to-blue-500",
    trainer: "from-emerald-400 to-teal-500",
    independent_trainer: "from-amber-400 to-orange-500",
    trainee: "from-pink-400 to-rose-500",
  };
  const ROLE_LABELS: Record<string, string> = {
    super_admin: "Super Admin",
    chain_owner: "Chain Owner",
    chain_manager: "Chain Manager",
    branch_manager: "Branch Manager",
    trainer: "Trainer",
    independent_trainer: "Independent Trainer",
    trainee: "Trainee",
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0c0c10] border border-white/15 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 bg-white/[0.025]">
          <p className="font-extrabold text-white text-lg">Choose Workspace</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            You have {assignments.length} active roles. Which one do you want to open?
          </p>
        </div>

        {/* Role list */}
        <div className="p-4 space-y-3">
          {assignments.map((a) => (
            <button
              key={a.id}
              onClick={() => onSelect(a)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition group text-left"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ROLE_COLORS[a.role] ?? "from-slate-500 to-slate-700"} flex items-center justify-center shrink-0 shadow-md`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{ROLE_LABELS[a.role] ?? a.role}</p>
                <p className="text-[11px] text-slate-400 truncate">
                  {a.assigned_by_name
                    ? `Assigned by ${a.assigned_by_name}`
                    : "Self-registered"}
                  {(a.org_name || a.branch_name) && ` · ${[a.branch_name, a.org_name].filter(Boolean).join(", ")}`}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-600 group-hover:text-white transition -rotate-90" />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function SurgeFitApp() {
  const [appState, setAppState] = useState<AppState>("loading");
  const [currentRole, setCurrentRole] = useState<RoleType>("trainee");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isDark, setIsDark] = useState(true);
  const [commandOpen, setCommandOpen] = useState(false);
  const [chainModalOpen, setChainModalOpen] = useState(false);
  const [personaPickerRole, setPersonaPickerRole] = useState<RoleType | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  // The active role assignment driving the banner
  const [activeAssignment, setActiveAssignment] = useState<RoleAssignment | null>(null);
  // When user has multiple roles and hasn't picked yet
  const [pendingAssignments, setPendingAssignments] = useState<RoleAssignment[] | null>(null);

  // Fetch role assignments reactively for the current user
  const { data: roleAssignments, isLoading: assignmentsLoading } = useMyRoleAssignments(currentUserId);
  const upsertSelfRole = useUpsertSelfRoleAssignment();

  const handleRoleChange = (role: RoleType, targetEntityId?: string) => {
    setCurrentRole(role);
    store.setSession(role, targetEntityId);
    const firstItem = ROLE_NAVIGATION[role]?.[0]?.id || "dashboard";
    setActiveTab(firstItem);
    // Clear banner if switching via UI (not via role_assignments)
    setActiveAssignment(null);
  };

  const loadUserSession = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setAppState("auth");
      return;
    }

    setCurrentUserId(user.id);
    setCurrentUserEmail(user.email ?? "");

    // Derive role + name from user_metadata first (always present after seed)
    const metaRole = (user.user_metadata?.role ?? "trainee") as RoleType;
    const metaName = user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "User";

    // Fetch profile
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();

    // Insert profile if it doesn't exist so FK constraints never fail
    if (!existingProfile) {
      await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        full_name: metaName,
        role: metaRole,
      });
    }

    const profile = existingProfile || { role: metaRole, full_name: metaName };

    const role = (profile?.role ?? metaRole) as RoleType;
    const name = profile?.full_name ?? metaName;

    setCurrentUserName(name);

    // Ensure a self-role-assignment exists for demo/seed accounts so the banner works
    // (fires in background — doesn't block UI)
    upsertSelfRole.mutate({ user_id: user.id, role });

    // Fetch role_assignments — the main source of truth for multi-role
    const { data: assignments } = await supabase
      .from("role_assignments")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("assigned_at", { ascending: true });

    const activeAssignments = (assignments || []) as RoleAssignment[];

    if (activeAssignments.length === 0) {
      // No role_assignments yet (table might not exist, or seed not run) — use profile role
      setCurrentRole(role);
      store.setSession(role);
      const firstItem = ROLE_NAVIGATION[role]?.[0]?.id || "dashboard";
      setActiveTab(firstItem);
      setAppState("app");
    } else if (activeAssignments.length === 1) {
      // Single role — go straight in
      const a = activeAssignments[0];
      setCurrentRole(a.role);
      setActiveAssignment(a);
      store.setSession(a.role);
      const firstItem = ROLE_NAVIGATION[a.role]?.[0]?.id || "dashboard";
      setActiveTab(firstItem);
      setAppState("app");
    } else {
      // Multiple roles — show picker
      setPendingAssignments(activeAssignments);
      setAppState("app"); // show app shell so picker renders
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // INITIAL_SESSION fires immediately on mount.
    // SIGNED_IN fires on actual login. SIGNED_OUT clears state.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || (!session && event !== "INITIAL_SESSION")) {
        setAppState("auth");
        setCurrentUserId("");
        setActiveAssignment(null);
        setPendingAssignments(null);
      } else if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
        if (session) {
          loadUserSession();
        } else {
          setAppState("auth");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [loadUserSession]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    setAppState("auth");
    setCurrentUserId("");
    setActiveAssignment(null);
    setPendingAssignments(null);
    setIsSigningOut(false);
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (appState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.4)]">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <p className="text-slate-400 text-sm font-medium tracking-wide">Loading SurgeFit...</p>
        </div>
      </div>
    );
  }

  // ── Auth Screen ───────────────────────────────────────────────────────────
  if (appState === "auth") {
    return (
      <AuthView
        onLoginSuccess={(role, email) => {
          // loadUserSession() will fire via onAuthStateChange(SIGNED_IN) 
          // so we just store the email as hint
          if (email) setCurrentUserEmail(email);
        }}
      />
    );
  }

  // ── Onboarding ────────────────────────────────────────────────────────────
  if (appState === "onboarding") {
    return <OnboardingView onCompleteOnboarding={() => setAppState("app")} />;
  }

  // ── Multi-role picker ─────────────────────────────────────────────────────
  const showMultiRolePicker = pendingAssignments && pendingAssignments.length > 0 && !currentRole;

  // ── Protected Workspace ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 w-full">
      {/* Multi-role picker overlay */}
      <AnimatePresence>
        {pendingAssignments && pendingAssignments.length > 1 && !activeAssignment && (
          <MultiRolePicker
            assignments={pendingAssignments}
            onSelect={(a) => {
              setCurrentRole(a.role);
              setActiveAssignment(a);
              store.setSession(a.role);
              const firstItem = ROLE_NAVIGATION[a.role]?.[0]?.id || "dashboard";
              setActiveTab(firstItem);
              setPendingAssignments(null);
            }}
          />
        )}
      </AnimatePresence>

      <TopNavBar
        currentRole={currentRole}
        availableRoles={roleAssignments ? Array.from(new Set(roleAssignments.map(a => a.role))) : [currentRole]}
        onRoleChange={handleRoleChange}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenCommand={() => setCommandOpen(true)}
        onOpenPersonaPicker={(role) => setPersonaPickerRole(role)}
      />

      <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        <SidebarNav
          currentRole={currentRole}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId)}
        />

        <div className="flex-1 min-w-0 w-full space-y-4">
          {/* Role context banner — shown below nav, above content */}
          {activeAssignment ? (
            <RoleContextBanner
              assignment={activeAssignment}
              hasMultipleRoles={(roleAssignments?.length ?? 0) > 1}
              onSwitchRole={() => {
                setActiveAssignment(null);
                setPendingAssignments(roleAssignments ?? null);
              }}
            />
          ) : assignmentsLoading && currentUserId ? (
            <RoleContextBannerSkeleton />
          ) : null}

          {currentRole === "super_admin" && <SuperAdminView activeTab={activeTab} />}
          {currentRole === "chain_owner" && <ChainOwnerView activeTab={activeTab} />}
          {currentRole === "chain_manager" && <ChainManagerView activeTab={activeTab} />}
          {currentRole === "branch_manager" && <BranchManagerView activeTab={activeTab} />}
          {currentRole === "trainer" && <TrainerView activeTab={activeTab} />}
          {currentRole === "independent_trainer" && <IndependentTrainerView activeTab={activeTab} />}
          {currentRole === "trainee" && <TraineeView activeTab={activeTab} />}
        </div>
      </main>

      <CommandPalette
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
        onSelectRole={handleRoleChange}
      />

      {personaPickerRole && (
        <PersonaPickerModal
          role={personaPickerRole}
          onSelect={(entityId) => {
            handleRoleChange(personaPickerRole, entityId);
            setPersonaPickerRole(null);
          }}
          onClose={() => setPersonaPickerRole(null)}
        />
      )}

      <OnboardChainModal
        isOpen={chainModalOpen}
        onClose={() => setChainModalOpen(false)}
        onSuccess={(chainData) => {
          alert(`Successfully onboarded "${chainData.name}" — ${chainData.branches} branches, ${chainData.tier} SLA.`);
        }}
      />

      {/* User identity strip — bottom right */}
      <div className="fixed bottom-5 right-5 z-40">
        <div className="flex items-center gap-3 backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-2.5 shadow-xl">
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold text-white">{currentUserName || currentUserEmail}</span>
            <span className="text-[10px] text-slate-500 capitalize">{currentRole.replace(/_/g, " ")}</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors disabled:opacity-50"
            title="Sign Out"
          >
            {isSigningOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
