"use client";

import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PARKS } from "@/data/parks";
import { useApp } from "@/hooks/useAppState";
import { useScrollRestore } from "@/hooks/useScrollRestore";
import ParkCard from "@/components/ParkCard";
import NotificationBanner from "@/components/NotificationBanner";
import NotificationDropdown from "@/components/NotificationDropdown";

const BANNER_SESSION_KEY = "fetch-notification-banner-shown";
const BANNER_DELAY_MS = 3000;

function usePullToRefresh(onRefresh: () => void) {
  const [pullY, setPullY] = useState(0);
  const startY = useRef(0);
  const currentPull = useRef(0);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      startY.current = e.touches[0].clientY;
    },
    []
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const list = e.currentTarget;
      if (list.scrollTop <= 0) {
        const y = e.touches[0].clientY;
        const pull = Math.max(0, y - startY.current);
        currentPull.current = pull;
        setPullY(pull);
      }
    },
    []
  );

  const onTouchEnd = useCallback(() => {
    if (currentPull.current > 60) onRefresh();
    currentPull.current = 0;
    setPullY(0);
  }, [onRefresh]);

  return { pullY, onTouchStart, onTouchMove, onTouchEnd };
}

const HEADER_HEIGHT = 200;
const MAP_HEIGHT = 140;

const sortedParks = [...PARKS].sort((a, b) => a.distanceKm - b.distanceKm);

export default function ParksScreen() {
  const pathname = usePathname();
  const { state, markNotificationRead, markAllNotificationsRead } = useApp();
  const listRef = useRef<HTMLDivElement>(null);
  const parkRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  useScrollRestore(pathname, listRef);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(BANNER_SESSION_KEY) === "1") return;
    const t = setTimeout(() => {
      setShowBanner(true);
      sessionStorage.setItem(BANNER_SESSION_KEY, "1");
    }, BANNER_DELAY_MS);
    return () => clearTimeout(t);
  }, []);
  const handleRefresh = useCallback(() => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, [refreshing]);
  const { pullY, onTouchStart, onTouchMove, onTouchEnd } =
    usePullToRefresh(handleRefresh);

  const unreadCount = useMemo(
    () => state.notifications.filter((n) => !n.read).length,
    [state.notifications]
  );

  const totalDogsActive = useMemo(
    () => sortedParks.reduce((s, p) => s + p.activeDogCount, 0),
    []
  );

  const friendIds = useMemo(
    () => new Set(state.friendships.map((f) => f.dog.id)),
    [state.friendships]
  );

  const parkFriendCounts = useMemo(
    () =>
      new Map(
        sortedParks.map((p) => [
          p.id,
          p.activeDogs.filter((pd) => friendIds.has(pd.dog.id)).length,
        ])
      ),
    [friendIds]
  );

  const totalFriendsNearby = useMemo(
    () =>
      Array.from(parkFriendCounts.values()).reduce((s, c) => s + c, 0),
    [parkFriendCounts]
  );

  const checkedInPark = useMemo(() => {
    if (!state.isCheckedIn) return null;
    const active = state.visits.find((v) => v.isActive);
    return active ? active.parkName : null;
  }, [state.isCheckedIn, state.visits]);

  const scrollToPark = useCallback((parkId: string) => {
    const idx = sortedParks.findIndex((p) => p.id === parkId);
    if (idx >= 0 && parkRefs.current[idx]) {
      parkRefs.current[idx]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  const mapParks = sortedParks.slice(0, 4);
  const markerPositions = [
    { left: "18%", top: "35%" },
    { left: "55%", top: "25%" },
    { left: "75%", top: "55%" },
    { left: "30%", top: "70%" },
  ];

  return (
    <div className="flex flex-col min-h-full">
      {/* Top section — fixed height, non-scrollable */}
      <div
        className="bg-navy shrink-0 pt-[env(safe-area-inset-top)]"
        style={{
          paddingTop: `calc(0.5rem + env(safe-area-inset-top))`,
          minHeight: HEADER_HEIGHT,
        }}
      >
        <div className="px-4 flex items-start justify-between relative">
          <div>
            <h1 className="text-white font-extrabold text-[24px] tracking-wide leading-tight">
              FETCH
            </h1>
            <p className="text-grey text-xs mt-0.5">
              {sortedParks.length} parks nearby
            </p>
          </div>
          <motion.button
            type="button"
            className="p-2 -mr-2 relative min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setNotificationOpen((o) => !o)}
            whileTap={{ scale: 0.95 }}
            aria-label="Notifications"
          >
            <Bell size={24} className="text-white" strokeWidth={2} />
            {unreadCount > 0 && (
              <motion.span
                className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-orange"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                aria-hidden
              />
            )}
          </motion.button>
          <NotificationDropdown
            open={notificationOpen}
            onClose={() => setNotificationOpen(false)}
            notifications={state.notifications}
            onMarkAllRead={markAllNotificationsRead}
            onNotificationTap={(n) => markNotificationRead(n.id)}
          />
        </div>

        {/* Quick stats pills */}
        <div className="flex gap-2 overflow-x-auto px-4 mt-3 pb-2 scrollbar-hide">
          <span className="shrink-0 rounded-full bg-blue/90 text-white text-xs font-medium px-3 py-1.5">
            🐕 {totalDogsActive} dogs active
          </span>
          <span
            className={`shrink-0 rounded-full text-xs font-medium px-3 py-1.5 ${
              totalFriendsNearby > 0 ? "bg-orange text-white" : "bg-grey/30 text-grey"
            }`}
          >
            ⭐ {totalFriendsNearby} friends nearby
          </span>
          {checkedInPark && (
            <span className="shrink-0 max-w-[180px] rounded-full bg-success/90 text-white text-xs font-medium px-3 py-1.5 truncate">
              📍 {checkedInPark}
            </span>
          )}
        </div>

        {/* Map placeholder */}
        <div
          className="mx-4 rounded-xl overflow-hidden relative"
          style={{
            height: MAP_HEIGHT,
            background: "linear-gradient(135deg, #E8F0F7 0%, #d4edda 100%)",
          }}
        >
          {mapParks.map((park, i) => (
            <motion.button
              key={park.id}
              type="button"
              className="absolute w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md border-2 border-white"
              style={{
                left: markerPositions[i]?.left ?? "50%",
                top: markerPositions[i]?.top ?? "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor:
                  (parkFriendCounts.get(park.id) ?? 0) > 0 ? "#E8913A" : "#1A7BBF",
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollToPark(park.id)}
            >
              {park.activeDogCount}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Banner (below header, above content) + Park list */}
      <div className="relative flex-1 flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          {showBanner && (
            <NotificationBanner onDismiss={() => setShowBanner(false)} />
          )}
        </AnimatePresence>
        <div
          ref={listRef}
          className="flex-1 overflow-auto overflow-x-hidden overscroll-contain scroll-touch relative"
          style={{ minHeight: 0 }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Pull-to-refresh indicator */}
          <div
            className="absolute left-0 right-0 flex justify-center pointer-events-none transition-opacity"
            style={{
              top: Math.min(pullY * 0.4, 56) - 48,
              opacity: pullY > 10 ? Math.min(pullY / 80, 1) : 0,
            }}
          >
            <motion.div
              className="w-10 h-10 rounded-full bg-white shadow-md border border-grey/20 flex items-center justify-center"
              animate={{
                rotate: pullY > 60 ? 360 : 0,
                scale: pullY > 0 ? 0.9 + Math.min(pullY / 200, 0.2) : 1,
              }}
              transition={{ type: "tween", duration: 0.2 }}
            >
              <motion.div
                className="w-5 h-5 rounded-full border-2 border-blue border-t-transparent"
                animate={{
                  rotate: refreshing ? 360 : pullY > 60 ? 180 : 0,
                }}
                transition={{
                  rotate: refreshing
                    ? { repeat: Infinity, duration: 0.6, ease: "linear" }
                    : { duration: 0.2 },
                }}
              />
            </motion.div>
          </div>
          {refreshing && (
            <div className="flex justify-center py-3">
              <motion.div
                className="w-6 h-6 rounded-full border-2 border-blue border-t-transparent animate-spin"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              />
            </div>
          )}

        <div
            className="px-4 pt-4"
            style={{ paddingBottom: "var(--scroll-padding-bottom)" }}
          >
          <p className="section-label">
            NEARBY PARKS
          </p>
          <div className="space-y-3">
            {sortedParks.map((park, index) => (
              <ParkCard
                key={park.id}
                ref={(el) => {
                  parkRefs.current[index] = el;
                }}
                park={park}
                index={index}
                friendCountOverride={parkFriendCounts.get(park.id)}
              />
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
