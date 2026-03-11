"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import VisitSummaryCard from "@/components/VisitSummaryCard";
import ActiveVisitCard from "@/components/ActiveVisitCard";
import Toast from "@/components/ui/Toast";
import { useApp } from "@/hooks/useAppState";
import { useScrollRestore } from "@/hooks/useScrollRestore";

export default function VisitsScreen() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { state, endVisit } = useApp();
  const [toast, setToast] = useState(false);

  useScrollRestore(pathname, scrollRef);

  const showToast = useCallback(() => {
    setToast(true);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 2500);
    return () => clearTimeout(t);
  }, [toast]);

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

  const handleEndVisit = useCallback(() => {
    endVisit();
    showToast();
  }, [endVisit, showToast]);

  return (
    <div className="flex flex-col min-h-full">
      <Toast message="Visit saved!" variant="success" visible={toast} />
      <header
        className="bg-gradient-to-b from-navy to-[#0F2A45] text-white pt-[env(safe-area-inset-top)] pb-4 px-4 shrink-0"
        style={{ paddingTop: "calc(1rem + env(safe-area-inset-top))" }}
      >
        <h1 className="text-lg font-bold">Visit History</h1>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-auto overflow-x-hidden scroll-touch px-4 pt-4"
        style={{ paddingBottom: "var(--scroll-padding-bottom)" }}
      >
        {state.isCheckedIn && activeVisit && (
          <ActiveVisitCard visit={activeVisit} onEndVisit={handleEndVisit} />
        )}

        <p className="section-label">
          RECENT
        </p>
        {recentVisits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="text-4xl mb-3">🐾</span>
            <p className="text-charcoal font-semibold">No visits yet</p>
            <p className="text-grey text-sm mt-1">Check in at a park to start tracking</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentVisits.map((visit) => (
              <VisitSummaryCard key={visit.id} visit={visit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
