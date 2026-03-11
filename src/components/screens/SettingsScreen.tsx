"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, Share2 } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import Toast from "@/components/ui/Toast";
import { MY_DOG } from "@/data/dogs";
import { useApp } from "@/hooks/useAppState";
import { useScrollRestore } from "@/hooks/useScrollRestore";

const TOAST_DURATION_MS = 2000;

export default function SettingsScreen() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { state, setInvisibleMode, setNotificationPrefs } = useApp();

  useScrollRestore(pathname, scrollRef);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "info" | "warning";
    visible: boolean;
  }>({ message: "", variant: "info", visible: false });
  const [notificationsExpanded, setNotificationsExpanded] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const stats = useMemo(() => {
    const visits = state.visits.filter((v) => !v.isActive);
    const totalMin = visits.reduce((s, v) => s + v.durationMinutes, 0);
    const parkCounts = new Map<string, number>();
    for (const v of visits) {
      parkCounts.set(v.parkName, (parkCounts.get(v.parkName) ?? 0) + 1);
    }
    let favPark = "—";
    let maxCount = 0;
    parkCounts.forEach((count, name) => {
      if (count > maxCount) { maxCount = count; favPark = name; }
    });
    return {
      totalVisits: visits.length,
      totalFriends: state.friendships.length,
      totalHours: (totalMin / 60).toFixed(1),
      favoritePark: favPark,
    };
  }, [state.visits, state.friendships]);

  const showToast = useCallback(
    (message: string, variant: "success" | "info" | "warning" = "info") => {
      setToast({ message, variant, visible: true });
    },
    []
  );

  useEffect(() => {
    if (!toast.visible) return;
    const t = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, TOAST_DURATION_MS);
    return () => clearTimeout(t);
  }, [toast.visible]);

  const handleInvisibleToggle = useCallback(
    (on: boolean) => {
      setInvisibleMode(on);
      showToast(
        on ? "Invisible mode enabled" : "Invisible mode disabled",
        "info"
      );
    },
    [setInvisibleMode, showToast]
  );

  const prefs = state.notificationPrefs;

  const handleShare = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin).then(() => {
        showToast("Link copied!", "success");
      });
    }
  }, [showToast]);

  return (
    <div className="flex flex-col min-h-full">
      <Toast
        message={toast.message}
        variant={toast.variant}
        visible={toast.visible}
      />

      {/* Header */}
      <header
        className="bg-gradient-to-b from-navy to-[#0F2A45] text-white pt-[env(safe-area-inset-top)] pb-4 px-4 shrink-0"
        style={{ paddingTop: "calc(1rem + env(safe-area-inset-top))" }}
      >
        <h1 className="text-lg font-bold">Settings</h1>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-auto overflow-x-hidden scroll-touch px-4"
        style={{ paddingBottom: "var(--scroll-padding-bottom)" }}
      >
        {/* Dog profile card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col items-center text-center">
            <Avatar
              src={MY_DOG.photoUrl}
              alt={MY_DOG.name}
              size="xl"
              priority
            />
            <h2 className="mt-4 font-bold text-[18px] text-charcoal">
              {MY_DOG.name}
            </h2>
            <p className="text-[13px] text-grey mt-0.5">
              {MY_DOG.breed} · {MY_DOG.colour}
            </p>
            {MY_DOG.tagId && (
              <p className="text-sm text-blue mt-2">
                🏷️ Tag: {MY_DOG.tagId} · Battery: 94%
              </p>
            )}
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setEditProfileOpen(true)}
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Your Stats */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <p className="section-label">YOUR STATS</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-offwhite rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-charcoal">{stats.totalVisits}</p>
              <p className="text-xs text-grey">visits</p>
            </div>
            <div className="bg-offwhite rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-charcoal">{stats.totalFriends}</p>
              <p className="text-xs text-grey">friends</p>
            </div>
            <div className="bg-offwhite rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-charcoal">{stats.totalHours}h</p>
              <p className="text-xs text-grey">at parks</p>
            </div>
            <div className="bg-offwhite rounded-xl p-3 text-center">
              <p className="text-sm font-bold text-charcoal truncate">{stats.favoritePark}</p>
              <p className="text-xs text-grey">favourite</p>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <p className="section-label">
          PRIVACY
        </p>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          {/* Invisible Mode */}
          <div className="p-4 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-charcoal">👻 Invisible Mode</p>
              <p className="text-xs text-grey mt-0.5">
                Hide from park map. Your data still logs for you.
              </p>
            </div>
            <Toggle
              checked={state.invisibleMode}
              onChange={handleInvisibleToggle}
              aria-label="Invisible mode"
            />
          </div>

          {/* Notifications */}
          <div className="border-t border-grey/10">
            <button
              type="button"
              className="w-full p-4 min-h-[44px] flex items-center justify-between gap-2 text-left"
              onClick={() => setNotificationsExpanded((e) => !e)}
            >
              <span className="font-bold text-charcoal">🔔 Notifications</span>
              <motion.span
                animate={{ rotate: notificationsExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={20} className="text-grey" strokeWidth={2} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {notificationsExpanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-charcoal">
                        Friend Alerts
                      </span>
                      <Toggle
                        checked={prefs.friendAlerts}
                        onChange={(on) =>
                          setNotificationPrefs({ friendAlerts: on })
                        }
                        aria-label="Friend alerts"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-charcoal">
                        Visit Summaries
                      </span>
                      <Toggle
                        checked={prefs.visitSummaries}
                        onChange={(on) =>
                          setNotificationPrefs({ visitSummaries: on })
                        }
                        aria-label="Visit summaries"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-charcoal">
                        Nearby Alerts
                      </span>
                      <Toggle
                        checked={true}
                        onChange={() => showToast("Setting saved", "success")}
                        aria-label="Nearby alerts"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Account */}
        <p className="section-label">
          ACCOUNT
        </p>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="divide-y divide-grey/10">
            <div className="p-4 min-h-[44px] flex items-center justify-between">
              <span className="font-medium text-charcoal">My Dogs</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-charcoal">{MY_DOG.name}</span>
                <span className="text-xs text-grey bg-grey/10 px-2 py-0.5 rounded-full">
                  1 dog
                </span>
                <ChevronRight size={20} className="text-grey" strokeWidth={2} />
              </div>
            </div>
            <div className="p-4 min-h-[44px] flex items-center justify-between">
              <span className="font-medium text-charcoal">Tag Management</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-grey">{MY_DOG.tagId ?? "—"}</span>
                <ChevronRight size={20} className="text-grey" strokeWidth={2} />
              </div>
            </div>
            <button
              type="button"
              className="w-full p-4 min-h-[44px] text-left font-medium text-grey"
            >
              Sign Out
            </button>
            <button
              type="button"
              className="w-full p-4 min-h-[44px] text-left font-medium text-error"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* App */}
        <p className="section-label">
          APP
        </p>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal">About Fetch</p>
              <p className="text-xs text-grey mt-0.5">Version 1.0.0 (MVP)</p>
            </div>
            <span className="text-xs text-grey">Made with ❤️ in Brisbane</span>
          </div>
          <div className="border-t border-grey/10">
            <button
              type="button"
              className="w-full p-4 min-h-[44px] flex items-center gap-2 text-sm text-blue font-medium"
              onClick={handleShare}
            >
              <Share2 size={16} strokeWidth={2} />
              Share Fetch
            </button>
          </div>
          <div className="border-t border-grey/10">
            <Link
              href="/privacy"
              className="block p-4 min-h-[44px] text-sm text-blue font-medium"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="block p-4 min-h-[44px] text-sm text-blue font-medium border-t border-grey/10"
            >
              Terms of Service
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-grey pb-8">
          Made with 🐕 in Brisbane
        </p>
      </div>

      {/* Edit Profile sheet */}
      <AnimatePresence>
        {editProfileOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditProfileOpen(false)}
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
              <h3 className="text-lg font-bold text-charcoal">Edit Profile</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-medium text-grey">Name</label>
                  <input
                    type="text"
                    defaultValue={MY_DOG.name}
                    className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl bg-offwhite border border-grey/20 text-charcoal focus:outline-none focus:ring-2 focus:ring-blue/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-grey">Breed</label>
                  <input
                    type="text"
                    defaultValue={MY_DOG.breed}
                    className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl bg-offwhite border border-grey/20 text-charcoal focus:outline-none focus:ring-2 focus:ring-blue/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-grey">Colour</label>
                  <input
                    type="text"
                    defaultValue={MY_DOG.colour}
                    className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl bg-offwhite border border-grey/20 text-charcoal focus:outline-none focus:ring-2 focus:ring-blue/30"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditProfileOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    setEditProfileOpen(false);
                    showToast("Profile updated!", "success");
                  }}
                >
                  Save
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation dialog */}
      <AnimatePresence>
        {deleteDialogOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteDialogOpen(false)}
          >
            <motion.div
              className="bg-white rounded-xl w-full max-w-[398px] p-6 shadow-xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-bold text-lg text-charcoal">
                Delete account?
              </h3>
              <p className="text-sm text-grey mt-2">
                This will permanently delete your account and all data. This
                action cannot be undone.
              </p>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
