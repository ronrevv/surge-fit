"use client";

import React, { useState } from "react";
import { GlassCard } from "../ui/GlassCard";
import { Flame, ArrowRight, ShieldCheck, Mail, Lock, Phone, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface AuthViewProps {
  onLoginSuccess: (role?: string) => void;
}

export function AuthView({ onLoginSuccess }: AuthViewProps) {
  const [mode, setMode] = useState<"login" | "register" | "otp">("login");
  const [email, setEmail] = useState("athlete@surgefit.pro");
  const [password, setPassword] = useState("••••••••••••");
  const [selectedRole, setSelectedRole] = useState("trainee");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#090a0f] text-slate-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center mx-auto mb-3 shadow-md">
            <Flame className="w-7 h-7" />
          </div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight">
            SURGE<span className="text-slate-500 dark:text-slate-400">FIT</span> PRO OS
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            The Operating System for the Fitness Industry
          </p>
        </div>

        <GlassCard className="p-6 sm:p-8">
          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-100 dark:bg-white/10 p-1 rounded-xl mb-6 text-xs font-semibold">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-lg transition ${
                mode === "login"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 rounded-lg transition ${
                mode === "register"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => setMode("otp")}
              className={`flex-1 py-2 rounded-lg transition ${
                mode === "otp"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Phone OTP
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-xs font-mono-data text-slate-500 uppercase block mb-1">
                  Select Primary Account Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full surge-card rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="trainee">Trainee Athlete</option>
                  <option value="trainer">Gym Trainer</option>
                  <option value="independent_trainer">Independent Trainer</option>
                  <option value="branch_manager">Gym Branch Manager</option>
                  <option value="chain_owner">Gym Chain Owner</option>
                  <option value="super_admin">Super Admin OS</option>
                </select>
              </div>
            )}

            {mode !== "otp" ? (
              <>
                <div>
                  <label className="text-xs font-mono-data text-slate-500 uppercase block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="name@surgefit.pro"
                      className="w-full surge-card pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono-data text-slate-500 uppercase block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="w-full surge-card pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="text-xs font-mono-data text-slate-500 uppercase block mb-1">
                  Mobile Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    required
                    className="w-full surge-card pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition"
            >
              <span>{mode === "login" ? "Sign In to Workspace" : mode === "register" ? "Create SurgeFit Account" : "Send One-Time Password"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social Sign In Divider */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 text-center">
            <p className="text-[11px] text-slate-400 font-mono-data mb-3 uppercase">Or continue with</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onLoginSuccess("trainee")}
                className="py-2 px-3 rounded-xl surge-card text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition"
              >
                Google SSO
              </button>
              <button
                onClick={() => onLoginSuccess("trainee")}
                className="py-2 px-3 rounded-xl surge-card text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition"
              >
                Apple ID
              </button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
