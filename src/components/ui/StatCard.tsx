"use client";

import React from "react";
import { GlassCard } from "./GlassCard";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
  icon?: React.ReactNode;
  sparklineData?: number[];
}

export function StatCard({
  title,
  value,
  change,
  changeType = "positive",
  subtitle,
  icon,
  sparklineData = [40, 55, 35, 60, 75, 65, 85, 95],
}: StatCardProps) {
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * 100;
      const y = 30 - ((val - min) / (max - min || 1)) * 25;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <GlassCard hoverEffect className="group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono-data text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between mt-3">
        <div>
          <p className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            {value}
          </p>

          {change && (
            <div className="flex items-center gap-1.5 text-xs font-mono-data font-semibold mt-1">
              {changeType === "positive" && (
                <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {change}
                </span>
              )}
              {changeType === "negative" && (
                <span className="flex items-center text-rose-600 dark:text-rose-400">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  {change}
                </span>
              )}
              {changeType === "neutral" && (
                <span className="flex items-center text-slate-500">
                  <Minus className="w-3.5 h-3.5" />
                  {change}
                </span>
              )}
            </div>
          )}

          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono-data">
              {subtitle}
            </p>
          )}
        </div>

        {/* Minimalist SVG Sparkline */}
        <div className="w-20 h-10 opacity-70 group-hover:opacity-100 transition-opacity">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 35">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={
                changeType === "positive"
                  ? "text-emerald-500"
                  : changeType === "negative"
                  ? "text-rose-500"
                  : "text-slate-400"
              }
              points={points}
            />
          </svg>
        </div>
      </div>
    </GlassCard>
  );
}
