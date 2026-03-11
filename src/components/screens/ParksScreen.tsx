"use client";

import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PARKS } from "@/data/parks";
import { useApp } from "@/hooks/useAppState";
import { useScrollRestore } from "@/hooks/useScrollRestore";
import ParkCard from "@/components/ParkCard";
import ParkMap from "@/components/ParkMap";
import NotificationBanner from "@/components/NotificationBanner";
import NotificationDropdown from "@/components/NotificationDropdown";
import Toast from "@/components/ui/Toast";

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
  const { state, markNotificationRead, markAllNotificationsRead, dismissNotification } = useApp();
  const listRef = useRef<HTMLDivElement>(null);
  const parkRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [welcomeToast, setWelcomeToast] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const WELCOME_KEY = "fetch-welcome-shown";
    if (localStorage.getItem(WELCOME_KEY) === "1") return;
    localStorage.setItem(WELCOME_KEY, "1");
    const t = setTimeout(() => setWelcomeToast(true), 500);
    const t2 = setTimeout(() => setWelcomeToast(false), 3000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

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

  const activeVisit = useMemo(
    () => state.visits.find((v) => v.isActive),
    [state.visits]
  );
  const checkedInPark = state.isCheckedIn && activeVisit ? activeVisit.parkName : null;
  const checkedInParkId = state.isCheckedIn && activeVisit ? activeVisit.parkId : null;

  const toggleFilter = useCallback((f: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  }, []);

  const filteredParks = useMemo(() => {
    let result = sortedParks;
    const q = searchQuery.trim().toLowerCase();
    if (q) result = result.filter((p) => p.name.toLowerCase().includes(q) || p.suburb.toLowerCase().includes(q));
    if (activeFilters.has("friends")) result = result.filter((p) => (parkFriendCounts.get(p.id) ?? 0) > 0);
    if (activeFilters.has("fenced")) result = result.filter((p) => p.isFenced);
    if (activeFilters.has("water")) result = result.filter((p) => p.hasWaterAccess);
    if (activeFilters.has("near")) result = result.filter((p) => p.distanceKm < 5);
    return result;
  }, [searchQuery, activeFilters, parkFriendCounts]);

  const scrollToPark = useCallback((parkId: string) => {
    const idx = sortedParks.findIndex((p) => p.id === parkId);
    if (idx >= 0 && parkRefs.current[idx]) {
      parkRefs.current[idx]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-full">
      <Toast message="Welcome, Cooper! 🐕" variant="success" visible={welcomeToast} />
      {/* Top section — fixed height, non-scrollable */}
      <div
        className="bg-gradient-to-b from-navy to-[#0F2A45] shrink-0 pt-[env(safe-area-inset-top)]"
        style={{
          paddingTop: `calc(0.5rem + env(safe-area-inset-top))`,
          minHeight: HEADER_HEIGHT,
        }}
      >
        <div className="px-4 flex items-start justify-between relative">
          <div>
            <h1 className="text-white font-extrabold text-[24px] tracking-wide leading-tight flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <path d="M12 2C10 2 8.5 4 8.5 6C8.5 8 10 9 12 9C14 9 15.5 8 15.5 6C15.5 4 14 2 12 2Z" fill="currentColor" opacity="0.9"/>
                <path d="M5 5C3.5 5 2 6.5 2 8C2 9.5 3 10.5 5 10.5C7 10.5 8 9.5 8 8C8 6.5 6.5 5 5 5Z" fill="currentColor" opacity="0.7"/>
                <path d="M19 5C17.5 5 16 6.5 16 8C16 9.5 17 10.5 19 10.5C21 10.5 22 9.5 22 8C22 6.5 20.5 5 19 5Z" fill="currentColor" opacity="0.7"/>
                <path d="M12 10C9 10 5 13 5 16C5 19 8 22 12 22C16 22 19 19 19 16C19 13 15 10 12 10Z" fill="currentColor"/>
              </svg>
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
            <motion.span
              animate={unreadCount > 0 ? { rotate: [0, 12, -12, 8, -8, 0] } : { rotate: 0 }}
              transition={unreadCount > 0 ? { duration: 0.6, repeat: Infinity, repeatDelay: 4 } : {}}
            >
              <Bell size={24} className="text-white" strokeWidth={2} />
            </motion.span>
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
            onDismiss={dismissNotification}
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
            <span className="shrink-0 max-w-[200px] rounded-full bg-success/90 text-white text-xs font-medium px-3 py-1.5 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <span className="truncate">{checkedInPark}</span>
            </span>
          )}
        </div>

        {/* Map */}
        <ParkMap
          parks={sortedParks}
          friendCounts={parkFriendCounts}
          onMarkerTap={scrollToPark}
          height={MAP_HEIGHT}
        />
      </div>

      {/* Search & Filters */}
      <div className="px-4 py-2 bg-offwhite shrink-0">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search parks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl bg-white shadow-sm border border-grey/10 text-charcoal placeholder:text-grey/40 focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue/20"
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
              onClick={() => setSearchQuery("")}
            >
              <X size={14} className="text-grey" />
            </button>
          )}
        </div>
        <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide">
          {([
            { key: "friends", label: "Friends here" },
            { key: "fenced", label: "Fenced" },
            { key: "water", label: "Water" },
            { key: "near", label: "< 5km" },
          ] as const).map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => toggleFilter(f.key)}
              className={`shrink-0 rounded-full text-xs font-medium px-3 py-1.5 transition-colors ${
                activeFilters.has(f.key)
                  ? "bg-blue text-white"
                  : "bg-white text-charcoal border border-grey/20"
              }`}
            >
              {f.label}
            </button>
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
          {filteredParks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-4xl mb-3">🔍</span>
              <p className="text-charcoal font-medium">No parks match your filters</p>
              <p className="text-grey text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredParks.map((park, index) => (
                <ParkCard
                  key={park.id}
                  ref={(el) => {
                    parkRefs.current[index] = el;
                  }}
                  park={park}
                  index={index}
                  friendCountOverride={parkFriendCounts.get(park.id)}
                  isCheckedInHere={checkedInParkId === park.id}
                />
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
