"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Bot,
  Zap,
  Cpu,
} from "lucide-react";
import { RoleType } from "../navigation/TopNavBar";
import { QUICK_ACCURATE_PROMPTS, ROLE_SYSTEM_PROMPTS } from "@/lib/ai/prompts";

interface SurgeAiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: RoleType;
}

export function SurgeAiDrawer({ isOpen, onClose, currentRole }: SurgeAiDrawerProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [tokensUsed, setTokensUsed] = useState(145);
  const [messages, setMessages] = useState<
    { sender: "user" | "ai"; text: string; timestamp: string; tokens?: number }[]
  >([
    {
      sender: "ai",
      text: `⚡ **Surge AI Copilot Active** (${currentRole.replace("_", " ")} Mode)\nSystem Prompt: Optimized for concise, high-density token responses. How can I assist your workspace today?`,
      timestamp: "Just now",
      tokens: 42,
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const newMsg = {
      sender: "user" as const,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputMessage("");
    setIsGenerating(true);

    setTimeout(() => {
      // Find matching template or generate concise output
      const promptsForRole = QUICK_ACCURATE_PROMPTS[currentRole] || [];
      const match = promptsForRole.find((p) => p.prompt.toLowerCase() === text.toLowerCase() || p.label.toLowerCase() === text.toLowerCase());

      let aiReply = match
        ? match.responseTemplate
        : `⚡ **Surge AI Analysis:**\n- Goal: Processed request for ${currentRole.replace("_", " ")} workspace.\n- Recommendation: Applied structured optimization rules.\n- Token Savings: Response condensed to high-density bullet points.`;

      const generatedTokens = Math.floor(aiReply.length / 4);
      setTokensUsed((prev) => prev + generatedTokens);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          tokens: generatedTokens,
        },
      ]);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Slide-out Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] surge-card border-l border-slate-200 dark:border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                    Surge AI Copilot
                    <span className="text-[10px] font-mono-data bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full border border-slate-300 dark:border-white/10">
                      Gemini 3.6
                    </span>
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Cpu className="w-3 h-3 text-slate-400" />
                    <span>Session Tokens Used: <strong className="font-mono-data text-slate-900 dark:text-white">{tokensUsed}</strong></span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl surge-card text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Token-Optimized Quick Action Chips */}
            <div className="p-3 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
              <p className="text-[10px] font-mono-data text-slate-500 uppercase tracking-wider mb-2">
                Token-Efficient Quick Prompts
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_ACCURATE_PROMPTS[currentRole]?.map((promptObj, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(promptObj.prompt)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 transition text-left flex items-center gap-1.5"
                  >
                    <Zap className="w-3 h-3 text-slate-400" />
                    <span>{promptObj.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "ai" && (
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm ${
                      msg.sender === "user"
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium shadow-sm"
                        : "surge-card text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono-data pt-1 border-t border-slate-200/50 dark:border-white/5">
                      {msg.tokens && <span>~{msg.tokens} tokens</span>}
                      <span className="ml-auto">{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex items-center gap-2 text-xs text-slate-500 animate-pulse pl-10">
                  <Sparkles className="w-4 h-4" />
                  <span>Surge AI (Gemini 3.6) is generating token-dense response...</span>
                </div>
              )}
            </div>

            {/* Input Box */}
            <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={`Ask Surge AI (${currentRole.replace("_", " ")}) for concise analysis...`}
                  className="w-full surge-card rounded-xl py-3 pl-4 pr-12 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputMessage.trim()}
                  className="absolute right-2 p-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 disabled:opacity-40 transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
