"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useApp } from "@/hooks/useAppState";
import { getDogById } from "@/data/dogs";
import { getMilestone } from "@/lib/milestones";

interface DogProfileContextValue {
  openDogProfile: (dogId: string) => void;
}

const DogProfileContext = createContext<DogProfileContextValue>({
  openDogProfile: () => {},
});

export function useDogProfile() {
  return useContext(DogProfileContext);
}

export function DogProfileProvider({ children }: { children: ReactNode }) {
  const [activeDogId, setActiveDogId] = useState<string | null>(null);

  const openDogProfile = useCallback((dogId: string) => {
    setActiveDogId(dogId);
  }, []);

  const value = useMemo(() => ({ openDogProfile }), [openDogProfile]);

  return (
    <DogProfileContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {activeDogId && (
          <DogProfileSheetContent
            dogId={activeDogId}
            onClose={() => setActiveDogId(null)}
          />
        )}
      </AnimatePresence>
    </DogProfileContext.Provider>
  );
}

function DogProfileSheetContent({
  dogId,
  onClose,
}: {
  dogId: string;
  onClose: () => void;
}) {
  const { state, addFriendFromSuggestion } = useApp();
  const dog = getDogById(dogId);

  const friendship = useMemo(
    () => state.friendships.find((f) => f.dog.id === dogId),
    [state.friendships, dogId]
  );
  const suggestion = useMemo(
    () => state.suggestions.find((s) => s.dog.id === dogId),
    [state.suggestions, dogId]
  );

  const visitStats = useMemo(() => {
    const parks = new Set<string>();
    let totalMin = 0;
    let encounters = 0;
    for (const visit of state.visits) {
      for (const vd of visit.dogsEncountered) {
        if (vd.dog.id === dogId) {
          parks.add(visit.parkName);
          totalMin += vd.minutesNear;
          encounters++;
        }
      }
    }
    return { parks: Array.from(parks), totalMin, encounters };
  }, [state.visits, dogId]);

  if (!dog) return null;

  const isFriend = !!friendship;
  const isPending = !!suggestion && !isFriend;
  const isStranger = !isFriend && !isPending;

  const handleAdd = () => {
    if (suggestion) {
      addFriendFromSuggestion(suggestion.id);
    }
  };

  const formatTime = (mins: number) => {
    if (mins < 60) return `${Math.round(mins)} min`;
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  };

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-[430px] shadow-xl overflow-hidden"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        onClick={(e) => e.stopPropagation()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 80) onClose();
        }}
      >
        <div className="w-10 h-1 bg-grey/30 rounded-full mx-auto mt-3" />

        <motion.button
          type="button"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-grey/10 flex items-center justify-center"
          onClick={onClose}
          whileTap={{ scale: 0.9 }}
        >
          <X size={18} className="text-grey" />
        </motion.button>

        <div className="p-6 pt-4 flex flex-col items-center text-center">
          <Avatar src={dog.photoUrl} alt={dog.name} size="xl" bordered={isFriend} priority />
          <h2 className="mt-3 text-xl font-bold text-charcoal">{dog.name}</h2>
          <p className="text-sm text-grey mt-0.5">{dog.breed} · {dog.colour}</p>

          {isFriend && friendship && (
            <div className="mt-4 w-full">
              {(() => {
                const m = getMilestone(friendship.totalEncounters, friendship.totalMinutesTogether);
                return (
                  <span className="inline-flex items-center gap-1 bg-offwhite rounded-full px-3 py-1 text-xs font-semibold text-charcoal mb-3">
                    {m.emoji} {m.label}
                  </span>
                );
              })()}
              <div className="flex items-center justify-center gap-2 text-success">
                <Check size={16} strokeWidth={2.5} />
                <span className="text-sm font-semibold">
                  Friends since {new Date(friendship.confirmedAt).toLocaleDateString("en-AU", { month: "short", year: "numeric" })}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-offwhite rounded-xl p-3">
                  <p className="text-lg font-bold text-charcoal">{formatTime(friendship.totalMinutesTogether)}</p>
                  <p className="text-xs text-grey">together</p>
                </div>
                <div className="bg-offwhite rounded-xl p-3">
                  <p className="text-lg font-bold text-charcoal">{friendship.totalEncounters}</p>
                  <p className="text-xs text-grey">meets</p>
                </div>
                <div className="bg-offwhite rounded-xl p-3">
                  <p className="text-lg font-bold text-charcoal">{visitStats.parks.length}</p>
                  <p className="text-xs text-grey">parks</p>
                </div>
              </div>
              {friendship.lastSeenAt && (
                <p className="text-xs text-grey mt-3">Last seen: {friendship.lastSeenAt}</p>
              )}
            </div>
          )}

          {isPending && suggestion && (
            <div className="mt-4 w-full">
              <Badge variant="blue" className="mx-auto">Pending suggestion</Badge>
              <p className="text-sm text-charcoal mt-3">
                Cooper spent {suggestion.minutesTogether} min with {dog.name} across {suggestion.encounters} visit{suggestion.encounters !== 1 ? "s" : ""} at {suggestion.parkName}
              </p>
              <Button variant="primary" size="md" fullWidth className="mt-4" onClick={handleAdd}>
                Add Friend
              </Button>
            </div>
          )}

          {isStranger && (
            <div className="mt-4 w-full">
              {visitStats.encounters > 0 ? (
                <p className="text-sm text-grey">
                  You&apos;ve seen {dog.name} at {visitStats.parks.join(", ")} — keep meeting up!
                </p>
              ) : (
                <p className="text-sm text-grey">
                  You haven&apos;t met {dog.name} yet. Say hi at the park!
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
