"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DIET_TEMPLATES, MealItem } from "@/lib/data/exercises";
import {
  X,
  Apple,
  Plus,
  Trash2,
  CheckCircle2,
  Flame,
  Check,
  Zap,
} from "lucide-react";

interface DietPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanSaved?: (planTitle: string) => void;
}

export function DietPlannerModal({ isOpen, onClose, onPlanSaved }: DietPlannerModalProps) {
  const [planTitle, setPlanTitle] = useState("High-Protein Muscle Hypertrophy Plan");
  const [targetCalories, setTargetCalories] = useState(2500);
  const [targetProtein, setTargetProtein] = useState(180);
  const [targetCarbs, setTargetCarbs] = useState(250);
  const [targetFat, setTargetFat] = useState(70);
  const [selectedMeals, setSelectedMeals] = useState<MealItem[]>(DIET_TEMPLATES);

  const totalCalories = selectedMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = selectedMeals.reduce((acc, m) => acc + m.proteinGrams, 0);
  const totalCarbs = selectedMeals.reduce((acc, m) => acc + m.carbsGrams, 0);
  const totalFat = selectedMeals.reduce((acc, m) => acc + m.fatGrams, 0);

  const handleSavePlan = () => {
    if (onPlanSaved) onPlanSaved(planTitle);
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
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-bold shadow-md">
                  <Apple className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-extrabold text-lg sm:text-2xl text-white">
                    Macro Nutrition & Diet Planner
                  </h2>
                  <p className="text-xs text-slate-400">
                    Configure caloric targets, protein macro distribution, and daily meal plans.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSavePlan}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-900 font-extrabold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Diet Plan</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-xl surge-card text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden p-4 sm:p-6 gap-6">
              {/* Left Column: Target Sliders & Macro Compliance (5 Cols) */}
              <div className="lg:col-span-5 space-y-4 overflow-y-auto">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                    Target Macro Distribution
                  </h3>

                  <div>
                    <div className="flex justify-between text-xs font-mono-data mb-1">
                      <span className="text-slate-400">Daily Calories</span>
                      <span className="font-bold text-white">{targetCalories} kcal</span>
                    </div>
                    <input
                      type="range"
                      min={1500}
                      max={4000}
                      step={50}
                      value={targetCalories}
                      onChange={(e) => setTargetCalories(Number(e.target.value))}
                      className="w-full accent-white"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono-data mb-1">
                      <span className="text-slate-400">Protein Target</span>
                      <span className="font-bold text-white">{targetProtein}g ({Math.round(((targetProtein * 4) / targetCalories) * 100)}%)</span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={300}
                      step={5}
                      value={targetProtein}
                      onChange={(e) => setTargetProtein(Number(e.target.value))}
                      className="w-full accent-white"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono-data mb-1">
                      <span className="text-slate-400">Carbohydrates Target</span>
                      <span className="font-bold text-white">{targetCarbs}g ({Math.round(((targetCarbs * 4) / targetCalories) * 100)}%)</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={450}
                      step={5}
                      value={targetCarbs}
                      onChange={(e) => setTargetCarbs(Number(e.target.value))}
                      className="w-full accent-white"
                    />
                  </div>
                </div>

                {/* Macro Compliance Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
                    <span className="text-slate-400 font-mono-data uppercase text-[10px]">Logged Calories</span>
                    <p className="font-display font-bold text-xl text-white mt-1">
                      {totalCalories} <span className="text-xs font-normal text-slate-400">/ {targetCalories}</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
                    <span className="text-slate-400 font-mono-data uppercase text-[10px]">Logged Protein</span>
                    <p className="font-display font-bold text-xl text-white mt-1">
                      {totalProtein}g <span className="text-xs font-normal text-slate-400">/ {targetProtein}g</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Meal Distribution List (7 Cols) */}
              <div className="lg:col-span-7 overflow-y-auto space-y-3">
                <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                  Daily Meal Distribution ({selectedMeals.length} Meals)
                </h3>

                {selectedMeals.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <span className="text-[10px] font-mono-data px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 uppercase">
                        {m.mealType}
                      </span>
                      <h4 className="font-bold text-white mt-1 text-sm">{m.name}</h4>
                      <p className="text-slate-400 text-xs mt-0.5">{m.ingredients.join(" • ")}</p>
                    </div>

                    <div className="text-right font-mono-data shrink-0 ml-4">
                      <span className="font-bold text-white text-sm block">{m.calories} kcal</span>
                      <span className="text-xs text-slate-400">{m.proteinGrams}g P | {m.carbsGrams}g C | {m.fatGrams}g F</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
