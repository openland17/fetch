"use client";

import { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}

export default function Header({
  title,
  subtitle,
  rightAction,
  showBack,
  onBack,
}: HeaderProps) {
  return (
    <header
      className="bg-navy text-white pt-[env(safe-area-inset-top)] pb-4 px-4 shrink-0"
      style={{ paddingTop: "calc(1rem + env(safe-area-inset-top))" }}
    >
      <div className="flex items-center justify-between gap-3 min-h-10">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showBack && onBack && (
            <motion.button
              type="button"
              onClick={onBack}
              className="p-1 -ml-1 rounded-lg active:bg-white/10 shrink-0"
              whileTap={{ scale: 0.92 }}
              aria-label="Go back"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </motion.button>
          )}
          <div className="min-w-0">
            <h1 className="text-lg font-bold truncate">{title}</h1>
            {subtitle && (
              <p className="text-sm text-grey mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
        </div>
        {rightAction && <div className="shrink-0">{rightAction}</div>}
      </div>
    </header>
  );
}
