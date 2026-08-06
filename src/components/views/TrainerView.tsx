"use client";

import React, { useState } from "react";
import { GlassCard } from "../ui/GlassCard";
import { StatCard } from "../ui/StatCard";
import {
  Dumbbell,
  Users,
  Calendar,
  Sparkles,
  Plus,
  CheckCircle2,
  Apple,
  TrendingUp,
  MessageSquare,
  PlusCircle,
  Clock,
  Search,
  ChevronRight,
  Send,
  Video,
  AlertCircle,
  FileText,
} from "lucide-react";

interface TrainerViewProps {
  activeTab?: string;
}

export function TrainerView({ activeTab = "dashboard" }: TrainerViewProps) {
  const [selectedClient, setSelectedClient] = useState("Sarah Jenkins");
  const [clientSearch, setClientSearch] = useState("");

  // Workout Builder State
  const [exerciseList, setExerciseList] = useState([
    { name: "Incline Dumbbell Press", sets: "4", reps: "8-10", rest: "90s" },
    { name: "Cable Chest Flyes", sets: "3", reps: "12-15", rest: "60s" },
    { name: "Barbell Dips", sets: "3", reps: "10-12", rest: "60s" },
  ]);
  const [newExerciseName, setNewExerciseName] = useState("");

  // Chat State
  const [trainerChatInput, setTrainerChatInput] = useState("");
  const [trainerChatMessages, setTrainerChatMessages] = useState([
    { sender: "client", text: "Coach, completed today's Push session! Hit a 95kg Bench PR.", time: "09:14 AM" },
    { sender: "trainer", text: "Boom! Exceptional execution Sarah. Let's increase target to 97.5kg next week.", time: "09:16 AM" },
  ]);

  const addExercise = () => {
    if (!newExerciseName.trim()) return;
    setExerciseList((prev) => [
      ...prev,
      { name: newExerciseName, sets: "3", reps: "10", rest: "60s" },
    ]);
    setNewExerciseName("");
  };

  const handleSendTrainerChat = () => {
    if (!trainerChatInput.trim()) return;
    setTrainerChatMessages((prev) => [
      ...prev,
      { sender: "trainer", text: trainerChatInput, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setTrainerChatInput("");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-slate-900 dark:text-white" />
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              Gym Trainer Command Hub
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Empowering client transformations • Active Module: <span className="font-bold uppercase font-mono-data text-slate-900 dark:text-white">{activeTab.replace("_", " ")}</span>
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-sm transition">
          <Plus className="w-4 h-4" />
          <span>Launch Workout Builder</span>
        </button>
      </div>

      {/* COMMAND CENTER DASHBOARD TAB */}
      {activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Client Roster"
              value="24 Athletes"
              change="100% check-in rate"
              changeType="positive"
              icon={<Users className="w-4 h-4 text-slate-500" />}
              sparklineData={[18, 20, 21, 22, 23, 24, 24]}
            />
            <StatCard
              title="Today's Appointments"
              value="6 Sessions"
              change="4 Done • 2 Upcoming"
              changeType="neutral"
              icon={<Calendar className="w-4 h-4 text-slate-500" />}
              sparklineData={[4, 5, 6, 5, 7, 6, 6]}
            />
            <StatCard
              title="Client PR Hit Rate"
              value="14 Personal Records"
              change="+3 PRs logged this week"
              changeType="positive"
              icon={<TrendingUp className="w-4 h-4 text-slate-500" />}
              sparklineData={[5, 7, 9, 10, 12, 13, 14]}
            />
            <StatCard
              title="Surge AI Copilot"
              value="Active"
              subtitle="Gemini 3.6 Enabled"
              icon={<Sparkles className="w-4 h-4 text-slate-500" />}
              sparklineData={[1, 1, 1, 1, 1, 1, 1]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Roster Column */}
            <GlassCard className="lg:col-span-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Client Roster</h3>
                <span className="text-xs font-mono-data text-slate-500">24 Total</span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {[
                  { name: "Sarah Jenkins", goal: "Hypertrophy & Strength", status: "Session Today 2PM", streak: "14 Days" },
                  { name: "Marcus Brody", goal: "Fat Loss & Conditioning", status: "Check-in Complete", streak: "21 Days" },
                  { name: "Elena Rostova", goal: "Powerlifting (1RM Peak)", status: "Workout Assigned", streak: "8 Days" },
                  { name: "David Chen", goal: "Mobility & Endurance", status: "Rest Day", streak: "30 Days" },
                ].map((client, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedClient(client.name)}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      selectedClient === client.name
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold"
                        : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{client.name}</span>
                      <span className="text-[10px] font-mono-data px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                        ⚡ {client.streak}
                      </span>
                    </div>
                    <p className="text-xs opacity-75 mt-1">{client.goal}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Client Detail & AI Copilot Panel */}
            <GlassCard className="lg:col-span-2">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">{selectedClient}</h3>
                  <p className="text-xs text-slate-500">Goal: Hypertrophy & Strength • Target: +3kg Muscle Mass</p>
                </div>
                <span className="text-xs font-mono-data px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-white/10">
                  Active: 4-Day Upper/Lower
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                  <span className="text-slate-500 uppercase font-mono-data text-[10px]">Squat 1RM Progress</span>
                  <p className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">140 kg (+10kg)</p>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono-data text-[11px] mt-1 block">New Personal Record!</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                  <span className="text-slate-500 uppercase font-mono-data text-[10px]">Macro Compliance</span>
                  <p className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">94% Target Met</p>
                  <span className="text-slate-500 text-[11px] mt-1 block">Avg 165g Protein / Day</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Surge AI Copilot Suggestion for {selectedClient}</span>
                </div>
                <p className="leading-relaxed">
                  {selectedClient} hit a 140kg Squat PR today. Fatigue metrics indicate slight lower back tightness. Swap tomorrow's Heavy RDLs for Lying Leg Curls (4x12) & add 10-minute Psoas stretch flow.
                </p>
              </div>
            </GlassCard>
          </div>
        </>
      )}

      {/* CLIENT ROSTER TAB */}
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
                  <th className="py-3 px-3">Check-in Status</th>
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

      {/* WORKOUT BUILDER TAB */}
      {activeTab === "workout_builder" && (
        <GlassCard>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-white/10">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                Interactive Superset & Circuit Builder
              </h3>
              <p className="text-xs text-slate-500">Configure sets, reps, and rest timers for client assignment.</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-xs shadow-sm transition">
              Save Template
            </button>
          </div>

          {/* Exercise Sequence List */}
          <div className="space-y-3 mb-6">
            {exerciseList.map((ex, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-white/10 flex items-center justify-center font-mono-data font-bold text-xs">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{ex.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono-data">{ex.sets} Sets x {ex.reps} Reps</p>
                  </div>
                </div>
                <span className="font-mono-data text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-white/10 px-2.5 py-1 rounded-lg">
                  Rest {ex.rest}
                </span>
              </div>
            ))}
          </div>

          {/* Add Exercise Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add exercise (e.g. Romanian Deadlifts)..."
              value={newExerciseName}
              onChange={(e) => setNewExerciseName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addExercise()}
              className="w-full surge-card p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 rounded-xl focus:outline-none"
            />
            <button
              onClick={addExercise}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shrink-0 transition"
            >
              Add Exercise
            </button>
          </div>
        </GlassCard>
      )}

      {/* NUTRITION PLANS TAB */}
      {activeTab === "nutrition" && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Apple className="w-5 h-5 text-slate-500" />
              Client Diet & Macro Plan Builder
            </h3>
            <span className="text-xs font-mono-data text-slate-500">4 Active Templates</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "High-Protein Hypertrophy", kcal: "2,600 kcal", macros: "180g P | 280g C | 70g F", desc: "Designed for muscular hypertrophy and strength gains." },
              { title: "Low-FODMAP Performance", kcal: "2,400 kcal", macros: "165g P | 250g C | 65g F", desc: "Easy digestion diet for gut health & endurance." },
              { title: "Ketogenic Fat Loss", kcal: "2,100 kcal", macros: "150g P | 30g C | 120g F", desc: "High-fat metabolic adaptation split." },
            ].map((diet, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <p className="font-bold text-slate-900 dark:text-white text-sm">{diet.title}</p>
                <p className="font-mono-data text-xs text-slate-500 mt-1 font-bold">{diet.kcal}</p>
                <p className="font-mono-data text-[11px] text-slate-400 mt-0.5">{diet.macros}</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{diet.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* BOOKING CALENDAR TAB */}
      {activeTab === "calendar" && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-500" />
              Personal Training Appointment Schedule
            </h3>
            <span className="text-xs font-mono-data text-slate-500">Today: 6 Sessions</span>
          </div>

          <div className="space-y-2">
            {[
              { time: "09:00 AM - 10:00 AM", client: "Sarah Jenkins", type: "1-on-1 Powerlifting Check-in", status: "Completed" },
              { time: "11:30 AM - 12:30 PM", client: "Marcus Brody", type: "Hypertrophy Upper Body", status: "Completed" },
              { time: "02:00 PM - 03:00 PM", client: "Elena Rostova", type: "Heavy Squats Spotting", status: "Upcoming" },
              { time: "04:30 PM - 05:30 PM", client: "David Chen", type: "Mobility & Recovery Flow", status: "Upcoming" },
            ].map((slot, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <span className="font-mono-data font-bold text-slate-500">{slot.time}</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{slot.client}</p>
                    <p className="text-[11px] text-slate-500">{slot.type}</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-data border bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white border-slate-200 dark:border-white/10">
                  {slot.status}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* CLIENT CHAT TAB */}
      {activeTab === "chat" && (
        <GlassCard>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold">
                SJ
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Sarah Jenkins</h3>
                <p className="text-[11px] text-slate-500">Active Client • 140kg Squat PR</p>
              </div>
            </div>
            <button className="p-2 rounded-xl surge-card text-slate-600 dark:text-slate-300">
              <Video className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto mb-4 p-2">
            {trainerChatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "trainer" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                    msg.sender === "trainer"
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
              value={trainerChatInput}
              onChange={(e) => setTrainerChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendTrainerChat()}
              placeholder="Send feedback or workout advice to Sarah..."
              className="w-full surge-card p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 rounded-xl focus:outline-none"
            />
            <button
              onClick={handleSendTrainerChat}
              className="p-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      )}

      {/* AI GENERATOR TAB */}
      {activeTab === "ai_copilot" && (
        <GlassCard>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-slate-900 dark:text-white" />
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Surge AI Workout & Meal Copilot (Gemini 3.6)
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Instant Gemini 3.6 workout split and diet plan generator tailored for client PR progression and injury prevention.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono-data space-y-2 text-slate-800 dark:text-slate-200">
            <p className="font-bold text-slate-900 dark:text-white">⚡ AI Instant Plan Generator Prompt:</p>
            <p>"Generate 4-week Push/Pull/Legs split for intermediate lifter returning from shoulder impingement."</p>
            <button className="mt-2 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-sm">
              Execute AI Generation
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
