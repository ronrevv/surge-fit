"use client";

import React, { useState } from "react";
import { GlassCard } from "../ui/GlassCard";
import { StatCard } from "../ui/StatCard";
import {
  Building2,
  Users,
  Activity,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Calendar,
  DollarSign,
  Search,
  Plus,
} from "lucide-react";

interface BranchManagerViewProps {
  activeTab?: string;
}

export function BranchManagerView({ activeTab = "dashboard" }: BranchManagerViewProps) {
  const [memberSearch, setMemberSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-slate-900 dark:text-white" />
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              Branch Manager Portal
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Downtown Flagship Branch • Active Module: <span className="font-bold uppercase font-mono-data text-slate-900 dark:text-white">{activeTab.replace("_", " ")}</span>
          </p>
        </div>
      </div>

      {activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Live Floor Check-Ins"
              value="184 On Floor"
              change="74% Peak Capacity"
              changeType="positive"
              icon={<Activity className="w-4 h-4 text-slate-500" />}
              sparklineData={[120, 140, 160, 175, 180, 184, 184]}
            />
            <StatCard
              title="Today's Visits"
              value="1,240 Check-ins"
              change="+120 vs yesterday"
              changeType="positive"
              icon={<Users className="w-4 h-4 text-slate-500" />}
              sparklineData={[980, 1050, 1120, 1180, 1200, 1240, 1240]}
            />
            <StatCard
              title="Active Floor Trainers"
              value="12 On Shift"
              subtitle="100% Coverage"
              icon={<Building2 className="w-4 h-4 text-slate-500" />}
              sparklineData={[8, 10, 12, 12, 12, 12, 12]}
            />
            <StatCard
              title="Equipment Health"
              value="98% Operational"
              change="1 Cable Tower Servicing"
              changeType="neutral"
              icon={<Wrench className="w-4 h-4 text-slate-500" />}
              sparklineData={[99, 99, 98, 98, 98, 98, 98]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-slate-500" />
                  Facility & Equipment Health
                </h3>
                <span className="text-xs font-mono-data text-slate-500">All Systems Operational</span>
              </div>

              <div className="space-y-2">
                {[
                  { item: "Hammer Strength Squat Racks (x6)", status: "Optimal", time: "Inspected 2d ago" },
                  { item: "Concept2 Rowers (x8)", status: "Optimal", time: "Inspected yesterday" },
                  { item: "Cable Crossover Tower #3", status: "Scheduled Service", time: "Technician 3PM" },
                ].map((eq, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{eq.item}</p>
                      <p className="text-slate-500 text-[11px]">{eq.time}</p>
                    </div>
                    <span className="font-mono-data font-bold text-slate-900 dark:text-white">{eq.status}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-3">Today's Class Schedule</h3>
              <div className="space-y-2">
                {[
                  { title: "HIIT Surge Circuit", time: "07:00 AM", instructor: "Coach Dave", enrolled: "20/20 Full" },
                  { title: "Powerlifting Fundamentals", time: "11:00 AM", instructor: "Coach Sarah", enrolled: "14/15" },
                  { title: "Mobility & Recovery Flow", time: "05:30 PM", instructor: "Coach Maya", enrolled: "18/20" },
                ].map((cls, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{cls.title}</p>
                      <p className="text-slate-500 text-[11px]">{cls.time} • {cls.instructor}</p>
                    </div>
                    <span className="font-mono-data font-bold text-slate-900 dark:text-white px-2 py-1 rounded-lg bg-slate-200 dark:bg-white/10">{cls.enrolled}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </>
      )}

      {activeTab === "members" && (
        <GlassCard>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Branch Member Database & Access Roster</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search members..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl surge-card text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <thead className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono-data text-[11px] uppercase">
                <tr>
                  <th className="py-3 px-3">Member Name</th>
                  <th className="py-3 px-3">Tier</th>
                  <th className="py-3 px-3">Last Check-in</th>
                  <th className="py-3 px-3">Access Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {[
                  { name: "Sarah Jenkins", tier: "All-Access VIP", checkin: "10 mins ago", status: "Active" },
                  { name: "Marcus Brody", tier: "Branch Unlimited", checkin: "1 hour ago", status: "Active" },
                  { name: "David Chen", tier: "Off-Peak Pass", checkin: "Yesterday", status: "Active" },
                ]
                  .filter((m) => m.name.toLowerCase().includes(memberSearch.toLowerCase()))
                  .map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">{row.name}</td>
                      <td className="py-3.5 px-3 text-slate-500">{row.tier}</td>
                      <td className="py-3.5 px-3 font-mono-data text-slate-500">{row.checkin}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-data border bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white border-slate-200 dark:border-white/10">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {activeTab !== "dashboard" && activeTab !== "members" && (
        <GlassCard>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white capitalize mb-2">
            Branch Manager Module: {activeTab.replace("_", " ")}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Dedicated branch operations view for {activeTab.replace("_", " ")}. Manage turnstiles, staff shifts, maintenance logs, and daily cash drawers.
          </p>
        </GlassCard>
      )}
    </div>
  );
}
