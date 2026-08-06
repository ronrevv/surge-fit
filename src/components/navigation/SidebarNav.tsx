"use client";

import React from "react";
import { RoleType } from "./TopNavBar";
import {
  LayoutDashboard,
  Building2,
  Users,
  Dumbbell,
  ShieldCheck,
  Zap,
  TrendingUp,
  BarChart3,
  Calendar,

  CreditCard,
  Wrench,
  DollarSign,
  Apple,
  Trophy,
  MessageSquare,
  FileText,
  Settings,
  Flame,
  Activity,
  History,
  Heart,
  PlusCircle,
  Megaphone,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const ROLE_NAVIGATION: Record<RoleType, NavItem[]> = {
  super_admin: [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "analytics", label: "Platform Analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "gym_chains", label: "Onboard Gym Chains", icon: <Building2 className="w-4 h-4" />, badge: "12 Pending" },
    { id: "subscriptions", label: "Subscriptions & Billing", icon: <CreditCard className="w-4 h-4" /> },

    { id: "users", label: "User Management", icon: <Users className="w-4 h-4" /> },
    { id: "audit_logs", label: "Audit Logs", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "settings", label: "Platform Settings", icon: <Settings className="w-4 h-4" /> },
  ],
  chain_owner: [
    { id: "dashboard", label: "Chain Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "revenue", label: "Revenue Engine", icon: <DollarSign className="w-4 h-4" /> },
    { id: "branches", label: "Branch Management", icon: <Building2 className="w-4 h-4" />, badge: "12 Active" },
    { id: "managers", label: "Chain Managers", icon: <Users className="w-4 h-4" /> },
    { id: "memberships", label: "Membership Plans", icon: <CreditCard className="w-4 h-4" /> },
    { id: "trainers", label: "Trainer Overview", icon: <Dumbbell className="w-4 h-4" /> },
    { id: "campaigns", label: "Marketing Campaigns", icon: <Megaphone className="w-4 h-4" /> },
    { id: "settings", label: "Chain Settings", icon: <Settings className="w-4 h-4" /> },
  ],
  chain_manager: [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "compare_branches", label: "Branch Performance", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "branch_analytics", label: "Regional Analytics", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "trainers", label: "Trainer Performance", icon: <Dumbbell className="w-4 h-4" /> },
    { id: "growth", label: "Member Growth", icon: <Users className="w-4 h-4" /> },
    { id: "reports", label: "Regional Reports", icon: <FileText className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ],
  branch_manager: [
    { id: "dashboard", label: "Branch Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "trainers", label: "Trainer Staff", icon: <Dumbbell className="w-4 h-4" /> },
    { id: "members", label: "Member Management", icon: <Users className="w-4 h-4" /> },
    { id: "attendance", label: "Turnstile Attendance", icon: <Activity className="w-4 h-4" />, badge: "184 Live" },
    { id: "classes", label: "Class Schedules", icon: <Calendar className="w-4 h-4" /> },
    { id: "equipment", label: "Equipment Health", icon: <Wrench className="w-4 h-4" /> },
    { id: "expenses", label: "Daily Expenses", icon: <DollarSign className="w-4 h-4" /> },
    { id: "settings", label: "Branch Settings", icon: <Settings className="w-4 h-4" /> },
  ],
  trainer: [
    { id: "dashboard", label: "Command Center", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "clients", label: "Client Roster", icon: <Users className="w-4 h-4" />, badge: "24 Athletes" },
    { id: "workout_builder", label: "Workout Builder", icon: <PlusCircle className="w-4 h-4" /> },
    { id: "nutrition", label: "Nutrition Plans", icon: <Apple className="w-4 h-4" /> },
    { id: "progress", label: "Progress Tracking", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "calendar", label: "Booking Calendar", icon: <Calendar className="w-4 h-4" /> },
    { id: "chat", label: "Client Chat", icon: <MessageSquare className="w-4 h-4" />, badge: "4 New" },

  ],
  independent_trainer: [
    { id: "dashboard", label: "CRM Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "clients", label: "Client Database", icon: <Users className="w-4 h-4" /> },
    { id: "programs", label: "Online Programs", icon: <Dumbbell className="w-4 h-4" /> },
    { id: "payments", label: "Stripe Billing", icon: <CreditCard className="w-4 h-4" />, badge: "$14.8k MRR" },
    { id: "calendar", label: "Session Calendar", icon: <Calendar className="w-4 h-4" /> },
    { id: "chat", label: "Messaging", icon: <MessageSquare className="w-4 h-4" /> },

  ],
  trainee: [
    { id: "dashboard", label: "Daily Pulse", icon: <Flame className="w-4 h-4 text-slate-700 dark:text-slate-200" /> },
    { id: "active_workout", label: "Live Workout", icon: <Dumbbell className="w-4 h-4 text-slate-700 dark:text-slate-200" />, badge: "Leg Day" },
    { id: "workout_history", label: "Workout History", icon: <History className="w-4 h-4" /> },
    { id: "nutrition", label: "Nutrition & Macros", icon: <Apple className="w-4 h-4" /> },
    { id: "biometrics", label: "Body Measurements", icon: <Heart className="w-4 h-4" /> },
    { id: "challenges", label: "Leaderboards", icon: <Trophy className="w-4 h-4" /> },
    { id: "trainer_chat", label: "Trainer Chat", icon: <MessageSquare className="w-4 h-4" /> },

  ],
};

interface SidebarNavProps {
  currentRole: RoleType;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function SidebarNav({ currentRole, activeTab, onTabChange }: SidebarNavProps) {
  const items = ROLE_NAVIGATION[currentRole];

  return (
    <aside className="w-full lg:w-64 shrink-0 surge-card rounded-2xl p-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-auto gap-1">
      <div className="px-3 py-2 border-b border-slate-200 dark:border-white/10 hidden lg:block mb-1">
        <span className="text-[11px] font-mono-data text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {currentRole.replace("_", " ")} Menu
        </span>
      </div>

      {items.map((item) => {
        const isSelected = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap lg:whitespace-normal ${
              isSelected
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={isSelected ? "text-white dark:text-slate-900" : "text-slate-400"}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span
                className={`text-[10px] font-mono-data px-2 py-0.5 rounded-full ${
                  isSelected
                    ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                    : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300 border border-slate-200 dark:border-white/10"
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
}
