"use client";

import Link from "next/link";
import { forwardRef } from "react";
import type { Park } from "@/types";
import Badge from "@/components/ui/Badge";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface ParkCardProps {
  park: Park;
  index: number;
  friendCountOverride?: number;
  isCheckedInHere?: boolean;
}

const ParkCard = forwardRef<HTMLDivElement, ParkCardProps>(
  function ParkCard({ park, index, friendCountOverride, isCheckedInHere }, ref) {
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
            rounded-xl shadow-sm border p-4 flex items-start gap-3 min-h-[44px]
            ${hasFriends ? "border-l-4 border-l-orange bg-lightorange/30 border-orange/20" : "bg-white border-grey/10"}
            ${isCheckedInHere ? "ring-2 ring-success/40" : ""}
          `}
          whileTap={{ scale: 0.97 }}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[15px] text-charcoal truncate">{park.name}</h3>
              {isCheckedInHere && (
                <span className="inline-flex items-center gap-1 bg-success/10 text-success text-[10px] font-semibold rounded-full px-2 py-0.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  You&apos;re here
                </span>
              )}
            </div>
            <p className="text-xs text-grey mt-0.5">
              {park.suburb} · {Number.isFinite(park.distanceKm) ? `${Number(park.distanceKm).toFixed(1)} km` : "—"}
            </p>
            {hasFriends && (
              <span className="inline-flex items-center bg-orange/10 text-orange rounded-full px-2 py-0.5 text-xs font-medium mt-1.5">
                ⭐ {friendCount} friend{friendCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <span className="text-2xl font-bold text-blue leading-none">
                {Math.max(0, park.activeDogs?.length ?? park.activeDogCount ?? 0)}
              </span>
              <p className="text-[11px] text-grey mt-0.5">dogs now</p>
            </div>
            <ChevronRight size={18} className="text-grey/40" strokeWidth={2} />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
  }
);

export default ParkCard;
