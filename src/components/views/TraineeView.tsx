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
  Plus,
  Send,
  Calendar,
  Activity,
  TrendingUp,
  Scale,
  Award,
} from "lucide-react";

interface TraineeViewProps {
  activeTab?: string;
}

export function TraineeView({ activeTab = "dashboard" }: TraineeViewProps) {
  // Workout State
  const [activeWorkout, setActiveWorkout] = useState(false);
  const [restSeconds, setRestSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [completedSets, setCompletedSets] = useState([false, false, false, false]);
  const [setWeights, setSetWeights] = useState(["120", "120", "120", "125"]);

  // Water State
  const [waterMl, setWaterMl] = useState(2250);

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: "coach", text: "Great work on that 140kg Squat PR today Sarah! How are your hamstrings feeling?", time: "10:30 AM" },
    { sender: "user", text: "Felt strong! Slight tightness in lower back, but foam rolled right after.", time: "10:32 AM" },
  ]);
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
      { sender: "user", text: inputChat, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setInputChat("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-slate-900 dark:text-white" />
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              Trainee Athlete Pulse
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Welcome back, Athlete • <span className="font-bold font-mono-data text-slate-900 dark:text-white">🔥 14-Day Streak Active</span>
          </p>
        </div>

        {!activeWorkout ? (
          <button
            onClick={() => setActiveWorkout(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-sm transition"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Today's Heavy Leg Workout</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveWorkout(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Minimize Workout Player</span>
          </button>
        )}
      </div>

      {/* DASHBOARD TAB / ACTIVE WORKOUT TAB */}
      {(activeTab === "dashboard" || activeTab === "active_workout" || activeWorkout) && (
        <>
          {/* Progress Rings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassCard hoverEffect className="flex items-center gap-4">
              <ProgressRing progress={80} radius={42} stroke={7} color="var(--accent-primary)">
                <Flame className="w-5 h-5 text-slate-700 dark:text-slate-200" />
              </ProgressRing>
              <div>
                <span className="text-xs font-mono-data text-slate-500 dark:text-slate-400 uppercase">Active Move</span>
                <p className="font-display font-extrabold text-2xl text-slate-900 dark:text-white mt-0.5">
                  680 <span className="text-xs font-mono-data text-slate-400">/ 850 kcal</span>
                </p>
                <span className="text-[11px] font-mono-data text-slate-500">80% Target Met</span>
              </div>
            </GlassCard>

            <GlassCard hoverEffect className="flex items-center gap-4">
              <ProgressRing progress={92} radius={42} stroke={7} color="var(--accent-primary)">
                <Dumbbell className="w-5 h-5 text-slate-700 dark:text-slate-200" />
              </ProgressRing>
              <div>
                <span className="text-xs font-mono-data text-slate-500 dark:text-slate-400 uppercase">Volume Lifted</span>
                <p className="font-display font-extrabold text-2xl text-slate-900 dark:text-white mt-0.5">
                  12,450 <span className="text-xs font-mono-data text-slate-400">kg</span>
                </p>
                <span className="text-[11px] font-mono-data text-slate-500">92% Target Met</span>
              </div>
            </GlassCard>

            <GlassCard hoverEffect className="flex items-center gap-4">
              <ProgressRing progress={95} radius={42} stroke={7} color="var(--accent-primary)">
                <Heart className="w-5 h-5 text-slate-700 dark:text-slate-200" />
              </ProgressRing>
              <div>
                <span className="text-xs font-mono-data text-slate-500 dark:text-slate-400 uppercase">WHOOP Recovery</span>
                <p className="font-display font-extrabold text-2xl text-slate-900 dark:text-white mt-0.5">
                  95% <span className="text-xs font-mono-data text-slate-400">Score</span>
                </p>
                <span className="text-[11px] font-mono-data text-slate-500">Optimal Recovery</span>
              </div>
            </GlassCard>
          </div>

          {/* Active Workout Interactive Player */}
          {(activeWorkout || activeTab === "active_workout") && (
            <GlassCard className="border-slate-300 dark:border-white/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
                <div>
                  <span className="text-[10px] font-mono-data bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white px-2.5 py-1 rounded-full uppercase border border-slate-200 dark:border-white/10">
                    LIVE WORKOUT ENGINE
                  </span>
                  <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white mt-1">
                    Exercise 1: Barbell Back Squat
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Target: 4 Sets x 6 Reps • Target Weight: 120kg (RPE 8)
                  </p>
                </div>

                {/* Rest Timer */}
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center min-w-[140px]">
                  <span className="text-[10px] font-mono-data text-slate-500 uppercase block">Rest Countdown</span>
                  <span className="font-mono-data font-extrabold text-2xl text-slate-900 dark:text-white">
                    {Math.floor(restSeconds / 60)}:{(restSeconds % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Set Logger */}
              <div className="mt-4 space-y-2">
                {[1, 2, 3, 4].map((setNum, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleSet(idx)}
                    className={`p-3.5 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                      completedSets[idx]
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold"
                        : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-white/10 flex items-center justify-center font-mono-data font-bold text-xs">
                        {setNum}
                      </span>
                      <div>
                        <p className="font-semibold text-xs sm:text-sm">{setWeights[idx]} kg x 6 Reps</p>
                        <p className="text-[11px] opacity-75">Target RPE 8 • Rest 90s</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono-data opacity-75 hidden sm:inline">
                        {completedSets[idx] ? "Completed" : "Tap to Log"}
                      </span>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </>
      )}

      {/* WORKOUT HISTORY TAB */}
      {activeTab === "workout_history" && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-slate-500" />
              Completed Workout History
            </h3>
            <span className="text-xs font-mono-data text-slate-500">28 Sessions Completed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <thead className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono-data text-[11px] uppercase">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Workout Name</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Total Volume</th>
                  <th className="py-3 px-3 text-right">Personal Records</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {[
                  { date: "Yesterday", name: "Heavy Leg & Core Peak", duration: "54 mins", volume: "14,200 kg", pr: "🏆 140kg Squat PR" },
                  { date: "3 Days ago", name: "Push Hypertrophy", duration: "48 mins", volume: "11,800 kg", pr: "🏆 95kg Bench PR" },
                  { date: "5 Days ago", name: "Pull & Lat Focus", duration: "52 mins", volume: "12,600 kg", pr: "—" },
                  { date: "1 Week ago", name: "Full Body Conditioning", duration: "45 mins", volume: "9,800 kg", pr: "—" },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                    <td className="py-3 px-3 font-mono-data text-slate-500">{row.date}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{row.name}</td>
                    <td className="py-3 px-3 font-mono-data text-slate-600 dark:text-slate-300">{row.duration}</td>
                    <td className="py-3 px-3 font-mono-data font-bold text-slate-900 dark:text-white">{row.volume}</td>
                    <td className="py-3 px-3 text-right font-mono-data font-bold text-slate-900 dark:text-white">{row.pr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* NUTRITION & WATER TAB */}
      {activeTab === "nutrition" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Apple className="w-5 h-5 text-slate-500" />
                Daily Macro Targets & Meal Logs
              </h3>
              <span className="text-xs font-mono-data font-bold text-slate-900 dark:text-white">1,940 / 2,500 kcal</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono-data mb-1 text-slate-700 dark:text-slate-300">
                  <span>Protein Target (180g)</span>
                  <span className="font-bold">145g Logged (80%)</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-slate-900 dark:bg-white rounded-full w-[80%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono-data mb-1 text-slate-700 dark:text-slate-300">
                  <span>Carbohydrates Target (250g)</span>
                  <span className="font-bold">190g Logged (76%)</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-slate-700 dark:bg-slate-300 rounded-full w-[76%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono-data mb-1 text-slate-700 dark:text-slate-300">
                  <span>Fats Target (70g)</span>
                  <span className="font-bold">52g Logged (74%)</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-slate-500 rounded-full w-[74%]" />
                </div>
              </div>
            </div>

            {/* Meal Log List */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 space-y-2">
              <span className="text-xs font-mono-data text-slate-500 uppercase block mb-2">Today's Meals</span>
              {[
                { meal: "Breakfast", items: "Oatmeal, 4 Egg Whites, Whey Protein Shake", kcal: "580 kcal", protein: "45g P" },
                { meal: "Lunch", items: "Grilled Chicken Breast, Jasmine Rice, Broccoli", kcal: "620 kcal", protein: "52g P" },
                { meal: "Post-Workout Snack", items: "Greek Yogurt, Honey & Berries", kcal: "340 kcal", protein: "28g P" },
              ].map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{m.meal}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">{m.items}</p>
                  </div>
                  <div className="text-right font-mono-data">
                    <span className="font-bold text-slate-900 dark:text-white block">{m.kcal}</span>
                    <span className="text-[11px] text-slate-500">{m.protein}</span>
                  </div>
                </div>
              ))}
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
                <span className="font-mono-data font-extrabold text-xl text-slate-900 dark:text-white">
                  {waterMl} <span className="text-xs font-normal">ml</span>
                </span>
              </ProgressRing>
              <p className="text-xs text-slate-500 mt-2">{Math.round((waterMl / 3000) * 100)}% of daily hydration met</p>

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

      {/* BIOMETRICS TAB */}
      {activeTab === "biometrics" && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-slate-500" />
              Athlete Biometrics & Body Composition
            </h3>
            <span className="text-xs font-mono-data text-slate-500">Updated 2 days ago</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-xs font-mono-data text-slate-500 uppercase">Body Weight</span>
              <p className="font-display font-extrabold text-2xl text-slate-900 dark:text-white mt-1">78.4 kg</p>
              <span className="text-xs font-mono-data text-emerald-600 dark:text-emerald-400 mt-1 block">-1.2kg this month</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-xs font-mono-data text-slate-500 uppercase">Body Fat Percentage</span>
              <p className="font-display font-extrabold text-2xl text-slate-900 dark:text-white mt-1">14.2%</p>
              <span className="text-xs font-mono-data text-emerald-600 dark:text-emerald-400 mt-1 block">Lean Athletic Range</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-xs font-mono-data text-slate-500 uppercase">Skeletal Muscle Mass</span>
              <p className="font-display font-extrabold text-2xl text-slate-900 dark:text-white mt-1">38.6 kg</p>
              <span className="text-xs font-mono-data text-emerald-600 dark:text-emerald-400 mt-1 block">+0.8kg Muscle Gain</span>
            </div>
          </div>
        </GlassCard>
      )}

      {/* CHALLENGES TAB */}
      {activeTab === "challenges" && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-slate-500" />
              Downtown Branch Weekly Leaderboard
            </h3>
            <span className="text-xs font-mono-data font-bold text-slate-900 dark:text-white">#2 Position overall</span>
          </div>

          <div className="space-y-2">
            {[
              { rank: 1, name: "Marcus Brody", pts: "4,820 pts", badge: "🥇 Alpha Athlete" },
              { rank: 2, name: "You (Sarah)", pts: "4,640 pts", badge: "🥈 Surge Challenger", isUser: true },
              { rank: 3, name: "David Chen", pts: "4,190 pts", badge: "🥉 Iron Specialist" },
            ].map((user, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                  user.isUser
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold"
                    : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono-data font-bold text-sm">#{user.rank}</span>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-[11px] opacity-75">{user.badge}</p>
                  </div>
                </div>
                <span className="font-mono-data font-bold">{user.pts}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* TRAINER CHAT TAB */}
      {activeTab === "trainer_chat" && (
        <GlassCard>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold">
                CD
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Coach Dave</h3>
                <p className="text-[11px] text-slate-500">Assigned Head Trainer • Online</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto mb-4 p-2">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs ${
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
              placeholder="Message Coach Dave..."
              className="w-full surge-card p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 rounded-xl focus:outline-none"
            />
            <button
              onClick={handleSendChat}
              className="p-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      )}

      {/* AI COACH TAB */}
      {activeTab === "ai_coach" && (
        <GlassCard>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-slate-900 dark:text-white" />
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Surge AI Recovery & Workout Coach (Gemini 3.6)
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Your personal Gemini 3.6 AI Coach analyzes your live workout sets, WHOOP recovery score, and macro compliance to deliver real-time training advice.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono-data space-y-2 text-slate-800 dark:text-slate-200">
            <p className="font-bold text-slate-900 dark:text-white">⚡ Real-Time Recommendations:</p>
            <p>1. **Post-Squat Recovery:** Take 5g Creatine Monohydrate & 400ml water within 30 mins.</p>
            <p>2. **Tomorrow's Push Session:** CNS Recovery score is 95%. You are primed to attempt a +2.5kg PR on Flat Bench Press.</p>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
