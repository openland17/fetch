"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Heart, Clock, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "@/hooks/useAppState";

const tabs = [
  { href: "/", label: "Parks", icon: MapPin },
  { href: "/friends", label: "Friends", icon: Heart },
  { href: "/visits", label: "Visits", icon: Clock },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { state } = useApp();
  const unreadCount = useMemo(
    () => state.notifications.filter((n) => !n.read).length,
    [state.notifications]
  );
  const isOnParks = pathname === "/" || pathname.startsWith("/park/");

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/95 backdrop-blur-md border-t border-grey/10 z-50"
      style={{
        paddingBottom: "calc(8px + env(safe-area-inset-bottom))",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.04)",
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
      }}
    >
      <div className="flex items-center justify-around pt-1.5" style={{ height: 56 }}>
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href === "/" && pathname.startsWith("/park/"));
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] py-1 transition-colors"
            >
              {isActive && (
                <motion.span
                  layoutId="nav-dot"
                  className="w-1 h-1 rounded-full bg-blue mb-0.5"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <motion.span
                className="relative flex items-center justify-center"
                whileTap={{ scale: 0.85 }}
              >
                <Icon
                  size={22}
                  className={isActive ? "text-blue" : "text-grey/60"}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {href === "/" && !isOnParks && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-orange border border-white" />
                )}
              </motion.span>
              <span
                className={`text-[11px] leading-tight ${
                  isActive ? "text-blue font-semibold" : "text-grey/60 font-medium"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
