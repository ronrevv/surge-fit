"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import { StatCard } from "../ui/StatCard";
import { WorkoutPlannerModal, PlannedExerciseItem } from "../planner/WorkoutPlannerModal";
import { DietPlannerModal } from "../planner/DietPlannerModal";
import { TrainingCalendarModal } from "../planner/TrainingCalendarModal";
import { useStore } from "@/lib/store/useStore";
import { useAssignPlanMutation } from "@/lib/hooks/usePlans";
import { AppUser, AssignedPlan } from "@/lib/store/orgStore";
import { MealItem } from "@/lib/data/exercises";
import {
  Dumbbell, Users, Calendar, Plus, Apple, TrendingUp, Search, Send,
  X, Check, Clock, CheckCircle2, UserPlus, Mail, Phone,
  ChevronRight, ClipboardList, Utensils, Trash2,
} from "lucide-react";

interface TrainerViewProps {
  activeTab?: string;
}


function OnboardTraineeModal({ trainerId, branchId, orgId, actorName, onClose }: {
  trainerId: string; branchId: string; orgId: string; actorName: string; onClose: () => void;
}) {
  const s = useStore();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", goal: "", weightKg: "70", heightCm: "170",
  });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const GOALS = [
    "Hypertrophy & Muscle Gain", "Fat Loss & Body Recomposition", "Powerlifting (1RM Peak)",
    "Athletic Performance", "Mobility & Flexibility", "General Fitness", "Weight Management",
    "Endurance & Cardio", "Post-Rehab Training",
  ];

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.goal) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    s.onboardTrainee({
      trainerId, branchId, organizationId: orgId, actorName,
      name: form.name, email: form.email, phone: form.phone,
      goal: form.goal, weightKg: Number(form.weightKg), heightCm: Number(form.heightCm),
    });
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
        className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#0c0c10] border border-white/15 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.025]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-slate-900 flex items-center justify-center"><UserPlus className="w-5 h-5" /></div>
            <div>
              <p className="font-extrabold text-white text-base">Onboard New Trainee</p>
              <p className="text-[11px] text-slate-500">Adds trainee to your client roster</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {done ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-400" />
            <p className="font-bold text-white text-lg">Trainee Added!</p>
            <p className="text-slate-500 text-sm text-center">{form.name} is now on your roster.<br />Assign a workout plan from the Workout Planner.</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1">Full Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Alex Johnson"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-white/25" />
              </div>
              <div>
                <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="client@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-white/25" />
              </div>
              <div>
                <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1">Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 000 0000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1">Primary Goal *</label>
                <select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none appearance-none">
                  <option value="">Select goal…</option>
                  {GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1">Body Weight (kg)</label>
                <input type="number" value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1">Height (cm)</label>
                <input type="number" value={form.heightCm} onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none" />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving || !form.name || !form.email || !form.goal}
              className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm transition disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {saving ? <><Clock className="w-4 h-4 animate-spin" /> Adding trainee…</> : <><Check className="w-4 h-4" /> Add to My Roster</>}
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}

/**
 * AssignPlanModal — lets trainer pick a trainee from their roster,
 * then calls store.assignPlan() to write the assignment to the store.
 * The trainee's dashboard will reflect this immediately.
 */
function AssignPlanModal({
  trainerId, trainees, plan, onClose,
}: {
  trainerId: string;
  trainees: AppUser[];
  plan: { title: string; summary: string; type: AssignedPlan["type"]; content?: any };
  onClose: () => void;
}) {
  const s = useStore();
  const assignPlanMutation = useAssignPlanMutation();
  const [selectedTraineeId, setSelectedTraineeId] = useState(trainees[0]?.id || "");
  const [done, setDone] = useState(false);

  const handleAssign = async () => {
    if (!selectedTraineeId) return;
    try {
      await assignPlanMutation.mutateAsync({ 
        trainer_id: trainerId, 
        trainee_id: selectedTraineeId, 
        type: plan.type as any,
        title: plan.title,
        summary: plan.summary,
        content: plan.content 
      });
      // Fallback local store update for instant UI response before DB settles
      s.assignPlan({ trainerId, traineeId: selectedTraineeId, ...plan });
      setDone(true);
      setTimeout(onClose, 1400);
    } catch (error) {
      console.error("Failed to assign plan", error);
    }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-md z-50" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0c0c10] border border-white/15 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.025]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-slate-900 flex items-center justify-center">
              {plan.type === "workout" ? <Dumbbell className="w-5 h-5" /> : plan.type === "diet" ? <Utensils className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-extrabold text-white text-base">Assign to Client</p>
              <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{plan.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {done ? (
          <div className="flex flex-col items-center justify-center py-14 gap-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-400" />
            <p className="font-bold text-white text-lg">Plan Assigned!</p>
            <p className="text-slate-400 text-sm text-center">
              <span className="text-white font-bold">{plan.title}</span><br />
              is now visible in {trainees.find(t => t.id === selectedTraineeId)?.name}&apos;s dashboard.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <div>
              <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-2">Select Trainee</label>
              {trainees.length === 0 ? (
                <p className="text-slate-500 text-sm italic">No trainees on your roster yet. Add one first.</p>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {trainees.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTraineeId(t.id)}
                      className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                        selectedTraineeId === t.id
                          ? "bg-white text-slate-900 border-transparent"
                          : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-[11px] opacity-60">{t.goal}</p>
                      </div>
                      {selectedTraineeId === t.id && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-[10px] font-mono-data text-slate-500 uppercase mb-1">Plan Details</p>
              <p className="font-bold text-white text-sm">{plan.title}</p>
              <p className="text-xs text-slate-400">{plan.summary}</p>
            </div>

            <button
              onClick={handleAssign}
              disabled={!selectedTraineeId || trainees.length === 0}
              className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm transition disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Assign Plan
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}

export function TrainerView({ activeTab = "dashboard" }: TrainerViewProps) {
  const s = useStore();
  const [selectedClient, setSelectedClient] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [workoutPlannerOpen, setWorkoutPlannerOpen] = useState(false);
  const [dietPlannerOpen, setDietPlannerOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [traineeModalOpen, setTraineeModalOpen] = useState(false);
  const [trainerChatInput, setTrainerChatInput] = useState("");
  const [trainerChatMessages, setTrainerChatMessages] = useState<any[]>([]);
  // Assign modal state: when set, shows a trainee picker for that plan
  const [assignModal, setAssignModal] = useState<{
    title: string; summary: string; type: AssignedPlan["type"]; content?: any;
  } | null>(null);

  // Live session
  const session = s.getSession();
  const myTrainerId = session.trainerId || s.getUsers().find((u) => u.role === "trainer" && u.status === "active")?.id || "";
  const myBranchId = session.branchId || "";
  const myOrgId = session.chainId || "";
  const myName = session.name || "Trainer";

  const myTrainees = s.getTraineesByTrainer(myTrainerId);
  const filteredTrainees = myTrainees.filter(
    (t) => t.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const activeClient = selectedClient
    ? s.getUserById(selectedClient)
    : myTrainees[0];

  const savedPlans = s.getTrainerSavedPlans(myTrainerId);
  const savedRoutines = savedPlans.filter(p => p.type === "workout").map(p => ({ title: p.title, exercises: p.content as PlannedExerciseItem[] }));
  const savedDietPlans = savedPlans.filter(p => p.type === "diet").map(p => ({ title: p.title, meals: p.content as MealItem[] }));

  const handleRoutineSaved = (routine: { title: string; exercises: PlannedExerciseItem[] }, assignToTraineeId?: string) => {
    s.saveTrainerPlan({
      trainerId: myTrainerId,
      type: "workout",
      title: routine.title,
      summary: `${routine.exercises.length} exercise${routine.exercises.length !== 1 ? "s" : ""}`,
      content: routine.exercises
    });
    if (assignToTraineeId) {
      s.assignPlan({
        trainerId: myTrainerId,
        traineeId: assignToTraineeId,
        type: "workout",
        title: routine.title,
        summary: `${routine.exercises.length} exercise${routine.exercises.length !== 1 ? "s" : ""}`,
        content: routine.exercises,
      });
    } else {
      setCalendarOpen(true);
    }
  };

  const handleDietPlanSaved = (plan: { title: string; meals: MealItem[] }, assignToTraineeId?: string) => {
    s.saveTrainerPlan({
      trainerId: myTrainerId,
      type: "diet",
      title: plan.title,
      summary: `${plan.meals.length} meal${plan.meals.length !== 1 ? "s" : ""}`,
      content: plan.meals
    });
    if (assignToTraineeId) {
      s.assignPlan({
        trainerId: myTrainerId,
        traineeId: assignToTraineeId,
        type: "diet",
        title: plan.title,
        summary: `${plan.meals.length} meal${plan.meals.length !== 1 ? "s" : ""}`,
        content: plan.meals,
      });
    } else {
      setCalendarOpen(true);
    }
  };

  const handleScheduleSaved = (entries: any[], assignToTraineeId?: string) => {
    if (assignToTraineeId) {
      s.assignPlan({
        trainerId: myTrainerId,
        traineeId: assignToTraineeId,
        type: "schedule",
        title: "Training Calendar",
        summary: `${entries.length} scheduled day${entries.length !== 1 ? "s" : ""}`,
        content: entries,
      });
    }
  };

  const handleSendChat = () => {
    if (!trainerChatInput.trim()) return;
    setTrainerChatMessages((prev) => [...prev, { sender: "trainer", text: trainerChatInput, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setTrainerChatInput("");
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {traineeModalOpen && (
          <OnboardTraineeModal
            trainerId={myTrainerId} branchId={myBranchId}
            orgId={myOrgId} actorName={myName}
            onClose={() => setTraineeModalOpen(false)}
          />
        )}
        {assignModal && (
          <AssignPlanModal
            trainerId={myTrainerId}
            trainees={myTrainees}
            plan={assignModal}
            onClose={() => setAssignModal(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-slate-900 dark:text-white" />
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              Trainer Command Hub
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            {myName} · {myTrainees.length} trainees active
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setTraineeModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-xs sm:text-sm transition">
            <UserPlus className="w-4 h-4" /><span>Add Trainee</span>
          </button>
          <button onClick={() => setWorkoutPlannerOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl surge-card text-slate-900 dark:text-white font-bold text-xs sm:text-sm transition">
            <Dumbbell className="w-4 h-4" /><span>Workout Planner</span>
          </button>
          <button onClick={() => setDietPlannerOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl surge-card text-slate-900 dark:text-white font-bold text-xs sm:text-sm transition">
            <Apple className="w-4 h-4" /><span>Diet Planner</span>
          </button>
          <button onClick={() => setCalendarOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-500/30 text-blue-600 dark:text-blue-300 font-bold text-xs sm:text-sm transition">
            <Calendar className="w-4 h-4" /><span>Calendar</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD */}
      {activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="My Client Roster" value={`${myTrainees.length} Trainees`} change="Live count" changeType="positive" icon={<Users className="w-4 h-4 text-slate-500" />} sparklineData={[1, 1, 2, 2, 3, 3, myTrainees.length]} />
            <StatCard title="Saved Routines" value={`${savedRoutines.length} Routines`} change={`${savedDietPlans.length} diet plans`} changeType="neutral" icon={<Dumbbell className="w-4 h-4 text-slate-500" />} sparklineData={[0, 0, 1, 1, 2, 2, savedRoutines.length]} />
            <StatCard title="Client PRs This Week" value="3 PRs" change="+1 new this session" changeType="positive" icon={<TrendingUp className="w-4 h-4 text-slate-500" />} sparklineData={[0, 1, 1, 2, 2, 3, 3]} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trainee Roster */}
            <GlassCard className="lg:col-span-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">My Trainees</h3>
                <button onClick={() => setTraineeModalOpen(true)} className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 hover:underline">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              {myTrainees.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <Users className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                  <p className="text-sm text-slate-500 font-semibold">No trainees yet</p>
                  <p className="text-xs text-slate-400 mt-1">Click "Add Trainee" to get started</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {myTrainees.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedClient(t.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer ${selectedClient === t.id || (!selectedClient && myTrainees[0]?.id === t.id) ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent" : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{t.name}</span>
                        <span className={`text-[10px] font-mono-data px-2 py-0.5 rounded-full ${t.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-xs opacity-70 mt-0.5">{t.goal}</p>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            {/* Trainee Detail */}
            <GlassCard className="lg:col-span-2">
              {activeClient ? (
                <>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-4">
                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">{activeClient.name}</h3>
                      <p className="text-xs text-slate-500">Goal: {activeClient.goal} · Weight: {activeClient.weightKg}kg · Height: {activeClient.heightCm}cm</p>
                    </div>
                    <span className="text-xs font-mono-data px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-white/10">
                      {activeClient.goal?.split(" ")[0] || "Custom"} Plan
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                      <span className="text-slate-500 uppercase font-mono-data text-[10px]">Body Weight</span>
                      <p className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">{activeClient.weightKg} kg</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                      <span className="text-slate-500 uppercase font-mono-data text-[10px]">Joined</span>
                      <p className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">{activeClient.joinedAt}</p>
                    </div>
                  </div>
                  {/* Live per-trainee assignments from store */}
                  {(() => {
                    const clientAssignments = activeClient ? s.getAssignmentsForTrainee(activeClient.id) : [];
                    return clientAssignments.length > 0 ? (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-3">
                        <p className="font-bold text-xs text-slate-700 dark:text-slate-200 mb-2">Assigned Plans</p>
                        <div className="flex flex-col gap-1.5">
                          {clientAssignments.map((a) => (
                            <div key={a.id} className="flex items-center justify-between gap-2">
                              <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
                                a.type === "workout"
                                  ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300"
                                  : a.type === "diet"
                                  ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                                  : "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300"
                              }`}>
                                {a.type === "workout" ? "💪" : a.type === "diet" ? "🥗" : "📅"} {a.title}
                              </span>
                              <button
                                onClick={() => s.removeAssignment(a.id)}
                                className="text-slate-400 hover:text-red-500 transition shrink-0"
                                title="Remove assignment"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 mb-3">
                        <p className="text-xs text-slate-400 text-center italic">No plans assigned yet</p>
                        <div className="flex gap-2 mt-2 justify-center">
                          <button
                            onClick={() => setAssignModal({ title: savedRoutines[0]?.title || "Workout", summary: `${savedRoutines[0]?.exercises?.length || 0} exercises`, type: "workout", content: savedRoutines[0]?.exercises })}
                            disabled={savedRoutines.length === 0}
                            className="text-[10px] px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold disabled:opacity-40"
                          >+ Assign Workout</button>
                          <button
                            onClick={() => setAssignModal({ title: savedDietPlans[0]?.title || "Diet Plan", summary: `${savedDietPlans[0]?.meals?.length || 0} meals`, type: "diet", content: savedDietPlans[0]?.meals })}
                            disabled={savedDietPlans.length === 0}
                            className="text-[10px] px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold disabled:opacity-40"
                          >+ Assign Diet</button>
                        </div>
                      </div>
                    );
                  })()}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail className="w-3.5 h-3.5" />{activeClient.email}
                    {activeClient.phone && <><Phone className="w-3.5 h-3.5 ml-2" />{activeClient.phone}</>}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Users className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3" />
                  <p className="text-slate-500 font-semibold">Select a trainee to view details</p>
                </div>
              )}
            </GlassCard>
          </div>
        </>
      )}

      {/* CLIENTS TAB */}
      {activeTab === "clients" && (
        <GlassCard>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Client Roster ({myTrainees.length})</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input value={clientSearch} onChange={(e) => setClientSearch(e.target.value)} placeholder="Search clients…"
                  className="pl-9 pr-3 py-1.5 text-xs rounded-xl surge-card text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none" />
              </div>
              <button onClick={() => setTraineeModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs">
                <UserPlus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-700 dark:text-slate-300">
              <thead className="border-b border-slate-200 dark:border-white/10 font-mono-data text-[10px] uppercase text-slate-500">
                <tr>
                  <th className="py-3 px-3 text-left">Name</th>
                  <th className="py-3 px-3 text-left">Goal</th>
                  <th className="py-3 px-3 text-left">Weight</th>
                  <th className="py-3 px-3 text-left">Email</th>
                  <th className="py-3 px-3 text-left">Status</th>
                  <th className="py-3 px-3 text-left">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredTrainees.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{t.name}</td>
                    <td className="py-3 px-3 text-slate-500">{t.goal}</td>
                    <td className="py-3 px-3 font-mono-data text-slate-900 dark:text-white">{t.weightKg} kg</td>
                    <td className="py-3 px-3 text-slate-500 font-mono-data">{t.email}</td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono-data border ${t.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25" : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300"}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono-data text-slate-500">{t.joinedAt}</td>
                  </tr>
                ))}
                {filteredTrainees.length === 0 && (
                  <tr><td colSpan={6} className="py-12 text-center text-slate-500 text-sm">No trainees found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* WORKOUT BUILDER TAB */}
      {activeTab === "workout_builder" && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <Dumbbell className="w-5 h-5" /> Workout Builder
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {savedRoutines.length} saved routine{savedRoutines.length !== 1 ? "s" : ""} ready to assign
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setWorkoutPlannerOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm">
                <Plus className="w-4 h-4" /> New Routine
              </button>
              <button onClick={() => setCalendarOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-300 font-bold text-sm">
                <Calendar className="w-4 h-4" /> Schedule
              </button>
            </div>
          </div>

          {savedRoutines.length === 0 ? (
            <GlassCard>
              <div className="flex flex-col items-center py-14 text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                  <Dumbbell className="w-7 h-7 text-slate-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">No routines saved yet</p>
                  <p className="text-xs text-slate-500 mt-1">Use the Workout Planner to build & save your first routine</p>
                </div>
                <button onClick={() => setWorkoutPlannerOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm">
                  <Plus className="w-4 h-4" /> Open Workout Planner
                </button>
              </div>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {savedRoutines.map((routine, i) => (
                <GlassCard key={i} hoverEffect className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shrink-0">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono-data px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                      {routine.exercises.length} exercises
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-base text-slate-900 dark:text-white">{routine.title}</p>
                    <div className="mt-2 space-y-1">
                      {routine.exercises.slice(0, 3).map((ex, j) => (
                        <p key={j} className="text-xs text-slate-500 truncate">• {ex.exercise.name} — {ex.sets}×{ex.reps}</p>
                      ))}
                      {routine.exercises.length > 3 && (
                        <p className="text-xs text-slate-400">+{routine.exercises.length - 3} more exercises</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                    <button
                      onClick={() => setAssignModal({
                        title: routine.title,
                        summary: `${routine.exercises.length} exercise${routine.exercises.length !== 1 ? "s" : ""}`,
                        type: "workout",
                        content: routine.exercises,
                      })}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
                    >
                      <Users className="w-3.5 h-3.5" /> Assign to Client
                    </button>
                    <button
                      onClick={() => setWorkoutPlannerOpen(true)}
                      className="flex items-center justify-center p-2 rounded-xl surge-card text-slate-600 dark:text-slate-300"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              ))}
              {/* Add new card */}
              <GlassCard
                hoverEffect
                className="flex flex-col items-center justify-center gap-3 cursor-pointer min-h-[180px] border-dashed"
              >
                <button onClick={() => setWorkoutPlannerOpen(true)} className="flex flex-col items-center gap-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition">
                  <div className="w-10 h-10 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/20 flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold">New Routine</span>
                </button>
              </GlassCard>
            </div>
          )}
        </div>
      )}

      {/* CHAT TAB */}
      {activeTab === "chat" && (
        <GlassCard>
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-4">Client Messenger — {activeClient?.name || "Select a client"}</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
            {trainerChatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "trainer" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm ${msg.sender === "trainer" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"}`}>
                  <p>{msg.text}</p>
                  <span className="text-[10px] opacity-50 mt-1 block">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={trainerChatInput} onChange={(e) => setTrainerChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendChat()} placeholder={`Message ${activeClient?.name || "client"}...`}
              className="flex-1 px-4 py-2.5 text-sm rounded-xl surge-card text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none" />
            <button onClick={handleSendChat} className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm"><Send className="w-4 h-4" /></button>
          </div>
        </GlassCard>
      )}

      {/* CALENDAR TAB */}
      {activeTab === "calendar" && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Training Calendar
              </h3>
              <p className="text-xs text-slate-500 mt-1">Weekly schedule for all client assignments</p>
            </div>
            <button onClick={() => setCalendarOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm">
              <Calendar className="w-4 h-4" /> Open Full Calendar
            </button>
          </div>

          {/* Weekly schedule grid */}
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              const hasWorkout = savedRoutines.length > 0 && [0, 2, 4].includes(i);
              const hasDiet = savedDietPlans.length > 0;
              const isToday = i === 0;
              return (
                <div
                  key={day}
                  className={`p-3 rounded-xl border flex flex-col gap-2 sm:min-h-[120px] ${
                    isToday
                      ? "bg-slate-900 dark:bg-white border-transparent"
                      : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
                  }`}
                >
                  <span className={`text-[11px] font-mono-data font-bold uppercase ${
                    isToday ? "text-slate-300 dark:text-slate-600" : "text-slate-400"
                  }`}>
                    {day}
                  </span>
                  {hasWorkout && (
                    <div className={`text-[10px] font-semibold px-1.5 py-1 rounded-lg truncate ${
                      isToday ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900" : "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300"
                    }`}>
                      💪 {savedRoutines[i % savedRoutines.length]?.title || "Workout"}
                    </div>
                  )}
                  {hasDiet && (
                    <div className={`text-[10px] font-semibold px-1.5 py-1 rounded-lg truncate ${
                      isToday ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900" : "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                    }`}>
                      🥗 {savedDietPlans[0]?.title || "Diet Plan"}
                    </div>
                  )}
                  {!hasWorkout && !hasDiet && (
                    <span className={`text-[10px] ${
                      isToday ? "text-slate-400 dark:text-slate-600" : "text-slate-400"
                    }`}>
                      Rest Day
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Assignment summary */}
          <GlassCard>
            <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white mb-3">Client Assignment Summary</h4>
            {myTrainees.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">No trainees yet — add trainees and assign plans to see the schedule here.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-slate-700 dark:text-slate-300 min-w-[400px]">
                  <thead className="border-b border-slate-200 dark:border-white/10 font-mono-data text-[10px] uppercase text-slate-500">
                    <tr>
                      <th className="py-2 px-3 text-left">Client</th>
                      <th className="py-2 px-3 text-left">Workout Plan</th>
                      <th className="py-2 px-3 text-left">Diet Plan</th>
                      <th className="py-2 px-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {myTrainees.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{t.name}</td>
                        <td className="py-2.5 px-3">
                          {savedRoutines.length > 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold text-[10px]">
                              {savedRoutines[0].title}
                            </span>
                          ) : <span className="text-slate-400">—</span>}
                        </td>
                        <td className="py-2.5 px-3">
                          {savedDietPlans.length > 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold text-[10px]">
                              {savedDietPlans[0].title}
                            </span>
                          ) : <span className="text-slate-400">—</span>}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/25 font-mono-data text-[10px]">
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* NUTRITION TAB */}
      {activeTab === "nutrition" && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <Utensils className="w-5 h-5" /> Nutrition Plans
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {savedDietPlans.length} diet plan{savedDietPlans.length !== 1 ? "s" : ""} saved
              </p>
            </div>
            <button onClick={() => setDietPlannerOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm">
              <Plus className="w-4 h-4" /> New Diet Plan
            </button>
          </div>

          {savedDietPlans.length === 0 ? (
            <GlassCard>
              <div className="flex flex-col items-center py-14 text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                  <Utensils className="w-7 h-7 text-slate-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">No diet plans saved yet</p>
                  <p className="text-xs text-slate-500 mt-1">Use the Diet Planner to build and assign nutrition plans to your clients</p>
                </div>
                <button onClick={() => setDietPlannerOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm">
                  <Plus className="w-4 h-4" /> Open Diet Planner
                </button>
              </div>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {savedDietPlans.map((plan, i) => (
                <GlassCard key={i} hoverEffect className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono-data px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                      {plan.meals.length} meals
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-base text-slate-900 dark:text-white">{plan.title}</p>
                    <div className="mt-2 space-y-1">
                      {plan.meals.slice(0, 3).map((meal, j) => (
                        <p key={j} className="text-xs text-slate-500 truncate">• {meal.name} — {meal.calories} kcal</p>
                      ))}
                      {plan.meals.length > 3 && (
                        <p className="text-xs text-slate-400">+{plan.meals.length - 3} more meals</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                    <button
                      onClick={() => setAssignModal({
                        title: plan.title,
                        summary: `${plan.meals.length} meal${plan.meals.length !== 1 ? "s" : ""} · ${plan.meals.reduce((a, m) => a + m.calories, 0).toLocaleString()} kcal`,
                        type: "diet",
                        content: plan.meals,
                      })}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                    >
                      <Users className="w-3.5 h-3.5" /> Assign to Client
                    </button>
                    <button
                      onClick={() => setDietPlannerOpen(true)}
                      className="flex items-center justify-center p-2 rounded-xl surge-card text-slate-600 dark:text-slate-300"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              ))}
              <GlassCard hoverEffect className="flex flex-col items-center justify-center gap-3 cursor-pointer min-h-[180px] border-dashed">
                <button onClick={() => setDietPlannerOpen(true)} className="flex flex-col items-center gap-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition">
                  <div className="w-10 h-10 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/20 flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold">New Diet Plan</span>
                </button>
              </GlassCard>
            </div>
          )}
        </div>
      )}

      {activeTab !== "dashboard" && activeTab !== "clients" && activeTab !== "workout_builder" && activeTab !== "chat" && activeTab !== "calendar" && activeTab !== "nutrition" && activeTab !== "progress" && (
        <GlassCard>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white capitalize mb-2">{activeTab.replace(/_/g, " ")}</h3>
          <p className="text-xs text-slate-500">Trainer module for {activeTab.replace(/_/g, " ")}.</p>
        </GlassCard>
      )}

      {/* Planner Modals */}
      <WorkoutPlannerModal trainees={myTrainees} isOpen={workoutPlannerOpen} onClose={() => setWorkoutPlannerOpen(false)} onRoutineSaved={handleRoutineSaved} />
      <DietPlannerModal trainees={myTrainees} isOpen={dietPlannerOpen} onClose={() => setDietPlannerOpen(false)} onPlanSaved={handleDietPlanSaved} />
      <TrainingCalendarModal trainees={myTrainees} isOpen={calendarOpen} onClose={() => setCalendarOpen(false)}
        onOpenWorkoutPlanner={() => { setCalendarOpen(false); setWorkoutPlannerOpen(true); }}
        onOpenDietPlanner={() => { setCalendarOpen(false); setDietPlannerOpen(true); }}
        savedRoutines={savedRoutines} savedDietPlans={savedDietPlans}
        onScheduleSaved={handleScheduleSaved}
      />
    </div>
  );
}
