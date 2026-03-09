"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSkeleton from "./LoadingSkeleton";

const ONBOARDED_KEY = "fetch-onboarded";
const INITIAL_DELAY_MS = 600;

export default function InitialLoadGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isOnboarded = localStorage.getItem(ONBOARDED_KEY) === "1";
    if (!isOnboarded) {
      setReady(true);
      return;
    }
    const t = setTimeout(() => setReady(true), INITIAL_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!ready ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <LoadingSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
