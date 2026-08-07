"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import { StatCard } from "../ui/StatCard";
import { useStore } from "@/lib/store/useStore";
import {
  Building2, Users, Activity, Wrench, Plus, X, Check, Clock,
  CheckCircle2, Dumbbell, UserPlus, Search, Phone, Mail,
} from "lucide-react";

interface BranchManagerViewProps {
  activeTab?: string;
}

// In production, branchId & actorName come from auth session
const MY_BRANCH_ID = "branch_001";
const MY_ORG_ID = "chain_001";
const MY_NAME = "James Harrington";

function OnboardTrainerModal({ branchId, orgId, actorName, onClose }: {
  branchId: string; orgId: string; actorName: string; onClose: () => void;
}) {
  const s = useStore();
  const [form, setForm] = useState({ name: "", email: "", phone: "", specialization: "" });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const SPECIALIZATIONS = [
    "Powerlifting & Strength", "HIIT & Conditioning", "Hypertrophy & Nutrition",
    "Mobility & Recovery", "CrossFit", "Sports Performance", "Weight Loss & Body Composition",
    "Yoga & Flexibility", "Athletic Training",
  ];

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.specialization) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    s.onboardTrainer({ branchId, organizationId: orgId, actorName, ...form });
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
            <div className="w-9 h-9 rounded-xl bg-white text-slate-900 flex items-center justify-center"><UserPlus className="w-5 h-5" /></div>
            <div>
              <p className="font-extrabold text-white text-base">Onboard Trainer</p>
              <p className="text-[11px] text-slate-500">Adds trainer to your branch roster</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {done ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-400" />
            <p className="font-bold text-white text-lg">Trainer Onboarded!</p>
            <p className="text-slate-500 text-sm text-center">Invite sent to {form.email}<br />Status: Pending acceptance</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", key: "name", placeholder: "e.g. Coach Mike Johnson", type: "text" },
                { label: "Email", key: "email", placeholder: "coach@gym.com", type: "email" },
                { label: "Phone", key: "phone", placeholder: "+1 (555) 000-0000", type: "tel" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key} className={key === "name" ? "sm:col-span-2" : ""}>
                  <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1">{label} {key !== "phone" && "*"}</label>
                  <input
                    type={type} value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-white/25"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1">Specialization *</label>
                <select
                  value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none appearance-none"
                >
                  <option value="">Select specialization…</option>
                  {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving || !form.name || !form.email || !form.specialization}
              className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm transition disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {saving ? <><Clock className="w-4 h-4 animate-spin" /> Sending invite…</> : <><Check className="w-4 h-4" /> Onboard & Send Invite</>}
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}

export function BranchManagerView({ activeTab = "dashboard" }: BranchManagerViewProps) {
  const s = useStore();
  const [trainerModalOpen, setTrainerModalOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");

  const branch = s.getBranchById(MY_BRANCH_ID);
  const trainers = s.getTrainersByBranch(MY_BRANCH_ID);
  const trainees = s.getTraineesByBranch(MY_BRANCH_ID);
  const allMembers = s.getUsersByBranch(MY_BRANCH_ID).filter((u) => u.role !== "branch_manager");

  const filteredMembers = allMembers.filter(
    (m) => m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
            m.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {trainerModalOpen && (
          <OnboardTrainerModal
            branchId={MY_BRANCH_ID}
            orgId={MY_ORG_ID}
            actorName={MY_NAME}
            onClose={() => setTrainerModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-slate-900 dark:text-white" />
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              Branch Manager Portal
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            {branch?.name || "Branch"} · {trainers.length} trainers · {trainees.length} trainees · Capacity: {branch?.capacity}
          </p>
        </div>
        <button
          onClick={() => setTrainerModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-sm shadow-sm transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Onboard Trainer</span>
        </button>
      </div>

      {/* DASHBOARD */}
      {activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Trainers"
              value={`${trainers.filter((t) => t.status === "active").length} Active`}
              change={`${trainers.filter((t) => t.status === "invited").length} pending invite`}
              changeType="positive"
              icon={<Dumbbell className="w-4 h-4 text-slate-500" />}
              sparklineData={[6, 7, 8, 9, 10, 11, trainers.length]}
            />
            <StatCard
              title="Total Trainees"
              value={`${trainees.length} Members`}
              change="Live count"
              changeType="positive"
              icon={<Users className="w-4 h-4 text-slate-500" />}
              sparklineData={[50, 100, 150, 200, 250, 300, trainees.length]}
            />
            <StatCard
              title="Branch Capacity"
              value={`${branch?.capacity || 0} Max`}
              change={`${trainees.length + trainers.length} occupied`}
              changeType="neutral"
              icon={<Building2 className="w-4 h-4 text-slate-500" />}
              sparklineData={[200, 250, 300, 350, 400, 450, branch?.capacity || 0]}
            />
            <StatCard
              title="Equipment Health"
              value="98% OK"
              change="1 unit in service"
              changeType="neutral"
              icon={<Wrench className="w-4 h-4 text-slate-500" />}
              sparklineData={[99, 99, 98, 98, 98, 98, 98]}
            />
          </div>

          {/* Trainer Cards */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-slate-500" />
                Branch Trainer Roster ({trainers.length})
              </h3>
              <button
                onClick={() => setTrainerModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white hover:underline"
              >
                <UserPlus className="w-3.5 h-3.5" /> Add Trainer
              </button>
            </div>
            {trainers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Dumbbell className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3" />
                <p className="text-slate-500 font-semibold text-sm">No trainers yet</p>
                <p className="text-slate-400 text-xs mt-1">Click "Onboard Trainer" to add your first trainer</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {trainers.map((t) => {
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
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-3">
                        <Mail className="w-3 h-3" /> {t.email}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center pt-3 border-t border-slate-200 dark:border-white/10">
                        <div>
                          <p className="font-bold font-mono-data text-slate-900 dark:text-white">{myTrainees.length}</p>
                          <p className="text-[10px] text-slate-500">Trainees</p>
                        </div>
                        <div>
                          <p className="font-bold font-mono-data text-slate-900 dark:text-white">{t.rating?.toFixed(1) || "—"} ★</p>
                          <p className="text-[10px] text-slate-500">Rating</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </>
      )}

      {/* TRAINERS TAB */}
      {activeTab === "trainers" && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Trainer Management ({trainers.length})</h3>
            <button onClick={() => setTrainerModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs">
              <UserPlus className="w-3.5 h-3.5" /> Onboard Trainer
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-700 dark:text-slate-300">
              <thead className="border-b border-slate-200 dark:border-white/10 font-mono-data text-[10px] uppercase text-slate-500">
                <tr>
                  <th className="py-3 px-3 text-left">Trainer</th>
                  <th className="py-3 px-3 text-left">Email</th>
                  <th className="py-3 px-3 text-left">Specialization</th>
                  <th className="py-3 px-3 text-left">Trainees</th>
                  <th className="py-3 px-3 text-left">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {trainers.map((t) => {
                  const myTrainees = s.getTraineesByTrainer(t.id);
                  return (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{t.name}</td>
                      <td className="py-3 px-3 text-slate-500 font-mono-data">{t.email}</td>
                      <td className="py-3 px-3 text-slate-500">{t.specialization}</td>
                      <td className="py-3 px-3 font-mono-data font-bold text-slate-900 dark:text-white">{myTrainees.length}</td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono-data border ${t.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25" : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300"}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => s.updateUserStatus(t.id, t.status === "active" ? "suspended" : "active")}
                          className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-bold transition hover:bg-slate-200"
                        >
                          {t.status === "active" ? "Suspend" : "Restore"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* MEMBERS TAB */}
      {activeTab === "members" && (
        <GlassCard>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Branch Member Database ({allMembers.length})
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text" placeholder="Search members…" value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl surge-card text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-700 dark:text-slate-300">
              <thead className="border-b border-slate-200 dark:border-white/10 font-mono-data text-[10px] uppercase text-slate-500">
                <tr>
                  <th className="py-3 px-3 text-left">Name</th>
                  <th className="py-3 px-3 text-left">Role</th>
                  <th className="py-3 px-3 text-left">Email</th>
                  <th className="py-3 px-3 text-left">Goal / Spec.</th>
                  <th className="py-3 px-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{m.name}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 font-mono-data">
                        {m.role.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono-data">{m.email}</td>
                    <td className="py-3 px-3 text-slate-500">{m.goal || m.specialization || "—"}</td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono-data border ${m.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25" : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300"}`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* OTHER TABS */}
      {activeTab !== "dashboard" && activeTab !== "trainers" && activeTab !== "members" && (
        <GlassCard>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white capitalize mb-2">
            {activeTab.replace(/_/g, " ")}
          </h3>
          <p className="text-xs text-slate-500">Branch Manager module for {activeTab.replace(/_/g, " ")}.</p>
        </GlassCard>
      )}
    </div>
  );
}
