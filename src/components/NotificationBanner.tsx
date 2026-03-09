"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const AUTO_DISMISS_MS = 5000;

interface NotificationBannerProps {
  onDismiss: () => void;
}

export default function NotificationBanner({ onDismiss }: NotificationBannerProps) {
  const router = useRouter();

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }
    const t = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const handleTap = () => {
    onDismiss();
    router.push("/park/newstead");
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (info.offset.y < -30) onDismiss();
      }}
      className="absolute left-0 right-0 top-0 z-40 mx-4 mt-2 rounded-xl bg-white shadow-lg border border-grey/20 overflow-hidden"
      style={{ touchAction: "pan-y" }}
    >
      <button
        type="button"
        className="w-full p-4 text-left flex items-start gap-3 min-h-[44px]"
        onClick={handleTap}
      >
        <span className="text-2xl shrink-0" aria-hidden>
          🐕
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-charcoal text-sm">
            Bella just arrived at Newstead Park — 0.8 km from you!
          </p>
        </div>
      </button>
    </motion.div>
  );
}
