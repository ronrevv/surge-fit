"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import { StatCard } from "../ui/StatCard";
import { useStore } from "@/lib/store/useStore";
import { Branch } from "@/lib/store/orgStore";
import {
  Building2, DollarSign, Users, Dumbbell, Plus, TrendingUp,
  X, Check, Clock, MapPin, UserCheck, Activity, Settings,
  CheckCircle2, AlertCircle,
} from "lucide-react";

interface ChainOwnerViewProps {
  activeTab?: string;
}

// Hard-coded to chain_001 for demo — in production this comes from auth session
const MY_CHAIN_ID = "chain_001";

function CreateBranchModal({ chainId, onClose }: { chainId: string; onClose: () => void }) {
  const s = useStore();
  const [form, setForm] = useState({ name: "", address: "", city: "", capacity: "250" });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.address || !form.city) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    s.createBranch({ chainId, name: form.name, address: form.address, city: form.city, capacity: Number(form.capacity) });
    setSaving(false);
    setDone(true);
    setTimeout(onClose, 1200);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-md z-50" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0c0c10] border border-white/15 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.025]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-slate-900 flex items-center justify-center"><Building2 className="w-5 h-5" /></div>
            <div>
              <p className="font-extrabold text-white text-base">Create New Branch</p>
              <p className="text-[11px] text-slate-500">Adds a new gym location under your chain</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {done ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-400" />
            <p className="font-bold text-white text-lg">Branch Created!</p>
            <p className="text-slate-500 text-sm">Now assign a Branch Manager in the Branch Settings.</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {[
              { label: "Branch Name", key: "name", placeholder: "e.g. Uptown Fitness Center" },
              { label: "Address", key: "address", placeholder: "e.g. 200 Park Avenue" },
              { label: "City", key: "city", placeholder: "e.g. Brooklyn, NY" },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1">{label} *</label>
                <input
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-white/25"
                />
              </div>
            ))}
            <div>
              <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1">Capacity (members)</label>
              <input
                type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving || !form.name || !form.address || !form.city}
              className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm transition disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {saving ? <><Clock className="w-4 h-4 animate-spin" /> Creating branch…</> : <><Check className="w-4 h-4" /> Create Branch</>}
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}

export function ChainOwnerView({ activeTab = "dashboard" }: ChainOwnerViewProps) {
  const s = useStore();
  const [branchModalOpen, setBranchModalOpen] = useState(false);

  const chain = s.getChainById(MY_CHAIN_ID);
  const branches = s.getBranchesByChain(MY_CHAIN_ID);
  const chainStats = s.getChainStats(MY_CHAIN_ID);
  const allUsers = s.getUsers();

  const branchManagers = allUsers.filter((u) => u.role === "branch_manager" && u.organizationId === MY_CHAIN_ID);
  const trainers = allUsers.filter((u) => u.role === "trainer" && u.organizationId === MY_CHAIN_ID);

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {branchModalOpen && <CreateBranchModal chainId={MY_CHAIN_ID} onClose={() => setBranchModalOpen(false)} />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-slate-900 dark:text-white" />
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              {chain?.name || "Chain Owner Portal"}
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            {chain?.tier} · {branches.length} branches · {chainStats.trainers} trainers · {chainStats.trainees} trainees
          </p>
        </div>
        <button
          onClick={() => setBranchModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-sm shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Branch</span>
        </button>
      </div>

      {/* DASHBOARD */}
      {activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Monthly Chain Revenue"
              value={`$${(chain?.mrr || 0).toLocaleString()}`}
              change={`$${((chain?.mrr || 0) * 12 / 1000).toFixed(0)}K ARR`}
              changeType="positive"
              icon={<DollarSign className="w-4 h-4 text-slate-500" />}
              sparklineData={[60, 68, 72, 75, 78, 82, 84.2]}
            />
            <StatCard
              title="Active Branches"
              value={`${branches.filter((b) => b.status === "active").length} Live`}
              change={`${branches.length} total`}
              changeType="positive"
              icon={<Building2 className="w-4 h-4 text-slate-500" />}
              sparklineData={[8, 9, 10, 10, 11, 11, branches.length]}
            />
            <StatCard
              title="Trainer Staff"
              value={`${chainStats.trainers} Trainers`}
              change={`${chainStats.trainees} active clients`}
              changeType="positive"
              icon={<Dumbbell className="w-4 h-4 text-slate-500" />}
              sparklineData={[20, 25, 32, 38, 44, 50, chainStats.trainers]}
            />
            <StatCard
              title="Chain Members"
              value={`${chainStats.trainees + chainStats.trainers + branchManagers.length}`}
              change="Live count"
              changeType="neutral"
              icon={<Users className="w-4 h-4 text-slate-500" />}
              sparklineData={[100, 200, 300, 400, 500, 600, chainStats.trainees + chainStats.trainers]}
            />
          </div>

          {/* Branch Grid */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Branch Network</h3>
              <button onClick={() => setBranchModalOpen(true)} className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 hover:underline">
                <Plus className="w-3.5 h-3.5" /> New Branch
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {branches.map((branch) => {
                const manager = branch.managerId ? s.getUserById(branch.managerId) : null;
                const branchTrainers = s.getTrainersByBranch(branch.id);
                const branchTrainees = s.getTraineesByBranch(branch.id);
                return (
                  <div key={branch.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{branch.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono-data ${branch.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25" : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300"}`}>
                        {branch.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                      <MapPin className="w-3 h-3" /> {branch.city}
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-200 dark:border-white/10 pt-3">
                      <div><p className="font-bold text-slate-900 dark:text-white font-mono-data">{branchTrainers.length}</p><p className="text-[10px] text-slate-500">Trainers</p></div>
                      <div><p className="font-bold text-slate-900 dark:text-white font-mono-data">{branchTrainees.length}</p><p className="text-[10px] text-slate-500">Trainees</p></div>
                      <div><p className="font-bold text-slate-900 dark:text-white font-mono-data">{branch.capacity}</p><p className="text-[10px] text-slate-500">Cap.</p></div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500">
                      Manager: <span className="font-semibold text-slate-700 dark:text-slate-300">{manager?.name || "Unassigned"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </>
      )}

      {/* BRANCHES TAB */}
      {activeTab === "branches" && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">All Branches ({branches.length})</h3>
            <button onClick={() => setBranchModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs">
              <Plus className="w-3.5 h-3.5" /> Create Branch
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-700 dark:text-slate-300">
              <thead className="border-b border-slate-200 dark:border-white/10 font-mono-data text-[10px] uppercase text-slate-500">
                <tr>
                  <th className="py-3 px-3 text-left">Branch</th>
                  <th className="py-3 px-3 text-left">City</th>
                  <th className="py-3 px-3 text-left">Manager</th>
                  <th className="py-3 px-3 text-left">Trainers</th>
                  <th className="py-3 px-3 text-left">Trainees</th>
                  <th className="py-3 px-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {branches.map((branch) => {
                  const manager = branch.managerId ? s.getUserById(branch.managerId) : null;
                  const branchTrainers = s.getTrainersByBranch(branch.id);
                  const branchTrainees = s.getTraineesByBranch(branch.id);
                  return (
                    <tr key={branch.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">{branch.name}</td>
                      <td className="py-3.5 px-3 text-slate-500">{branch.city}</td>
                      <td className="py-3.5 px-3 text-slate-500">{manager?.name || <span className="text-amber-500">Unassigned</span>}</td>
                      <td className="py-3.5 px-3 font-mono-data font-bold text-slate-900 dark:text-white">{branchTrainers.length}</td>
                      <td className="py-3.5 px-3 font-mono-data font-bold text-slate-900 dark:text-white">{branchTrainees.length}</td>
                      <td className="py-3.5 px-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono-data ${branch.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25" : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300"}`}>
                          {branch.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* TRAINERS TAB */}
      {activeTab === "trainers" && (
        <GlassCard>
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-4">
            Chain Trainers ({trainers.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {trainers.map((t) => {
              const branch = t.branchId ? s.getBranchById(t.branchId) : null;
              const trainees = s.getTraineesByTrainer(t.id);
              return (
                <div key={t.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t.specialization}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono-data ${t.status === "active" ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300"}`}>
                      {t.status}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-2 text-center">
                    <div><p className="font-bold font-mono-data text-slate-900 dark:text-white">{trainees.length}</p><p className="text-[10px] text-slate-500">Trainees</p></div>
                    <div><p className="font-bold font-mono-data text-slate-900 dark:text-white">{t.rating?.toFixed(1) || "—"} ★</p><p className="text-[10px] text-slate-500">Rating</p></div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">{branch?.name || "No branch"}</p>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {activeTab !== "dashboard" && activeTab !== "branches" && activeTab !== "trainers" && activeTab !== "revenue" && activeTab !== "managers" && activeTab !== "memberships" && activeTab !== "campaigns" && activeTab !== "settings" && (
        <GlassCard>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white capitalize mb-2">
            {activeTab.replace(/_/g, " ")}
          </h3>
          <p className="text-xs text-slate-500">Module content for {activeTab.replace(/_/g, " ")}.</p>
        </GlassCard>
      )}
    </div>
  );
}
