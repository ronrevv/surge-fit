"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EXERCISE_DATABASE, ExerciseItem, EXERCISE_COUNT } from "@/lib/data/exercises";
import { WorkoutEngineService } from "@/lib/backend/services";
import {
  X,
  Dumbbell,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

interface WorkoutPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoutineSaved?: (routineTitle: string) => void;
}

interface PlannedExerciseItem {
  exercise: ExerciseItem;
  sets: number;
  reps: string;
  targetWeightKg: number;
  restSeconds: number;
}

const PAGE_SIZE = 24;
const CATEGORIES = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Cardio"] as const;
const EQUIPMENT_TYPES = ["All", "Barbell", "Dumbbell", "Cable", "Machine", "Bodyweight", "Kettlebell"] as const;

export function WorkoutPlannerModal({ isOpen, onClose, onRoutineSaved }: WorkoutPlannerModalProps) {
  const [routineTitle, setRoutineTitle] = useState("My Custom Workout Routine");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [plannedExercises, setPlannedExercises] = useState<PlannedExerciseItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

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

  const updateExercise = useCallback(
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
    if (onRoutineSaved) onRoutineSaved(routineTitle);
    onClose();
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
            className="fixed inset-0 bg-black/75 backdrop-blur-lg z-50"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-2 sm:inset-4 lg:inset-8 bg-[#0f0f13] border border-white/10 rounded-3xl z-50 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* ── TOP HEADER ── */}
            <div className="shrink-0 px-5 py-4 border-b border-white/10 flex items-center gap-3 bg-white/[0.03]">
              <div className="w-9 h-9 rounded-xl bg-white text-slate-900 flex items-center justify-center shadow">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-extrabold text-white text-base sm:text-lg leading-none">
                  Workout Planner
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {EXERCISE_COUNT.toLocaleString()} exercises with animated GIFs
                </p>
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving || plannedExercises.length === 0}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-extrabold transition disabled:opacity-40 flex items-center gap-1.5 shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
                {isSaving ? "Saving…" : `Save (${plannedExercises.length})`}
              </button>
              <button onClick={onClose} className="p-2 rounded-xl text-slate-500 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── MAIN BODY ── */}
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">

              {/* ── LEFT: EXERCISE LIBRARY ── */}
              <div className="flex-1 min-h-0 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10">
                {/* Search & Filters */}
                <div className="shrink-0 p-4 space-y-3 border-b border-white/10">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={`Search ${EXERCISE_COUNT} exercises…`}
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/20 transition"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleFilterChange("category", cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition border ${
                          selectedCategory === cat
                            ? "bg-white text-slate-900 border-white"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none items-center">
                    <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    {EQUIPMENT_TYPES.map((eq) => (
                      <button
                        key={eq}
                        onClick={() => handleFilterChange("equipment", eq)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition border ${
                          selectedEquipment === eq
                            ? "bg-white/20 text-white border-white/30"
                            : "bg-transparent border-white/10 text-slate-500 hover:text-white"
                        }`}
                      >
                        {eq}
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono-data">
                    Showing {pageExercises.length} of {filteredExercises.length} exercises
                    {filteredExercises.length < EXERCISE_COUNT && ` (filtered from ${EXERCISE_COUNT})`}
                  </div>
                </div>

                {/* GIF Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                    {pageExercises.map((ex) => {
                      const isAdded = plannedExercises.some((p) => p.exercise.id === ex.id);
                      return (
                        <div
                          key={ex.id}
                          onClick={() => addExercise(ex)}
                          className={`rounded-2xl border overflow-hidden flex flex-col transition cursor-pointer ${
                            isAdded
                              ? "border-emerald-500/40 bg-emerald-500/5"
                              : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/5"
                          }`}
                        >
                          <div className="aspect-[4/3] bg-black/50 relative overflow-hidden">
                            <img
                              src={ex.gifUrl}
                              alt={ex.name}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                            {isAdded && (
                              <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                              </div>
                            )}
                            <span className="absolute bottom-1.5 left-1.5 text-[9px] font-mono-data px-1.5 py-0.5 rounded bg-black/70 text-white/70">
                              {ex.equipment}
                            </span>
                          </div>
                          <div className="p-2.5">
                            <h4 className="text-xs font-bold text-white leading-tight line-clamp-2">{ex.name}</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                              {ex.targetMuscles.slice(0, 2).join(" · ")}
                            </p>
                            <div className="mt-1.5">
                              <span
                                className={`text-[9px] font-mono-data px-1.5 py-0.5 rounded-full ${
                                  ex.category === "Chest"
                                    ? "bg-orange-500/20 text-orange-300"
                                    : ex.category === "Back"
                                    ? "bg-blue-500/20 text-blue-300"
                                    : ex.category === "Legs"
                                    ? "bg-green-500/20 text-green-300"
                                    : ex.category === "Shoulders"
                                    ? "bg-purple-500/20 text-purple-300"
                                    : ex.category === "Arms"
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : ex.category === "Core"
                                    ? "bg-red-500/20 text-red-300"
                                    : "bg-slate-500/20 text-slate-300"
                                }`}
                              >
                                {ex.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-6 pb-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-mono-data text-slate-400">
                        Page {currentPage + 1} / {totalPages}
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
              <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col">
                <div className="shrink-0 p-4 border-b border-white/10">
                  <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1.5">
                    Routine Name
                  </label>
                  <input
                    type="text"
                    value={routineTitle}
                    onChange={(e) => setRoutineTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm font-bold text-white focus:outline-none"
                  />
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {plannedExercises.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-center">
                      <Dumbbell className="w-8 h-8 text-slate-700 mb-3" />
                      <p className="text-sm text-slate-600 font-medium">No exercises added yet</p>
                      <p className="text-xs text-slate-700 mt-1">Click any exercise on the left to add it</p>
                    </div>
                  ) : (
                    plannedExercises.map((item, idx) => (
                      <div key={item.exercise.id} className="p-3 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="w-5 h-5 rounded-md bg-white/10 text-[10px] font-mono-data font-bold flex items-center justify-center text-white shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-xs font-bold text-white flex-1 leading-tight">{item.exercise.name}</p>
                          <button
                            onClick={() => removeExercise(item.exercise.id)}
                            className="text-slate-600 hover:text-red-400 transition shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <div>
                            <label className="text-[9px] text-slate-600 block mb-0.5">Sets</label>
                            <input
                              type="number"
                              min={1}
                              max={10}
                              value={item.sets}
                              onChange={(e) =>
                                updateExercise(item.exercise.id, "sets", Number(e.target.value))
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs text-white text-center focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-600 block mb-0.5">Reps</label>
                            <input
                              type="text"
                              value={item.reps}
                              onChange={(e) => updateExercise(item.exercise.id, "reps", e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs text-white text-center focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-600 block mb-0.5">Kg</label>
                            <input
                              type="number"
                              min={0}
                              value={item.targetWeightKg}
                              onChange={(e) =>
                                updateExercise(item.exercise.id, "targetWeightKg", Number(e.target.value))
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs text-white text-center focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {plannedExercises.length > 0 && (
                  <div className="shrink-0 p-4 border-t border-white/10 bg-white/[0.02]">
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono-data text-slate-500 mb-3">
                      <span>{plannedExercises.length} exercises</span>
                      <span className="text-right">
                        {plannedExercises.reduce((a, i) => a + i.sets, 0)} total sets
                      </span>
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-sm font-extrabold transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      {isSaving ? "Saving…" : "Save Routine"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
