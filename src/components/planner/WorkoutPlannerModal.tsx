"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EXERCISE_DATABASE, ExerciseItem, EXERCISE_COUNT } from "@/lib/data/exercises";
import { WorkoutEngineService } from "@/lib/backend/services";
import {
  X,
  Dumbbell,
  Search,
  Trash2,
  CheckCircle2,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  Clock,
  Plus,
  Minus,
} from "lucide-react";

export interface PlannedExerciseItem {
  exercise: ExerciseItem;
  sets: number;
  reps: string;
  targetWeightKg: number;
  restSeconds: number;
}

interface WorkoutPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoutineSaved?: (routine: { title: string; exercises: PlannedExerciseItem[] }) => void;
}

const PAGE_SIZE = 20;
const CATEGORIES = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Cardio"] as const;
const EQUIPMENT_TYPES = ["All", "Barbell", "Dumbbell", "Cable", "Machine", "Bodyweight", "Kettlebell"] as const;

const REST_OPTIONS = [30, 45, 60, 90, 120, 180, 240];

export function WorkoutPlannerModal({ isOpen, onClose, onRoutineSaved }: WorkoutPlannerModalProps) {
  const [routineTitle, setRoutineTitle] = useState("My Custom Workout Routine");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [plannedExercises, setPlannedExercises] = useState<PlannedExerciseItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hoveredExId, setHoveredExId] = useState<string | null>(null);
  const [previewEx, setPreviewEx] = useState<ExerciseItem | null>(null);

  const filteredExercises = useMemo(() => {
    return EXERCISE_DATABASE.filter((ex) => {
      const matchesCat = selectedCategory === "All" || ex.category === selectedCategory;
      const matchesEquip = selectedEquipment === "All" || ex.equipment === selectedEquipment;
      const matchesSearch =
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.targetMuscles.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesEquip && matchesSearch;
    });
  }, [selectedCategory, selectedEquipment, searchQuery]);

  const totalPages = Math.ceil(filteredExercises.length / PAGE_SIZE);
  const pageExercises = filteredExercises.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const handleFilterChange = useCallback((type: "category" | "equipment", value: string) => {
    setCurrentPage(0);
    if (type === "category") setSelectedCategory(value);
    else setSelectedEquipment(value);
  }, []);

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    setCurrentPage(0);
  }, []);

  const addExercise = useCallback(
    (ex: ExerciseItem) => {
      if (plannedExercises.some((p) => p.exercise.id === ex.id)) return;
      setPlannedExercises((prev) => [
        ...prev,
        { exercise: ex, sets: 3, reps: "10", targetWeightKg: 20, restSeconds: 60 },
      ]);
    },
    [plannedExercises]
  );

  const removeExercise = useCallback((id: string) => {
    setPlannedExercises((prev) => prev.filter((p) => p.exercise.id !== id));
  }, []);

  const updateField = useCallback(
    (id: string, field: keyof PlannedExerciseItem, value: number | string) => {
      setPlannedExercises((prev) =>
        prev.map((p) => (p.exercise.id === id ? { ...p, [field]: value } : p))
      );
    },
    []
  );

  const handleSave = async () => {
    setIsSaving(true);
    for (const item of plannedExercises) {
      await WorkoutEngineService.logWorkoutSet({
        userId: "trainer_01",
        exerciseName: item.exercise.name,
        setNumber: item.sets,
        weightKg: item.targetWeightKg,
        reps: 10,
        rpe: 8,
      });
    }
    setIsSaving(false);
    if (onRoutineSaved) onRoutineSaved({ title: routineTitle, exercises: plannedExercises });
    onClose();
  };

  const catColor: Record<string, string> = {
    Chest: "bg-orange-500/20 text-orange-300",
    Back: "bg-blue-500/20 text-blue-300",
    Legs: "bg-green-500/20 text-green-300",
    Shoulders: "bg-purple-500/20 text-purple-300",
    Arms: "bg-yellow-500/20 text-yellow-300",
    Core: "bg-red-500/20 text-red-300",
    Cardio: "bg-slate-500/20 text-slate-300",
  };

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
            {/* ── HEADER ── */}
            <div className="shrink-0 px-5 py-4 border-b border-white/10 bg-white/[0.025] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-slate-900 flex items-center justify-center shadow shrink-0">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={routineTitle}
                  onChange={(e) => setRoutineTitle(e.target.value)}
                  className="bg-transparent text-white font-extrabold text-base sm:text-lg w-full focus:outline-none placeholder-slate-600"
                  placeholder="Routine name…"
                />
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {EXERCISE_COUNT.toLocaleString()} exercises · {plannedExercises.length} selected
                </p>
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving || plannedExercises.length === 0}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-sm font-extrabold transition disabled:opacity-40 flex items-center gap-1.5 shrink-0"
              >
                <Check className="w-4 h-4" />
                {isSaving ? "Saving…" : "Save Routine"}
              </button>
              <button onClick={onClose} className="p-2 rounded-xl text-slate-500 hover:text-white transition shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── BODY ── */}
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">

              {/* ── LEFT: EXERCISE LIBRARY ── */}
              <div className="flex-1 min-h-0 flex flex-col lg:border-r border-white/10">
                {/* Filters */}
                <div className="shrink-0 p-4 space-y-2.5 border-b border-white/10">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder={`Search all ${EXERCISE_COUNT} exercises by name or muscle…`}
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-white/20 transition"
                    />
                  </div>

                  <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleFilterChange("category", cat)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold shrink-0 transition border ${
                          selectedCategory === cat
                            ? "bg-white text-slate-900 border-white"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5 items-center">
                    <Filter className="w-3 h-3 text-slate-600 shrink-0" />
                    {EQUIPMENT_TYPES.map((eq) => (
                      <button
                        key={eq}
                        onClick={() => handleFilterChange("equipment", eq)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition border ${
                          selectedEquipment === eq
                            ? "bg-white/20 text-white border-white/30"
                            : "bg-transparent border-white/10 text-slate-600 hover:text-white"
                        }`}
                      >
                        {eq}
                      </button>
                    ))}
                    <span className="text-[10px] text-slate-600 font-mono-data ml-auto shrink-0">
                      {filteredExercises.length.toLocaleString()} results
                    </span>
                  </div>
                </div>

                {/* GIF Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2.5">
                    {pageExercises.map((ex) => {
                      const isAdded = plannedExercises.some((p) => p.exercise.id === ex.id);
                      return (
                        <div
                          key={ex.id}
                          onClick={() => addExercise(ex)}
                          onMouseEnter={() => setHoveredExId(ex.id)}
                          onMouseLeave={() => setHoveredExId(null)}
                          className={`rounded-2xl border overflow-hidden flex flex-col transition cursor-pointer group ${
                            isAdded
                              ? "border-emerald-500/50 bg-emerald-500/5"
                              : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                          }`}
                        >
                          {/* GIF */}
                          <div className="aspect-[4/3] bg-black/60 relative overflow-hidden">
                            <img
                              src={ex.gifUrl}
                              alt={ex.name}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                            {isAdded && (
                              <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7 text-emerald-400 drop-shadow-lg" />
                              </div>
                            )}
                            {/* Quick-preview button */}
                            {hoveredExId === ex.id && !isAdded && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setPreviewEx(ex); }}
                                className="absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded bg-black/70 text-white/80 border border-white/20"
                              >
                                Preview
                              </button>
                            )}
                          </div>

                          {/* Info */}
                          <div className="p-2">
                            <h4 className="text-[11px] font-bold text-white leading-snug line-clamp-2 mb-1">{ex.name}</h4>
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className={`text-[9px] font-mono-data px-1.5 py-0.5 rounded-full ${catColor[ex.category] || "bg-slate-500/20 text-slate-300"}`}>
                                {ex.category}
                              </span>
                              <span className="text-[9px] text-slate-600 truncate">
                                {ex.targetMuscles[0]}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-5">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-mono-data text-slate-500">
                        {currentPage + 1} / {totalPages} pages
                      </span>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={currentPage >= totalPages - 1}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ── RIGHT: ROUTINE BUILDER ── */}
              <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 flex flex-col overflow-hidden">
                <div className="shrink-0 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                  <p className="text-[10px] font-mono-data text-slate-500 uppercase">
                    Routine Sequence · {plannedExercises.length} exercises · {plannedExercises.reduce((a, i) => a + i.sets, 0)} total sets
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {plannedExercises.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-40 text-center">
                      <Dumbbell className="w-10 h-10 text-slate-800 mb-3" />
                      <p className="text-sm text-slate-600 font-semibold">No exercises yet</p>
                      <p className="text-xs text-slate-700 mt-1">Click any exercise on the left to add it</p>
                    </div>
                  ) : (
                    plannedExercises.map((item, idx) => (
                      <div key={item.exercise.id} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                        {/* Exercise header with GIF thumbnail */}
                        <div className="flex items-start gap-3 p-3">
                          {/* Thumbnail */}
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/50 shrink-0">
                            <img
                              src={item.exercise.gifUrl}
                              alt={item.exercise.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <div>
                                <span className="text-[9px] font-mono-data text-slate-600 mr-1">#{idx + 1}</span>
                                <p className="text-xs font-bold text-white leading-tight line-clamp-2">{item.exercise.name}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">
                                  {item.exercise.targetMuscles.slice(0, 2).join(" · ")}
                                </p>
                              </div>
                              <button
                                onClick={() => removeExercise(item.exercise.id)}
                                className="text-slate-700 hover:text-red-400 transition shrink-0 mt-0.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Sets / Reps / Weight */}
                        <div className="px-3 pb-2 grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[9px] text-slate-600 block mb-1 font-mono-data uppercase">Sets</label>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => updateField(item.exercise.id, "sets", Math.max(1, item.sets - 1))}
                                className="w-5 h-5 rounded-md bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="text-xs font-bold text-white text-center w-4">{item.sets}</span>
                              <button
                                onClick={() => updateField(item.exercise.id, "sets", Math.min(10, item.sets + 1))}
                                className="w-5 h-5 rounded-md bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-600 block mb-1 font-mono-data uppercase">Reps</label>
                            <input
                              type="text"
                              value={item.reps}
                              onChange={(e) => updateField(item.exercise.id, "reps", e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs text-white text-center focus:outline-none font-mono-data"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-600 block mb-1 font-mono-data uppercase">Kg</label>
                            <input
                              type="number"
                              min={0}
                              value={item.targetWeightKg}
                              onChange={(e) => updateField(item.exercise.id, "targetWeightKg", Number(e.target.value))}
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs text-white text-center focus:outline-none font-mono-data"
                            />
                          </div>
                        </div>

                        {/* Rest Between Sets */}
                        <div className="px-3 pb-3">
                          <label className="text-[9px] text-slate-600 block mb-1.5 font-mono-data uppercase flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            Rest Between Sets
                          </label>
                          <div className="flex gap-1 flex-wrap">
                            {REST_OPTIONS.map((sec) => (
                              <button
                                key={sec}
                                onClick={() => updateField(item.exercise.id, "restSeconds", sec)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-mono-data font-bold transition border ${
                                  item.restSeconds === sec
                                    ? "bg-white text-slate-900 border-white"
                                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                                }`}
                              >
                                {sec < 60 ? `${sec}s` : `${sec / 60}m`}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {plannedExercises.length > 0 && (
                  <div className="shrink-0 p-4 border-t border-white/10">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-sm font-extrabold transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      {isSaving ? "Saving…" : "Save Workout Routine"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Preview Overlay */}
          <AnimatePresence>
            {previewEx && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setPreviewEx(null)}
                  className="fixed inset-0 z-[60] bg-black/60"
                />
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="fixed z-[61] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-[#0c0c10] border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
                >
                  <div className="aspect-video w-full bg-black">
                    <img src={previewEx.gifUrl} alt={previewEx.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white text-sm">{previewEx.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{previewEx.targetMuscles.join(" · ")}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => { addExercise(previewEx); setPreviewEx(null); }}
                        className="flex-1 py-2 rounded-xl bg-white text-slate-900 text-xs font-extrabold"
                      >
                        + Add to Routine
                      </button>
                      <button
                        onClick={() => setPreviewEx(null)}
                        className="py-2 px-3 rounded-xl bg-white/10 text-white text-xs"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
