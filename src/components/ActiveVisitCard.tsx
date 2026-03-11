"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bluetooth } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { formatDurationFromSeconds } from "@/lib/dateHelpers";
import type { Visit } from "@/types";
import { useDogProfile } from "./DogProfileSheet";

/**
 * Isolated component so the 1s timer only re-renders this card, not the entire Visits screen.
 */
export default function ActiveVisitCard({ visit }: { visit: Visit }) {
  const { openDogProfile } = useDogProfile();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const liveTotalSeconds = visit.startedAt
    ? (now - new Date(visit.startedAt).getTime()) / 1000
    : visit.durationMinutes * 60;
  const durationDisplay = formatDurationFromSeconds(Math.max(0, liveTotalSeconds));

  return (
    <motion.div
      className="rounded-xl bg-navy p-4 mb-4 text-white"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-full bg-blue animate-pulse" />
        <span className="text-sm font-medium">
          📍 Currently at {visit.parkName}
        </span>
      </div>

      <p className="text-2xl font-bold tabular-nums">{durationDisplay}</p>
      <p className="text-xs text-white/70 mt-0.5">Duration</p>

      <div className="mt-4">
        <p className="text-xs text-white/80 mb-2">
          Dogs nearby: {visit.dogsEncountered.length}
        </p>
        <div className="flex -space-x-2">
          {visit.dogsEncountered.slice(0, 6).map((vd, i) => (
            <button
              key={vd.dog.id}
              type="button"
              className="ring-2 ring-navy rounded-full"
              onClick={() => openDogProfile(vd.dog.id)}
            >
              <Avatar
                src={vd.dog.photoUrl}
                alt={vd.dog.name}
                size="sm"
                priority={i === 0}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-white/70">
        <Bluetooth size={16} strokeWidth={2} className="animate-pulse" />
        <span className="text-xs">Scanning...</span>
      </div>
    </motion.div>
  );
}
