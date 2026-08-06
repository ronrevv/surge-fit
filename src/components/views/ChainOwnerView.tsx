"use client";

import React, { useState } from "react";
import { GlassCard } from "../ui/GlassCard";
import { StatCard } from "../ui/StatCard";
import { Building2, DollarSign, Users, Dumbbell, Plus, TrendingUp } from "lucide-react";

interface ChainOwnerViewProps {
  activeTab?: string;
}

export function ChainOwnerView({ activeTab = "dashboard" }: ChainOwnerViewProps) {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-slate-900 dark:text-white" />
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              Gym Chain Owner Portal
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Enterprise revenue command • Active Module: <span className="font-bold uppercase font-mono-data text-slate-900 dark:text-white">{activeTab.replace("_", " ")}</span>
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-sm transition">
          <Plus className="w-4 h-4" />
          <span>Create New Branch</span>
        </button>
      </div>

      {activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Monthly Chain Revenue"
              value="$428,500"
              change="+14.2% vs last month"
              changeType="positive"
              icon={<DollarSign className="w-4 h-4 text-slate-500" />}
              sparklineData={[340, 360, 380, 395, 410, 420, 428.5]}
            />
            <StatCard
              title="Active Gym Branches"
              value="12 Locations"
              subtitle="98.2% capacity"
              icon={<Building2 className="w-4 h-4 text-slate-500" />}
              sparklineData={[10, 10, 11, 11, 12, 12, 12]}
            />
            <StatCard
              title="Chain Memberships"
              value="18,450"
              change="+840 new joins"
              changeType="positive"
              icon={<Users className="w-4 h-4 text-slate-500" />}
              sparklineData={[15, 16, 16.8, 17.2, 17.8, 18.1, 18.45]}
            />
            <StatCard
              title="Active Trainers"
              value="86 Staff"
              subtitle="Avg 4.9 ★ Rating"
              icon={<Dumbbell className="w-4 h-4 text-slate-500" />}
              sparklineData={[70, 74, 78, 80, 82, 85, 86]}
            />
          </div>

          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Branch Network & Revenue Leaderboard
              </h3>
              <span className="text-xs font-mono-data font-bold text-slate-900 dark:text-white">Realtime Supabase Sync</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { location: "Downtown Flagship Branch", manager: "Alex Vance", revenue: "$84,200/mo", members: 3420, trend: "+16%" },
                { location: "Westside High-Performance Center", manager: "Marcus Thorne", revenue: "$68,900/mo", members: 2890, trend: "+12%" },
                { location: "North District Fitness Hub", manager: "Elena Rostova", revenue: "$52,100/mo", members: 2150, trend: "+9%" },
              ].map((branch, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 transition group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white group-hover:underline">{branch.location}</span>
                    <span className="text-xs font-mono-data font-bold text-slate-900 dark:text-white">{branch.trend}</span>
                  </div>
                  <p className="text-xs text-slate-500">Manager: {branch.manager}</p>
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono-data text-slate-900 dark:text-white font-bold">{branch.revenue}</span>
                    <span className="text-slate-500">{branch.members} Members</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </>
      )}

      {activeTab !== "dashboard" && (
        <GlassCard>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white capitalize mb-2">
            Chain Owner Module: {activeTab.replace("_", " ")}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Enterprise chain command view for {activeTab.replace("_", " ")}. Configure revenue models, expand branch locations, manage membership pricing tiers, and launch marketing funnels.
          </p>
        </GlassCard>
      )}
    </div>
  );
}
