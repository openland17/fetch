"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share } from "lucide-react";

const DISMISSED_KEY = "fetch-ath-dismissed";

export default function AddToHomeBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      || ("standalone" in window.navigator && (window.navigator as { standalone?: boolean }).standalone);
    if (isStandalone) return;
    if (localStorage.getItem(DISMISSED_KEY) === "1") return;
    const t = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-20 left-4 right-4 z-[80] max-w-[398px] mx-auto bg-white rounded-xl shadow-lg border border-grey/20 p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-white text-lg shrink-0">
            🐕
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-charcoal">Add Fetch to Home Screen</p>
            <p className="text-xs text-grey mt-0.5 flex items-center gap-1">
              Tap <Share size={12} className="inline" /> then &quot;Add to Home Screen&quot;
            </p>
          </div>
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-grey/10 flex items-center justify-center shrink-0"
            onClick={dismiss}
          >
            <X size={16} className="text-grey" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
