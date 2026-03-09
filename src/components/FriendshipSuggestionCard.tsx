"use client";

import { useState, useCallback } from "react";
import type { FriendshipSuggestion } from "@/types";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface FriendshipSuggestionCardProps {
  suggestion: FriendshipSuggestion;
  onConfirm: (suggestionId: string) => void;
  onDismiss: (suggestionId: string) => void;
  priority?: boolean;
}

const CONFETTI_COUNT = 4;
const confettiPositions = [
  { left: "20%", top: "30%" },
  { left: "70%", top: "25%" },
  { left: "40%", top: "60%" },
  { left: "80%", top: "55%" },
];

export default function FriendshipSuggestionCard({
  suggestion,
  onConfirm,
  onDismiss,
  priority = false,
}: FriendshipSuggestionCardProps) {
  const [status, setStatus] = useState<"idle" | "added">("idle");

  const handleAdd = useCallback(() => {
    if (status !== "idle") return;
    setStatus("added");
    setTimeout(() => {
      onConfirm(suggestion.id);
    }, 1000);
  }, [suggestion.id, onConfirm, status]);

  const handleDismiss = useCallback(() => {
    if (status !== "idle") return;
    onDismiss(suggestion.id);
  }, [suggestion.id, onDismiss, status]);

  return (
    <motion.div
      key={suggestion.id}
      layout
      initial={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.3 }}
          className={twMerge(
            "rounded-xl shadow-sm p-4 border-l-4 border-l-blue bg-lightblue overflow-hidden relative",
            status === "added" && "border-l-orange bg-lightorange"
          )}
        >
          {status === "added" && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {confettiPositions.map((pos, i) => (
                <motion.span
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-orange"
                  style={{ left: pos.left, top: pos.top }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.08,
                  }}
                />
              ))}
            </motion.div>
          )}

          <div className="flex items-start gap-4">
            <Avatar
              src={suggestion.dog.photoUrl}
              alt={suggestion.dog.name}
              size="md"
              priority={priority}
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[15px] text-charcoal">
                {suggestion.dog.name}
              </p>
              <p className="text-xs text-grey mt-0.5">
                {suggestion.dog.breed}
              </p>
              <p className="text-xs text-charcoal mt-2">
                Cooper spent {suggestion.minutesTogether} min with{" "}
                {suggestion.dog.name} across {suggestion.encounters} visit
                {suggestion.encounters !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-grey mt-1">
                Met at {suggestion.parkName}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={handleAdd}
              disabled={status !== "idle"}
            >
              {status === "added" ? (
                <>
                  <Check size={16} strokeWidth={2.5} />
                  Friend Added!
                </>
              ) : (
                <>Add Friend ✓</>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-grey text-grey"
              onClick={handleDismiss}
              disabled={status !== "idle"}
            >
              Not now
            </Button>
          </div>
        </motion.div>
  );
}
