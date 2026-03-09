"use client";

import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";

export type ToastVariant = "success" | "info" | "warning";

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-success text-white",
  info: "bg-blue text-white",
  warning: "bg-orange text-white",
};

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  visible: boolean;
}

export default function Toast({
  message,
  variant = "info",
  visible,
}: ToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={twMerge(
            "fixed left-4 right-4 top-4 z-[100] mx-auto max-w-[398px] rounded-xl px-4 py-3 text-center text-sm font-medium shadow-lg",
            variantStyles[variant]
          )}
          role="status"
          aria-live="polite"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
