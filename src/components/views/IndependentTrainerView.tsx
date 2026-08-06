"use client";

import React, { useState } from "react";
import { GlassCard } from "../ui/GlassCard";
import { StatCard } from "../ui/StatCard";
import {
  Zap,
  Plus,
  CreditCard,
  Users,
  Calendar,
  MessageSquare,
  Sparkles,
  Dumbbell,
  Search,
  CheckCircle2,
  DollarSign,
  Send,
} from "lucide-react";

interface IndependentTrainerViewProps {
  activeTab?: string;
}

export function IndependentTrainerView({ activeTab = "dashboard" }: IndependentTrainerViewProps) {
  const [clientSearch, setClientSearch] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "client", text: "Hey Coach! Submitted my weekly video check-in for the deadlift set.", time: "11:05 AM" },
    { sender: "trainer", text: "Awesome! Checking the hip hinge angle now. Form looks pristine.", time: "11:10 AM" },
  ]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      { sender: "trainer", text: chatInput, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setChatInput("");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-slate-900 dark:text-white" />
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              Independent Trainer CRM
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Solo online coaching business • Active Module: <span className="font-bold uppercase font-mono-data text-slate-900 dark:text-white">{activeTab.replace("_", " ")}</span>
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-sm transition">
          <Plus className="w-4 h-4" />
          <span>New Coaching Client</span>
        </button>
      </div>

      {activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Monthly Retainer MRR"
              value="$14,800"
              change="+22% via Stripe"
              changeType="positive"
              icon={<DollarSign className="w-4 h-4 text-slate-500" />}
              sparklineData={[9, 10.5, 11.2, 12, 13.5, 14, 14.8]}
            />
            <StatCard
              title="Online Clients"
              value="32 Athletes"
              subtitle="Avg $460/mo per retainer"
              icon={<Users className="w-4 h-4 text-slate-500" />}
              sparklineData={[22, 24, 26, 28, 29, 31, 32]}
            />
            <StatCard
              title="Check-in Completion"
              value="96.8%"
              change="Form reviews active"
              changeType="positive"
              icon={<CheckCircle2 className="w-4 h-4 text-slate-500" />}
              sparklineData={[90, 92, 94, 95, 96, 96.5, 96.8]}
            />
            <StatCard
              title="Program Templates"
              value="8 Templates"
              subtitle="Hypertrophy & Powerlifting"
              icon={<Dumbbell className="w-4 h-4 text-slate-500" />}
              sparklineData={[4, 5, 6, 6, 7, 8, 8]}
            />
          </div>

          <GlassCard>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-4">
              Direct Client Billing & Stripe Subscriptions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <thead className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono-data text-[11px] uppercase">
                  <tr>
                    <th className="py-3 px-3">Client Name</th>
                    <th className="py-3 px-3">Coaching Tier</th>
                    <th className="py-3 px-3">Monthly Retainer</th>
                    <th className="py-3 px-3">Stripe Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {[
                    { name: "Daniel Craig", plan: "1-on-1 VIP Online Coaching", rate: "$650/mo", status: "Active (Stripe)" },
                    { name: "Jessica Alba", plan: "Hybrid Training & Diet", rate: "$450/mo", status: "Active (Stripe)" },
                    { name: "Tom Hardy", plan: "Strength & Powerlifting", rate: "$500/mo", status: "Renews Tomorrow" },
                  ].map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">{c.name}</td>
                      <td className="py-3.5 px-3 text-slate-500">{c.plan}</td>
                      <td className="py-3.5 px-3 font-mono-data font-bold text-slate-900 dark:text-white">{c.rate}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-data border bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white border-slate-200 dark:border-white/10">
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-semibold text-slate-900 dark:text-white transition">
                          View CRM
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </>
      )}

      {activeTab === "clients" && (
        <GlassCard>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Online Coaching Client CRM</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search clients..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl surge-card text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            {[
              { name: "Daniel Craig", tier: "$650/mo VIP", checkin: "Submitted Today", next: "Video Call Fri" },
              { name: "Jessica Alba", tier: "$450/mo Hybrid", checkin: "Submitted 2d ago", next: "Form Feedback Sent" },
            ].map((c, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex justify-between items-center text-xs">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{c.name}</p>
                  <p className="text-slate-500 font-mono-data mt-0.5">{c.tier} • Check-in: {c.checkin}</p>
                </div>
                <span className="font-mono-data text-slate-500">{c.next}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {activeTab === "chat" && (
        <GlassCard>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold">
                DC
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Daniel Craig</h3>
                <p className="text-[11px] text-slate-500">$650/mo VIP Coaching Client</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto mb-4 p-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "trainer" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                    msg.sender === "trainer"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium"
                      : "bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[10px] opacity-60 mt-1 block text-right font-mono-data">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              placeholder="Message Daniel..."
              className="w-full surge-card p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 rounded-xl focus:outline-none"
            />
            <button onClick={handleSendChat} className="p-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      )}

      {activeTab !== "dashboard" && activeTab !== "clients" && activeTab !== "chat" && (
        <GlassCard>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white capitalize mb-2">
            Independent Trainer Module: {activeTab.replace("_", " ")}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Dedicated solo coaching workspace for {activeTab.replace("_", " ")}. Manage online templates, Stripe retainers, and form video reviews.
          </p>
        </GlassCard>
      )}
    </div>
  );
}
