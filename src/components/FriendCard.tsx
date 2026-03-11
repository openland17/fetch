"use client";

import type { Friendship } from "@/types";
import Avatar from "@/components/ui/Avatar";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useDogProfile } from "./DogProfileSheet";
import { getMilestone } from "@/lib/milestones";

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
  const { openDogProfile } = useDogProfile();
  const milestone = getMilestone(totalEncounters, totalMinutesTogether);

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-grey/10 p-4 flex items-center gap-4 cursor-pointer"
      whileTap={{ scale: 0.97 }}
      role="button"
      tabIndex={0}
      onClick={() => openDogProfile(dog.id)}
    >
      <div className="rounded-full ring-2 ring-offset-2 ring-orange shrink-0">
        <Avatar
          src={dog.photoUrl}
          alt={dog.name}
          size="md"
          bordered={false}
          priority={priority}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold text-[15px] text-charcoal truncate">{dog.name}</p>
          <span className="inline-flex items-center bg-offwhite text-[10px] font-semibold rounded-full px-1.5 py-0.5 shrink-0" title={milestone.label}>
            {milestone.emoji} {milestone.label}
          </span>
        </div>
        <p className="text-xs text-grey mt-0.5">{dog.breed}</p>
        <p className="text-xs text-grey mt-1">
          🕐 {formatHours(totalMinutesTogether)} · 📍 {totalEncounters} visit{totalEncounters !== 1 ? "s" : ""}
        </p>
        <p className="text-xs text-blue mt-0.5 font-medium">
          Last seen: {lastSeenText}
        </p>
      </div>
      <ChevronRight size={18} className="text-grey/40 shrink-0" strokeWidth={2} />
    </motion.div>
  );
}
