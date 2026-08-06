"use client";

import React, { useState } from "react";
import { GlassCard } from "../ui/GlassCard";
import { StatCard } from "../ui/StatCard";
import {
  ShieldCheck,
  Building2,
  Users,
  Cpu,
  Plus,
  Search,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
} from "lucide-react";

interface SuperAdminViewProps {
  activeTab?: string;
}

export function SuperAdminView({ activeTab = "dashboard" }: SuperAdminViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-slate-800 dark:text-slate-200" />
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              Super Admin OS
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Global governance • Active View: <span className="font-bold uppercase font-mono-data text-slate-900 dark:text-white">{activeTab.replace("_", " ")}</span>
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-sm transition">
          <Plus className="w-4 h-4" />
          <span>Onboard Gym Chain</span>
        </button>
      </div>

      {activeTab === "dashboard" && (
        <>
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Platform ARR"
              value="$2,480,000"
              change="+18.4% YoY"
              changeType="positive"
              icon={<TrendingUp className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
              sparklineData={[30, 42, 48, 55, 62, 70, 85]}
            />

            <StatCard
              title="Active Gym Chains"
              value="142 Chains"
              change="12 Pending"
              changeType="neutral"
              icon={<Building2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
              sparklineData={[100, 108, 115, 122, 130, 138, 142]}
            />

            <StatCard
              title="Total Active Users"
              value="384,120"
              change="+2,410 this week"
              changeType="positive"
              icon={<Users className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
              sparklineData={[320, 335, 350, 362, 370, 378, 384]}
            />

            <StatCard
              title="AI Token Consumption"
              value="14.2M Tokens"
              subtitle="Gemini 3.6 Flash / Pro"
              icon={<Cpu className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
              sparklineData={[5, 7, 9, 11, 12, 13.5, 14.2]}
            />
          </div>

          {/* Governance Table & Live Security Log Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Gym Chain Governance Queue
                </h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Filter chains..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs rounded-xl surge-card text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none w-36 sm:w-48"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <thead className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono-data text-[11px] uppercase">
                    <tr>
                      <th className="py-3 px-3">Organization</th>
                      <th className="py-3 px-3">Type</th>
                      <th className="py-3 px-3">Branches</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {[
                      { name: "MetroFit Fitness Labs", type: "Enterprise Chain", branches: 24, status: "Active" },
                      { name: "Apex Athletics Group", type: "Enterprise Chain", branches: 45, status: "Pending Approval" },
                      { name: "Iron Vault Performance", type: "Regional Chain", branches: 8, status: "Active" },
                      { name: "Velocity Sports Club", type: "Franchise", branches: 12, status: "Suspended" },
                    ]
                      .filter((row) => row.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                          <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-500" />
                            {row.name}
                          </td>
                          <td className="py-3 px-3 text-slate-500">{row.type}</td>
                          <td className="py-3 px-3 font-mono-data text-slate-900 dark:text-white">{row.branches}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-data border ${
                                row.status === "Active"
                                  ? "bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white border-slate-200 dark:border-white/10"
                                  : row.status === "Pending Approval"
                                  ? "bg-amber-50 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-500/30"
                                  : "bg-rose-50 text-rose-900 dark:bg-rose-500/20 dark:text-rose-300 border-rose-200 dark:border-rose-500/30"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-semibold text-slate-900 dark:text-white transition">
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {/* Audit Security Log Feed */}
            <GlassCard className="lg:col-span-1">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-white/10">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-500" />
                  Live Platform Audit Log
                </h3>
                <span className="text-[10px] font-mono-data text-slate-400">RLS Active</span>
              </div>

              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {[
                  { event: "Tenant Provisioned", desc: "MetroFit added Branch #25", time: "2m ago", status: "ok" },
                  { event: "RLS Audit Passed", desc: "Isolated query check passed", time: "14m ago", status: "ok" },
                  { event: "Token Threshold Warning", desc: "Apex Chain reached 80% quota", time: "1h ago", status: "warn" },
                  { event: "Role Modification", desc: "Admin promoted user #482", time: "3h ago", status: "ok" },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                      <span>{item.event}</span>
                      <span className="text-[10px] font-mono-data text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </>
      )}

      {activeTab !== "dashboard" && (
        <GlassCard>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white capitalize">
              Super Admin Module: {activeTab.replace("_", " ")}
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Enterprise RBAC governance module active for {activeTab.replace("_", " ")}. Manage global settings, tenant database isolation, and API token billing thresholds.
          </p>
        </GlassCard>
      )}
    </div>
  );
}
