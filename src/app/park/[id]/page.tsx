"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Zap,
  Droplets,
  Dog,
  ChevronLeft,
  LogIn,
  LogOut,
} from "lucide-react";
import { getParkById } from "@/data/parks";
import { useApp } from "@/hooks/useAppState";
import DogAtParkCard from "@/components/DogAtParkCard";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { formatDurationFromSeconds } from "@/lib/dateHelpers";

export default function ParkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state, checkIn, endVisit } = useApp();
  const parkId = typeof params.id === "string" ? params.id : "";
  const park = getParkById(parkId);

  const [showEndSheet, setShowEndSheet] = useState(false);
  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: "", visible: false });

  const showToast = (msg: string) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast((p) => ({ ...p, visible: false })), 2500);
  };

  const friendIds = useMemo(
    () => new Set(state.friendships.map((f) => f.dog.id)),
    [state.friendships]
  );
  const liveFriendCount = park
    ? park.activeDogs.filter((pd) => friendIds.has(pd.dog.id)).length
    : 0;
  const suggestionDogIds = useMemo(
    () => new Set(state.suggestions.map((s) => s.dog.id)),
    [state.suggestions]
  );

  const activeVisit = useMemo(
    () => state.visits.find((v) => v.isActive),
    [state.visits]
  );
  const isCheckedInHere = state.isCheckedIn && activeVisit?.parkId === parkId;
  const isCheckedInElsewhere = state.isCheckedIn && activeVisit?.parkId !== parkId;

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!isCheckedInHere) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isCheckedInHere]);

  const liveSeconds = isCheckedInHere && activeVisit?.startedAt
    ? (now - new Date(activeVisit.startedAt).getTime()) / 1000
    : 0;

  if (!park) {
    return (
      <div className="p-4">
        <p className="text-grey">Park not found.</p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-2 text-blue font-medium"
        >
          Back to parks
        </button>
      </div>
    );
  }

  const amenities = [
    { key: "fenced", on: park.isFenced, icon: Shield, label: "Fenced" },
    { key: "agility", on: park.hasAgility, icon: Zap, label: "Agility" },
    { key: "water", on: park.hasWaterAccess, icon: Droplets, label: "Water" },
    { key: "small", on: park.hasSmallDogArea, icon: Dog, label: "Small dog area" },
  ].filter((a) => a.on);

  const handleCheckIn = () => {
    checkIn(parkId);
  };

  const handleEndVisit = () => {
    setShowEndSheet(false);
    endVisit();
    showToast("Visit saved!");
  };

  return (
    <>
      <Toast message={toast.msg} variant="success" visible={toast.visible} />
      <motion.div
        className="flex flex-col min-h-full"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <header
          className="bg-gradient-to-b from-navy to-[#0F2A45] text-white pt-[env(safe-area-inset-top)] pb-4 px-4 shrink-0"
          style={{ paddingTop: "calc(1rem + env(safe-area-inset-top))" }}
        >
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={() => router.back()}
              className="min-h-[44px] flex items-center gap-0.5 -ml-1 rounded-lg active:bg-white/10 shrink-0 pr-1"
              whileTap={{ scale: 0.92 }}
              aria-label="Go back"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
              <span className="text-sm font-medium">Parks</span>
            </motion.button>
            <div className="min-w-0">
              <h1 className="text-lg font-bold truncate">{park.name}</h1>
              <p className="text-sm text-grey mt-0.5 truncate">
                {park.suburb}
                {Number.isFinite(park.distanceKm)
                  ? ` · ${Number(park.distanceKm).toFixed(1)} km away`
                  : ""}
              </p>
            </div>
          </div>

          {liveFriendCount > 0 && (
            <div className="mt-3 rounded-xl bg-gradient-to-r from-orange/15 to-orange/5 border border-orange/30 px-4 py-3">
              <p className="text-sm font-semibold text-white">
                ⭐ {liveFriendCount} of Cooper&apos;s friend{liveFriendCount !== 1 ? "s are" : " is"} here!
              </p>
            </div>
          )}

          {isCheckedInHere && (
            <div className="mt-3 rounded-xl bg-success/15 border border-success/30 px-4 py-2.5 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
              </span>
              <p className="text-sm font-medium text-white">You&apos;re here! ✓</p>
            </div>
          )}

          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {amenities.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs text-white"
                >
                  <Icon size={14} strokeWidth={2} />
                  {label}
                </span>
              ))}
            </div>
          )}
        </header>

        <div
          className="flex-1 overflow-auto overflow-x-hidden scroll-touch px-4 py-4"
          style={{ paddingBottom: "calc(var(--scroll-padding-bottom) + 72px)" }}
        >
          <p className="section-label">
            DOGS HERE NOW
          </p>
          <div className="space-y-3">
            {park.activeDogs.map((pd, i) => (
              <motion.div
                key={pd.dog.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DogAtParkCard
                  dog={pd.dog}
                  isFriend={friendIds.has(pd.dog.id)}
                  arrivedMinutesAgo={pd.arrivedMinutesAgo}
                  hasPendingSuggestion={suggestionDogIds.has(pd.dog.id)}
                  priority={i === 0}
                />
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          {park.recentActivity && park.recentActivity.length > 0 && (
            <>
              <p className="section-label mt-6">
                RECENT ACTIVITY
              </p>
              <div className="space-y-2">
                {park.recentActivity.map((activity, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue shrink-0" />
                    <p className="text-sm text-charcoal flex-1">{activity.text}</p>
                    <span className="text-xs text-grey shrink-0">{activity.minutesAgo}m ago</span>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Fixed bottom check-in bar */}
        <div
          className="sticky bottom-0 left-0 right-0 bg-white border-t border-grey/10 px-4 py-3 z-30"
          style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}
        >
          {isCheckedInHere ? (
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />
                  <span className="text-sm font-semibold text-charcoal">Checked in</span>
                </div>
                <p className="text-xs text-grey mt-0.5 tabular-nums">
                  {formatDurationFromSeconds(Math.max(0, liveSeconds))}
                </p>
              </div>
              <Button
                variant="danger"
                size="md"
                onClick={() => setShowEndSheet(true)}
              >
                <LogOut size={16} strokeWidth={2.5} />
                End Visit
              </Button>
            </div>
          ) : isCheckedInElsewhere ? (
            <div className="space-y-2">
              <p className="text-xs text-grey text-center">
                You&apos;re checked in at {activeVisit?.parkName}
              </p>
              <Button
                variant="danger"
                size="md"
                fullWidth
                onClick={() => {
                  endVisit();
                  showToast("Visit saved!");
                  setTimeout(() => checkIn(parkId), 100);
                }}
              >
                <LogOut size={16} strokeWidth={2.5} />
                End Visit &amp; Check In Here
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleCheckIn}
            >
              <LogIn size={16} strokeWidth={2.5} />
              Check In at {park.name}
            </Button>
          )}
        </div>
      </motion.div>

      {/* End Visit confirmation sheet */}
      <AnimatePresence>
        {showEndSheet && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowEndSheet(false)}
          >
            <motion.div
              className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-[430px] p-6 shadow-xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-grey/30 rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-bold text-charcoal text-center">
                End your visit?
              </h3>
              <div className="mt-4 bg-offwhite rounded-xl p-4 text-center">
                <p className="text-sm text-charcoal font-semibold">{park.name}</p>
                <p className="text-2xl font-bold text-blue mt-1 tabular-nums">
                  {formatDurationFromSeconds(Math.max(0, liveSeconds))}
                </p>
                <p className="text-xs text-grey mt-1">
                  {activeVisit?.dogsEncountered.length ?? park.activeDogs.length} dogs encountered
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  size="md"
                  className="flex-1"
                  onClick={() => setShowEndSheet(false)}
                >
                  Keep Going
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  className="flex-1"
                  onClick={handleEndVisit}
                >
                  End Visit
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
