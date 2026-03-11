"use client";

import { useState } from "react";
import type { Visit } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatVisitDate, formatDuration } from "@/lib/dateHelpers";
import { useApp } from "@/hooks/useAppState";
import { useDogProfile } from "./DogProfileSheet";

interface VisitSummaryCardProps {
  visit: Visit;
}

export default function VisitSummaryCard({ visit }: VisitSummaryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { state, addFriendFromSuggestion } = useApp();
  const { openDogProfile } = useDogProfile();

  const friendIds = new Set(state.friendships.map((f) => f.dog.id));
  const suggestionByDogId = new Map(
    state.suggestions.map((s) => [s.dog.id, s])
  );

  const dateLabel = formatVisitDate(visit.date);
  const durationText = formatDuration(visit.durationMinutes);
  const dogCount = visit.dogsEncountered.length;

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm overflow-hidden"
      layout
      whileTap={{ scale: 0.98 }}
    >
      <button
        type="button"
        className="w-full p-4 min-h-[44px] flex items-center gap-3 text-left"
        onClick={() => setExpanded((e) => !e)}
      >
        <span className="shrink-0 rounded-lg bg-lightblue text-blue text-xs font-semibold px-2.5 py-1.5">
          {dateLabel}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[15px] text-charcoal truncate">
            {visit.parkName}
          </p>
          <p className="text-xs text-grey">{durationText}</p>
        </div>
        <div className="shrink-0 flex items-center gap-1">
          <span className="text-xs text-grey">{dogCount} dogs</span>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={20} className="text-grey" strokeWidth={2} />
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-grey/10">
              <div className="pt-3 space-y-3">
                {visit.dogsEncountered.map((vd) => {
                  const isFriend = friendIds.has(vd.dog.id);
                  const suggestion = suggestionByDogId.get(vd.dog.id);

                  return (
                    <div
                      key={vd.dog.id}
                      className="flex items-center gap-3 py-2"
                    >
                      <button type="button" onClick={() => openDogProfile(vd.dog.id)}>
                        <Avatar
                          src={vd.dog.photoUrl}
                          alt={vd.dog.name}
                          size="sm"
                          bordered={isFriend}
                        />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-charcoal">
                            {vd.dog.name}
                          </span>
                          {isFriend && (
                            <Badge variant="orange">⭐ Friend</Badge>
                          )}
                        </div>
                        <p className="text-xs text-grey">
                          {vd.dog.breed} · {vd.minutesNear} min together
                        </p>
                        {suggestion && !isFriend && (
                          <div className="mt-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                addFriendFromSuggestion(suggestion.id);
                              }}
                            >
                              Add Friend
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
