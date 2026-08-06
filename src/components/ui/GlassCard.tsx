"use client";

import React from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowEffect?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  hoverEffect = false,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -1 } : undefined}
      transition={{ duration: 0.15, ease: "easeOut" }}
      onClick={onClick}
      className={clsx(
        "surge-card rounded-2xl p-5 relative overflow-hidden transition-all duration-200",
        hoverEffect && "surge-card-hover cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
