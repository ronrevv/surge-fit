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

export function TrainingCalendarModal({
  isOpen,
  onClose,
  onOpenWorkoutPlanner,
  onOpenDietPlanner,
  savedRoutines = [],
  savedDietPlans = [],
}: TrainingCalendarModalProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [entries, setEntries] = useState<ScheduledEntry[]>([
    // Pre-seed some demo data
    {
      id: "demo_w1",
      type: "workout",
      title: "Upper Body Push",
      dateKey: dateKey(today.getFullYear(), today.getMonth(), today.getDate()),
      color: "border-blue-500/40 bg-blue-500/10 text-blue-300",
    },
    {
      id: "demo_d1",
      type: "diet",
      title: "High-Protein Day",
      dateKey: dateKey(today.getFullYear(), today.getMonth(), today.getDate()),
      color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    },
  ]);
  const [copySource, setCopySource] = useState<string | null>(null);
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
    setEntries((prev) => [
      ...prev,
      {
        id: `w_${Date.now()}`,
        type: "workout",
        title: routine.title,
        dateKey: day,
        exercises: routine.exercises,
        color,
      },
    ]);
  };

  const addDietPlanToDate = (plan: { title: string; meals: MealItem[] }, day: string) => {
    const color = DIET_COLORS[entries.filter((e) => e.type === "diet").length % DIET_COLORS.length];
    setEntries((prev) => [
      ...prev,
      {
        id: `d_${Date.now()}`,
        type: "diet",
        title: plan.title,
        dateKey: day,
        meals: plan.meals,
        color,
      },
    ]);
  };

  const copyDayEntries = (fromDay: string, toDay: string) => {
    const toCopy = (entriesByDate[fromDay] || []).map((e) => ({
      ...e,
      id: `copy_${Date.now()}_${Math.random()}`,
      dateKey: toDay,
    }));
    setEntries((prev) => [...prev, ...toCopy]);
    setCopySource(null);
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50"
          />

          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-1 sm:inset-3 lg:inset-6 bg-[#0c0c10] border border-white/10 rounded-3xl z-50 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="shrink-0 px-5 py-4 border-b border-white/10 bg-white/[0.025] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-slate-900 flex items-center justify-center shadow shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="font-extrabold text-white text-base sm:text-lg">Training Calendar</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Schedule workouts & diet plans · Copy days · Assign to athletes
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onOpenWorkoutPlanner}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold transition hover:bg-blue-500/30"
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Workout</span>
                </button>
                <button
                  onClick={onOpenDietPlanner}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition hover:bg-emerald-500/30"
                >
                  <Apple className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Diet Plan</span>
                </button>
              </div>

              <button onClick={onClose} className="p-2 rounded-xl text-slate-500 hover:text-white transition shrink-0">
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
                  <h2 className="font-extrabold text-white text-lg">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </h2>
                  <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Day Names */}
                <div className="grid grid-cols-7 mb-2">
                  {DAY_NAMES.map((d) => (
                    <div key={d} className="text-center text-[10px] font-mono-data text-slate-600 py-1 uppercase">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day Cells */}
                <div className="grid grid-cols-7 gap-1 flex-1">
                  {/* Empty cells for first day offset */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, dayIdx) => {
                    const day = dayIdx + 1;
                    const key = dateKey(viewYear, viewMonth, day);
                    const dayEntries = entriesByDate[key] || [];
                    const isToday = key === todayKey;
                    const isSelected = key === selectedDay;
                    const isCopySource = key === copySource;

                    return (
                      <div
                        key={key}
                        onClick={() => {
                          if (copySource && copySource !== key) {
                            copyDayEntries(copySource, key);
                          } else {
                            setSelectedDay(isSelected ? null : key);
                          }
                        }}
                        className={`relative rounded-xl p-1.5 min-h-[64px] cursor-pointer transition-all border ${
                          isSelected
                            ? "border-white/30 bg-white/10"
                            : isCopySource
                            ? "border-yellow-400/40 bg-yellow-400/10"
                            : isToday
                            ? "border-white/20 bg-white/5"
                            : "border-white/5 hover:border-white/15 hover:bg-white/[0.03]"
                        }`}
                      >
                        <span className={`text-xs font-bold block mb-1 ${isToday ? "text-white" : "text-slate-500"}`}>
                          {day}
                          {isToday && <span className="ml-1 text-[8px] text-white/60">today</span>}
                        </span>

                        <div className="space-y-0.5">
                          {dayEntries.slice(0, 3).map((entry) => (
                            <div
                              key={entry.id}
                              className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md border truncate ${entry.color}`}
                            >
                              {entry.type === "workout" ? "💪" : "🥗"} {entry.title}
                            </div>
                          ))}
                          {dayEntries.length > 3 && (
                            <div className="text-[8px] text-slate-600 font-mono-data text-center">
                              +{dayEntries.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Copy hint */}
                {copySource && (
                  <div className="mt-3 p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs font-bold text-center">
                    📋 Click any date to paste a copy of {copySource}'s plans · Click here to cancel
                  </div>
                )}
              </div>

              {/* SIDE PANEL: Selected Day Detail */}
              <div className="w-full lg:w-80 xl:w-96 shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col overflow-hidden">
                <div className="shrink-0 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                  {selectedDay ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white text-sm">{selectedDay}</p>
                        <p className="text-[10px] text-slate-500 font-mono-data">{selectedEntries.length} items scheduled</p>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setCopySource(copySource === selectedDay ? null : selectedDay)}
                          title="Copy this day's plan to another date"
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition flex items-center gap-1 ${
                            copySource === selectedDay
                              ? "bg-yellow-400/20 border-yellow-400/40 text-yellow-300"
                              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          <Copy className="w-3 h-3" />
                          {copySource === selectedDay ? "Copying…" : "Copy Day"}
                        </button>
                        <button
                          onClick={() => setShowAddMenu(!showAddMenu)}
                          className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold border bg-white/5 border-white/10 text-slate-400 hover:text-white transition flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-xs font-medium text-center">
                      Select a date to see or add plans
                    </p>
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
                            <p className="text-[9px] font-mono-data text-slate-600 uppercase mb-1.5">Saved Workouts</p>
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
                            <p className="text-[9px] font-mono-data text-slate-600 uppercase mb-1.5">Saved Diet Plans</p>
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
                          <p className="text-xs text-slate-600 text-center py-2">
                            No saved plans yet. Create a workout or diet plan first.
                          </p>
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
                              <p className="text-[10px] opacity-60 font-mono-data">
                                {entry.type === "workout"
                                  ? `${entry.exercises?.length || 0} exercises`
                                  : `${entry.meals?.length || 0} meals`}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              title="Copy to another date"
                              onClick={() => { setCopySource(selectedDay); }}
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

                        {/* Exercise preview */}
                        {entry.exercises && entry.exercises.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {entry.exercises.slice(0, 4).map((ex, i) => (
                              <div key={i} className="flex items-center gap-2 opacity-80">
                                <div className="w-5 h-5 rounded-md overflow-hidden bg-black/30 shrink-0">
                                  <img src={ex.exercise.gifUrl} alt={ex.exercise.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[10px] truncate">{ex.exercise.name}</span>
                                <span className="text-[9px] opacity-60 shrink-0 font-mono-data">{ex.sets}×{ex.reps}</span>
                              </div>
                            ))}
                            {entry.exercises.length > 4 && (
                              <p className="text-[9px] opacity-50 font-mono-data">+{entry.exercises.length - 4} more exercises</p>
                            )}
                          </div>
                        )}

                        {/* Meal preview */}
                        {entry.meals && entry.meals.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {entry.meals.slice(0, 3).map((meal, i) => (
                              <div key={i} className="flex items-center justify-between opacity-80">
                                <span className="text-[10px] truncate">{meal.name}</span>
                                <span className="text-[9px] opacity-60 font-mono-data shrink-0">{meal.calories} kcal</span>
                              </div>
                            ))}
                            {entry.meals.length > 3 && (
                              <p className="text-[9px] opacity-50 font-mono-data">+{entry.meals.length - 3} more meals</p>
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
        </>
      )}
    </AnimatePresence>
  );
}
