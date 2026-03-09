"use client";

import type { Dog } from "@/types";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

interface DogAtParkCardProps {
  dog: Dog;
  isFriend: boolean;
  arrivedMinutesAgo: number;
  hasPendingSuggestion?: boolean;
  priority?: boolean;
}

export default function DogAtParkCard({
  dog,
  isFriend,
  arrivedMinutesAgo,
  hasPendingSuggestion,
  priority = false,
}: DogAtParkCardProps) {
  return (
    <motion.div
      className={twMerge(
        "rounded-xl shadow-sm p-4 flex items-center gap-4 bg-white",
        isFriend && "border-l-4 border-l-orange bg-lightorange",
        hasPendingSuggestion && !isFriend && "border-l-4 border-l-blue bg-lightblue/50"
      )}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Avatar
        src={dog.photoUrl}
        alt={dog.name}
        size="md"
        bordered={isFriend}
        priority={priority}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-[15px] text-charcoal truncate">{dog.name}</span>
          {isFriend && (
            <Badge variant="orange">⭐ Friend</Badge>
          )}
        </div>
        <p className="text-xs text-grey mt-0.5">
          {dog.breed} · {dog.colour}
        </p>
        <p className="text-xs text-grey mt-1">
          Arrived {arrivedMinutesAgo} min ago
        </p>
        {hasPendingSuggestion && !isFriend && (
          <p className="text-xs text-blue mt-1">
            You&apos;ve played with {dog.name} before
          </p>
        )}
      </div>
    </motion.div>
  );
}
