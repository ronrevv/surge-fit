"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, X, CheckCircle2, ShieldCheck, CreditCard } from "lucide-react";

interface OnboardChainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (chainData: any) => void;
}

export function OnboardChainModal({ isOpen, onClose, onSuccess }: OnboardChainModalProps) {
  const [chainName, setChainName] = useState("");
  const [branchesCount, setBranchesCount] = useState("5");
  const [tier, setTier] = useState("Enterprise ($1,999/mo)");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({ name: chainName, branches: Number(branchesCount), tier });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md surge-card rounded-2xl p-6 shadow-2xl relative"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-900 dark:text-white" />
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Onboard Gym Chain
              </h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="text-xs font-mono-data text-slate-500 uppercase block mb-1">
                Gym Chain Organization Name
              </label>
              <input
                type="text"
                required
                value={chainName}
                onChange={(e) => setChainName(e.target.value)}
                placeholder="e.g. Titan Athletics Club"
                className="w-full surge-card p-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono-data text-slate-500 uppercase block mb-1">
                  Initial Branches
                </label>
                <input
                  type="number"
                  value={branchesCount}
                  onChange={(e) => setBranchesCount(e.target.value)}
                  className="w-full surge-card p-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-mono-data text-slate-500 uppercase block mb-1">
                  SLA Tier
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="w-full surge-card p-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                >
                  <option>Enterprise ($1,999/mo)</option>
                  <option>Pro Growth ($999/mo)</option>
                  <option>Standard ($499/mo)</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono-data text-slate-600 dark:text-slate-400">
              ⚡ Will auto-provision isolated Supabase tenant schema & admin workspace.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold"
              >
                Approve & Provision
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
