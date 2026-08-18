"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlannedExerciseItem } from "./WorkoutPlannerModal";
import { MealItem } from "@/lib/data/exercises";
import {
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Apple,
  Copy,
  Trash2,
  Plus,
  Check,
  Repeat,
  CalendarDays,
  Layers,
} from "lucide-react";

type PlanType = "workout" | "diet";

export interface ScheduledEntry {
  id: string;
  type: PlanType;
  title: string;
  dateKey: string; // "YYYY-MM-DD"
  exercises?: PlannedExerciseItem[];
  meals?: MealItem[];
  color: string;
}

interface TrainingCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWorkoutPlanner: () => void;
  onOpenDietPlanner: () => void;
  savedRoutines?: { title: string; exercises: PlannedExerciseItem[] }[];
  savedDietPlans?: { title: string; meals: MealItem[] }[];
  onScheduleSaved?: (entries: ScheduledEntry[], assignToTraineeId?: string) => void;
  trainees?: { id: string; name: string }[];
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
function addDays(key: string, n: number): string {
  const d = new Date(key);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}
function parseKey(key: string) {
  const d = new Date(key);
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const WORKOUT_COLORS = [
  "border-blue-500/40 bg-blue-500/10 text-blue-300",
  "border-violet-500/40 bg-violet-500/10 text-violet-300",
  "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
];
const DIET_COLORS = [
  "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  "border-orange-500/40 bg-orange-500/10 text-orange-300",
  "border-rose-500/40 bg-rose-500/10 text-rose-300",
];

// ─── Copy Schedule Modal ──────────────────────────────────────────────────────
type CopyPattern = "custom" | "daily" | "alternate" | "mwf" | "tts" | "weekly";

interface CopyScheduleModalProps {
  sourceDay: string;
  onConfirm: (targetDates: string[]) => void;
  onCancel: () => void;
}

function CopyScheduleModal({ sourceDay, onConfirm, onCancel }: CopyScheduleModalProps) {
  const today = new Date();
  const [pattern, setPattern] = useState<CopyPattern>("custom");
  const [rangeStart, setRangeStart] = useState(dateKey(today.getFullYear(), today.getMonth(), today.getDate() + 1));
  const [rangeEnd, setRangeEnd] = useState(dateKey(today.getFullYear(), today.getMonth() + 1, today.getDate()));
  const [customDates, setCustomDates] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");

  const generatedDates = useMemo(() => {
    if (pattern === "custom") return customDates;
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);
    const dates: string[] = [];
    let cur = new Date(start);
    while (cur <= end) {
      const key = cur.toISOString().split("T")[0];
      if (key === sourceDay) { cur.setDate(cur.getDate() + 1); continue; }
      const dow = cur.getDay();
      if (pattern === "daily") dates.push(key);
      else if (pattern === "alternate" && dates.length % 2 === 0) dates.push(key);
      else if (pattern === "mwf" && [1, 3, 5].includes(dow)) dates.push(key);
      else if (pattern === "tts" && [2, 4, 6].includes(dow)) dates.push(key);
      else if (pattern === "weekly" && dow === new Date(sourceDay).getDay()) dates.push(key);
      cur.setDate(cur.getDate() + 1);
    }
    if (pattern === "alternate") {
      // recompute for true alternate
      const alt: string[] = [];
      let cur2 = new Date(start);
      let skip = false;
      while (cur2 <= end) {
        const k = cur2.toISOString().split("T")[0];
        if (k !== sourceDay) {
          if (!skip) alt.push(k);
          skip = !skip;
        }
        cur2.setDate(cur2.getDate() + 1);
      }
      return alt;
    }
    return dates;
  }, [pattern, rangeStart, rangeEnd, customDates, sourceDay]);

  const addCustomDate = () => {
    if (customInput && !customDates.includes(customInput) && customInput !== sourceDay) {
      setCustomDates(prev => [...prev, customInput].sort());
      setCustomInput("");
    }
  };

  const PATTERN_OPTIONS: { key: CopyPattern; label: string; desc: string; icon: React.ReactNode }[] = [
    { key: "custom", label: "Custom Dates", desc: "Hand-pick specific dates", icon: <CalendarDays className="w-3.5 h-3.5" /> },
    { key: "daily", label: "Every Day", desc: "Fill all days in range", icon: <Repeat className="w-3.5 h-3.5" /> },
    { key: "alternate", label: "Alternate Days", desc: "Every other day in range", icon: <Layers className="w-3.5 h-3.5" /> },
    { key: "mwf", label: "Mon / Wed / Fri", desc: "Classic 3-day split", icon: <Dumbbell className="w-3.5 h-3.5" /> },
    { key: "tts", label: "Tue / Thu / Sat", desc: "Classic alternate split", icon: <Dumbbell className="w-3.5 h-3.5" /> },
    { key: "weekly", label: "Same Day Weekly", desc: "Same weekday each week", icon: <CalendarDays className="w-3.5 h-3.5" /> },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onCancel}
        className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="fixed z-[71] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#0f0f14] border border-white/15 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
              <Copy className="w-4 h-4 text-yellow-300" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Copy Schedule</p>
              <p className="text-[10px] text-slate-500 font-mono">Copying from {sourceDay}</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-1.5 rounded-lg text-slate-600 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Pattern selector */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-mono mb-2.5">Copy Pattern</p>
            <div className="grid grid-cols-2 gap-2">
              {PATTERN_OPTIONS.map(opt => (
                <button
                  key={opt.key} onClick={() => setPattern(opt.key)}
                  className={`text-left px-3.5 py-3 rounded-2xl border transition ${
                    pattern === opt.key
                      ? "bg-yellow-500/15 border-yellow-500/30 text-yellow-200"
                      : "bg-white/[0.03] border-white/8 text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">{opt.icon}<span className="text-xs font-bold">{opt.label}</span></div>
                  <p className="text-[10px] opacity-60">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Date range (for pattern-based) */}
          {pattern !== "custom" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-mono block mb-1.5">From Date</label>
                <input
                  type="date" value={rangeStart} onChange={e => setRangeStart(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/25 transition"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-mono block mb-1.5">To Date</label>
                <input
                  type="date" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/25 transition"
                />
              </div>
            </div>
          )}

          {/* Custom date picker */}
          {pattern === "custom" && (
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-mono block mb-1.5">Add Specific Dates</label>
              <div className="flex gap-2">
                <input
                  type="date" value={customInput} onChange={e => setCustomInput(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/25 transition"
                />
                <button
                  onClick={addCustomDate}
                  className="px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/20 transition text-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {customDates.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {customDates.map(d => (
                    <span key={d} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-[10px] font-mono font-bold">
                      {d}
                      <button onClick={() => setCustomDates(prev => prev.filter(x => x !== d))} className="hover:text-red-400 transition">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Preview */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-slate-500 uppercase font-mono">Target Dates Preview</p>
              <span className="text-[10px] font-bold text-yellow-400">{generatedDates.length} date{generatedDates.length !== 1 ? "s" : ""}</span>
            </div>
            {generatedDates.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-2">No dates selected yet</p>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {generatedDates.map(d => (
                  <span key={d} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/15 text-yellow-400">
                    {d}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-white/10 bg-white/[0.02] flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm font-bold hover:text-white transition">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(generatedDates)}
            disabled={generatedDates.length === 0}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 text-sm font-extrabold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-40"
          >
            <Copy className="w-4 h-4" /> Copy to {generatedDates.length} Date{generatedDates.length !== 1 ? "s" : ""}
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ─── Main Calendar Modal ─────────────────────────────────────────────────────

export function TrainingCalendarModal({
  isOpen,
  onClose,
  onOpenWorkoutPlanner,
  onOpenDietPlanner,
  savedRoutines = [],
  savedDietPlans = [],
  onScheduleSaved,
  trainees,
}: TrainingCalendarModalProps) {
  const today = new Date();
  const [assignToId, setAssignToId] = useState("");
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [entries, setEntries] = useState<ScheduledEntry[]>([
    {
      id: "demo_w1", type: "workout", title: "Upper Body Push",
      dateKey: dateKey(today.getFullYear(), today.getMonth(), today.getDate()),
      color: "border-blue-500/40 bg-blue-500/10 text-blue-300",
    },
    {
      id: "demo_d1", type: "diet", title: "High-Protein Day",
      dateKey: dateKey(today.getFullYear(), today.getMonth(), today.getDate()),
      color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    },
  ]);

  const [showCopyModal, setShowCopyModal] = useState(false);
  const [copySourceDay, setCopySourceDay] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const entriesByDate = useMemo(() => {
    const map: Record<string, ScheduledEntry[]> = {};
    entries.forEach((e) => {
      if (!map[e.dateKey]) map[e.dateKey] = [];
      map[e.dateKey].push(e);
    });
    return map;
  }, [entries]);

  const selectedEntries = selectedDay ? entriesByDate[selectedDay] || [] : [];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const addRoutineToDate = (routine: { title: string; exercises: PlannedExerciseItem[] }, day: string) => {
    const color = WORKOUT_COLORS[entries.filter((e) => e.type === "workout").length % WORKOUT_COLORS.length];
    setEntries((prev) => [...prev, { id: `w_${Date.now()}`, type: "workout", title: routine.title, dateKey: day, exercises: routine.exercises, color }]);
  };

  const addDietPlanToDate = (plan: { title: string; meals: MealItem[] }, day: string) => {
    const color = DIET_COLORS[entries.filter((e) => e.type === "diet").length % DIET_COLORS.length];
    setEntries((prev) => [...prev, { id: `d_${Date.now()}`, type: "diet", title: plan.title, dateKey: day, meals: plan.meals, color }]);
  };

  const handleCopyConfirm = (targetDates: string[]) => {
    if (!copySourceDay) return;
    const sourceDayEntries = entriesByDate[copySourceDay] || [];
    const newEntries: ScheduledEntry[] = [];
    targetDates.forEach(toDay => {
      sourceDayEntries.forEach(e => {
        newEntries.push({
          ...e,
          id: `copy_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          dateKey: toDay,
        });
      });
    });
    setEntries(prev => [...prev, ...newEntries]);
    setShowCopyModal(false);
    setCopySourceDay(null);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50"
          />

          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-1 sm:inset-3 lg:inset-5 bg-[#0c0c10] border border-white/10 rounded-3xl z-50 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="shrink-0 px-5 py-4 border-b border-white/10 bg-gradient-to-r from-white/[0.04] to-transparent flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shrink-0">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <span className="font-extrabold text-white text-base sm:text-lg">Training Calendar</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Schedule workouts & diet plans · Copy to multiple dates · Assign to athletes
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {trainees && trainees.length > 0 && (
                  <select
                    value={assignToId}
                    onChange={(e) => setAssignToId(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-white/20 appearance-none max-w-[140px]"
                  >
                    <option value="">No Client</option>
                    {trainees.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                )}
                {entries.length > 0 && (
                  <button
                    onClick={() => {
                      if (onScheduleSaved) onScheduleSaved(entries, assignToId);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition shadow-lg shadow-violet-500/20"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">Save</span>
                  </button>
                )}
                <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block"></div>
                <button
                  onClick={onOpenWorkoutPlanner}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold transition hover:bg-blue-500/30"
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Workout</span>
                </button>
                <button
                  onClick={onOpenDietPlanner}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition hover:bg-emerald-500/30"
                >
                  <Apple className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Diet</span>
                </button>
              </div>

              <button onClick={onClose} className="p-2 rounded-xl text-slate-600 hover:text-white transition shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">

              {/* CALENDAR GRID */}
              <div className="flex-1 min-h-0 flex flex-col p-4 overflow-y-auto">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h2 className="font-extrabold text-white text-lg">{MONTH_NAMES[viewMonth]} {viewYear}</h2>
                  <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Day Names */}
                <div className="grid grid-cols-7 mb-1.5">
                  {DAY_NAMES.map((d) => (
                    <div key={d} className="text-center text-[10px] font-mono text-slate-600 py-1 uppercase">{d}</div>
                  ))}
                </div>

                {/* Day Cells */}
                <div className="grid grid-cols-7 gap-1 flex-1">
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}

                  {Array.from({ length: daysInMonth }).map((_, dayIdx) => {
                    const day = dayIdx + 1;
                    const key = dateKey(viewYear, viewMonth, day);
                    const dayEntries = entriesByDate[key] || [];
                    const isToday = key === todayKey;
                    const isSelected = key === selectedDay;
                    const hasWorkout = dayEntries.some(e => e.type === "workout");
                    const hasDiet = dayEntries.some(e => e.type === "diet");

                    return (
                      <motion.div
                        key={key}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedDay(isSelected ? null : key)}
                        className={`relative rounded-xl p-1.5 min-h-[68px] cursor-pointer transition-all border ${
                          isSelected
                            ? "border-violet-500/40 bg-violet-500/10 shadow-lg shadow-violet-500/10"
                            : isToday
                            ? "border-white/20 bg-white/[0.04]"
                            : "border-white/5 hover:border-white/15 hover:bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className={`text-xs font-bold block ${isToday ? "text-white" : "text-slate-500"}`}>
                            {day}
                          </span>
                          {isToday && (
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-1" />
                          )}
                        </div>

                        {/* Compact event pills */}
                        <div className="space-y-0.5">
                          {dayEntries.slice(0, 2).map((entry) => (
                            <div
                              key={entry.id}
                              className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md border truncate ${entry.color}`}
                            >
                              {entry.type === "workout" ? "💪" : "🥗"} {entry.title}
                            </div>
                          ))}
                          {dayEntries.length > 2 && (
                            <div className="text-[8px] text-slate-600 font-mono text-center">+{dayEntries.length - 2} more</div>
                          )}
                        </div>

                        {/* Macro dot indicators */}
                        {(hasWorkout || hasDiet) && (
                          <div className="absolute bottom-1 right-1 flex gap-0.5">
                            {hasWorkout && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                            {hasDiet && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-blue-400" /> Workout
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Diet Plan
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-violet-400" /> Today
                  </div>
                </div>
              </div>

              {/* SIDE PANEL */}
              <div className="w-full lg:w-80 xl:w-96 shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col overflow-hidden">
                <div className="shrink-0 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                  {selectedDay ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white text-sm">{selectedDay}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{selectedEntries.length} items scheduled</p>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            if (selectedEntries.length > 0) {
                              setCopySourceDay(selectedDay);
                              setShowCopyModal(true);
                            }
                          }}
                          disabled={selectedEntries.length === 0}
                          title="Copy this day's plans to other dates"
                          className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold border bg-yellow-500/10 border-yellow-500/20 text-yellow-300 hover:bg-yellow-500/20 transition flex items-center gap-1 disabled:opacity-30"
                        >
                          <Copy className="w-3 h-3" /> Copy Day
                        </button>
                        <button
                          onClick={() => setShowAddMenu(!showAddMenu)}
                          className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold border bg-white/5 border-white/10 text-slate-400 hover:text-white transition flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-xs font-medium text-center">Select a date to see or add plans</p>
                  )}
                </div>

                {/* Add from saved routines/plans */}
                <AnimatePresence>
                  {showAddMenu && selectedDay && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="shrink-0 border-b border-white/10 overflow-hidden"
                    >
                      <div className="p-3 space-y-3">
                        {savedRoutines.length > 0 && (
                          <div>
                            <p className="text-[9px] font-mono text-slate-600 uppercase mb-1.5">Saved Workouts</p>
                            <div className="space-y-1">
                              {savedRoutines.map((r, i) => (
                                <button
                                  key={i}
                                  onClick={() => { addRoutineToDate(r, selectedDay); setShowAddMenu(false); }}
                                  className="w-full text-left px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold flex items-center gap-2 hover:bg-blue-500/20 transition"
                                >
                                  <Dumbbell className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{r.title}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {savedDietPlans.length > 0 && (
                          <div>
                            <p className="text-[9px] font-mono text-slate-600 uppercase mb-1.5">Saved Diet Plans</p>
                            <div className="space-y-1">
                              {savedDietPlans.map((p, i) => (
                                <button
                                  key={i}
                                  onClick={() => { addDietPlanToDate(p, selectedDay); setShowAddMenu(false); }}
                                  className="w-full text-left px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2 hover:bg-emerald-500/20 transition"
                                >
                                  <Apple className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{p.title}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {savedRoutines.length === 0 && savedDietPlans.length === 0 && (
                          <p className="text-xs text-slate-600 text-center py-2">No saved plans. Create one first.</p>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => { onOpenWorkoutPlanner(); setShowAddMenu(false); }}
                            className="flex-1 py-2 rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-300 text-xs font-bold"
                          >
                            + New Workout
                          </button>
                          <button
                            onClick={() => { onOpenDietPlanner(); setShowAddMenu(false); }}
                            className="flex-1 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-xs font-bold"
                          >
                            + New Diet Plan
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Entries list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {!selectedDay ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Calendar className="w-10 h-10 text-slate-800 mb-3" />
                      <p className="text-sm text-slate-600 font-semibold">No date selected</p>
                      <p className="text-xs text-slate-700 mt-1">Click a date on the calendar to view plans</p>
                    </div>
                  ) : selectedEntries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <p className="text-sm text-slate-600 font-semibold">Nothing scheduled</p>
                      <p className="text-xs text-slate-700 mt-1">Click "Add" to assign a workout or diet plan</p>
                    </div>
                  ) : (
                    selectedEntries.map((entry) => (
                      <div key={entry.id} className={`p-3 rounded-2xl border ${entry.color}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {entry.type === "workout" ? (
                              <Dumbbell className="w-3.5 h-3.5 shrink-0" />
                            ) : (
                              <Apple className="w-3.5 h-3.5 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-xs truncate">{entry.title}</p>
                              <p className="text-[10px] opacity-60 font-mono">
                                {entry.type === "workout"
                                  ? `${entry.exercises?.length || 0} exercises`
                                  : `${entry.meals?.length || 0} meals`}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              title="Copy to other dates"
                              onClick={() => { setCopySourceDay(selectedDay); setShowCopyModal(true); }}
                              className="p-1 rounded-lg hover:bg-white/20 transition"
                            >
                              <Copy className="w-3 h-3 opacity-60" />
                            </button>
                            <button
                              onClick={() => removeEntry(entry.id)}
                              className="p-1 rounded-lg hover:bg-red-500/20 transition"
                            >
                              <Trash2 className="w-3 h-3 opacity-60 hover:text-red-400" />
                            </button>
                          </div>
                        </div>

                        {entry.exercises && entry.exercises.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {entry.exercises.slice(0, 4).map((ex, i) => (
                              <div key={i} className="flex items-center gap-2 opacity-80">
                                <div className="w-5 h-5 rounded-md overflow-hidden bg-black/30 shrink-0">
                                  <img src={ex.exercise.gifUrl} alt={ex.exercise.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[10px] truncate">{ex.exercise.name}</span>
                                <span className="text-[9px] opacity-60 shrink-0 font-mono">{ex.sets}×{ex.reps}</span>
                              </div>
                            ))}
                            {entry.exercises.length > 4 && (
                              <p className="text-[9px] opacity-50 font-mono">+{entry.exercises.length - 4} more exercises</p>
                            )}
                          </div>
                        )}

                        {entry.meals && entry.meals.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {entry.meals.slice(0, 3).map((meal, i) => (
                              <div key={i} className="flex items-center justify-between opacity-80">
                                <span className="text-[10px] truncate">{meal.name}</span>
                                <span className="text-[9px] opacity-60 font-mono shrink-0">{meal.calories} kcal</span>
                              </div>
                            ))}
                            {entry.meals.length > 3 && (
                              <p className="text-[9px] opacity-50 font-mono">+{entry.meals.length - 3} more</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Copy Schedule Modal */}
          <AnimatePresence>
            {showCopyModal && copySourceDay && (
              <CopyScheduleModal
                sourceDay={copySourceDay}
                onConfirm={handleCopyConfirm}
                onCancel={() => { setShowCopyModal(false); setCopySourceDay(null); }}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
