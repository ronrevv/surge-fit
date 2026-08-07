"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store/useStore";
import { RoleType } from "@/components/navigation/TopNavBar";
import {
  Building2, Dumbbell, User, Zap, Users, ShieldCheck,
  CheckCircle2, MapPin, Mail, Star, X, ChevronRight,
} from "lucide-react";

interface PersonaPickerModalProps {
  role: RoleType;
  onSelect: (entityId: string) => void;
  onClose: () => void;
}

const ROLE_META: Record<RoleType, { label: string; icon: React.ReactNode; desc: string }> = {
  super_admin:         { label: "Super Admin",         icon: <ShieldCheck className="w-5 h-5" />, desc: "Platform governance" },
  chain_owner:         { label: "Gym Chain Owner",     icon: <Building2 className="w-5 h-5" />,  desc: "Select which gym chain you own" },
  chain_manager:       { label: "Chain Manager",       icon: <Building2 className="w-5 h-5" />,  desc: "Select which chain you manage" },
  branch_manager:      { label: "Branch Manager",      icon: <Building2 className="w-5 h-5" />,  desc: "Select which branch you manage" },
  trainer:             { label: "Gym Trainer",         icon: <Dumbbell className="w-5 h-5" />,   desc: "Select which trainer you are" },
  independent_trainer: { label: "Independent Trainer", icon: <Zap className="w-5 h-5" />,        desc: "Select your independent profile" },
  trainee:             { label: "Trainee Athlete",     icon: <User className="w-5 h-5" />,       desc: "Select which trainee you are" },
};

export function PersonaPickerModal({ role, onSelect, onClose }: PersonaPickerModalProps) {
  const s = useStore();
  const meta = ROLE_META[role];

  // Build entity list based on role
  const entities = (() => {
    switch (role) {
      case "chain_owner": {
        // One card per gym chain — shows chain info + owner name
        return s.getChains().map((chain) => {
          const ownerUser = s.getUsers().find((u) => u.organizationId === chain.id && u.role === "chain_owner");
          const stats = s.getChainStats(chain.id);
          return {
            id: chain.id,     // we pass chainId so setSession knows which chain to activate
            isChainId: true,
            name: chain.name,
            sub: chain.ownerName,
            meta2: `${chain.city}, ${chain.country}`,
            badge: chain.tier,
            badgeColor: chain.tier === "enterprise"
              ? "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300"
              : chain.tier === "professional"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300"
              : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300",
            status: chain.status,
            stats: [`${stats.branches} branches`, `${stats.trainers} trainers`, `${stats.trainees} trainees`],
            email: chain.ownerEmail,
            disabled: chain.status === "suspended",
          };
        });
      }

      case "chain_manager": {
        return s.getUsers()
          .filter((u) => u.role === "chain_manager")
          .map((u) => {
            const chain = u.organizationId ? s.getChainById(u.organizationId) : null;
            return {
              id: u.id,
              name: u.name,
              sub: chain?.name || "No Chain",
              meta2: chain?.city || "",
              badge: u.status,
              badgeColor: u.status === "active"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                : "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
              status: u.status,
              stats: [],
              email: u.email,
              disabled: u.status === "suspended",
            };
          });
      }

      case "branch_manager": {
        return s.getUsers()
          .filter((u) => u.role === "branch_manager")
          .map((u) => {
            const branch = u.branchId ? s.getBranchById(u.branchId) : null;
            const chain = u.organizationId ? s.getChainById(u.organizationId) : null;
            const trainers = branch ? s.getTrainersByBranch(branch.id) : [];
            const trainees = branch ? s.getTraineesByBranch(branch.id) : [];
            return {
              id: u.id,
              name: u.name,
              sub: branch?.name || "No branch assigned",
              meta2: `${chain?.name || ""} · ${branch?.city || ""}`,
              badge: u.status,
              badgeColor: u.status === "active"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                : "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
              status: u.status,
              stats: [`${trainers.length} trainers`, `${trainees.length} trainees`, `Cap. ${branch?.capacity || 0}`],
              email: u.email,
              disabled: u.status === "suspended",
            };
          });
      }

      case "trainer": {
        return s.getUsers()
          .filter((u) => u.role === "trainer")
          .map((u) => {
            const branch = u.branchId ? s.getBranchById(u.branchId) : null;
            const chain = u.organizationId ? s.getChainById(u.organizationId) : null;
            const trainees = s.getTraineesByTrainer(u.id);
            return {
              id: u.id,
              name: u.name,
              sub: u.specialization || "General Trainer",
              meta2: `${branch?.name || "No branch"} · ${chain?.name || ""}`,
              badge: u.rating ? `${u.rating.toFixed(1)} ★` : "New",
              badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
              status: u.status,
              stats: [`${trainees.length} trainees`],
              email: u.email,
              disabled: u.status === "suspended",
            };
          });
      }

      case "independent_trainer": {
        return s.getUsers()
          .filter((u) => u.role === "independent_trainer")
          .map((u) => {
            const clients = s.getTraineesByTrainer(u.id);
            return {
              id: u.id,
              name: u.name,
              sub: u.specialization || "Independent Coach",
              meta2: `${u.rating?.toFixed(1) || "—"} ★ rating`,
              badge: `${clients.length} clients`,
              badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300",
              status: u.status,
              stats: [`$${u.monthlyRevenue?.toLocaleString() || "0"}/mo`],
              email: u.email,
              disabled: u.status === "suspended",
            };
          });
      }

      case "trainee": {
        return s.getUsers()
          .filter((u) => u.role === "trainee")
          .map((u) => {
            const trainer = u.trainerId ? s.getUserById(u.trainerId) : null;
            const branch = u.branchId ? s.getBranchById(u.branchId) : null;
            return {
              id: u.id,
              name: u.name,
              sub: u.goal || "No goal set",
              meta2: trainer ? `Trainer: ${trainer.name}` : "No trainer assigned",
              badge: branch?.name || "Online",
              badgeColor: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300",
              status: u.status,
              stats: [`${u.weightKg || "—"} kg`, `${u.heightCm || "—"} cm`],
              email: u.email,
              disabled: u.status === "suspended",
            };
          });
      }

      default:
        return [];
    }
  })();

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] flex flex-col"
        >
          <div className="surge-card rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center">
                  {meta.icon}
                </div>
                <div>
                  <p className="font-display font-extrabold text-slate-900 dark:text-white text-base">
                    Login as {meta.label}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {meta.desc} · {entities.length} {entities.length === 1 ? "entity" : "entities"} available
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Entity list */}
            <div className="overflow-y-auto flex-1 p-4 space-y-2">
              {entities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
                  <p className="font-semibold text-slate-600 dark:text-slate-400 text-sm">
                    No {meta.label}s found
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
                    Onboard one using the appropriate role above in the hierarchy.
                  </p>
                </div>
              ) : (
                entities.map((entity) => (
                  <motion.button
                    key={entity.id}
                    whileHover={{ scale: entity.disabled ? 1 : 1.01 }}
                    whileTap={{ scale: entity.disabled ? 1 : 0.99 }}
                    disabled={entity.disabled}
                    onClick={() => !entity.disabled && onSelect(entity.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all group ${
                      entity.disabled
                        ? "opacity-40 cursor-not-allowed bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
                        : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 hover:bg-white dark:hover:bg-white/10 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-bold text-slate-900 dark:text-white text-sm">
                            {entity.name}
                          </span>
                          <span className={`text-[10px] font-mono-data px-2 py-0.5 rounded-full ${entity.badgeColor}`}>
                            {entity.badge}
                          </span>
                          {entity.disabled && (
                            <span className="text-[10px] font-mono-data px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
                              suspended
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{entity.sub}</p>
                        {entity.meta2 && (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {entity.meta2}
                          </p>
                        )}
                        {entity.email && (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1 font-mono-data">
                            <Mail className="w-3 h-3 shrink-0" />
                            {entity.email}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {entity.stats.length > 0 && (
                          <div className="flex gap-2">
                            {entity.stats.map((stat, i) => (
                              <span key={i} className="text-[11px] font-mono-data font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-lg">
                                {stat}
                              </span>
                            ))}
                          </div>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition mt-auto" />
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-white/10 shrink-0">
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono-data text-center">
                Simulating auth session · In production, your JWT determines the active entity
              </p>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
