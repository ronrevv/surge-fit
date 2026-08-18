"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FOOD_DATABASE, FoodItem, MealItem } from "@/lib/data/exercises";
import { X, Apple, Check, ChevronRight, ChevronLeft, User, Activity, Target, Flame, Beef, Wheat, Droplets, Leaf, Search, Plus, Minus, Trash2, Salad } from "lucide-react";

interface DietPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanSaved?: (plan: { title: string; meals: MealItem[] }, assignToTraineeId?: string) => void;
  trainees?: { id: string; name: string }[];
}

// ─── BMI / TDEE math ────────────────────────────────────────────────────────
type Sex = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "veryActive";
type Goal = "cut" | "maintain" | "bulk";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

const GOAL_MODIFIERS: Record<Goal, number> = {
  cut: -0.2,
  maintain: 0,
  bulk: 0.12,
};

function calcTDEE(weight: number, height: number, age: number, sex: Sex, activity: ActivityLevel): number {
  const bmr = sex === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activity]);
}

function calcMacroTargets(tdee: number, goal: Goal, weight: number) {
  const targetCals = Math.round(tdee * (1 + GOAL_MODIFIERS[goal]));
  const protein = Math.round(weight * (goal === "bulk" ? 2.2 : goal === "cut" ? 2.4 : 1.8));
  const fat = Math.round((targetCals * 0.25) / 9);
  const carbs = Math.round((targetCals - protein * 4 - fat * 9) / 4);
  const fiber = Math.round((targetCals / 1000) * 14);
  return { calories: targetCals, protein, fat, carbs, fiber };
}

// ─── Selected food entry ─────────────────────────────────────────────────────
interface SelectedFood {
  food: FoodItem;
  servings: number; // multiplier of default serving
}

function macrosForEntry(sf: SelectedFood) {
  const grams = sf.food.servingGrams * sf.servings;
  const r = sf.food.per100g;
  return {
    calories: Math.round((r.calories * grams) / 100),
    protein: Math.round((r.protein * grams) / 100 * 10) / 10,
    carbs: Math.round((r.carbs * grams) / 100 * 10) / 10,
    fat: Math.round((r.fat * grams) / 100 * 10) / 10,
    fiber: Math.round((r.fiber * grams) / 100 * 10) / 10,
  };
}

// ─── MacroRing (SVG donut) ────────────────────────────────────────────────────
function MacroRing({ pct, color, size = 64, label, current, target, unit }: {
  pct: number; color: string; size?: number; label: string; current: number; target: number; unit: string;
}) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const filled = Math.min(1, pct / 100) * circ;
  const status = pct >= 95 && pct <= 110 ? "good" : pct > 110 ? "over" : "under";
  const ringColor = status === "good" ? "#22c55e" : status === "over" ? "#ef4444" : color;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={7} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={ringColor} strokeWidth={7}
            strokeDasharray={`${filled} ${circ - filled}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.4s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-white">{Math.round(pct)}%</span>
        </div>
      </div>
      <p className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">{label}</p>
      <p className="text-[10px] font-bold text-white">{current}<span className="text-slate-600">/{target}{unit}</span></p>
    </div>
  );
}

const MACRO_TABS = [
  { key: "protein", label: "Protein", icon: Beef, color: "#3b82f6", ring: "#3b82f6", unit: "g" },
  { key: "carbs", label: "Carbs", icon: Wheat, color: "#f97316", ring: "#f97316", unit: "g" },
  { key: "fats", label: "Fats", icon: Droplets, color: "#eab308", ring: "#eab308", unit: "g" },
  { key: "fiber", label: "Fiber", icon: Leaf, color: "#22c55e", ring: "#22c55e", unit: "g" },
] as const;

type MacroTab = typeof MACRO_TABS[number]["key"];

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (desk job, no exercise)",
  light: "Light (1–3 days/week exercise)",
  moderate: "Moderate (3–5 days/week)",
  active: "Active (6–7 days/week)",
  veryActive: "Very Active (2× per day)",
};

export function DietPlannerModal({ isOpen, onClose, onPlanSaved, trainees }: DietPlannerModalProps) {
  // ── Step ──────────────────────────────────────────────────────────────────
  const [step, setStep] = useState<"profile" | "planner">("profile");
  const [assignToId, setAssignToId] = useState("");
  const [planTitle, setPlanTitle] = useState("Custom Meal Plan");

  // ── Profile ───────────────────────────────────────────────────────────────
  const [weight, setWeight] = useState(75);
  const [height, setHeight] = useState(175);
  const [age, setAge] = useState(28);
  const [sex, setSex] = useState<Sex>("male");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");

  // ── Computed targets ──────────────────────────────────────────────────────
  const tdee = useMemo(() => calcTDEE(weight, height, age, sex, activity), [weight, height, age, sex, activity]);
  const bmi = useMemo(() => Math.round((weight / ((height / 100) ** 2)) * 10) / 10, [weight, height]);
  const targets = useMemo(() => calcMacroTargets(tdee, goal, weight), [tdee, goal, weight]);

  // ── Food picker ───────────────────────────────────────────────────────────
  const [isVegMode, setIsVegMode] = useState(false);
  const [macroTab, setMacroTab] = useState<MacroTab>("protein");
  const [foodSearch, setFoodSearch] = useState("");
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);

  const filteredFoods = useMemo(() => {
    return FOOD_DATABASE.filter(f => {
      const matchesVeg = !isVegMode || f.isVeg;
      const matchesCat = f.macroCategory === macroTab;
      const matchesSearch = f.name.toLowerCase().includes(foodSearch.toLowerCase());
      return matchesVeg && matchesCat && matchesSearch;
    });
  }, [isVegMode, macroTab, foodSearch]);

  const totals = useMemo(() => {
    return selectedFoods.reduce(
      (acc, sf) => {
        const m = macrosForEntry(sf);
        return {
          calories: acc.calories + m.calories,
          protein: Math.round((acc.protein + m.protein) * 10) / 10,
          carbs: Math.round((acc.carbs + m.carbs) * 10) / 10,
          fat: Math.round((acc.fat + m.fat) * 10) / 10,
          fiber: Math.round((acc.fiber + m.fiber) * 10) / 10,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  }, [selectedFoods]);

  const addFood = useCallback((food: FoodItem) => {
    setSelectedFoods(prev => {
      const exists = prev.find(sf => sf.food.id === food.id);
      if (exists) return prev;
      return [...prev, { food, servings: 1 }];
    });
  }, []);

  const removeFood = useCallback((id: string) => {
    setSelectedFoods(prev => prev.filter(sf => sf.food.id !== id));
  }, []);

  const updateServings = useCallback((id: string, delta: number) => {
    setSelectedFoods(prev =>
      prev.map(sf =>
        sf.food.id === id
          ? { ...sf, servings: Math.max(0.5, Math.round((sf.servings + delta) * 2) / 2) }
          : sf
      )
    );
  }, []);

  const handleSave = () => {
    // Convert selected foods to MealItem format for compatibility
    const finalMeals: MealItem[] = selectedFoods.map((sf, i) => ({
      id: `food_${sf.food.id}_${i}`,
      name: `${sf.food.emoji} ${sf.food.name} (${sf.servings}× ${sf.food.servingLabel})`,
      mealType: "Breakfast" as const,
      ...macrosForEntry(sf),
      proteinGrams: macrosForEntry(sf).protein,
      carbsGrams: macrosForEntry(sf).carbs,
      fatGrams: macrosForEntry(sf).fat,
      ingredients: [`${Math.round(sf.food.servingGrams * sf.servings)}g ${sf.food.name}`],
    }));
    if (onPlanSaved) {
      onPlanSaved({ title: planTitle, meals: finalMeals }, assignToId);
    }
    onClose();
  };

  const bmiCategory = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  const bmiColor = bmi < 18.5 ? "text-blue-400" : bmi < 25 ? "text-emerald-400" : bmi < 30 ? "text-orange-400" : "text-red-400";

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
            initial={{ scale: 0.95, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-2 sm:inset-4 lg:inset-6 bg-[#0c0c10] border border-white/10 rounded-3xl z-50 flex flex-col overflow-hidden shadow-2xl text-white"
          >
            {/* ── HEADER ─────────────────────────────────────────────────────── */}
            <div className="shrink-0 px-5 py-4 border-b border-white/8 bg-gradient-to-r from-white/[0.04] to-transparent flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shrink-0">
                <Salad className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                {step === "planner" ? (
                  <input
                    type="text" value={planTitle} onChange={e => setPlanTitle(e.target.value)}
                    className="bg-transparent text-white font-extrabold text-base sm:text-lg w-full focus:outline-none"
                  />
                ) : (
                  <span className="font-extrabold text-white text-base sm:text-lg">Smart Nutrition Planner</span>
                )}
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {step === "profile"
                    ? "Enter your biometric profile for science-backed macro targets"
                    : `TDEE: ${tdee} kcal · Target: ${targets.calories} kcal · BMI: ${bmi}`}
                </p>
              </div>

              {step === "planner" && (
                <>
                  <button
                    onClick={() => setStep("profile")}
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                  >
                    <User className="w-3.5 h-3.5" /> Profile
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={selectedFoods.length === 0}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-extrabold transition flex items-center gap-1.5 shrink-0 disabled:opacity-40"
                  >
                    <Check className="w-3.5 h-3.5" /> Save Plan
                  </button>
                </>
              )}
              <button onClick={onClose} className="p-2 rounded-xl text-slate-600 hover:text-white transition shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── BODY ──────────────────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
              {step === "profile" ? (
                /* ── STEP 1: BIOMETRIC PROFILE ─────────────────────────────── */
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex-1 overflow-y-auto p-5"
                >
                  <div className="max-w-2xl mx-auto space-y-6">
                    {/* BMI Card */}
                    <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white">Body Metrics</h3>
                        <div className="text-right">
                          <span className={`text-2xl font-black ${bmiColor}`}>{bmi}</span>
                          <span className="text-slate-500 text-xs ml-1">BMI</span>
                          <p className={`text-xs font-bold ${bmiColor}`}>{bmiCategory}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {/* Weight */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-slate-500 uppercase font-mono">Weight (kg)</label>
                          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                            <button onClick={() => setWeight(w => Math.max(30, w - 1))} className="text-slate-500 hover:text-white transition"><Minus className="w-3.5 h-3.5" /></button>
                            <input
                              type="number" value={weight} min={30} max={250}
                              onChange={e => setWeight(Number(e.target.value))}
                              className="flex-1 bg-transparent text-center text-white font-bold text-sm focus:outline-none w-12"
                            />
                            <button onClick={() => setWeight(w => Math.min(250, w + 1))} className="text-slate-500 hover:text-white transition"><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>

                        {/* Height */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-slate-500 uppercase font-mono">Height (cm)</label>
                          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                            <button onClick={() => setHeight(h => Math.max(100, h - 1))} className="text-slate-500 hover:text-white transition"><Minus className="w-3.5 h-3.5" /></button>
                            <input
                              type="number" value={height} min={100} max={250}
                              onChange={e => setHeight(Number(e.target.value))}
                              className="flex-1 bg-transparent text-center text-white font-bold text-sm focus:outline-none w-12"
                            />
                            <button onClick={() => setHeight(h => Math.min(250, h + 1))} className="text-slate-500 hover:text-white transition"><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>

                        {/* Age */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-slate-500 uppercase font-mono">Age (years)</label>
                          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                            <button onClick={() => setAge(a => Math.max(10, a - 1))} className="text-slate-500 hover:text-white transition"><Minus className="w-3.5 h-3.5" /></button>
                            <input
                              type="number" value={age} min={10} max={100}
                              onChange={e => setAge(Number(e.target.value))}
                              className="flex-1 bg-transparent text-center text-white font-bold text-sm focus:outline-none w-12"
                            />
                            <button onClick={() => setAge(a => Math.min(100, a + 1))} className="text-slate-500 hover:text-white transition"><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      </div>

                      {/* Sex */}
                      <div className="mt-4">
                        <label className="text-[10px] text-slate-500 uppercase font-mono block mb-2">Biological Sex</label>
                        <div className="flex gap-2">
                          {(["male", "female"] as Sex[]).map(s => (
                            <button
                              key={s} onClick={() => setSex(s)}
                              className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition capitalize ${
                                sex === s ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" : "bg-white/5 border-white/10 text-slate-500 hover:text-white"
                              }`}
                            >
                              {s === "male" ? "♂ Male" : "♀ Female"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Activity Level */}
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-mono block mb-2 flex items-center gap-1.5">
                        <Activity className="w-3 h-3" /> Activity Level
                      </label>
                      <div className="space-y-2">
                        {(Object.entries(ACTIVITY_LABELS) as [ActivityLevel, string][]).map(([key, label]) => (
                          <button
                            key={key} onClick={() => setActivity(key)}
                            className={`w-full text-left px-4 py-3 rounded-xl border transition text-sm ${
                              activity === key
                                ? "bg-blue-500/15 border-blue-500/30 text-blue-300"
                                : "bg-white/[0.03] border-white/8 text-slate-400 hover:border-white/20 hover:text-white"
                            }`}
                          >
                            <span className="font-bold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-[11px] opacity-70 ml-2">{label.split('(')[1]?.replace(')', '') || ''}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Goal */}
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-mono block mb-2 flex items-center gap-1.5">
                        <Target className="w-3 h-3" /> Fitness Goal
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {([
                          { key: "cut", label: "Cut", sub: "-20% calories", color: "bg-red-500/15 border-red-500/30 text-red-300" },
                          { key: "maintain", label: "Maintain", sub: "TDEE calories", color: "bg-blue-500/15 border-blue-500/30 text-blue-300" },
                          { key: "bulk", label: "Bulk", sub: "+12% calories", color: "bg-orange-500/15 border-orange-500/30 text-orange-300" },
                        ] as const).map(g => (
                          <button
                            key={g.key} onClick={() => setGoal(g.key)}
                            className={`py-4 rounded-2xl border transition text-center ${
                              goal === g.key ? g.color : "bg-white/[0.03] border-white/8 text-slate-500 hover:border-white/20"
                            }`}
                          >
                            <p className="font-extrabold text-sm">{g.label}</p>
                            <p className="text-[10px] mt-1 opacity-70">{g.sub}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Computed Targets Preview */}
                    <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Flame className="w-4 h-4 text-orange-400" /> Your Daily Targets
                        </h3>
                        <span className="text-[10px] font-mono text-slate-600">Mifflin-St Jeor Formula</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {[
                          { label: "Calories", value: targets.calories, unit: "kcal", color: "text-white" },
                          { label: "Protein", value: targets.protein, unit: "g", color: "text-blue-400" },
                          { label: "Carbs", value: targets.carbs, unit: "g", color: "text-orange-400" },
                          { label: "Fats", value: targets.fat, unit: "g", color: "text-yellow-400" },
                          { label: "Fiber", value: targets.fiber, unit: "g", color: "text-emerald-400" },
                        ].map(m => (
                          <div key={m.label} className="p-3 rounded-2xl bg-white/5 border border-white/8 text-center">
                            <p className={`text-xl font-black ${m.color}`}>{m.value}</p>
                            <p className="text-[9px] text-slate-500 uppercase font-mono">{m.label}</p>
                            <p className="text-[9px] text-slate-600">{m.unit}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-600 mt-3 text-center">
                        Based on {tdee} kcal TDEE · Protein: {(targets.protein / weight).toFixed(1)}g/kg bodyweight
                      </p>
                    </div>

                    <button
                      onClick={() => setStep("planner")}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg shadow-emerald-500/20"
                    >
                      Build My Meal Plan <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ── STEP 2: FOOD PLANNER ───────────────────────────────────── */
                <motion.div
                  key="planner"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden"
                >
                  {/* LEFT: Macro ring HUD + Food picker ─────────────────────── */}
                  <div className="flex-1 min-h-0 flex flex-col overflow-hidden lg:border-r border-white/8">
                    {/* Macro Rings HUD */}
                    <div className="shrink-0 px-5 py-4 border-b border-white/8 bg-gradient-to-r from-white/[0.03] to-transparent">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex gap-5">
                          <MacroRing pct={Math.round((totals.calories / targets.calories) * 100)} color="#f59e0b" size={58} label="Cals" current={totals.calories} target={targets.calories} unit="kcal" />
                          <MacroRing pct={Math.round((totals.protein / targets.protein) * 100)} color="#3b82f6" size={58} label="Protein" current={totals.protein} target={targets.protein} unit="g" />
                          <MacroRing pct={Math.round((totals.carbs / targets.carbs) * 100)} color="#f97316" size={58} label="Carbs" current={totals.carbs} target={targets.carbs} unit="g" />
                          <MacroRing pct={Math.round((totals.fat / targets.fat) * 100)} color="#eab308" size={58} label="Fats" current={totals.fat} target={targets.fat} unit="g" />
                          <MacroRing pct={Math.round((totals.fiber / targets.fiber) * 100)} color="#22c55e" size={58} label="Fiber" current={totals.fiber} target={targets.fiber} unit="g" />
                        </div>
                        {/* Veg toggle */}
                        <button
                          onClick={() => setIsVegMode(v => !v)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition shrink-0 ${
                            isVegMode
                              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          <span className="text-base">{isVegMode ? "🥦" : "🍖"}</span>
                          {isVegMode ? "Veg Only" : "All Foods"}
                        </button>
                      </div>
                    </div>

                    {/* Macro Tabs */}
                    <div className="shrink-0 px-5 py-3 border-b border-white/8 flex gap-2">
                      {MACRO_TABS.map(tab => {
                        const Icon = tab.icon;
                        const tabTotal = tab.key === "protein" ? totals.protein
                          : tab.key === "carbs" ? totals.carbs
                          : tab.key === "fats" ? totals.fat
                          : totals.fiber;
                        const tabTarget = tab.key === "protein" ? targets.protein
                          : tab.key === "carbs" ? targets.carbs
                          : tab.key === "fats" ? targets.fat
                          : targets.fiber;
                        return (
                          <button
                            key={tab.key} onClick={() => setMacroTab(tab.key)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                              macroTab === tab.key
                                ? "bg-white/10 border-white/25 text-white"
                                : "bg-white/[0.03] border-white/8 text-slate-500 hover:text-white hover:border-white/15"
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" style={{ color: macroTab === tab.key ? tab.color : undefined }} />
                            {tab.label}
                            <span className={`text-[10px] font-mono ml-1 ${tabTotal >= tabTarget * 0.9 ? "text-emerald-400" : "text-slate-600"}`}>
                              {tabTotal}/{tabTarget}g
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Search */}
                    <div className="shrink-0 px-5 py-3 border-b border-white/8">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text" placeholder={`Search ${macroTab} foods…`}
                          value={foodSearch} onChange={e => setFoodSearch(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-white/20 transition"
                        />
                      </div>
                    </div>

                    {/* Food Grid */}
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                        {filteredFoods.map(food => {
                          const isSelected = selectedFoods.some(sf => sf.food.id === food.id);
                          const servingMacros = macrosForEntry({ food, servings: 1 });
                          return (
                            <button
                              key={food.id}
                              onClick={() => isSelected ? removeFood(food.id) : addFood(food)}
                              className={`text-left p-3.5 rounded-2xl border transition group relative ${
                                isSelected
                                  ? "bg-emerald-500/10 border-emerald-500/30"
                                  : "bg-white/[0.03] border-white/8 hover:border-white/20 hover:bg-white/[0.06]"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-2xl shrink-0 mt-0.5">{food.emoji}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-bold text-white leading-tight line-clamp-2">{food.name}</p>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                                  </div>
                                  <p className="text-[10px] text-slate-600 mt-0.5">{food.servingLabel}</p>
                                  <div className="flex gap-2 mt-2 flex-wrap">
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-white/5 text-slate-400">{servingMacros.calories} kcal</span>
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400">{servingMacros.protein}g P</span>
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-orange-500/10 text-orange-400">{servingMacros.carbs}g C</span>
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-yellow-500/10 text-yellow-400">{servingMacros.fat}g F</span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                        {filteredFoods.length === 0 && (
                          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-slate-600 text-sm">No foods found</p>
                            {isVegMode && <p className="text-slate-700 text-xs mt-1">Try disabling Veg-only filter</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Selected foods + calorie summary ──────────────── */}
                  <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 flex flex-col overflow-hidden">
                    <div className="shrink-0 px-4 py-3 border-b border-white/8 bg-white/[0.02]">
                      <p className="text-[10px] font-mono text-slate-500 uppercase">
                        Selected Foods · {selectedFoods.length} items · {totals.calories} kcal total
                      </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                      {selectedFoods.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full min-h-40 text-center">
                          <span className="text-4xl mb-3">🥗</span>
                          <p className="text-sm text-slate-600 font-semibold">No foods selected yet</p>
                          <p className="text-xs text-slate-700 mt-1">Pick foods from the library on the left</p>
                        </div>
                      ) : (
                        selectedFoods.map(sf => {
                          const m = macrosForEntry(sf);
                          return (
                            <div key={sf.food.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-xl shrink-0">{sf.food.emoji}</span>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-white leading-tight truncate">{sf.food.name}</p>
                                    <p className="text-[10px] text-slate-600 mt-0.5">{sf.servings}× {sf.food.servingLabel}</p>
                                  </div>
                                </div>
                                <button onClick={() => removeFood(sf.food.id)} className="text-slate-700 hover:text-red-400 transition shrink-0 mt-0.5">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Servings stepper */}
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2">
                                  <button onClick={() => updateServings(sf.food.id, -0.5)} className="w-6 h-6 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition text-xs font-bold">−</button>
                                  <span className="text-xs font-mono text-white w-8 text-center">{sf.servings}×</span>
                                  <button onClick={() => updateServings(sf.food.id, 0.5)} className="w-6 h-6 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition text-xs font-bold">+</button>
                                </div>
                                <div className="flex gap-1.5">
                                  <span className="text-[9px] font-mono px-1.5 py-1 rounded-lg bg-white/5 text-slate-400">{m.calories} kcal</span>
                                  <span className="text-[9px] font-mono px-1.5 py-1 rounded-lg bg-blue-500/10 text-blue-400">{m.protein}g P</span>
                                  <span className="text-[9px] font-mono px-1.5 py-1 rounded-lg bg-orange-500/10 text-orange-400">{m.carbs}g C</span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Totals + save */}
                    {selectedFoods.length > 0 && (
                      <div className="shrink-0 p-4 border-t border-white/10 mt-auto">
                      {trainees && trainees.length > 0 && (
                        <div className="mb-3">
                          <label className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Assign to Client (Optional)</label>
                          <select
                            value={assignToId}
                            onChange={(e) => setAssignToId(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-white/20 appearance-none"
                          >
                            <option value="">Do not assign yet (Save only)</option>
                            {trainees.map(t => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/8 grid grid-cols-5 gap-2 text-center mb-3">
                          {[
                            { v: totals.calories, u: "kcal", c: "text-white" },
                            { v: totals.protein, u: "P", c: "text-blue-400" },
                            { v: totals.carbs, u: "C", c: "text-orange-400" },
                            { v: totals.fat, u: "F", c: "text-yellow-400" },
                            { v: totals.fiber, u: "Fib", c: "text-emerald-400" },
                          ].map((x, i) => (
                            <div key={i}>
                              <p className={`text-sm font-black ${x.c}`}>{x.v}</p>
                              <p className="text-[9px] text-slate-600 font-mono">{x.u}</p>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={handleSave}
                          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg shadow-emerald-500/20"
                        >
                          <Check className="w-4 h-4" /> Save Nutrition Plan
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
