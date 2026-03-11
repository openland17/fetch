"use client";

import { useState, useCallback } from "react";
import type { FriendshipSuggestion } from "@/types";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useDogProfile } from "./DogProfileSheet";

interface FriendshipSuggestionCardProps {
  suggestion: FriendshipSuggestion;
  onConfirm: (suggestionId: string) => void;
  onDismiss: (suggestionId: string) => void;
  priority?: boolean;
}

const confettiPositions = [
  { left: "15%", top: "20%", color: "bg-orange" },
  { left: "65%", top: "15%", color: "bg-blue" },
  { left: "35%", top: "55%", color: "bg-orange" },
  { left: "80%", top: "50%", color: "bg-blue" },
  { left: "10%", top: "70%", color: "bg-orange" },
  { left: "50%", top: "30%", color: "bg-blue" },
  { left: "90%", top: "65%", color: "bg-orange" },
  { left: "25%", top: "85%", color: "bg-blue" },
];

export default function FriendshipSuggestionCard({
  suggestion,
  onConfirm,
  onDismiss,
  priority = false,
}: FriendshipSuggestionCardProps) {
  const { openDogProfile } = useDogProfile();
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
      whileTap={{ scale: 0.98 }}
          className={twMerge(
            "rounded-xl shadow-md border border-blue/10 p-4 border-l-4 border-l-blue bg-white overflow-hidden relative",
            status === "added" && "border-l-orange bg-lightorange border-orange/10"
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
                  className={`absolute rounded-full ${pos.color} ${i % 2 === 0 ? "w-3 h-3" : "w-2 h-2"}`}
                  style={{ left: pos.left, top: pos.top }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.06,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          )}

          <div className="flex items-start gap-4">
            <button type="button" onClick={() => openDogProfile(suggestion.dog.id)}>
              <Avatar
                src={suggestion.dog.photoUrl}
                alt={suggestion.dog.name}
                size="md"
                priority={priority}
              />
            </button>
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
            <button
              type="button"
              className="flex-1 text-sm text-grey/60 font-medium py-2 rounded-xl active:bg-grey/10 disabled:opacity-50"
              onClick={handleDismiss}
              disabled={status !== "idle"}
            >
              Not now
            </button>
          </div>
        </motion.div>
  );
}
