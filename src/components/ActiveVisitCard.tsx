"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bluetooth, LogOut } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { formatDurationFromSeconds } from "@/lib/dateHelpers";
import type { Visit } from "@/types";
import { useDogProfile } from "./DogProfileSheet";

interface ActiveVisitCardProps {
  visit: Visit;
  onEndVisit?: () => void;
}

export default function ActiveVisitCard({ visit, onEndVisit }: ActiveVisitCardProps) {
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
      className="rounded-2xl bg-gradient-to-br from-navy to-[#0F2A45] p-5 mb-4 text-white shadow-lg"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
        </span>
        <span className="text-sm font-medium">
          📍 Currently at {visit.parkName}
        </span>
      </div>

      <p className="text-4xl font-bold tabular-nums tracking-tight">{durationDisplay}</p>
      <p className="text-xs text-white/60 mt-0.5">Duration</p>

      <div className="mt-4">
        <p className="text-xs text-white/70 mb-2">
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

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/50">
          <Bluetooth size={14} strokeWidth={2} className="animate-pulse" />
          <span className="text-xs">Scanning...</span>
        </div>
        {onEndVisit && (
          <Button
            variant="danger"
            size="sm"
            onClick={onEndVisit}
          >
            <LogOut size={14} strokeWidth={2.5} />
            End Visit
          </Button>
        )}
      </div>
    </motion.div>
  );
}
