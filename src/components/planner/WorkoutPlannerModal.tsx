"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EXERCISE_DATABASE, ExerciseItem } from "@/lib/data/exercises";
import { WorkoutEngineService } from "@/lib/backend/services";
import {
  X,
  Dumbbell,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Check,
  Wand2,
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

export function WorkoutPlannerModal({ isOpen, onClose, onRoutineSaved }: WorkoutPlannerModalProps) {
  const [plannerMode, setPlannerMode] = useState<"manual" | "automated">("automated");
  const [routineTitle, setRoutineTitle] = useState("Hypertrophy Push/Pull Routine");
  const [aiPresetGoal, setAiPresetGoal] = useState<string>("4-Day Push/Pull/Legs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [plannedExercises, setPlannedExercises] = useState<PlannedExerciseItem[]>([
    {
      exercise: EXERCISE_DATABASE[1], // Incline Dumbbell Press
      sets: 4,
      reps: "8-10",
      targetWeightKg: 34,
      restSeconds: 90,
    },
    {
      exercise: EXERCISE_DATABASE[3], // Shoulder Press
      sets: 3,
      reps: "10-12",
      targetWeightKg: 28,
      restSeconds: 60,
    },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const categories = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

  const filteredExercises = EXERCISE_DATABASE.filter((ex) => {
    const matchesCat = selectedCategory === "All" || ex.category === selectedCategory;
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAutoGenerateAi = (preset: string) => {
    setIsAiGenerating(true);
    setAiPresetGoal(preset);
    setTimeout(() => {
      if (preset === "4-Day Push/Pull/Legs") {
        setRoutineTitle("AI 4-Day Push/Pull/Legs Hypertrophy");
        setPlannedExercises([
          { exercise: EXERCISE_DATABASE[0], sets: 4, reps: "6", targetWeightKg: 120, restSeconds: 120 }, // Squat
          { exercise: EXERCISE_DATABASE[1], sets: 4, reps: "8", targetWeightKg: 36, restSeconds: 90 }, // Incline Press
          { exercise: EXERCISE_DATABASE[2], sets: 3, reps: "10", targetWeightKg: 75, restSeconds: 60 }, // Lat Pulldown
          { exercise: EXERCISE_DATABASE[3], sets: 3, reps: "10", targetWeightKg: 28, restSeconds: 60 }, // Shoulder Press
        ]);
      } else if (preset === "Powerlifting 1RM Peak") {
        setRoutineTitle("AI Powerlifting 1RM Peak Program");
        setPlannedExercises([
          { exercise: EXERCISE_DATABASE[0], sets: 5, reps: "3", targetWeightKg: 140, restSeconds: 180 }, // Squat
          { exercise: EXERCISE_DATABASE[4], sets: 5, reps: "3", targetWeightKg: 170, restSeconds: 180 }, // Deadlift
          { exercise: EXERCISE_DATABASE[9], sets: 5, reps: "3", targetWeightKg: 105, restSeconds: 180 }, // Bench Press
        ]);
      } else {
        setRoutineTitle("AI Metabolic Conditioning Circuit");
        setPlannedExercises([
          { exercise: EXERCISE_DATABASE[7], sets: 4, reps: "15", targetWeightKg: 0, restSeconds: 45 }, // Push-Up
          { exercise: EXERCISE_DATABASE[6], sets: 4, reps: "12", targetWeightKg: 0, restSeconds: 45 }, // Leg Raise
          { exercise: EXERCISE_DATABASE[8], sets: 4, reps: "15", targetWeightKg: 12, restSeconds: 45 }, // Lateral Raise
        ]);
      }
      setIsAiGenerating(false);
    }, 500);
  };

  const addExerciseToRoutine = (ex: ExerciseItem) => {
    if (plannedExercises.some((p) => p.exercise.id === ex.id)) return;
    setPlannedExercises((prev) => [
      ...prev,
      { exercise: ex, sets: 3, reps: "10", targetWeightKg: 20, restSeconds: 60 },
    ]);
  };

  const removeExerciseFromRoutine = (id: string) => {
    setPlannedExercises((prev) => prev.filter((p) => p.exercise.id !== id));
  };

  const handleSaveRoutine = async () => {
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
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed inset-4 sm:inset-8 lg:inset-12 bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl z-50 flex flex-col overflow-hidden shadow-2xl text-white"
          >
            {/* Header with Mode Switcher */}
            <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-bold shadow-md">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-extrabold text-lg sm:text-2xl text-white">
                    Interactive Workout Planner
                  </h2>
                  <p className="text-xs text-slate-400">
                    Switch between Manual Custom Selection & Automated Gemini 3.6 AI Generation.
                  </p>
                </div>
              </div>

              {/* Dual Mode Switcher */}
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-2xl bg-white/10 border border-white/10 flex gap-1">
                  <button
                    onClick={() => setPlannerMode("manual")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      plannerMode === "manual" ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>Manual Custom</span>
                  </button>
                  <button
                    onClick={() => setPlannerMode("automated")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      plannerMode === "automated" ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>⚡ Automated AI</span>
                  </button>
                </div>

                <button
                  onClick={handleSaveRoutine}
                  disabled={isSaving || plannedExercises.length === 0}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-900 font-extrabold text-xs sm:text-sm shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? "Saving..." : "Save Routine"}</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-xl surge-card text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mode 1: AUTOMATED AI GENERATOR BAR */}
            {plannerMode === "automated" && (
              <div className="p-4 border-b border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-white" />
                  <span className="text-xs font-mono-data text-slate-300">Select AI Preset Program:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "4-Day Push/Pull/Legs",
                    "Powerlifting 1RM Peak",
                    "Fat Loss HIIT Circuit",
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleAutoGenerateAi(preset)}
                      disabled={isAiGenerating}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                        aiPresetGoal === preset
                          ? "bg-white text-slate-900 border-white shadow-sm"
                          : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      ⚡ {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content Body */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
              {/* Left Column: Exercise Search & GIF Library (7 Cols) */}
              <div className="lg:col-span-7 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-white/10 overflow-y-auto space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search exercise library..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-1 overflow-x-auto pb-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                          selectedCategory === cat
                            ? "bg-white text-slate-900"
                            : "bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exercise GIF Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredExercises.map((ex) => {
                    const isAdded = plannedExercises.some((p) => p.exercise.id === ex.id);
                    return (
                      <div
                        key={ex.id}
                        className={`p-3 rounded-2xl border transition flex flex-col justify-between ${
                          isAdded
                            ? "bg-white/10 border-white/30"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/40 mb-2 relative">
                          <img
                            src={ex.gifUrl}
                            alt={ex.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 text-[10px] font-mono-data px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">
                            {ex.equipment}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-white">{ex.name}</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {ex.targetMuscles.map((m, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-mono-data text-slate-400 bg-white/5 px-2 py-0.5 rounded"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => addExerciseToRoutine(ex)}
                          disabled={isAdded}
                          className={`w-full mt-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                            isAdded
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-white text-slate-900 hover:bg-slate-200"
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Added to Routine</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Exercise</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Planned Sequence & Parameters (5 Cols) */}
              <div className="lg:col-span-5 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between">
                <div>
                  <div className="mb-4">
                    <label className="text-[11px] font-mono-data text-slate-400 uppercase block mb-1">
                      Routine Title
                    </label>
                    <input
                      type="text"
                      value={routineTitle}
                      onChange={(e) => setRoutineTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm font-bold text-white focus:outline-none"
                    />
                  </div>

                  <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Routine Sequence ({plannedExercises.length})</span>
                    <span className="text-xs text-slate-400 font-mono-data">Target RPE 8</span>
                  </h3>

                  <div className="space-y-3">
                    {plannedExercises.map((item, idx) => (
                      <div
                        key={item.exercise.id}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-white/10 font-mono-data font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="font-bold text-white text-xs sm:text-sm">{item.exercise.name}</p>
                            <p className="text-slate-400 text-[11px] font-mono-data mt-0.5">
                              {item.sets} Sets x {item.reps} Reps @ {item.targetWeightKg}kg
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => removeExerciseFromRoutine(item.exercise.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
