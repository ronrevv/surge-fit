"use client";

import React, { useState, useEffect } from "react";
import { AuthView } from "@/components/auth/AuthView";
import { OnboardingView } from "@/components/auth/OnboardingView";
import { TopNavBar, RoleType } from "@/components/navigation/TopNavBar";
import { SidebarNav, ROLE_NAVIGATION } from "@/components/navigation/SidebarNav";

import { CommandPalette } from "@/components/navigation/CommandPalette";
import { OnboardChainModal } from "@/components/modals/OnboardChainModal";
import { store } from "@/lib/store/orgStore";

// Workspace Views
import { SuperAdminView } from "@/components/views/SuperAdminView";
import { ChainOwnerView } from "@/components/views/ChainOwnerView";
import { ChainManagerView } from "@/components/views/ChainManagerView";
import { BranchManagerView } from "@/components/views/BranchManagerView";
import { TrainerView } from "@/components/views/TrainerView";
import { IndependentTrainerView } from "@/components/views/IndependentTrainerView";
import { TraineeView } from "@/components/views/TraineeView";

import {
  ShieldCheck,
  Building2,
  Dumbbell,
  Zap,
  User,
  LogOut,
} from "lucide-react";

export default function SurgeFitApp() {
  // Auth Protected State Machine
  const [appState, setAppState] = useState<"auth" | "onboarding" | "app">("auth");
  const [currentRole, setCurrentRole] = useState<RoleType>("trainee");
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("athlete@surgefit.com");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isDark, setIsDark] = useState(true);
  const [commandOpen, setCommandOpen] = useState(false);
  const [chainModalOpen, setChainModalOpen] = useState(false);

  const handleRoleChange = (role: RoleType) => {
    setCurrentRole(role);
    // Sync the store session so every view reads live linked data
    store.setSession(role);
    const firstItem = ROLE_NAVIGATION[role]?.[0]?.id || "dashboard";
    setActiveTab(firstItem);
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Auth Guard 1: Sign In Screen
  if (appState === "auth") {
    return (
      <AuthView
        onLoginSuccess={(role, email) => {
          if (role) setCurrentRole(role as RoleType);
          if (email) setCurrentUserEmail(email);
          setAppState("onboarding");
        }}
      />
    );
  }

  // Auth Guard 2: 3-Step Setup Assistant
  if (appState === "onboarding") {
    return (
      <OnboardingView
        onCompleteOnboarding={() => setAppState("app")}
      />
    );
  }

  // Protected Route Workspace execution area
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 pb-24 w-full">
      {/* Sticky Top Navigation Bar */}
      <TopNavBar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenCommand={() => setCommandOpen(true)}
      />

      {/* Main Workspace Area with Full Screen Width Layout */}
      <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Role-Based Sidebar Navigation */}
        <SidebarNav
          currentRole={currentRole}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId)}
        />

        {/* Sub-page Workspace Area */}
        <div className="flex-1 min-w-0 w-full">
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

      {/* Gym Chain Onboarding Modal */}
      <OnboardChainModal
        isOpen={chainModalOpen}
        onClose={() => setChainModalOpen(false)}
        onSuccess={(chainData) => {
          alert(`Successfully onboarded Gym Chain "${chainData.name}" with ${chainData.branches} branches under ${chainData.tier} SLA!`);
        }}
      />

      {/* Bottom Floating Fast-Role Switcher Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[95%] overflow-x-auto surge-card rounded-2xl p-2 shadow-xl">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setAppState("auth")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
            title="Sign Out & Lock Workspace"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
          <div className="w-px h-4 bg-slate-200 dark:bg-white/10" />

          <span className="text-[11px] font-mono-data text-slate-500 dark:text-slate-400 uppercase px-2 hidden sm:inline">
            Role Dock:
          </span>
          {[
            { role: "trainee" as RoleType, label: "Trainee", icon: <User className="w-3.5 h-3.5" /> },
            { role: "trainer" as RoleType, label: "Trainer", icon: <Dumbbell className="w-3.5 h-3.5" /> },
            { role: "independent_trainer" as RoleType, label: "Independent", icon: <Zap className="w-3.5 h-3.5" /> },
            { role: "branch_manager" as RoleType, label: "Branch Mgr", icon: <Building2 className="w-3.5 h-3.5" /> },
            { role: "chain_manager" as RoleType, label: "Chain Mgr", icon: <Building2 className="w-3.5 h-3.5" /> },
            { role: "chain_owner" as RoleType, label: "Chain Owner", icon: <Building2 className="w-3.5 h-3.5" /> },
            { role: "super_admin" as RoleType, label: "Super Admin", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
          ].map((item) => {
            const isSelected = currentRole === item.role;
            return (
              <button
                key={item.role}
                onClick={() => handleRoleChange(item.role)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
