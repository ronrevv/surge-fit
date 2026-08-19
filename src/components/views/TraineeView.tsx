"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "../ui/GlassCard";
import { ProgressRing } from "../ui/ProgressRing";
import {
  Flame,
  Dumbbell,
  Heart,
  Play,
  CheckCircle2,
  Trophy,
  Apple,
  RotateCcw,
  Sparkles,
  History,
  MessageSquare,
  Droplets,
  Send,
  Calendar,
  Activity,
  TrendingUp,
  Scale,
  Zap,
  ChevronRight,
  ClipboardList,
  Utensils,
} from "lucide-react";

import { useStore } from "@/lib/store/useStore";
import { useAssignedPlans } from "@/lib/hooks/usePlans";
import { supabase } from "@/lib/supabase/client";

interface TraineeViewProps {
  activeTab?: string;
}

export function TraineeView({ activeTab = "dashboard" }: TraineeViewProps) {
  const s = useStore();
  const session = s.getSession();
  const traineeUser =
    session.userId
      ? s.getUserById(session.userId)
      : s.getUsers().find((u) => u.role === "trainee" && u.status === "active");
  const assignedTrainer = traineeUser?.trainerId
    ? s.getUserById(traineeUser.trainerId)
    : null;
  const assignedBranch = traineeUser?.branchId
    ? s.getBranchById(traineeUser.branchId)
    : null;

  // Real Supabase auth user ID (avoids fake mock UUIDs from orgStore)
  const [realUserId, setRealUserId] = useState<string>("");
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) setRealUserId(data.user.id);
    });
  }, []);

  // Workout State
  const [activeWorkout, setActiveWorkout] = useState(false);
  const [restSeconds, setRestSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [completedSets, setCompletedSets] = useState([false, false, false, false]);
  const [setWeights] = useState(["120", "120", "120", "125"]);

  // Water State
  const [waterMl, setWaterMl] = useState(2250);

  // Chat State
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [inputChat, setInputChat] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && restSeconds > 0) {
      interval = setInterval(() => setRestSeconds((prev) => prev - 1), 1000);
    } else if (restSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, restSeconds]);

  const toggleSet = (idx: number) => {
    const updated = [...completedSets];
    updated[idx] = !updated[idx];
    setCompletedSets(updated);
    if (!completedSets[idx]) {
      setRestSeconds(60);
      setTimerRunning(true);
    }
  };

  const handleSendChat = () => {
    if (!inputChat.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: inputChat,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInputChat("");
  };

  // Live assignments from store — written by trainer, read here
  // Use real Supabase UUID — not the mock store ID which breaks the UUID column
  const { data: myAssignments = [], isLoading: isLoadingAssignments } = useAssignedPlans(realUserId);
  // Get today's date in YYYY-MM-DD for scheduling
  const todayDate = new Date();
  const todayKey = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, "0")}-${String(todayDate.getDate()).padStart(2, "0")}`;

  // Find scheduled workout for today, or fallback to the most recent active assigned workout
  const assignedWorkout = myAssignments.find((a: any) => a.type === "workout" && a.scheduled_date === todayKey) 
    || myAssignments.find((a: any) => a.type === "workout" && !a.scheduled_date);

  // Find scheduled diet for today, or fallback to the most recent active assigned diet
  const assignedDiet = myAssignments.find((a: any) => a.type === "diet" && a.scheduled_date === todayKey)
    || myAssignments.find((a: any) => a.type === "diet" && !a.scheduled_date);

  // For the schedule badge, check if there's anything scheduled today
  const assignedSchedule = myAssignments.find((a: any) => a.scheduled_date === todayKey);

  return (
    <div className="space-y-5">
      {/* ── Top Banner ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-white/10">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900 dark:text-white shrink-0" />
            <h1 className="font-display font-extrabold text-xl sm:text-2xl lg:text-3xl text-slate-900 dark:text-white tracking-tight truncate">
              {traineeUser?.name || "Trainee Athlete"} Pulse
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
            Goal:{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {traineeUser?.goal || "Fitness & Performance"}
            </span>{" "}
            •{" "}
            {assignedTrainer
              ? `Trainer: ${assignedTrainer.name}`
              : "Online Program"}{" "}
            • {assignedBranch ? assignedBranch.name : "Remote"}
          </p>
        </div>

        {!activeWorkout ? (
          <button
            onClick={() => setActiveWorkout(true)}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-sm transition shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            <span className="whitespace-nowrap">Start Today's Workout</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveWorkout(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold transition shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Minimize</span>
          </button>
        )}
      </div>

      {/* ── Assigned-by-Trainer Banner (all tabs) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Workout Assignment */}
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${
          assignedWorkout
            ? "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20"
            : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            assignedWorkout ? "bg-blue-500/20 dark:bg-blue-500/30" : "bg-slate-200 dark:bg-white/10"
          }`}>
            <Dumbbell className={`w-4 h-4 ${
              assignedWorkout ? "text-blue-600 dark:text-blue-300" : "text-slate-400"
            }`} />
          </div>
          <div className="min-w-0">
            <p className={`text-[10px] font-mono-data uppercase ${
              assignedWorkout ? "text-blue-500 dark:text-blue-400" : "text-slate-400"
            }`}>Assigned Workout</p>
            {assignedWorkout ? (
              <>
                <p className="text-xs font-bold text-blue-800 dark:text-blue-200 truncate">{assignedWorkout.title}</p>
                <p className="text-[10px] text-blue-500 dark:text-blue-400 truncate">{assignedWorkout.summary}</p>
              </>
            ) : (
              <p className="text-xs text-slate-400 italic">Not yet assigned</p>
            )}
          </div>
        </div>

        {/* Diet Assignment */}
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${
          assignedDiet
            ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
            : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            assignedDiet ? "bg-emerald-500/20 dark:bg-emerald-500/30" : "bg-slate-200 dark:bg-white/10"
          }`}>
            <Utensils className={`w-4 h-4 ${
              assignedDiet ? "text-emerald-600 dark:text-emerald-300" : "text-slate-400"
            }`} />
          </div>
          <div className="min-w-0">
            <p className={`text-[10px] font-mono-data uppercase ${
              assignedDiet ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
            }`}>Assigned Diet</p>
            {assignedDiet ? (
              <>
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200 truncate">{assignedDiet.title}</p>
                <p className="text-[10px] text-emerald-500 dark:text-emerald-400 truncate">{assignedDiet.summary}</p>
              </>
            ) : (
              <p className="text-xs text-slate-400 italic">Not yet assigned</p>
            )}
          </div>
        </div>

        {/* Schedule Assignment */}
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${
          assignedSchedule
            ? "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20"
            : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            assignedSchedule ? "bg-violet-500/20 dark:bg-violet-500/30" : "bg-slate-200 dark:bg-white/10"
          }`}>
            <Calendar className={`w-4 h-4 ${
              assignedSchedule ? "text-violet-600 dark:text-violet-300" : "text-slate-400"
            }`} />
          </div>
          <div className="min-w-0">
            <p className={`text-[10px] font-mono-data uppercase ${
              assignedSchedule ? "text-violet-500 dark:text-violet-400" : "text-slate-400"
            }`}>Schedule</p>
            {assignedSchedule ? (
              <>
                <p className="text-xs font-bold text-violet-800 dark:text-violet-200 truncate">{assignedSchedule.title}</p>
                <p className="text-[10px] text-violet-500 dark:text-violet-400 truncate">{assignedSchedule.summary}</p>
              </>
            ) : (
              <p className="text-xs text-slate-400 italic">Not yet scheduled</p>
            )}
          </div>
        </div>
      </div>

      {/* ── DASHBOARD / ACTIVE WORKOUT TAB ── */}
      {(activeTab === "dashboard" || activeTab === "active_workout" || activeWorkout) && (
        <>
          {/* Progress Rings Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassCard hoverEffect className="flex items-center gap-4">
              <ProgressRing progress={0} radius={42} stroke={7} color="var(--accent-primary)">
                <Flame className="w-5 h-5 text-slate-700 dark:text-slate-200" />
              </ProgressRing>
              <div className="min-w-0">
                <span className="text-xs font-mono-data text-slate-500 dark:text-slate-400 uppercase">Active Move</span>
                <p className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white mt-0.5">
                  0 <span className="text-xs font-mono-data text-slate-400">/ 0 kcal</span>
                </p>
                <span className="text-[11px] font-mono-data text-slate-500">No Target Set</span>
              </div>
            </GlassCard>

            <GlassCard hoverEffect className="flex items-center gap-4">
              <ProgressRing progress={0} radius={42} stroke={7} color="var(--accent-primary)">
                <Dumbbell className="w-5 h-5 text-slate-700 dark:text-slate-200" />
              </ProgressRing>
              <div className="min-w-0">
                <span className="text-xs font-mono-data text-slate-500 dark:text-slate-400 uppercase">Volume Lifted</span>
                <p className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white mt-0.5">
                  0 <span className="text-xs font-mono-data text-slate-400">kg</span>
                </p>
                <span className="text-[11px] font-mono-data text-slate-500">No Sessions Logged</span>
              </div>
            </GlassCard>

            <GlassCard hoverEffect className="flex items-center gap-4">
              <ProgressRing progress={0} radius={42} stroke={7} color="var(--accent-primary)">
                <Heart className="w-5 h-5 text-slate-700 dark:text-slate-200" />
              </ProgressRing>
              <div className="min-w-0">
                <span className="text-xs font-mono-data text-slate-500 dark:text-slate-400 uppercase">WHOOP Recovery</span>
                <p className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white mt-0.5">
                  -- <span className="text-xs font-mono-data text-slate-400">Score</span>
                </p>
                <span className="text-[11px] font-mono-data text-slate-500">Connect Device</span>
              </div>
            </GlassCard>
          </div>

          {/* Active Workout Interactive Player */}
          {(activeWorkout || activeTab === "active_workout") && (
            <GlassCard className="border-slate-300 dark:border-white/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono-data bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white px-2.5 py-1 rounded-full uppercase border border-slate-200 dark:border-white/10">
                    LIVE WORKOUT ENGINE
                  </span>
                  <h2 className="font-display font-extrabold text-lg sm:text-2xl text-slate-900 dark:text-white mt-1">
                    {assignedWorkout ? assignedWorkout.title : "No Workout Assigned"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {assignedWorkout ? assignedWorkout.summary : "Ask your trainer to assign a workout."}
                  </p>
                </div>
              </div>

              {/* Dynamic Workout Content */}
              <div className="mt-4 space-y-4">
                {assignedWorkout?.content && Array.isArray(assignedWorkout.content) ? (
                  assignedWorkout.content.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 sm:p-4 rounded-xl border bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        {item.exercise?.gifUrl ? (
                          <div className="w-16 h-16 rounded-xl bg-black/50 overflow-hidden shrink-0 border border-slate-200 dark:border-white/10">
                            <img src={item.exercise.gifUrl} alt={item.exercise.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <span className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-mono-data font-bold text-sm shrink-0">
                            {idx + 1}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 dark:text-white truncate">{item.exercise?.name || "Unknown Exercise"}</p>
                          <p className="text-xs text-slate-500">{item.sets} Sets × {item.reps} Reps</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {Array.from({ length: item.sets || 1 }).map((_, setIdx) => (
                          <div key={setIdx} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-black/20 border border-slate-100 dark:border-white/5">
                            <span className="text-xs font-mono-data text-slate-500">Set {setIdx + 1}</span>
                            <span className="text-xs font-semibold">{item.reps} Reps</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-400 text-sm italic">
                    {assignedWorkout ? "This workout has no exercises." : "Nothing to show right now."}
                  </div>
                )}
              </div>
            </GlassCard>
          )}

          {/* Quick stats row on dashboard */}
          {activeTab === "dashboard" && !activeWorkout && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Streak", value: "0 days", icon: <Flame className="w-4 h-4 text-orange-500" /> },
                { label: "PRs This Month", value: "0 PRs", icon: <Trophy className="w-4 h-4 text-yellow-500" /> },
                { label: "Avg Session", value: "0 min", icon: <Activity className="w-4 h-4 text-blue-500" /> },
                { label: "Weight Trend", value: "0 kg", icon: <TrendingUp className="w-4 h-4 text-emerald-500" /> },
              ].map((stat) => (
                <GlassCard key={stat.label} hoverEffect className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    {stat.icon}
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <p className="font-display font-extrabold text-lg text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-[11px] font-mono-data text-slate-500 uppercase">{stat.label}</p>
                </GlassCard>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── WORKOUT HISTORY TAB ── */}
      {activeTab === "workout_history" && (
        <GlassCard>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-slate-500" />
              Completed Workout History
            </h3>
            <span className="text-xs font-mono-data text-slate-500">0 Sessions Completed</span>
          </div>

          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700 dark:text-slate-300 min-w-[480px]">
              <thead className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono-data text-[11px] uppercase">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Workout</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Volume</th>
                  <th className="py-3 px-3 text-right">PR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-sm italic">
                    No workouts logged yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* ── NUTRITION & WATER TAB ── */}
      {activeTab === "nutrition" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <GlassCard className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Apple className="w-5 h-5 text-slate-500" />
                Daily Macro Targets & Meal Logs
              </h3>
              {assignedDiet?.content && Array.isArray(assignedDiet.content) && (
                <span className="text-xs font-mono-data font-bold text-slate-900 dark:text-white">
                  {assignedDiet.content.reduce((sum: number, m: any) => sum + m.calories, 0).toLocaleString()} kcal Total
                </span>
              )}
            </div>

            {/* Assigned diet plan badge */}
            {assignedDiet && (
            <div className="flex items-center gap-2 mb-4 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
              <ClipboardList className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                Plan: <span className="font-extrabold">{assignedDiet.title}</span> — {assignedDiet.summary}
              </p>
            </div>
            )}

            {/* Meal Log List */}
            <div className="mt-2 space-y-2">
              <span className="text-xs font-mono-data text-slate-500 uppercase block mb-2">Planned Meals</span>
              {assignedDiet?.content && Array.isArray(assignedDiet.content) ? (
                assignedDiet.content.map((m: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white">{m.name}</p>
                    </div>
                    <div className="text-right font-mono-data shrink-0 flex gap-4">
                      <div className="text-left">
                        <span className="font-bold text-emerald-600 block">{m.calories} kcal</span>
                      </div>
                      <div className="text-left">
                        <span className="text-slate-500 text-[11px] block">P: {m.macros.protein}g</span>
                      </div>
                      <div className="text-left">
                        <span className="text-slate-500 text-[11px] block">C: {m.macros.carbs}g</span>
                      </div>
                      <div className="text-left">
                        <span className="text-slate-500 text-[11px] block">F: {m.macros.fats}g</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-sm italic">
                  {assignedDiet ? "This diet has no meals." : "No diet plan assigned."}
                </div>
              )}
            </div>
          </GlassCard>

          {/* Water Hydration Tracker */}
          <GlassCard className="lg:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-slate-500" />
                Water Hydration
              </h3>
              <span className="text-xs font-mono-data text-slate-500">Target 3,000 ml</span>
            </div>

            <div className="text-center py-4">
              <ProgressRing progress={(waterMl / 3000) * 100} radius={50} stroke={8} color="var(--accent-primary)">
                <span className="font-mono-data font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
                  {waterMl} <span className="text-xs font-normal">ml</span>
                </span>
              </ProgressRing>
              <p className="text-xs text-slate-500 mt-2">
                {Math.round((waterMl / 3000) * 100)}% of daily hydration met
              </p>

              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() => setWaterMl((prev) => prev + 250)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-xs shadow-sm transition"
                >
                  +250 ml
                </button>
                <button
                  onClick={() => setWaterMl((prev) => prev + 500)}
                  className="px-3 py-1.5 rounded-xl surge-card text-slate-700 dark:text-slate-300 font-bold text-xs transition"
                >
                  +500 ml
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── BIOMETRICS TAB ── */}
      {activeTab === "biometrics" && (
        <GlassCard>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-slate-500" />
              Athlete Biometrics & Body Composition
            </h3>
            <span className="text-xs font-mono-data text-slate-500">Updated 2 days ago</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Body Weight", value: "78.4 kg", change: "−1.2 kg this month", positive: true },
              { label: "Body Fat %", value: "14.2%", change: "Lean Athletic Range", positive: true },
              { label: "Skeletal Muscle", value: "38.6 kg", change: "+0.8 kg gained", positive: true },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
              >
                <span className="text-xs font-mono-data text-slate-500 uppercase">{item.label}</span>
                <p className="font-display font-extrabold text-2xl text-slate-900 dark:text-white mt-1">{item.value}</p>
                <span className="text-xs font-mono-data text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {item.change}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
            {[
              { label: "Height", value: "182 cm" },
              { label: "BMI", value: "23.7" },
              { label: "Visceral Fat", value: "Level 4" },
              { label: "Bone Mass", value: "3.8 kg" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center"
              >
                <p className="text-[10px] font-mono-data text-slate-500 uppercase">{item.label}</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* ── CHALLENGES TAB ── */}
      {activeTab === "challenges" && (
        <GlassCard>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-slate-500" />
              Downtown Branch Weekly Leaderboard
            </h3>
            <span className="text-xs font-mono-data font-bold text-slate-900 dark:text-white">#2 Position overall</span>
          </div>

          <div className="space-y-2">
            {[
              { rank: 1, name: "Marcus Brody", pts: "4,820 pts", badge: "🥇 Alpha Athlete", isUser: false },
              { rank: 2, name: "You (Sarah)", pts: "4,640 pts", badge: "🥈 Surge Challenger", isUser: true },
              { rank: 3, name: "David Chen", pts: "4,190 pts", badge: "🥉 Iron Specialist", isUser: false },
              { rank: 4, name: "Priya Malik", pts: "3,980 pts", badge: "Crusher", isUser: false },
              { rank: 5, name: "Jake Rivera", pts: "3,710 pts", badge: "Endurance King", isUser: false },
            ].map((user, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                  user.isUser
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold"
                    : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono-data font-bold text-sm shrink-0">#{user.rank}</span>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{user.name}</p>
                    <p className="text-[11px] opacity-75">{user.badge}</p>
                  </div>
                </div>
                <span className="font-mono-data font-bold shrink-0 ml-2">{user.pts}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* ── TRAINER CHAT TAB ── */}
      {activeTab === "trainer_chat" && (
        <GlassCard>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold shrink-0">
                {assignedTrainer?.name
                  ? assignedTrainer.name.split(" ").map((n) => n[0]).join("")
                  : "TR"}
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white truncate">
                  {assignedTrainer?.name || "Assigned Coach"}
                </h3>
                <p className="text-[11px] text-slate-500 truncate">
                  {assignedTrainer?.specialization || "Head Trainer"} • Online
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 max-h-[300px] sm:max-h-[360px] overflow-y-auto mb-4 p-1">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-2xl text-xs break-words ${
                    msg.sender === "user"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium"
                      : "bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[10px] opacity-60 mt-1 block text-right font-mono-data">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
            <input
              type="text"
              value={inputChat}
              onChange={(e) => setInputChat(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              placeholder={`Message ${assignedTrainer?.name?.split(" ")[0] || "Coach"}…`}
              className="w-full surge-card p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 rounded-xl focus:outline-none min-w-0"
            />
            <button
              onClick={handleSendChat}
              className="p-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      )}

      {/* ── AI COACH TAB ── */}
      {activeTab === "ai_coach" && (
        <div className="space-y-4">
          <GlassCard>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-slate-900 dark:text-white" />
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Surge AI Recovery & Workout Coach (Gemini 3.6)
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Your personal Gemini 3.6 AI Coach analyzes your live workout sets, WHOOP recovery score, and
              macro compliance to deliver real-time training advice.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono-data space-y-2 text-slate-800 dark:text-slate-200">
              <p className="font-bold text-slate-900 dark:text-white">⚡ Real-Time Recommendations:</p>
              <p>1. Post-Squat Recovery: Take 5g Creatine Monohydrate & 400ml water within 30 mins.</p>
              <p>
                2. Tomorrow's Push Session: CNS Recovery score is 95%. You are primed to attempt a +2.5kg PR on
                Flat Bench Press.
              </p>
              <p>3. Sleep Target: Aim for 8h tonight — HRV trending down. Prioritise recovery.</p>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <Dumbbell className="w-5 h-5 text-blue-500" />,
                label: "AI Workout Generator",
                desc: "Generate a custom session based on today's recovery",
                cta: "Generate Workout",
              },
              {
                icon: <Utensils className="w-5 h-5 text-emerald-500" />,
                label: "AI Meal Planner",
                desc: "Auto-plan your meals hitting all macro targets",
                cta: "Plan Meals",
              },
              {
                icon: <Zap className="w-5 h-5 text-violet-500" />,
                label: "AI Recovery Protocol",
                desc: "Personalized recovery stack for tonight",
                cta: "Get Protocol",
              },
            ].map((item) => (
              <GlassCard key={item.label} hoverEffect className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
                <button className="mt-auto flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white hover:underline">
                  {item.cta} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
