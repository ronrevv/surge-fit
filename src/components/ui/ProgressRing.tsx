"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProgressRingProps {
  radius?: number;
  stroke?: number;
  progress: number; // 0 to 100
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  radius = 48,
  stroke = 7,
  progress,
  color = "currentColor",
  backgroundColor = "rgba(148, 163, 184, 0.2)",
  children,
}: ProgressRingProps) {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke={backgroundColor}
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
}
