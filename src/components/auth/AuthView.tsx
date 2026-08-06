"use client";

import React, { useState } from "react";
import { GlassCard } from "../ui/GlassCard";
import {
  Flame,
  ArrowRight,
  ShieldCheck,
  Building2,
  Dumbbell,
  Users,
  Lock,
  Mail,
  Zap,
  UserCheck,
} from "lucide-react";
import { RoleType } from "../navigation/TopNavBar";

interface AuthViewProps {
  onLoginSuccess: (role: RoleType, email: string) => void;
}

export const DEMO_ACCOUNTS: { role: RoleType; email: string; pass: string; title: string; desc: string; icon: any }[] = [
  {
    role: "super_admin",
    email: "admin@surgefit.com",
    pass: "SurgeAdmin2026!",
    title: "Super Admin OS",
    desc: "Platform Governance & Chain Provisioning",
    icon: ShieldCheck,
  },
  {
    role: "chain_owner",
    email: "owner@surgefit.com",
    pass: "SurgeOwner2026!",
    title: "Gym Chain Owner",
    desc: "Enterprise Revenue & Multi-Branch P&L",
    icon: Building2,
  },
  {
    role: "branch_manager",
    email: "branchmanager@surgefit.com",
    pass: "SurgeBranch2026!",
    title: "Branch Manager",
    desc: "Turnstile Attendance & Facility Health",
    icon: Building2,
  },
  {
    role: "trainer",
    email: "trainer@surgefit.com",
    pass: "SurgeTrainer2026!",
    title: "Gym Trainer",
    desc: "Client Roster & Superset Workout Builder",
    icon: Dumbbell,
  },
  {
    role: "independent_trainer",
    email: "solo@surgefit.com",
    pass: "SurgeSolo2026!",
    title: "Independent Trainer",
    desc: "Solo CRM & Stripe Retainer Subscriptions",
    icon: Zap,
  },
  {
    role: "trainee",
    email: "athlete@surgefit.com",
    pass: "SurgeAthlete2026!",
    title: "Trainee Athlete",
    desc: "Daily Pulse, Set Logger & Rest Countdown",
    icon: Flame,
  },
];

export function AuthView({ onLoginSuccess }: AuthViewProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [selectedRole, setSelectedRole] = useState<RoleType>("trainee");
  const [emailInput, setEmailInput] = useState("athlete@surgefit.com");
  const [passwordInput, setPasswordInput] = useState("SurgeAthlete2026!");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const selectDemoAccount = (demo: typeof DEMO_ACCOUNTS[0]) => {
    setSelectedRole(demo.role);
    setEmailInput(demo.email);
    setPasswordInput(demo.pass);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onLoginSuccess(selectedRole, emailInput);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-slate-900 text-white relative overflow-hidden">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center z-10">
        {/* Left Side: Brand Vision */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-black shadow-lg">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="font-display font-black text-2xl tracking-tighter uppercase block">SURGE FIT</span>
              <span className="text-[10px] font-mono-data text-slate-400 tracking-widest uppercase">Operating System for Fitness</span>
            </div>
          </div>

          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
              Enterprise Fitness Operating System
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
              We don't replace trainers. We empower them. Multi-tenant RBAC platform connecting chains, branches, coaches, and athletes.
            </p>
          </div>

          {/* Quick Demo Selector Chips */}
          <div className="space-y-2">
            <p className="text-[11px] font-mono-data text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-white" />
              <span>Click Any Valid Role Account to Test:</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((demo, idx) => {
                const Icon = demo.icon;
                const isSelected = selectedRole === demo.role;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectDemoAccount(demo)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                      isSelected
                        ? "bg-white text-slate-900 font-bold border-white shadow-md scale-[1.02]"
                        : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold truncate">{demo.title}</p>
                      <p className={`text-[10px] truncate ${isSelected ? "text-slate-700" : "text-slate-400"}`}>
                        {demo.email}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Auth Box */}
        <GlassCard className="border-white/20 shadow-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <h2 className="font-display font-extrabold text-xl text-white">
              {isLoginMode ? "Sign In to Workspace" : "Register Account"}
            </h2>
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                type="button"
                onClick={() => setIsLoginMode(true)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  isLoginMode ? "bg-white text-slate-900" : "text-slate-400 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLoginMode(false)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  !isLoginMode ? "bg-white text-slate-900" : "text-slate-400 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-mono-data text-slate-400 uppercase block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white transition"
                  placeholder="name@surgefit.com"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono-data text-slate-400 uppercase block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white transition"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className="text-[10px] font-mono-data text-slate-400 uppercase block">Selected Role Authorization</span>
              <span className="font-bold text-white uppercase font-mono-data mt-0.5 block">{selectedRole.replace("_", " ")}</span>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 rounded-xl bg-white hover:bg-slate-200 text-slate-900 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg disabled:opacity-50 mt-2"
            >
              {isAuthenticating ? (
                <span>Authenticating User Session...</span>
              ) : (
                <>
                  <span>Enter {selectedRole.replace("_", " ")} Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
