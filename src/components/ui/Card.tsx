"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

type HighlightVariant = "blue" | "orange" | "none";

interface CardProps {
  children: ReactNode;
  className?: string;
  highlighted?: HighlightVariant;
  onTap?: () => void;
}

export default function Card({
  children,
  className,
  highlighted = "none",
  onTap,
}: CardProps) {
  const borderClass =
    highlighted === "blue"
      ? "border-l-4 border-l-blue"
      : highlighted === "orange"
        ? "border-l-4 border-l-orange"
        : "";

  const baseClass =
    "bg-white rounded-xl shadow-sm p-4 text-left " + borderClass;

  if (onTap) {
    return (
      <motion.div
        role="button"
        tabIndex={0}
        onClick={onTap}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onTap();
          }
        }}
        className={twMerge(baseClass, className)}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={twMerge(baseClass, className)}>{children}</div>;
}
