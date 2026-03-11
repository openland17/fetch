"use client";

import type { Dog } from "@/types";
import Avatar from "@/components/ui/Avatar";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { useDogProfile } from "./DogProfileSheet";

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
  const { openDogProfile } = useDogProfile();
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => openDogProfile(dog.id)}
      className={twMerge(
        "rounded-xl shadow-sm border p-4 flex items-center gap-4 bg-white border-grey/10",
        isFriend && "border-l-4 border-l-orange bg-lightorange/40 border-orange/20",
        hasPendingSuggestion && !isFriend && "border-l-4 border-l-blue bg-lightblue/30 border-blue/20"
      )}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className={twMerge(
        "rounded-full ring-2 ring-offset-2 shrink-0",
        isFriend ? "ring-orange" : "ring-grey/20"
      )}>
        <Avatar
          src={dog.photoUrl}
          alt={dog.name}
          size="md"
          bordered={false}
          priority={priority}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[15px] text-charcoal truncate">{dog.name}</span>
          {isFriend && (
            <span className="inline-flex items-center bg-orange/10 text-orange text-[10px] font-semibold rounded-full px-2 py-0.5 shrink-0">
              ⭐ Friend
            </span>
          )}
        </div>
        <p className="text-xs text-grey mt-0.5">{dog.breed} · {dog.colour}</p>
        <p className="text-xs text-grey/60 mt-0.5">
          Arrived {arrivedMinutesAgo} min ago
        </p>
        {hasPendingSuggestion && !isFriend && (
          <p className="text-xs text-blue font-medium mt-1">
            You&apos;ve played with {dog.name} before
          </p>
        )}
      </div>
    </motion.div>
  );
}
