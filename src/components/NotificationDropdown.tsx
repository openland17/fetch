"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import type { Notification } from "@/types";
import { getRelativeTime } from "@/lib/relativeTime";

interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
  onNotificationTap: (n: Notification) => void;
}

function getNotificationIcon(type: Notification["type"]) {
  if (type === "friend_alert") return "🐕";
  if (type === "visit_summary") return "📍";
  return "⭐";
}

export default function NotificationDropdown({
  open,
  onClose,
  notifications,
  onMarkAllRead,
  onNotificationTap,
}: NotificationDropdownProps) {
  const router = useRouter();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleTap = (n: Notification) => {
    onNotificationTap(n);
    onClose();
    if (n.parkId) router.push(`/park/${n.parkId}`);
    else if (n.type === "friendship_suggestion") router.push("/friends");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            style={{
              WebkitBackdropFilter: "blur(4px)",
              backdropFilter: "blur(4px)",
            }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 left-0 top-full z-50 mt-2 mx-4 rounded-xl bg-white shadow-xl border border-grey/20 overflow-hidden max-h-[70vh] flex flex-col"
          >
            <div className="p-3 border-b border-grey/10 flex items-center justify-between">
              <span className="font-semibold text-charcoal text-sm">
                Notifications
              </span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onMarkAllRead();
                  }}
                  className="min-h-[44px] min-w-[44px] -my-1 flex items-center justify-center text-xs text-blue font-medium gap-1"
                >
                  <CheckCircle size={14} strokeWidth={2} />
                  Mark all read
                </button>
              )}
            </div>
            <div className="overflow-auto scroll-touch">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-grey text-sm">
                  No notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className={`w-full p-4 flex items-start gap-3 text-left border-b border-grey/10 last:border-0 min-h-[44px] ${
                      !n.read ? "bg-lightblue/30" : ""
                    }`}
                    onClick={() => handleTap(n)}
                  >
                    <span className="text-lg shrink-0">
                      {getNotificationIcon(n.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-charcoal text-sm">
                        {n.title ?? "Notification"}
                      </p>
                      <p className="text-xs text-grey mt-0.5 line-clamp-2">
                        {n.body ?? ""}
                      </p>
                      <p className="text-xs text-grey mt-1">
                        {getRelativeTime(n.timestamp)}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
