"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Heart, Clock, Settings } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { href: "/", label: "Parks", icon: MapPin },
  { href: "/friends", label: "Friends", icon: Heart },
  { href: "/visits", label: "Visits", icon: Clock },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-grey/20 z-50 pt-2"
      style={{
        paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
      }}
    >
      <div className="flex items-center justify-around h-14">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href === "/" && pathname.startsWith("/park/"));
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] py-2 rounded-xl transition-colors"
            >
              <motion.span
                className={`flex items-center justify-center rounded-xl px-3 py-1.5 ${
                  isActive ? "bg-blue/20 ring-2 ring-blue/40" : ""
                }`}
                animate={{ scale: isActive ? 1.02 : 1 }}
                transition={{ duration: 0.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon
                  size={22}
                  className={isActive ? "text-blue" : "text-grey"}
                  strokeWidth={2.25}
                />
              </motion.span>
              <span
                className={`text-xs ${
                  isActive ? "text-blue font-semibold" : "text-grey font-medium"
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
