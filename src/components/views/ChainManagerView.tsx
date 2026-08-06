"use client";

import React from "react";
import { GlassCard } from "../ui/GlassCard";
import { StatCard } from "../ui/StatCard";
import { Building2, BarChart3, TrendingUp, Dumbbell, Users } from "lucide-react";

interface ChainManagerViewProps {
  activeTab?: string;
}

export function ChainManagerView({ activeTab = "dashboard" }: ChainManagerViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-slate-900 dark:text-white" />
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              Chain Operations Manager
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Regional operations • Active Module: <span className="font-bold uppercase font-mono-data text-slate-900 dark:text-white">{activeTab.replace("_", " ")}</span>
          </p>
        </div>
      </div>

      {activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Managed Branches"
              value="12 Locations"
              subtitle="3 Regional Clusters"
              icon={<Building2 className="w-4 h-4 text-slate-500" />}
              sparklineData={[10, 10, 11, 11, 12, 12, 12]}
            />
            <StatCard
              title="Avg Trainer Utilization"
              value="88.4%"
              change="+4.2% efficiency"
              changeType="positive"
              icon={<Dumbbell className="w-4 h-4 text-slate-500" />}
              sparklineData={[80, 82, 84, 85, 86, 87.5, 88.4]}
            />
            <StatCard
              title="Regional Member Churn"
              value="2.1%"
              change="Optimal (<5% Target)"
              changeType="positive"
              icon={<TrendingUp className="w-4 h-4 text-slate-500" />}
              sparklineData={[3.5, 3.1, 2.8, 2.5, 2.3, 2.2, 2.1]}
            />
          </div>

          <GlassCard>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-4">Branch Operations & Performance Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <thead className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono-data text-[11px] uppercase">
                  <tr>
                    <th className="py-3 px-3">Branch Location</th>
                    <th className="py-3 px-3">Daily Attendance</th>
                    <th className="py-3 px-3">Trainer Staff</th>
                    <th className="py-3 px-3">Retention Rate</th>
                    <th className="py-3 px-3 text-right">Performance Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {[
                    { name: "Downtown Flagship", attendance: "1,240 check-ins", trainers: 18, retention: "96.4%", score: "98/100" },
                    { name: "Westside Hub", attendance: "940 check-ins", trainers: 14, retention: "94.1%", score: "92/100" },
                    { name: "North District", attendance: "780 check-ins", trainers: 10, retention: "91.8%", score: "88/100" },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">{row.name}</td>
                      <td className="py-3.5 px-3 font-mono-data text-slate-500">{row.attendance}</td>
                      <td className="py-3.5 px-3 font-mono-data text-slate-500">{row.trainers}</td>
                      <td className="py-3.5 px-3 font-mono-data font-bold text-slate-900 dark:text-white">{row.retention}</td>
                      <td className="py-3.5 px-3 text-right font-mono-data font-bold text-slate-900 dark:text-white">{row.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </>
      )}

      {activeTab !== "dashboard" && (
        <GlassCard>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white capitalize mb-2">
            Chain Manager Module: {activeTab.replace("_", " ")}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Regional operations management for {activeTab.replace("_", " ")}. Benchmark branch KPIs, track trainer retention rates, and generate regional growth reports.
          </p>
        </GlassCard>
      )}
    </div>
  );
}
