"use client";

import { useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import VisitSummaryCard from "@/components/VisitSummaryCard";
import ActiveVisitCard from "@/components/ActiveVisitCard";
import { useApp } from "@/hooks/useAppState";
import { useScrollRestore } from "@/hooks/useScrollRestore";

export default function VisitsScreen() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { state } = useApp();

  useScrollRestore(pathname, scrollRef);

  const activeVisit = useMemo(
    () => state.visits.find((v) => v.isActive),
    [state.visits]
  );

  const recentVisits = useMemo(() => {
    return [...state.visits]
      .filter((v) => !v.isActive)
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }, [state.visits]);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header
        className="bg-gradient-to-b from-navy to-[#0F2A45] text-white pt-[env(safe-area-inset-top)] pb-4 px-4 shrink-0"
        style={{ paddingTop: "calc(1rem + env(safe-area-inset-top))" }}
      >
        <h1 className="text-lg font-bold">Visit History</h1>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-auto overflow-x-hidden scroll-touch px-4"
        style={{ paddingBottom: "var(--scroll-padding-bottom)" }}
      >
        {/* Active visit card — timer state isolated so only this card re-renders every second */}
        {state.isCheckedIn && activeVisit && (
          <ActiveVisitCard visit={activeVisit} />
        )}

        {/* Recent visits */}
        <p className="section-label">
          RECENT
        </p>
        <div className="space-y-3">
          {recentVisits.map((visit) => (
            <VisitSummaryCard key={visit.id} visit={visit} />
          ))}
        </div>
      </div>
    </div>
  );
}
