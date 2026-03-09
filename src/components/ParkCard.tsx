"use client";

import Link from "next/link";
import { forwardRef } from "react";
import type { Park } from "@/types";
import Badge from "@/components/ui/Badge";
import { motion } from "framer-motion";

interface ParkCardProps {
  park: Park;
  index: number;
  /** When provided, overrides park.friendCount (e.g. from live app state). */
  friendCountOverride?: number;
}

const ParkCard = forwardRef<HTMLDivElement, ParkCardProps>(
  function ParkCard({ park, index, friendCountOverride }, ref) {
    const friendCount =
      friendCountOverride !== undefined ? friendCountOverride : park.friendCount;
    const hasFriends = friendCount > 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
    >
      <Link href={`/park/${park.id}`}>
        <motion.div
          className={`
            rounded-xl shadow-sm p-4 flex items-start justify-between gap-3 min-h-[44px]
            ${hasFriends ? "border-l-4 border-l-orange bg-lightorange/40" : "bg-white"}
          `}
          whileTap={{ scale: 0.98 }}
        >
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-[15px] text-charcoal truncate">{park.name}</h3>
            <p className="text-xs text-grey mt-0.5">{park.suburb}</p>
            <p className="text-xs text-grey mt-0.5">
              {Number.isFinite(park.distanceKm)
                ? `${Number(park.distanceKm).toFixed(1)} km away`
                : "—"}
            </p>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-2xl font-bold text-blue leading-none">
              {Math.max(0, park.activeDogs?.length ?? park.activeDogCount ?? 0)}
            </span>
            <span className="text-xs text-grey mt-1">dogs now</span>
            {hasFriends && (
              <Badge variant="orange" className="mt-2">
                ⭐ {friendCount} friend{friendCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
  }
);

export default ParkCard;
