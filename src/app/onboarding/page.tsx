"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

const ONBOARDED_KEY = "fetch-onboarded";

const CARDS = [
  {
    emoji: "🐕",
    title: "Meet Friends at the Park",
    body: "Fetch tracks which dogs your dog plays with — automatically.",
  },
  {
    emoji: "📍",
    title: "See Who's Nearby",
    body: "Check which dogs are at which parks before you go.",
  },
  {
    emoji: "🔔",
    title: "Get Notified",
    body: "Know when your dog's friends arrive at a nearby park.",
  },
  {
    emoji: "📡",
    title: "Your Dog Wears a Fetch Tag",
    body: "A lightweight Bluetooth tag handles the rest — no phone needed at the park.",
  },
];

export default function OnboardingPage() {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const handleGetStarted = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(ONBOARDED_KEY, "1");
    }
    router.replace("/");
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50 && index < CARDS.length - 1) setIndex((i) => i + 1);
    if (info.offset.x > 50 && index > 0) setIndex((i) => i - 1);
  };

  return (
    <div className="min-h-safe-screen flex flex-col bg-offwhite">
      <div
        className="absolute top-0 right-0 z-10 pr-4"
        style={{ paddingTop: "calc(1rem + env(safe-area-inset-top))" }}
      >
        <motion.button
          type="button"
          onClick={handleGetStarted}
          className="py-2 px-4 text-blue font-semibold text-sm"
          whileTap={{ scale: 0.95 }}
        >
          Skip
        </motion.button>
      </div>
      <div className="flex-1 flex flex-col justify-center px-6 pt-12 pb-8">
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-xl shadow-sm p-8 text-center"
            >
              <motion.span
                className="text-6xl block mb-6"
                aria-hidden
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {CARDS[index].emoji}
              </motion.span>
              <h2 className="text-xl font-bold text-charcoal mb-3">
                {CARDS[index].title}
              </h2>
              <p className="text-grey text-[15px] leading-relaxed">
                {CARDS[index].body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {CARDS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className="w-2.5 h-2.5 rounded-full transition-colors min-w-[10px] min-h-[10px]"
              style={{
                backgroundColor: i === index ? "#1A7BBF" : "#E8F0F7",
              }}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="px-6 pb-12 pt-4">
        {index === CARDS.length - 1 ? (
          <motion.button
            type="button"
            onClick={handleGetStarted}
            className="relative w-full py-4 rounded-xl bg-blue text-white font-bold text-base overflow-hidden"
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Get Started</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.button>
        ) : (
          <motion.button
            type="button"
            onClick={() => setIndex((i) => i + 1)}
            className="w-full py-3 text-grey font-medium text-sm"
            whileTap={{ scale: 0.95 }}
          >
            Next
          </motion.button>
        )}
      </div>
    </div>
  );
}
