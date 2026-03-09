"use client";

import type { Friendship } from "@/types";
import Avatar from "@/components/ui/Avatar";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface FriendCardProps {
  friend: Friendship;
  priority?: boolean;
}

function formatHours(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes < 0) return "—";
  const hrs = minutes / 60;
  return hrs >= 1 ? `${hrs.toFixed(1)} hrs` : `${Math.round(minutes)} min`;
}

export default function FriendCard({ friend, priority = false }: FriendCardProps) {
  const { dog, totalMinutesTogether, totalEncounters, lastSeenAt } = friend;
  const lastSeenText =
    lastSeenAt.startsWith("At ") ? lastSeenAt.slice(3) : lastSeenAt;

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4"
      whileTap={{ scale: 0.98 }}
    >
      <Avatar
        src={dog.photoUrl}
        alt={dog.name}
        size="md"
        bordered
        priority={priority}
      />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[15px] text-charcoal truncate">{dog.name}</p>
        <p className="text-xs text-grey mt-0.5">{dog.breed}</p>
        <p className="text-xs text-grey mt-1">
          🕐 {formatHours(totalMinutesTogether)} together · 📍 {totalEncounters}{" "}
          visit{totalEncounters !== 1 ? "s" : ""}
        </p>
        <p className="text-xs text-blue mt-0.5">
          Last seen: {lastSeenText}
        </p>
      </div>
      <ChevronRight size={20} className="text-grey shrink-0" strokeWidth={2} />
    </motion.div>
  );
}
