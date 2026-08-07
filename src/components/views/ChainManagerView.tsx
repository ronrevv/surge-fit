"use client";

import React from "react";
import { GlassCard } from "../ui/GlassCard";
import { StatCard } from "../ui/StatCard";
import { useStore } from "@/lib/store/useStore";
import { Building2, TrendingUp, Dumbbell, Users, BarChart3, AlertCircle, CheckCircle2 } from "lucide-react";

interface ChainManagerViewProps {
  activeTab?: string;
}


export function ChainManagerView({ activeTab = "dashboard" }: ChainManagerViewProps) {
  const s = useStore();

  const session = s.getSession();
  const myChainId = session.chainId || s.getChains()[0]?.id || "";

  const branches = s.getBranchesByChain(myChainId);
  const chain = s.getChainById(myChainId);
  const chainStats = s.getChainStats(myChainId);
  const allUsers = s.getUsers();
  const trainers = allUsers.filter((u) => u.role === "trainer" && u.organizationId === myChainId);
  const trainees = allUsers.filter((u) => u.role === "trainee" && u.organizationId === myChainId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-slate-900 dark:text-white" />
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              Chain Operations Manager
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            {chain?.name} · {branches.length} branches · Overseeing all branch KPIs
          </p>
        </div>
      </div>

      {/* DASHBOARD */}
      {activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Managed Branches"
              value={`${branches.length} Locations`}
              change={`${branches.filter((b) => b.status === "active").length} active`}
              changeType="positive"
              icon={<Building2 className="w-4 h-4 text-slate-500" />}
              sparklineData={[8, 9, 10, 10, 11, 11, branches.length]}
            />
            <StatCard
              title="Total Trainers"
              value={`${chainStats.trainers} Staff`}
              change="Across all branches"
              changeType="positive"
              icon={<Dumbbell className="w-4 h-4 text-slate-500" />}
              sparklineData={[20, 25, 32, 38, 44, 50, chainStats.trainers]}
            />
            <StatCard
              title="Total Trainees"
              value={`${chainStats.trainees} Members`}
              change="Live count"
              changeType="positive"
              icon={<Users className="w-4 h-4 text-slate-500" />}
              sparklineData={[100, 200, 300, 400, 500, 600, chainStats.trainees]}
            />
            <StatCard
              title="Chain MRR"
              value={`$${(chain?.mrr || 0).toLocaleString()}`}
              change="Monthly recurring"
              changeType="positive"
              icon={<TrendingUp className="w-4 h-4 text-slate-500" />}
              sparklineData={[40, 50, 60, 65, 72, 78, (chain?.mrr || 0) / 1000]}
            />
          </div>

          {/* Branch Performance Matrix */}
          <GlassCard>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-slate-500" />
              Branch Operations & Performance Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-700 dark:text-slate-300">
                <thead className="border-b border-slate-200 dark:border-white/10 font-mono-data text-[10px] uppercase text-slate-500">
                  <tr>
                    <th className="py-3 px-3 text-left">Branch</th>
                    <th className="py-3 px-3 text-left">City</th>
                    <th className="py-3 px-3 text-left">Manager</th>
                    <th className="py-3 px-3 text-left">Trainers</th>
                    <th className="py-3 px-3 text-left">Trainees</th>
                    <th className="py-3 px-3 text-left">Capacity</th>
                    <th className="py-3 px-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {branches.map((branch) => {
                    const manager = branch.managerId ? s.getUserById(branch.managerId) : null;
                    const branchTrainers = s.getTrainersByBranch(branch.id);
                    const branchTrainees = s.getTraineesByBranch(branch.id);
                    const utilPct = Math.round(((branchTrainees.length + branchTrainers.length) / branch.capacity) * 100);
                    return (
                      <tr key={branch.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">{branch.name}</td>
                        <td className="py-3.5 px-3 text-slate-500">{branch.city}</td>
                        <td className="py-3.5 px-3 text-slate-500">{manager?.name || <span className="text-amber-500">Unassigned</span>}</td>
                        <td className="py-3.5 px-3 font-mono-data font-bold text-slate-900 dark:text-white">{branchTrainers.length}</td>
                        <td className="py-3.5 px-3 font-mono-data font-bold text-slate-900 dark:text-white">{branchTrainees.length}</td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full bg-slate-200 dark:bg-white/10">
                              <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${Math.min(100, utilPct)}%` }} />
                            </div>
                            <span className="font-mono-data text-slate-500">{utilPct}%</span>
                          </div>
                        </td>
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

          {/* Cross-branch Trainer Overview */}
          <GlassCard>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-4">
              Cross-Branch Trainer Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {trainers.map((t) => {
                const branch = t.branchId ? s.getBranchById(t.branchId) : null;
                const myTrainees = s.getTraineesByTrainer(t.id);
                return (
                  <div key={t.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{t.specialization}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono-data ${t.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"}`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-2">{branch?.name || "No branch"}</p>
                    <div className="flex justify-between text-center pt-2 border-t border-slate-200 dark:border-white/10">
                      <div><p className="font-bold font-mono-data text-slate-900 dark:text-white">{myTrainees.length}</p><p className="text-[10px] text-slate-500">Trainees</p></div>
                      <div><p className="font-bold font-mono-data text-slate-900 dark:text-white">{t.rating?.toFixed(1) || "—"} ★</p><p className="text-[10px] text-slate-500">Rating</p></div>
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
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-4">Branch Network ({branches.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {branches.map((branch) => {
              const manager = branch.managerId ? s.getUserById(branch.managerId) : null;
              const branchTrainers = s.getTrainersByBranch(branch.id);
              const branchTrainees = s.getTraineesByBranch(branch.id);
              return (
                <div key={branch.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <p className="font-bold text-slate-900 dark:text-white">{branch.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{branch.city}</p>
                  <div className="grid grid-cols-3 gap-2 text-center mt-3 pt-3 border-t border-slate-200 dark:border-white/10">
                    <div><p className="font-bold font-mono-data text-slate-900 dark:text-white">{branchTrainers.length}</p><p className="text-[10px] text-slate-500">Trainers</p></div>
                    <div><p className="font-bold font-mono-data text-slate-900 dark:text-white">{branchTrainees.length}</p><p className="text-[10px] text-slate-500">Trainees</p></div>
                    <div><p className="font-bold font-mono-data text-slate-900 dark:text-white">{branch.capacity}</p><p className="text-[10px] text-slate-500">Cap.</p></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Manager: <span className="font-semibold text-slate-700 dark:text-slate-300">{manager?.name || "Unassigned"}</span></p>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {activeTab !== "dashboard" && activeTab !== "branches" && (
        <GlassCard>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white capitalize mb-2">{activeTab.replace(/_/g, " ")}</h3>
          <p className="text-xs text-slate-500">Chain manager module for {activeTab.replace(/_/g, " ")}.</p>
        </GlassCard>
      )}
    </div>
  );
}
