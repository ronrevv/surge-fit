"use client";

import React, { useState } from "react";
import { GlassCard } from "../ui/GlassCard";
import { StatCard } from "../ui/StatCard";
import { WorkoutPlannerModal, PlannedExerciseItem } from "../planner/WorkoutPlannerModal";
import { DietPlannerModal } from "../planner/DietPlannerModal";
import { TrainingCalendarModal } from "../planner/TrainingCalendarModal";
import { EXERCISE_DATABASE } from "@/lib/data/exercises";
import { MealItem } from "@/lib/data/exercises";
import {
  Dumbbell,
  Users,
  Calendar,
  Plus,
  Apple,
  TrendingUp,
  Search,
  Send,
} from "lucide-react";

interface TrainerViewProps {
  activeTab?: string;
}

export function TrainerView({ activeTab = "dashboard" }: TrainerViewProps) {
  const [selectedClient, setSelectedClient] = useState("Sarah Jenkins");
  const [clientSearch, setClientSearch] = useState("");
  const [workoutPlannerOpen, setWorkoutPlannerOpen] = useState(false);
  const [dietPlannerOpen, setDietPlannerOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Saved plans state — shared across planner → calendar
  const [savedRoutines, setSavedRoutines] = useState<{ title: string; exercises: PlannedExerciseItem[] }[]>([]);
  const [savedDietPlans, setSavedDietPlans] = useState<{ title: string; meals: MealItem[] }[]>([]);

  // Chat State
  const [trainerChatInput, setTrainerChatInput] = useState("");
  const [trainerChatMessages, setTrainerChatMessages] = useState([
    { sender: "client", text: "Coach, completed today's Push session! Hit a 95kg Bench PR.", time: "09:14 AM" },
    { sender: "trainer", text: "Boom! Exceptional execution Sarah. Let's increase target to 97.5kg next week.", time: "09:16 AM" },
  ]);

  const handleSendTrainerChat = () => {
    if (!trainerChatInput.trim()) return;
    setTrainerChatMessages((prev) => [
      ...prev,
      { sender: "trainer", text: trainerChatInput, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setTrainerChatInput("");
  };

  // When workout planner saves, cache the routine and open calendar
  const handleRoutineSaved = (routine: { title: string; exercises: PlannedExerciseItem[] }) => {
    setSavedRoutines((prev) => [...prev.filter((r) => r.title !== routine.title), routine]);
    setCalendarOpen(true);
  };

  // When diet planner saves, cache and open calendar
  const handleDietPlanSaved = (plan: { title: string; meals: MealItem[] }) => {
    setSavedDietPlans((prev) => [...prev.filter((p) => p.title !== plan.title), plan]);
    setCalendarOpen(true);
  };

  return (
    <div className="space-y-6">
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
            Module:{" "}
            <span className="font-bold uppercase font-mono-data text-slate-900 dark:text-white">
              {activeTab.replace(/_/g, " ")}
            </span>
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setWorkoutPlannerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-sm transition"
          >
            <Dumbbell className="w-4 h-4" />
            <span>Workout Planner</span>
          </button>
          <button
            onClick={() => setDietPlannerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl surge-card text-slate-900 dark:text-white font-bold text-xs sm:text-sm transition"
          >
            <Apple className="w-4 h-4" />
            <span>Diet Planner</span>
          </button>
          <button
            onClick={() => setCalendarOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-500/30 text-blue-600 dark:text-blue-300 font-bold text-xs sm:text-sm transition hover:bg-blue-500/20"
          >
            <Calendar className="w-4 h-4" />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      {/* ── COMMAND CENTER ── */}
      {activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="Active Client Roster"
              value="24 Athletes"
              change="100% check-in rate"
              changeType="positive"
              icon={<Users className="w-4 h-4 text-slate-500" />}
              sparklineData={[18, 20, 21, 22, 23, 24, 24]}
            />
            <StatCard
              title="Today's Sessions"
              value="6 Sessions"
              change="4 Done · 2 Upcoming"
              changeType="neutral"
              icon={<Calendar className="w-4 h-4 text-slate-500" />}
              sparklineData={[4, 5, 6, 5, 7, 6, 6]}
            />
            <StatCard
              title="Client PR Hit Rate"
              value="14 PRs"
              change="+3 PRs logged this week"
              changeType="positive"
              icon={<TrendingUp className="w-4 h-4 text-slate-500" />}
              sparklineData={[5, 7, 9, 10, 12, 13, 14]}
            />
          </div>

          {/* Exercise GIF Library Preview */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-slate-500" />
                Exercise GIF Library — {EXERCISE_DATABASE.length.toLocaleString()} Animated Exercises
              </h3>
              <button
                onClick={() => setWorkoutPlannerOpen(true)}
                className="text-xs font-mono-data font-bold text-slate-900 dark:text-white underline"
              >
                Browse All →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {EXERCISE_DATABASE.slice(0, 6).map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => setWorkoutPlannerOpen(true)}
                  className="cursor-pointer p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 transition group"
                >
                  <div className="aspect-square w-full rounded-lg overflow-hidden bg-black/40 mb-2">
                    <img src={ex.gifUrl} alt={ex.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="font-bold text-[10px] text-slate-900 dark:text-white truncate">{ex.name}</p>
                  <p className="text-[9px] text-slate-500 font-mono-data mt-0.5">{ex.category}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client Roster */}
            <GlassCard className="lg:col-span-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Client Roster</h3>
                <span className="text-xs font-mono-data text-slate-500">24 Total</span>
              </div>
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {[
                  { name: "Sarah Jenkins", goal: "Hypertrophy & Strength", streak: "14 Days" },
                  { name: "Marcus Brody", goal: "Fat Loss & Conditioning", streak: "21 Days" },
                  { name: "Elena Rostova", goal: "Powerlifting (1RM Peak)", streak: "8 Days" },
                  { name: "David Chen", goal: "Mobility & Endurance", streak: "30 Days" },
                ].map((client, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedClient(client.name)}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      selectedClient === client.name
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{client.name}</span>
                      <span className="text-[10px] font-mono-data px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10">
                        ⚡ {client.streak}
                      </span>
                    </div>
                    <p className="text-xs opacity-75 mt-1">{client.goal}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Client Detail Panel */}
            <GlassCard className="lg:col-span-2">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">{selectedClient}</h3>
                  <p className="text-xs text-slate-500">Goal: Hypertrophy & Strength · Target: +3kg Muscle Mass</p>
                </div>
                <span className="text-xs font-mono-data px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-white/10">
                  4-Day Upper/Lower
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                  <span className="text-slate-500 uppercase font-mono-data text-[10px]">Squat 1RM</span>
                  <p className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">140 kg (+10kg)</p>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono-data text-[11px] mt-1 block">New Personal Record!</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                  <span className="text-slate-500 uppercase font-mono-data text-[10px]">Macro Compliance</span>
                  <p className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">94% Target</p>
                  <span className="text-slate-500 text-[11px] mt-1 block">Avg 165g Protein / Day</span>
                </div>
              </div>

              {/* Saved Plans Summary */}
              {(savedRoutines.length > 0 || savedDietPlans.length > 0) && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-4">
                  <p className="font-bold text-xs text-slate-900 dark:text-white mb-2">Saved Plans for {selectedClient}</p>
                  <div className="flex flex-wrap gap-2">
                    {savedRoutines.map((r, i) => (
                      <span key={i} className="text-[10px] px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold flex items-center gap-1">
                        <Dumbbell className="w-2.5 h-2.5" /> {r.title}
                      </span>
                    ))}
                    {savedDietPlans.map((p, i) => (
                      <span key={i} className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                        <Apple className="w-2.5 h-2.5" /> {p.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300">
                <p className="font-bold text-slate-900 dark:text-white mb-1">Today's Note for {selectedClient}</p>
                {selectedClient} hit a 140kg Squat PR today. Fatigue indicates lower back tightness — swap Heavy RDLs for Lying Leg Curls (4×12) & add 10-minute Psoas stretch flow.
              </div>
            </GlassCard>
          </div>
        </>
      )}

      {/* ── CLIENT ROSTER TAB ── */}
      {activeTab === "clients" && (
        <GlassCard>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Full Client Roster & Biometric Trackers
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search clients..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl surge-card text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <thead className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono-data text-[11px] uppercase">
                <tr>
                  <th className="py-3 px-3">Athlete Name</th>
                  <th className="py-3 px-3">Goal</th>
                  <th className="py-3 px-3">Squat 1RM</th>
                  <th className="py-3 px-3">Bench 1RM</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {[
                  { name: "Sarah Jenkins", goal: "Hypertrophy", squat: "140 kg", bench: "95 kg", status: "Completed Today" },
                  { name: "Marcus Brody", goal: "Fat Loss", squat: "160 kg", bench: "110 kg", status: "Check-in Sent" },
                  { name: "Elena Rostova", goal: "Powerlifting", squat: "185 kg", bench: "120 kg", status: "Workout Active" },
                  { name: "David Chen", goal: "Mobility", squat: "120 kg", bench: "85 kg", status: "Rest Day" },
                ]
                  .filter((c) => c.name.toLowerCase().includes(clientSearch.toLowerCase()))
                  .map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">{row.name}</td>
                      <td className="py-3.5 px-3 text-slate-500">{row.goal}</td>
                      <td className="py-3.5 px-3 font-mono-data font-bold text-slate-900 dark:text-white">{row.squat}</td>
                      <td className="py-3.5 px-3 font-mono-data font-bold text-slate-900 dark:text-white">{row.bench}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-data border bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white border-slate-200 dark:border-white/10">
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-semibold text-slate-900 dark:text-white transition">
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* ── WORKOUT BUILDER TAB — opens Workout Planner Modal ── */}
      {activeTab === "workout_builder" && (
        <GlassCard>
          <div className="flex flex-col items-center justify-center py-16 text-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-xl">
              <Dumbbell className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">Workout Builder</h3>
              <p className="text-slate-500 text-sm mt-1">
                Browse {EXERCISE_DATABASE.length.toLocaleString()} animated exercises, build routines with sets/reps/rest, then schedule them in the calendar.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setWorkoutPlannerOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-sm shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                Open Workout Planner
              </button>
              <button
                onClick={() => setCalendarOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-300 font-bold text-sm transition hover:bg-blue-500/20"
              >
                <Calendar className="w-4 h-4" />
                View Calendar
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* ── NUTRITION TAB ── */}
      {activeTab === "nutrition" && (
        <GlassCard>
          <div className="flex flex-col items-center justify-center py-16 text-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Apple className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">Nutrition & Diet Planner</h3>
              <p className="text-slate-500 text-sm mt-1">
                Set daily macro targets, build meal plans from the library, then schedule them into the training calendar.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDietPlannerOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                Open Diet Planner
              </button>
              <button
                onClick={() => setCalendarOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-300 font-bold text-sm transition hover:bg-blue-500/20"
              >
                <Calendar className="w-4 h-4" />
                View Calendar
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* ── CALENDAR TAB ── */}
      {activeTab === "calendar" && (
        <GlassCard>
          <div className="flex flex-col items-center justify-center py-16 text-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">Booking Calendar</h3>
              <p className="text-slate-500 text-sm mt-1">
                Schedule workouts and diet plans on specific dates. Copy entire days. Assign plans to clients.
              </p>
            </div>
            <button
              onClick={() => setCalendarOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-sm shadow-sm transition"
            >
              <Calendar className="w-4 h-4" />
              Open Training Calendar
            </button>
          </div>
        </GlassCard>
      )}

      {/* ── CHAT TAB ── */}
      {activeTab === "chat" && (
        <GlassCard>
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Send className="w-4 h-4 text-slate-500" />
            Client Messenger — {selectedClient}
          </h3>
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
            <input
              type="text"
              value={trainerChatInput}
              onChange={(e) => setTrainerChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendTrainerChat()}
              placeholder="Message Sarah Jenkins..."
              className="flex-1 px-4 py-2.5 text-sm rounded-xl surge-card text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={handleSendTrainerChat}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      )}

      {/* ── PROGRESS TAB ── */}
      {activeTab === "progress" && (
        <GlassCard>
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-500" />
            Progress Tracking — {selectedClient}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Squat 1RM", val: "140 kg", delta: "+10 kg" },
              { label: "Bench 1RM", val: "95 kg", delta: "+5 kg" },
              { label: "Deadlift 1RM", val: "180 kg", delta: "+15 kg" },
              { label: "Body Weight", val: "82 kg", delta: "-2 kg" },
            ].map((m, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <p className="text-[10px] text-slate-500 font-mono-data uppercase">{m.label}</p>
                <p className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">{m.val}</p>
                <p className="text-emerald-600 dark:text-emerald-400 text-xs font-mono-data mt-1">{m.delta}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* ── GLOBAL MODALS ── */}
      <WorkoutPlannerModal
        isOpen={workoutPlannerOpen}
        onClose={() => setWorkoutPlannerOpen(false)}
        onRoutineSaved={handleRoutineSaved}
      />

      <DietPlannerModal
        isOpen={dietPlannerOpen}
        onClose={() => setDietPlannerOpen(false)}
        onPlanSaved={(plan) => handleDietPlanSaved(plan)}
      />

      <TrainingCalendarModal
        isOpen={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        onOpenWorkoutPlanner={() => { setCalendarOpen(false); setWorkoutPlannerOpen(true); }}
        onOpenDietPlanner={() => { setCalendarOpen(false); setDietPlannerOpen(true); }}
        savedRoutines={savedRoutines}
        savedDietPlans={savedDietPlans}
      />
    </div>
  );
}
