"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
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

  return (
    <div className="flex flex-col min-h-full">
      <Toast
        message={toast.message}
        variant={toast.variant}
        visible={toast.visible}
      />

      {/* Header */}
      <header
        className="bg-navy text-white pt-[env(safe-area-inset-top)] pb-4 px-4 shrink-0"
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
            >
              Edit Profile
            </Button>
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
          <div className="p-4 text-sm text-grey">
            Version 1.0.0 (MVP)
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

      {/* Delete confirmation dialog */}
      <AnimatePresence>
        {deleteDialogOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/50"
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
