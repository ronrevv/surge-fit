"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import { StatCard } from "../ui/StatCard";
import { useStore } from "@/lib/store/useStore";
import { supabase } from "@/lib/supabase/client";
import { GymChain, OrgStatus } from "@/lib/store/orgStore";
import {
  ShieldCheck,
  Building2,
  Users,
  TrendingUp,
  Activity,
  Plus,
  Search,
  X,
  Check,
  ChevronDown,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  Dumbbell,
} from "lucide-react";

interface SuperAdminViewProps {
  activeTab?: string;
}

function OnboardChainModal({ onClose }: { onClose: () => void }) {
  const s = useStore();
  const [form, setForm] = useState({
    name: "", ownerName: "", ownerEmail: "", city: "", country: "USA",
    tier: "professional" as GymChain["tier"],
  });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mySupabaseId, setMySupabaseId] = useState<string>("");
  const [myName, setMyName] = useState<string>("Super Admin");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) setMySupabaseId(data.user.id);
      if (data?.user?.user_metadata?.full_name) setMyName(data.user.user_metadata.full_name);
    });
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.ownerName || !form.ownerEmail || !form.city) return;
    setSaving(true);
    setError(null);

    try {
      // 1. Create organization in Supabase
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert([{ name: form.name, type: "chain" }])
        .select()
        .single();
      if (orgError) throw orgError;

      // 2. Sign up the chain owner in Supabase Auth
      const { data: ownerAuth, error: ownerAuthErr } = await supabase.auth.signUp({
        email: form.ownerEmail,
        password: `SurgeOwner_${Date.now()}!`,
        options: { data: { full_name: form.ownerName, role: "chain_owner" } },
      });
      if (ownerAuthErr && !ownerAuthErr.message.includes("already registered")) {
        throw ownerAuthErr;
      }
      const ownerId = ownerAuth?.user?.id;

      // 3. Upsert profile for the chain owner
      if (ownerId) {
        await supabase.from("profiles").upsert(
          { id: ownerId, email: form.ownerEmail, full_name: form.ownerName, role: "chain_owner", updated_at: new Date().toISOString() },
          { onConflict: "id" }
        );

        // 4. Insert role_assignment — super admin assigned this chain owner
        await supabase.from("role_assignments").upsert(
          {
            user_id: ownerId,
            role: "chain_owner",
            org_id: org?.id ?? null,
            assigned_by: mySupabaseId || null,
            assigned_by_role: "super_admin",
            assigned_by_name: myName,
            org_name: form.name,
            status: "active",
          },
          { onConflict: "user_id,role,org_id,branch_id", ignoreDuplicates: true }
        );
      }

      // 5. In-memory store for immediate UI reactivity
      s.onboardGymChain(form);
      setSaving(false);
      setDone(true);
      setTimeout(onClose, 1400);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#0c0c10] border border-white/15 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.025]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-slate-900 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-white text-base">Onboard New Gym Chain</p>
              <p className="text-[11px] text-slate-500">Provisions tenant, RLS policies & owner invite</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {done ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-400" />
            <p className="font-bold text-white text-lg">Gym Chain Onboarded!</p>
            <p className="text-slate-500 text-sm text-center">Status: Pending Approval<br />Owner invite sent to {form.ownerEmail}</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1">Gym Chain Name *</label>
                <input
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. FitLife Nation"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-white/25"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1">Plan Tier *</label>
                <select
                  value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value as GymChain["tier"] })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none appearance-none"
                >
                  <option value="starter">Starter — Up to 3 branches</option>
                  <option value="professional">Professional — Up to 20 branches</option>
                  <option value="enterprise">Enterprise — Unlimited</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1">Owner Full Name *</label>
                <input
                  value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                  placeholder="e.g. John Smith"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-white/25"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1">Owner Email *</label>
                <input
                  type="email" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
                  placeholder="owner@gymchain.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-white/25"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1">City *</label>
                <input
                  value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g. New York"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-white/25"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1">Country</label>
                <input
                  value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-white/25"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-300">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={saving || !form.name || !form.ownerName || !form.ownerEmail || !form.city}
              className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm transition disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {saving ? (
                <><Clock className="w-4 h-4 animate-spin" /> Creating in Supabase…</>
              ) : (
                <><Check className="w-4 h-4" /> Onboard & Send Invite</>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}

export function SuperAdminView({ activeTab = "dashboard" }: SuperAdminViewProps) {
  const s = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [onboardOpen, setOnboardOpen] = useState(false);

  const chains = s.getChains();
  const stats = s.getPlatformStats();
  const auditLogs = s.getAuditLogs().slice(0, 12);
  const users = s.getUsers();

  const filteredChains = chains.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           c.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusBadge = (status: OrgStatus) => {
    if (status === "active") return "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25";
    if (status === "pending") return "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/25";
    return "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/25";
  };

  const tierBadge = (tier: GymChain["tier"]) => {
    if (tier === "enterprise") return "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300";
    if (tier === "professional") return "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300";
    return "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300";
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {onboardOpen && <OnboardChainModal onClose={() => setOnboardOpen(false)} />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-slate-800 dark:text-slate-200" />
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              Super Admin OS
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Platform governance · {chains.length} gym chains · {stats.totalBranches} branches
          </p>
        </div>
        <button
          onClick={() => setOnboardOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-sm shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard Gym Chain</span>
        </button>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Platform ARR"
              value={`$${(stats.totalMRR * 12 / 1000).toFixed(0)}K`}
              change={`$${stats.totalMRR.toLocaleString()}/mo MRR`}
              changeType="positive"
              icon={<TrendingUp className="w-4 h-4 text-slate-500" />}
              sparklineData={[30, 42, 48, 55, 62, 70, 85]}
            />
            <StatCard
              title="Active Gym Chains"
              value={`${stats.activeChains} Active`}
              change={`${stats.pendingChains} Pending Approval`}
              changeType={stats.pendingChains > 0 ? "neutral" : "positive"}
              icon={<Building2 className="w-4 h-4 text-slate-500" />}
              sparklineData={[100, 108, 115, 120, 122, 126, stats.activeChains]}
            />
            <StatCard
              title="Total Trainers"
              value={`${stats.totalTrainers} Staff`}
              change={`${stats.totalTrainees} active trainees`}
              changeType="positive"
              icon={<Dumbbell className="w-4 h-4 text-slate-500" />}
              sparklineData={[40, 52, 58, 64, 68, 72, stats.totalTrainers]}
            />
            <StatCard
              title="Total Branches"
              value={`${stats.totalBranches} Locations`}
              change="Live · Real-time sync"
              changeType="neutral"
              icon={<Activity className="w-4 h-4 text-slate-500" />}
              sparklineData={[8, 10, 12, 14, 15, 16, stats.totalBranches]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chain Table */}
            <GlassCard className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Gym Chain Governance Queue</h3>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text" placeholder="Search chains…" value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl surge-card text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none w-40"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="border-b border-slate-200 dark:border-white/10 text-slate-500 font-mono-data text-[10px] uppercase">
                    <tr>
                      <th className="py-3 px-2">Organization</th>
                      <th className="py-3 px-2">Tier</th>
                      <th className="py-3 px-2">Branches</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {filteredChains.map((chain) => (
                      <tr key={chain.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">{chain.name}</p>
                              <p className="text-[10px] text-slate-400">{chain.ownerName} · {chain.city}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`text-[10px] font-mono-data px-2 py-0.5 rounded-full ${tierBadge(chain.tier)}`}>
                            {chain.tier}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-mono-data font-bold text-slate-900 dark:text-white">
                          {chain.branches.length}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-data border ${statusBadge(chain.status)}`}>
                            {chain.status.charAt(0).toUpperCase() + chain.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {chain.status === "pending" && (
                              <button
                                onClick={() => s.updateChainStatus(chain.id, "active")}
                                className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold transition"
                              >
                                Approve
                              </button>
                            )}
                            {chain.status === "active" && (
                              <button
                                onClick={() => s.updateChainStatus(chain.id, "suspended")}
                                className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 text-[10px] font-bold transition"
                              >
                                Suspend
                              </button>
                            )}
                            {chain.status === "suspended" && (
                              <button
                                onClick={() => s.updateChainStatus(chain.id, "active")}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-[10px] font-bold transition"
                              >
                                Reactivate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {/* Audit Log */}
            <GlassCard>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-white/10">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-500" />
                  Live Audit Log
                </h3>
                <span className="text-[10px] font-mono-data text-slate-400">{auditLogs.length} events</span>
              </div>
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                      <span className="flex items-center gap-1.5">
                        {log.severity === "warn" ? (
                          <AlertCircle className="w-3 h-3 text-amber-500" />
                        ) : log.severity === "critical" ? (
                          <AlertCircle className="w-3 h-3 text-red-500" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        )}
                        {log.action}
                      </span>
                      <span className="text-[10px] font-mono-data text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5">
                      {log.actorName} → {log.targetName}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </>
      )}

      {/* GYM CHAINS TAB */}
      {activeTab === "gym_chains" && (
        <GlassCard>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-500" />
              All Gym Chains ({chains.length})
            </h3>
            <button
              onClick={() => setOnboardOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Onboard New Chain
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {chains.map((chain) => {
              const chainStats = s.getChainStats(chain.id);
              return (
                <div key={chain.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{chain.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{chain.ownerName} · {chain.city}, {chain.country}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-data border ${statusBadge(chain.status)}`}>
                      {chain.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-white/10">
                    {[
                      { label: "Branches", val: chainStats.branches },
                      { label: "Trainers", val: chainStats.trainers },
                      { label: "Trainees", val: chainStats.trainees },
                    ].map((m) => (
                      <div key={m.label} className="text-center">
                        <p className="font-bold text-slate-900 dark:text-white text-base font-mono-data">{m.val}</p>
                        <p className="text-[10px] text-slate-500">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    {chain.status === "pending" && (
                      <button
                        onClick={() => s.updateChainStatus(chain.id, "active")}
                        className="flex-1 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold"
                      >
                        ✓ Approve
                      </button>
                    )}
                    {chain.status === "active" && (
                      <button
                        onClick={() => s.updateChainStatus(chain.id, "suspended")}
                        className="flex-1 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold"
                      >
                        Suspend
                      </button>
                    )}
                    {chain.status === "suspended" && (
                      <button
                        onClick={() => s.updateChainStatus(chain.id, "active")}
                        className="flex-1 py-1.5 rounded-xl bg-white/10 border border-white/20 text-slate-300 text-xs font-bold"
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <GlassCard>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
            All Platform Users ({users.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-700 dark:text-slate-300">
              <thead className="border-b border-slate-200 dark:border-white/10 font-mono-data text-[10px] uppercase text-slate-500">
                <tr>
                  <th className="py-3 px-3 text-left">Name</th>
                  <th className="py-3 px-3 text-left">Email</th>
                  <th className="py-3 px-3 text-left">Role</th>
                  <th className="py-3 px-3 text-left">Status</th>
                  <th className="py-3 px-3 text-left">Joined</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{u.name}</td>
                    <td className="py-3 px-3 text-slate-500 font-mono-data">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 font-mono-data text-slate-700 dark:text-slate-300">
                        {u.role.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono-data ${u.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25" : u.status === "invited" ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/25" : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/25"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono-data text-slate-500">{u.joinedAt}</td>
                    <td className="py-3 px-3 text-right">
                      {u.status !== "suspended" ? (
                        <button
                          onClick={() => s.updateUserStatus(u.id, "suspended")}
                          className="text-[10px] px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold transition hover:bg-rose-200"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => s.updateUserStatus(u.id, "active")}
                          className="text-[10px] px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold transition"
                        >
                          Restore
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === "audit_logs" && (
        <GlassCard>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-slate-500" />
            Platform Audit Log ({auditLogs.length} recent events)
          </h3>
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-4">
                <div className="shrink-0">
                  {log.severity === "warn" ? <AlertCircle className="w-4 h-4 text-amber-500" /> :
                   log.severity === "critical" ? <AlertCircle className="w-4 h-4 text-red-500" /> :
                   <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">{log.action}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{log.actorName} → {log.targetName}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-[10px] font-mono-data text-slate-400 block">
                    {log.actorRole.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] font-mono-data text-slate-500 block mt-0.5">
                    {new Date(log.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* OTHER TABS */}
      {activeTab !== "dashboard" && activeTab !== "gym_chains" && activeTab !== "users" && activeTab !== "audit_logs" && (
        <GlassCard>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-5 h-5 text-slate-500" />
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white capitalize">
              {activeTab.replace(/_/g, " ")}
            </h3>
          </div>
          <p className="text-xs text-slate-500">Platform governance module for {activeTab.replace(/_/g, " ")}.</p>
        </GlassCard>
      )}
    </div>
  );
}
