"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import { StatCard } from "../ui/StatCard";
import { WorkoutPlannerModal, PlannedExerciseItem } from "../planner/WorkoutPlannerModal";
import { DietPlannerModal } from "../planner/DietPlannerModal";
import { TrainingCalendarModal } from "../planner/TrainingCalendarModal";
import { useStore } from "@/lib/store/useStore";
import { useAssignPlanMutation, useAssignScheduleMutation, useSaveTrainerPlanMutation, useTrainerSavedPlans, useTrainerAssignments } from "@/lib/hooks/usePlans";
import { useMyClients, useAddClientMutation, useLookupByEmail, useInviteTraineeMutation, ClientProfile } from "@/lib/hooks/useClients";
import { useAssignRoleMutation } from "@/lib/hooks/useRoleAssignments";
import { supabase } from "@/lib/supabase/client";
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


/**
 * AddClientModal — looks up a SurgeFit user by email and adds them
 * to the trainer's roster in trainer_clients (Supabase). 
 * Shows a warning if no client yet when opening planners.
 */
function AddClientModal({
  trainerId, trainerName, onClose, onAdded,
}: {
  trainerId: string; trainerName: string; onClose: () => void; onAdded: () => void;
}) {
  const lookupMutation = useLookupByEmail();
  const addClientMutation = useAddClientMutation();
  const inviteMutation = useInviteTraineeMutation();
  const assignRoleMutation = useAssignRoleMutation();
  const [emailInput, setEmailInput] = useState("");
  const [goal, setGoal] = useState("");
  const [found, setFound] = useState<{ id: string; full_name: string; email: string; role: string } | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [done, setDone] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const GOALS = [
    "Hypertrophy & Muscle Gain", "Fat Loss & Body Recomposition", "Powerlifting (1RM Peak)",
    "Athletic Performance", "Mobility & Flexibility", "General Fitness",
    "Weight Management", "Endurance & Cardio", "Post-Rehab Training",
  ];

  const handleSearch = async () => {
    if (!emailInput.trim()) return;
    setNotFound(false);
    setFound(null);
    setError(null);
    const result = await lookupMutation.mutateAsync(emailInput);
    if (!result) {
      setNotFound(true);
    } else if (result.role !== "trainee") {
      setError(`This user is a "${result.role}" — only trainees can be added to your roster.`);
    } else {
      setFound(result);
    }
  };

  const handleAdd = async () => {
    if (!found || !trainerId) return;
    try {
      await addClientMutation.mutateAsync({
        trainer_id: trainerId,
        client_id: found.id,
        client_name: found.full_name,
        client_email: found.email,
        goal: goal || undefined,
      });
      // Write role_assignment so trainee login shows "Assigned by [Trainer]"
      await assignRoleMutation.mutateAsync({
        user_id: found.id,
        role: "trainee",
        assigned_by: trainerId,
        assigned_by_role: "trainer",
        assigned_by_name: trainerName,
      });
      setDone(true);
      setTimeout(() => { onAdded(); onClose(); }, 1400);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleInvite = async () => {
    if (!emailInput.trim() || !trainerId) return;
    try {
      setError(null);
      await inviteMutation.mutateAsync({
        email: emailInput,
        inviterId: trainerId,
      });
      setInviteSent(true);
      setTimeout(() => { onClose(); }, 2000);
    } catch (err: any) {
      setError(err.message);
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
            <div className="w-9 h-9 rounded-xl bg-white text-slate-900 flex items-center justify-center"><UserPlus className="w-5 h-5" /></div>
            <div>
              <p className="font-extrabold text-white text-base">Add Client to Roster</p>
              <p className="text-[11px] text-slate-500">Search by their SurgeFit email</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {done ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-400" />
            <p className="font-bold text-white text-lg">{found?.full_name} Added!</p>
            <p className="text-slate-500 text-sm text-center">They're now on your roster.<br />You can assign plans to them.</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* Email search */}
            <div>
              <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1">Trainee's SurgeFit Email *</label>
              <div className="flex gap-2">
                <input
                  type="email" value={emailInput}
                  onChange={(e) => { setEmailInput(e.target.value); setFound(null); setNotFound(false); setError(null); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="athlete@surgefit.com"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-white/30"
                />
                <button
                  onClick={handleSearch}
                  disabled={lookupMutation.isPending}
                  className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition disabled:opacity-50"
                >
                  {lookupMutation.isPending ? <Clock className="w-4 h-4 animate-spin" /> : "Search"}
                </button>
              </div>
            </div>

            {/* Error / not found */}
            {notFound && !inviteSent && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm font-semibold text-amber-400 mb-2">User not found</p>
                <p className="text-xs text-amber-300/80 mb-3">
                  This user doesn't have a SurgeFit account yet. You can invite them via email to sign up and join your roster.
                </p>
                <button
                  onClick={handleInvite}
                  disabled={inviteMutation.isPending}
                  className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {inviteMutation.isPending ? (
                    <><Clock className="w-4 h-4 animate-spin" /> Sending Invite…</>
                  ) : (
                    <><Mail className="w-4 h-4" /> Send Invite</>
                  )}
                </button>
              </div>
            )}
            {inviteSent && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-emerald-400">Invite Sent!</p>
                <p className="text-xs text-emerald-300/80 mt-1">An invitation email has been sent to {emailInput}.</p>
              </div>
            )}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">{error}</div>
            )}

            {/* Found profile */}
            {found && (
              <>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                    {found.full_name?.[0] ?? "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{found.full_name}</p>
                    <p className="text-[11px] text-slate-400">{found.email}</p>
                  </div>
                  <span className="ml-auto text-[10px] uppercase font-mono-data text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">trainee</span>
                </div>

                <div>
                  <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1">Primary Goal (optional)</label>
                  <select value={goal} onChange={(e) => setGoal(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none appearance-none">
                    <option value="">Select goal…</option>
                    {GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={addClientMutation.isPending}
                  className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm transition disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {addClientMutation.isPending ? <><Clock className="w-4 h-4 animate-spin" /> Adding…</> : <><Check className="w-4 h-4" /> Add to My Roster</>}
                </button>
              </>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
}

/**
 * AssignPlanModal — trainer picks a trainee from their REAL DB roster,
 * then writes ONE row to assigned_plans via useAssignPlanMutation.
 */
function AssignPlanModal({
  trainerId, clients, plan, onClose, onNeedClient,
}: {
  trainerId: string;
  clients: ClientProfile[];
  plan: { title: string; summary: string; type: "workout" | "diet" | "schedule"; content?: any };
  onClose: () => void;
  onNeedClient: () => void;
}) {
  const assignMutation = useAssignPlanMutation();
  const assignScheduleMutation = useAssignScheduleMutation();
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.client_id || "");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedClient = clients.find(c => c.client_id === selectedClientId);

  const handleAssign = async () => {
    if (!selectedClientId || !trainerId) return;
    setError(null);
    try {
      if (plan.type === "schedule") {
        await assignScheduleMutation.mutateAsync({
          trainer_id: trainerId,
          trainee_id: selectedClientId,
          entries: plan.content,
        });
      } else {
        await assignMutation.mutateAsync({
          trainer_id: trainerId,
          trainee_id: selectedClientId,
          type: plan.type,
          title: plan.title,
          summary: plan.summary,
          content: plan.content ?? {},
        });
      }
      setDone(true);
      setTimeout(onClose, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to assign plan.");
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
              is now visible in {selectedClient?.client_name}&apos;s dashboard.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* No clients guard */}
            {clients.length === 0 ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto">
                  <UserPlus className="w-6 h-6 text-amber-400" />
                </div>
                <p className="text-white font-semibold">No clients on your roster yet</p>
                <p className="text-slate-500 text-sm">Add a client first before assigning plans.</p>
                <button
                  onClick={() => { onClose(); onNeedClient(); }}
                  className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition"
                >
                  + Add Client Now
                </button>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-2">Select Client</label>
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {clients.map((c) => (
                      <button
                        key={c.client_id}
                        onClick={() => setSelectedClientId(c.client_id)}
                        className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                          selectedClientId === c.client_id
                            ? "bg-white text-slate-900 border-transparent"
                            : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-sm">{c.client_name}</p>
                          <p className="text-[11px] opacity-60">{c.goal || c.client_email}</p>
                        </div>
                        {selectedClientId === c.client_id && <Check className="w-4 h-4 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-mono-data text-slate-500 uppercase mb-1">Plan Details</p>
                  <p className="font-bold text-white text-sm">{plan.title}</p>
                  <p className="text-xs text-slate-400">{plan.summary}</p>
                </div>

                {error && <p className="text-rose-400 text-xs">{error}</p>}

                <button
                  onClick={handleAssign}
                  disabled={!selectedClientId || assignMutation.isPending}
                  className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm transition disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {assignMutation.isPending
                    ? <><Clock className="w-4 h-4 animate-spin" /> Assigning…</>
                    : <><Check className="w-4 h-4" /> Assign Plan</>}
                </button>
              </>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
}

export function TrainerView({ activeTab = "dashboard" }: TrainerViewProps) {
  const s = useStore();
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [workoutPlannerOpen, setWorkoutPlannerOpen] = useState(false);
  const [dietPlannerOpen, setDietPlannerOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [addClientModalOpen, setAddClientModalOpen] = useState(false);
  const [trainerChatInput, setTrainerChatInput] = useState("");
  const [trainerChatMessages, setTrainerChatMessages] = useState<any[]>([]);
  const [assignModal, setAssignModal] = useState<{
    title: string; summary: string; type: "workout" | "diet" | "schedule"; content?: any;
  } | null>(null);

  // Live session (orgStore — for display names)
  const session = s.getSession();
  const myBranchId = session.branchId || "";
  const myOrgId = session.chainId || "";
  const myName = session.name || "Trainer";

  // Real Supabase UUID — required for valid trainer_id in assigned_plans
  const [realTrainerId, setRealTrainerId] = useState<string>("");
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) setRealTrainerId(data.user.id);
    });
  }, []);

  // Real DB client list from trainer_clients table
  const { data: myClients = [], refetch: refetchClients } = useMyClients(realTrainerId);
  const filteredClients = myClients.filter(
    (c) => c.client_name.toLowerCase().includes(clientSearch.toLowerCase()) ||
           c.client_email.toLowerCase().includes(clientSearch.toLowerCase())
  );
  const activeClient = selectedClientId
    ? myClients.find(c => c.client_id === selectedClientId)
    : myClients[0];

  // Real DB trainer plan templates
  const savePlanMutation = useSaveTrainerPlanMutation();
  const { data: dbSavedPlans = [] } = useTrainerSavedPlans(realTrainerId);
  const savedRoutines = dbSavedPlans.filter(p => p.type === "workout");
  const savedDietPlans = dbSavedPlans.filter(p => p.type === "diet");

  const handleRoutineSaved = async (routine: { title: string; exercises: PlannedExerciseItem[] }, assignToClientId?: string) => {
    const effectiveId = realTrainerId;
    if (!effectiveId) return;
    const summary = `${routine.exercises.length} exercise${routine.exercises.length !== 1 ? "s" : ""}`;
    // Save as template to DB
    await savePlanMutation.mutateAsync({
      trainer_id: effectiveId,
      type: "workout",
      title: routine.title,
      summary,
      content: routine.exercises,
    });
    // If a client was selected in the planner, immediately assign
    if (assignToClientId) {
      setAssignModal({ title: routine.title, summary, type: "workout", content: routine.exercises });
    } else {
      setAssignModal({ title: routine.title, summary, type: "workout", content: routine.exercises });
    }
  };

  const handleDietPlanSaved = async (plan: { title: string; meals: MealItem[] }, assignToClientId?: string) => {
    const effectiveId = realTrainerId;
    if (!effectiveId) return;
    const summary = `${plan.meals.length} meal${plan.meals.length !== 1 ? "s" : ""}`;
    await savePlanMutation.mutateAsync({
      trainer_id: effectiveId,
      type: "diet",
      title: plan.title,
      summary,
      content: plan.meals,
    });
    setAssignModal({ title: plan.title, summary, type: "diet", content: plan.meals });
  };

  const handleScheduleSaved = (entries: any[], assignToClientId?: string) => {
    const effectiveId = realTrainerId;
    if (!effectiveId) return;
    const summary = `${entries.length} scheduled day${entries.length !== 1 ? "s" : ""}`;
    setAssignModal({ title: "Training Calendar", summary, type: "schedule", content: entries });
  };

  const handleSendChat = () => {
    if (!trainerChatInput.trim()) return;
    setTrainerChatMessages((prev) => [...prev, { sender: "trainer", text: trainerChatInput, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setTrainerChatInput("");
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {addClientModalOpen && (
          <AddClientModal
            trainerId={realTrainerId}
            trainerName={myName}
            onClose={() => setAddClientModalOpen(false)}
            onAdded={() => refetchClients()}
          />
        )}
        {assignModal && (
          <AssignPlanModal
            trainerId={realTrainerId}
            clients={myClients}
            plan={assignModal}
            onClose={() => setAssignModal(null)}
            onNeedClient={() => setAddClientModalOpen(true)}
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
            {myName} · {myClients.length} clients active
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setAddClientModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-xs sm:text-sm transition">
            <UserPlus className="w-4 h-4" /><span>Add Client</span>
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
            <StatCard title="My Client Roster" value={`${myClients.length} Clients`} change="Live count" changeType="positive" icon={<Users className="w-4 h-4 text-slate-500" />} sparklineData={[1, 1, 2, 2, 3, 3, myClients.length]} />
            <StatCard title="Saved Templates" value={`${savedRoutines.length} Routines`} change={`${savedDietPlans.length} diet plans`} changeType="neutral" icon={<Dumbbell className="w-4 h-4 text-slate-500" />} sparklineData={[0, 0, 1, 1, 2, 2, savedRoutines.length]} />
            <StatCard title="Client PRs This Week" value="3 PRs" change="+1 new this session" changeType="positive" icon={<TrendingUp className="w-4 h-4 text-slate-500" />} sparklineData={[0, 1, 1, 2, 2, 3, 3]} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trainee Roster */}
            <GlassCard className="lg:col-span-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">My Clients</h3>
                <button onClick={() => setAddClientModalOpen(true)} className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 hover:underline">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              {myClients.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <Users className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                  <p className="text-sm text-slate-500 font-semibold">No clients yet</p>
                  <p className="text-xs text-slate-400 mt-1">Click "Add Client" to get started</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {myClients.map((c) => (
                    <div
                      key={c.client_id}
                      onClick={() => setSelectedClientId(c.client_id)}
                      className={`p-3 rounded-xl border transition cursor-pointer ${selectedClientId === c.client_id || (!selectedClientId && myClients[0]?.client_id === c.client_id) ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent" : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{c.client_name}</span>
                        <span className="text-[10px] font-mono-data px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">active</span>
                      </div>
                      <p className="text-xs opacity-70 mt-0.5">{c.goal || c.client_email}</p>
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
                      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">{activeClient.client_name}</h3>
                      <p className="text-xs text-slate-500">{activeClient.goal && `Goal: ${activeClient.goal} · `}Email: {activeClient.client_email}</p>
                    </div>
                    <span className="text-xs font-mono-data px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-white/10">
                      {activeClient.goal?.split(" ")[0] || "Custom"} Plan
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {activeClient.weight_kg && (
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                        <span className="text-slate-500 uppercase font-mono-data text-[10px]">Body Weight</span>
                        <p className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">{activeClient.weight_kg} kg</p>
                      </div>
                    )}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                      <span className="text-slate-500 uppercase font-mono-data text-[10px]">Added On</span>
                      <p className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">{new Date(activeClient.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {/* Quick-assign shortcuts */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 mb-3">
                    <p className="text-xs text-slate-500 mb-2 font-semibold">Quick Assign Plans</p>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setWorkoutPlannerOpen(true)}
                        className="text-[10px] px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold flex items-center gap-1"
                      >
                        <Dumbbell className="w-3 h-3" /> Workout Plan
                      </button>
                      <button
                        onClick={() => setDietPlannerOpen(true)}
                        className="text-[10px] px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1"
                      >
                        <Apple className="w-3 h-3" /> Diet Plan
                      </button>
                      <button
                        onClick={() => setCalendarOpen(true)}
                        className="text-[10px] px-3 py-1.5 rounded-lg bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 font-bold flex items-center gap-1"
                      >
                        <Calendar className="w-3 h-3" /> Schedule
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail className="w-3.5 h-3.5" />{activeClient.client_email}
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
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Client Roster ({myClients.length})</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input value={clientSearch} onChange={(e) => setClientSearch(e.target.value)} placeholder="Search clients…"
                  className="pl-9 pr-3 py-1.5 text-xs rounded-xl surge-card text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none" />
              </div>
              <button onClick={() => setAddClientModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs">
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
                {filteredClients.map((c) => (
                  <tr key={c.client_id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{c.client_name}</td>
                    <td className="py-3 px-3 text-slate-500">{c.goal || "—"}</td>
                    <td className="py-3 px-3 font-mono-data text-slate-900 dark:text-white">{c.weight_kg ? `${c.weight_kg} kg` : "—"}</td>
                    <td className="py-3 px-3 text-slate-500 font-mono-data">{c.client_email}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono-data border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25">
                        active
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono-data text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {filteredClients.length === 0 && (
                  <tr><td colSpan={6} className="py-12 text-center text-slate-500 text-sm">No clients found</td></tr>
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
              {savedRoutines.map((routine, i) => {
                const exercises = (routine.content as any[]) || [];
                return (
                  <GlassCard key={i} hoverEffect className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shrink-0">
                        <Dumbbell className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono-data px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                        {exercises.length} exercises
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-base text-slate-900 dark:text-white">{routine.title}</p>
                      <div className="mt-2 space-y-1">
                        {exercises.slice(0, 3).map((ex: any, j: number) => (
                          <p key={j} className="text-xs text-slate-500 truncate">• {ex.exercise?.name ?? ex.name} — {ex.sets}×{ex.reps}</p>
                        ))}
                        {exercises.length > 3 && (
                          <p className="text-xs text-slate-400">+{exercises.length - 3} more exercises</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                      <button
                        onClick={() => setAssignModal({
                          title: routine.title,
                          summary: `${exercises.length} exercise${exercises.length !== 1 ? "s" : ""}`,
                          type: "workout",
                          content: exercises,
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
                );
              })}
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
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-4">Client Messenger — {activeClient?.client_name || "Select a client"}</h3>
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
            <input value={trainerChatInput} onChange={(e) => setTrainerChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendChat()} placeholder={`Message ${activeClient?.client_name || "client"}...`}
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
            {myClients.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">No clients yet — add clients and assign plans to see the schedule here.</p>
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
                    {myClients.map((c) => (
                      <tr key={c.client_id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{c.client_name}</td>
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
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/25 font-mono-data text-[10px]">active</span>
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
              {savedDietPlans.map((plan, i) => {
                const meals = (plan.content as any[]) || [];
                const totalKcal = meals.reduce((a: number, m: any) => a + (m.calories ?? 0), 0);
                return (
                  <GlassCard key={i} hoverEffect className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono-data px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                        {meals.length} meals
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-base text-slate-900 dark:text-white">{plan.title}</p>
                      <div className="mt-2 space-y-1">
                        {meals.slice(0, 3).map((meal: any, j: number) => (
                          <p key={j} className="text-xs text-slate-500 truncate">• {meal.name} — {meal.calories} kcal</p>
                        ))}
                        {meals.length > 3 && (
                          <p className="text-xs text-slate-400">+{meals.length - 3} more meals</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                      <button
                        onClick={() => setAssignModal({
                          title: plan.title,
                          summary: `${meals.length} meal${meals.length !== 1 ? "s" : ""} · ${totalKcal.toLocaleString()} kcal`,
                          type: "diet",
                          content: meals,
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
                );
              })}
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
      <WorkoutPlannerModal trainees={[]} isOpen={workoutPlannerOpen} onClose={() => setWorkoutPlannerOpen(false)} onRoutineSaved={handleRoutineSaved} />
      <DietPlannerModal trainees={[]} isOpen={dietPlannerOpen} onClose={() => setDietPlannerOpen(false)} onPlanSaved={handleDietPlanSaved} />
      <TrainingCalendarModal trainees={[]} isOpen={calendarOpen} onClose={() => setCalendarOpen(false)}
        onOpenWorkoutPlanner={() => { setCalendarOpen(false); setWorkoutPlannerOpen(true); }}
        onOpenDietPlanner={() => { setCalendarOpen(false); setDietPlannerOpen(true); }}
        savedRoutines={savedRoutines.map(r => ({ title: r.title, exercises: (r.content as any[]) || [] }))}
        savedDietPlans={savedDietPlans.map(p => ({ title: p.title, meals: (p.content as any[]) || [] }))}
        onScheduleSaved={handleScheduleSaved}
      />
    </div>
  );
}
