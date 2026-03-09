"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const DURATION = 0.15;

const variants = {
  tab: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: DURATION },
  },
  push: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    transition: { duration: 0.25, ease: "easeInOut" },
  },
};

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isParkDetail = pathname.startsWith("/park/");
  const isOnboarding = pathname === "/onboarding";
  const v = isParkDetail && !isOnboarding ? variants.push : variants.tab;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={v.initial}
        animate={v.animate}
        exit={v.exit}
        transition={v.transition}
        className="flex flex-col min-h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
