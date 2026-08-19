"use client";

/**
 * RoleContextBanner
 * Shows a premium pill/banner with the user's active role assignment context:
 * "Trainer · Assigned by Sarah Chen (Branch Manager) · FitGym Downtown · Aug 19, 2026"
 *
 * If the user is a demo/self-registered super admin (no assigner), shows:
 * "Super Admin · Platform Owner"
 */
import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Building2, Dumbbell, Users, Zap, Flame, UserCheck, ChevronRight } from "lucide-react";
import type { RoleAssignment } from "@/lib/hooks/useRoleAssignments";
import type { RoleType } from "@/components/navigation/TopNavBar";

const ROLE_META: Record<RoleType, { label: string; icon: React.ElementType; color: string }> = {
  super_admin:         { label: "Super Admin",        icon: ShieldCheck, color: "from-rose-500 to-orange-500" },
  chain_owner:         { label: "Chain Owner",        icon: Building2,   color: "from-violet-500 to-purple-600" },
  chain_manager:       { label: "Chain Manager",      icon: Building2,   color: "from-blue-500 to-indigo-600" },
  branch_manager:      { label: "Branch Manager",     icon: Building2,   color: "from-sky-400 to-blue-500" },
  trainer:             { label: "Gym Trainer",         icon: Dumbbell,    color: "from-emerald-400 to-teal-500" },
  independent_trainer: { label: "Ind. Trainer",       icon: Zap,         color: "from-amber-400 to-orange-500" },
  trainee:             { label: "Trainee",             icon: Flame,       color: "from-pink-400 to-rose-500" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface Props {
  assignment: RoleAssignment;
  /** Called when user clicks to switch role (if they have multiple) */
  onSwitchRole?: () => void;
  hasMultipleRoles?: boolean;
}

export function RoleContextBanner({ assignment, onSwitchRole, hasMultipleRoles }: Props) {
  const meta = ROLE_META[assignment.role] ?? ROLE_META.trainee;
  const Icon = meta.icon;

  const assignedByText = assignment.assigned_by_name
    ? `${assignment.assigned_by_name}${assignment.assigned_by_role
        ? ` · ${ROLE_META[assignment.assigned_by_role]?.label ?? assignment.assigned_by_role}`
        : ""
      }`
    : null;

  const locationText = [assignment.branch_name, assignment.org_name].filter(Boolean).join(" · ");

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-lg">
        {/* Role icon pill */}
        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center shrink-0 shadow-sm`}>
          <Icon className="w-4 h-4 text-white" />
        </div>

        {/* Context text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-white whitespace-nowrap">{meta.label}</span>
            {assignedByText && (
              <>
                <span className="text-[10px] text-slate-500">assigned by</span>
                <span className="text-[11px] font-semibold text-slate-300 whitespace-nowrap truncate max-w-[160px]">
                  {assignedByText}
                </span>
              </>
            )}
            {!assignedByText && (
              <span className="text-[10px] text-slate-500">Platform Owner</span>
            )}
          </div>
          {(locationText || assignment.assigned_at) && (
            <div className="flex items-center gap-1.5 mt-0.5">
              {locationText && (
                <span className="text-[10px] text-slate-500 truncate max-w-[180px]">{locationText}</span>
              )}
              {locationText && assignment.assigned_at && (
                <span className="text-[10px] text-slate-600">·</span>
              )}
              {assignment.assigned_at && (
                <span className="text-[10px] text-slate-600">{formatDate(assignment.assigned_at)}</span>
              )}
            </div>
          )}
        </div>

        {/* Switch role button */}
        {hasMultipleRoles && onSwitchRole && (
          <button
            onClick={onSwitchRole}
            className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-white transition whitespace-nowrap shrink-0 border border-white/10 rounded-lg px-2 py-1"
          >
            <UserCheck className="w-3 h-3" />
            Switch
          </button>
        )}

        {!hasMultipleRoles && (
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        )}
      </div>
    </motion.div>
  );
}

/**
 * Skeleton loader for the banner while assignment data is loading
 */
export function RoleContextBannerSkeleton() {
  return (
    <div className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/8 animate-pulse">
      <div className="w-8 h-8 rounded-xl bg-white/10 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-32 bg-white/10 rounded-full" />
        <div className="h-2.5 w-48 bg-white/5 rounded-full" />
      </div>
    </div>
  );
}
