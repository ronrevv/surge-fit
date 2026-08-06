"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Building2,
  Users,
  Dumbbell,
  ShieldCheck,
  Zap,
  TrendingUp,
  BarChart3,
  Calendar,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { RoleType } from "./TopNavBar";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: RoleType) => void;
}

const NAVIGATION_ITEMS = [
  { label: "Super Admin Platform OS", role: "super_admin" as RoleType, category: "Workspaces", icon: <ShieldCheck className="w-4 h-4 text-purple-400" /> },
  { label: "Gym Chain Owner Portal", role: "chain_owner" as RoleType, category: "Workspaces", icon: <Building2 className="w-4 h-4 text-amber-400" /> },
  { label: "Chain Operations Manager", role: "chain_manager" as RoleType, category: "Workspaces", icon: <Building2 className="w-4 h-4 text-blue-400" /> },
  { label: "Branch Manager Workspace", role: "branch_manager" as RoleType, category: "Workspaces", icon: <Building2 className="w-4 h-4 text-emerald-400" /> },
  { label: "Gym Trainer Dashboard", role: "trainer" as RoleType, category: "Workspaces", icon: <Dumbbell className="w-4 h-4 text-rose-400" /> },
  { label: "Independent Trainer CRM", role: "independent_trainer" as RoleType, category: "Workspaces", icon: <Zap className="w-4 h-4 text-orange-400" /> },
  { label: "Trainee Athlete Daily Pulse", role: "trainee" as RoleType, category: "Workspaces", icon: <Users className="w-4 h-4 text-cyan-400" /> },
];

export function CommandPalette({ isOpen, onClose, onSelectRole }: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? onClose() : undefined;
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filteredItems = NAVIGATION_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 w-[92%] max-w-xl surge-glass rounded-2xl p-4 border border-white/20 shadow-2xl z-50 backdrop-blur-2xl"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-3 py-2 border-b border-white/10">
              <Search className="w-5 h-5 text-rose-400" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, workspace role, or client search..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Command List */}
            <div className="mt-3 max-h-80 overflow-y-auto space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-mono-data text-slate-400 uppercase tracking-wider">
                Workspaces & Dashboards
              </div>
              {filteredItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectRole(item.role);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-rose-500/20 hover:border-rose-500/30 border border-transparent text-left transition text-xs sm:text-sm text-slate-200 hover:text-white group"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-400 group-hover:translate-x-1 transition" />
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
