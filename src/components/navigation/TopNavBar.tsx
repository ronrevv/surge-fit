"use client";

import React, { useState } from "react";
import {
  Flame,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Building2,
  ShieldCheck,
  Dumbbell,
  User,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type RoleType =
  | "super_admin"
  | "chain_owner"
  | "chain_manager"
  | "branch_manager"
  | "trainer"
  | "independent_trainer"
  | "trainee";

interface TopNavBarProps {
  currentRole: RoleType;
  onRoleChange: (role: RoleType) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenCommand: () => void;
}

const ROLES_CONFIG: Record<
  RoleType,
  { label: string; icon: React.ReactNode }
> = {
  super_admin: { label: "Super Admin OS", icon: <ShieldCheck className="w-4 h-4 text-slate-400" /> },
  chain_owner: { label: "Gym Chain Owner", icon: <Building2 className="w-4 h-4 text-slate-400" /> },
  chain_manager: { label: "Chain Manager", icon: <Building2 className="w-4 h-4 text-slate-400" /> },
  branch_manager: { label: "Branch Manager", icon: <Building2 className="w-4 h-4 text-slate-400" /> },
  trainer: { label: "Gym Trainer", icon: <Dumbbell className="w-4 h-4 text-slate-400" /> },
  independent_trainer: { label: "Independent Trainer", icon: <Zap className="w-4 h-4 text-slate-400" /> },
  trainee: { label: "Trainee Athlete", icon: <User className="w-4 h-4 text-slate-400" /> },
};

export function TopNavBar({
  currentRole,
  onRoleChange,
  isDark,
  onToggleTheme,
  onOpenCommand,
}: TopNavBarProps) {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full surge-card border-b border-slate-200 dark:border-white/10 px-4 sm:px-6 lg:px-8 py-3 transition-all">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold shadow-sm">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                SURGE<span className="text-slate-500 dark:text-slate-400">FIT</span>
              </span>
              <span className="text-[10px] font-mono-data uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                PRO OS
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Operating System for Fitness
            </p>
          </div>
        </div>

        {/* Role & Workspace Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl surge-card hover:border-slate-400 dark:hover:border-white/30 transition-all text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {ROLES_CONFIG[currentRole].icon}
            <span className="font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">Role:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {ROLES_CONFIG[currentRole].label}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          </button>

          <AnimatePresence>
            {roleDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                className="absolute right-0 sm:left-0 mt-2 w-64 surge-card rounded-2xl p-2 shadow-xl z-50"
              >
                <div className="px-3 py-2 border-b border-slate-200 dark:border-white/10 mb-1">
                  <p className="text-[11px] font-mono-data text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Switch Workspace Role
                  </p>
                </div>
                {(Object.keys(ROLES_CONFIG) as RoleType[]).map((role) => {
                  const isSelected = role === currentRole;
                  return (
                    <button
                      key={role}
                      onClick={() => {
                        onRoleChange(role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm transition-all mb-1 ${
                        isSelected
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {ROLES_CONFIG[role].icon}
                        <span>{ROLES_CONFIG[role].label}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommand}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl surge-card text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-mono-data hidden md:flex"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search (⌘K)</span>
          </button>


          <div className="relative">
            <button
              onClick={() => setNotifDrawerOpen(!notifDrawerOpen)}
              className="p-2 rounded-xl surge-card text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white relative transition-all"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-slate-900 dark:bg-white" />
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl surge-card text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
            title="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-slate-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
