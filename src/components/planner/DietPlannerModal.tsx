"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DIET_TEMPLATES, MealItem } from "@/lib/data/exercises";
import { X, Apple, Check } from "lucide-react";

interface DietPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanSaved?: (plan: { title: string; meals: MealItem[] }) => void;
}

export function DietPlannerModal({ isOpen, onClose, onPlanSaved }: DietPlannerModalProps) {
  const [planTitle, setPlanTitle] = useState("High-Protein Muscle Hypertrophy Plan");
  const [targetCalories, setTargetCalories] = useState(2600);
  const [targetProtein, setTargetProtein] = useState(180);
  const [targetCarbs, setTargetCarbs] = useState(250);
  const [targetFat, setTargetFat] = useState(70);
  const [selectedMeals, setSelectedMeals] = useState<MealItem[]>(DIET_TEMPLATES);

  const totalCalories = selectedMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = selectedMeals.reduce((acc, m) => acc + m.proteinGrams, 0);
  const totalCarbs = selectedMeals.reduce((acc, m) => acc + m.carbsGrams, 0);
  const totalFat = selectedMeals.reduce((acc, m) => acc + m.fatGrams, 0);

  const toggleMeal = (meal: MealItem) => {
    setSelectedMeals((prev) =>
      prev.some((m) => m.id === meal.id)
        ? prev.filter((m) => m.id !== meal.id)
        : [...prev, meal]
    );
  };

  const handleSave = () => {
    if (onPlanSaved) onPlanSaved({ title: planTitle, meals: selectedMeals });
    onClose();
  };

  const macroBar = (current: number, target: number, color: string) => {
    const pct = Math.min(100, Math.round((current / target) * 100));
    return (
      <div className="w-full bg-white/5 rounded-full h-1.5 mt-1">
        <div className={`h-1.5 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    );
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
            className="fixed inset-2 sm:inset-4 lg:inset-8 bg-[#0f0f13] border border-white/10 rounded-3xl z-50 flex flex-col overflow-hidden shadow-2xl text-white"
          >
            {/* Header */}
            <div className="shrink-0 px-5 py-4 border-b border-white/10 flex items-center gap-3 bg-white/[0.03]">
              <div className="w-9 h-9 rounded-xl bg-white text-slate-900 flex items-center justify-center shadow">
                <Apple className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-extrabold text-white text-base sm:text-lg">Diet & Macro Planner</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Set your daily macro targets and build your meal plan manually.
                </p>
              </div>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-extrabold transition flex items-center gap-1.5 shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
                Save Plan
              </button>
              <button onClick={onClose} className="p-2 rounded-xl text-slate-500 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
              {/* Left: Targets + Compliance */}
              <div className="lg:col-span-5 p-5 overflow-y-auto border-b lg:border-b-0 lg:border-r border-white/10 space-y-5">
                {/* Plan Title */}
                <div>
                  <label className="text-[10px] font-mono-data text-slate-500 uppercase block mb-1.5">Plan Name</label>
                  <input
                    type="text"
                    value={planTitle}
                    onChange={(e) => setPlanTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm font-bold text-white focus:outline-none"
                  />
                </div>

                {/* Macro Sliders */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Target Macro Targets</h3>

                  <div>
                    <div className="flex justify-between text-xs font-mono-data mb-1">
                      <span className="text-slate-400">Daily Calories</span>
                      <span className="font-bold text-white">{targetCalories} kcal</span>
                    </div>
                    <input
                      type="range" min={1200} max={5000} step={50}
                      value={targetCalories}
                      onChange={(e) => setTargetCalories(Number(e.target.value))}
                      className="w-full accent-white"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono-data mb-1">
                      <span className="text-slate-400">Protein</span>
                      <span className="font-bold text-white">{targetProtein}g</span>
                    </div>
                    <input
                      type="range" min={50} max={400} step={5}
                      value={targetProtein}
                      onChange={(e) => setTargetProtein(Number(e.target.value))}
                      className="w-full accent-white"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono-data mb-1">
                      <span className="text-slate-400">Carbohydrates</span>
                      <span className="font-bold text-white">{targetCarbs}g</span>
                    </div>
                    <input
                      type="range" min={20} max={600} step={5}
                      value={targetCarbs}
                      onChange={(e) => setTargetCarbs(Number(e.target.value))}
                      className="w-full accent-white"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono-data mb-1">
                      <span className="text-slate-400">Fat</span>
                      <span className="font-bold text-white">{targetFat}g</span>
                    </div>
                    <input
                      type="range" min={20} max={300} step={5}
                      value={targetFat}
                      onChange={(e) => setTargetFat(Number(e.target.value))}
                      className="w-full accent-white"
                    />
                  </div>
                </div>

                {/* Compliance Summary */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Daily Compliance</h3>

                  {[
                    { label: "Calories", current: totalCalories, target: targetCalories, unit: "kcal", color: "bg-white" },
                    { label: "Protein", current: totalProtein, target: targetProtein, unit: "g", color: "bg-blue-400" },
                    { label: "Carbs", current: totalCarbs, target: targetCarbs, unit: "g", color: "bg-orange-400" },
                    { label: "Fat", current: totalFat, target: targetFat, unit: "g", color: "bg-yellow-400" },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="flex justify-between text-xs font-mono-data">
                        <span className="text-slate-400">{m.label}</span>
                        <span className="text-white font-bold">{m.current}{m.unit} <span className="text-slate-500">/ {m.target}{m.unit}</span></span>
                      </div>
                      {macroBar(m.current, m.target, m.color)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Meal Library */}
              <div className="lg:col-span-7 p-5 overflow-y-auto space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Meal Library — Select Your Meals ({selectedMeals.length} selected)
                </h3>

                {DIET_TEMPLATES.map((meal) => {
                  const isSelected = selectedMeals.some((m) => m.id === meal.id);
                  return (
                    <div
                      key={meal.id}
                      onClick={() => toggleMeal(meal)}
                      className={`p-4 rounded-2xl border cursor-pointer transition ${
                        isSelected
                          ? "bg-white/10 border-white/30"
                          : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono-data px-2 py-0.5 rounded-full bg-white/10 text-slate-400 uppercase">
                              {meal.mealType}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] font-bold text-emerald-400">✓ Selected</span>
                            )}
                          </div>
                          <h4 className="font-bold text-white text-sm">{meal.name}</h4>
                          <p className="text-slate-500 text-[11px] mt-1">{meal.ingredients.join(" · ")}</p>
                        </div>
                        <div className="text-right font-mono-data shrink-0">
                          <span className="font-bold text-white text-sm block">{meal.calories} kcal</span>
                          <span className="text-[10px] text-slate-500">
                            {meal.proteinGrams}g P | {meal.carbsGrams}g C | {meal.fatGrams}g F
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
