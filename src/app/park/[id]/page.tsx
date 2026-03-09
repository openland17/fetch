"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield,
  Zap,
  Droplets,
  Dog,
  ChevronLeft,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import { getParkById } from "@/data/parks";
import { useApp } from "@/hooks/useAppState";
import DogAtParkCard from "@/components/DogAtParkCard";

export default function ParkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state } = useApp();
  const parkId = typeof params.id === "string" ? params.id : "";
  const park = getParkById(parkId);

  const friendIds = new Set(state.friendships.map((f) => f.dog.id));
  const liveFriendCount = park
    ? park.activeDogs.filter((pd) => friendIds.has(pd.dog.id)).length
    : 0;
  const suggestionDogIds = new Set(
    state.suggestions.map((s) => s.dog.id)
  );

  if (!park) {
    return (
      <AppShell>
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
      </AppShell>
    );
  }

  const amenities = [
    { key: "fenced", on: park.isFenced, icon: Shield, label: "Fenced" },
    { key: "agility", on: park.hasAgility, icon: Zap, label: "Agility" },
    { key: "water", on: park.hasWaterAccess, icon: Droplets, label: "Water" },
    { key: "small", on: park.hasSmallDogArea, icon: Dog, label: "Small dog area" },
  ].filter((a) => a.on);

  return (
    <AppShell>
      <motion.div
        className="flex flex-col min-h-full"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Header */}
        <header
          className="bg-navy text-white pt-[env(safe-area-inset-top)] pb-4 px-4 shrink-0"
          style={{ paddingTop: "calc(1rem + env(safe-area-inset-top))" }}
        >
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={() => router.back()}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-1 rounded-lg active:bg-white/10 shrink-0"
              whileTap={{ scale: 0.92 }}
              aria-label="Go back"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
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
            <div className="mt-3 rounded-lg bg-lightorange border border-orange/50 px-3 py-2">
              <p className="text-sm font-semibold text-charcoal">
                ⭐ {liveFriendCount} of Cooper&apos;s friend
                {liveFriendCount !== 1 ? "s are" : " is"} here!
              </p>
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

        {/* Dogs here now */}
        <div
          className="flex-1 overflow-auto overflow-x-hidden scroll-touch px-4 py-4"
          style={{ paddingBottom: "var(--scroll-padding-bottom)" }}
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
        </div>
      </motion.div>
    </AppShell>
  );
}
