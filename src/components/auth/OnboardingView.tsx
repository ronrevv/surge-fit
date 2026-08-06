"use client";

import React, { useState } from "react";
import { GlassCard } from "../ui/GlassCard";
import { Sparkles, CheckCircle2, ArrowRight, Target, Dumbbell, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface OnboardingViewProps {
  onCompleteOnboarding: () => void;
}

export function OnboardingView({ onCompleteOnboarding }: OnboardingViewProps) {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState("Hypertrophy & Strength");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#090a0f] text-slate-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <GlassCard className="p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-slate-900 dark:text-white" />
              <h2 className="font-display font-extrabold text-lg">SurgeFit Setup Assistant</h2>
            </div>
            <span className="text-xs font-mono-data text-slate-500">Step {step} of 3</span>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-base">Select Your Primary Fitness Goal</h3>
              <div className="space-y-2">
                {[
                  { title: "Hypertrophy & Muscle Gain", desc: "Build lean muscle mass with progressive overload" },
                  { title: "Strength & 1RM Peak", desc: "Focus on Squat, Bench, and Deadlift powerlifting PRs" },
                  { title: "Fat Loss & Conditioning", desc: "High-intensity circuits & calorie deficit tracking" },
                  { title: "Mobility & Athletic Recovery", desc: "Injury prevention, yoga flows, and joint longevity" },
                ].map((g, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedGoal(g.title)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      selectedGoal === g.title
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold"
                        : "surge-card text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-xs sm:text-sm">{g.title}</p>
                      <p className="text-[11px] opacity-75 mt-0.5">{g.desc}</p>
                    </div>
                    {selectedGoal === g.title && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full mt-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
              >
                <span>Continue to Biometrics</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-base">Configure Athlete Biometrics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono-data text-slate-500 uppercase block mb-1">Body Weight (kg)</label>
                  <input
                    type="number"
                    defaultValue={78}
                    className="w-full surge-card p-2.5 text-xs rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono-data text-slate-500 uppercase block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    defaultValue={182}
                    className="w-full surge-card p-2.5 text-xs rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono-data text-slate-500 uppercase block mb-1">Weekly Training Days</label>
                <select className="w-full surge-card p-2.5 text-xs rounded-xl text-slate-900 dark:text-white focus:outline-none">
                  <option>4 Days / Week (Upper/Lower Split)</option>
                  <option>5 Days / Week (Push/Pull/Legs)</option>
                  <option>3 Days / Week (Full Body)</option>
                </select>
              </div>
              <button
                onClick={() => setStep(3)}
                className="w-full mt-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
              >
                <span>Initialize AI Persona</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center mx-auto mb-2 shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display font-extrabold text-xl">SurgeFit Persona Ready!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your athlete profile, biometrics, and Gemini 3.6 AI Copilot have been initialized with active Supabase RLS policies.
              </p>
              <button
                onClick={onCompleteOnboarding}
                className="w-full mt-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-sm transition"
              >
                Launch Workspace OS
              </button>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
