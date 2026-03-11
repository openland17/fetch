"use client";

import { ReactNode, useEffect, useState } from "react";
import BottomNav from "./BottomNav";
import { DogProfileProvider } from "./DogProfileSheet";
import AddToHomeBanner from "./AddToHomeBanner";

export default function AppShell({ children }: { children: ReactNode }) {
  const [origin, setOrigin] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Below 430px: full-screen edge-to-edge. Desktop: phone frame with gloss */}
      <div className="min-h-safe-screen w-full max-w-[430px] mx-auto md:min-h-[932px] md:h-[932px] md:w-[430px] md:rounded-[2.5rem] md:overflow-visible md:shadow-2xl md:bg-navy md:p-2 md:box-border relative md:ring-2 md:ring-white/10">
        {/* Gloss only on desktop (no frame on real iPhone) */}
        <div
          className="hidden md:block absolute inset-x-2 top-2 h-24 md:rounded-t-[2rem] pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 40%, transparent 100%)",
          }}
          aria-hidden
        />
        <DogProfileProvider>
        <div className="flex flex-col h-full min-h-safe-screen md:min-h-[900px] md:h-[900px] bg-offwhite md:rounded-[2rem] overflow-hidden relative">
          <main
            className="flex-1 overflow-auto overflow-x-hidden flex flex-col scroll-touch"
            style={{ paddingBottom: "var(--scroll-padding-bottom)" }}
          >
            {children}
          </main>
          <BottomNav />
          <AddToHomeBanner />
        </div>
        </DogProfileProvider>
      </div>
      {/* Desktop-only hint with URL */}
      <p className="hidden md:block mt-6 text-center text-white/80 text-sm px-4">
        Open on your phone for the best experience
      </p>
      {origin && (
        <p className="hidden md:block mt-2 text-center text-white/60 text-xs font-mono break-all px-4 max-w-[430px]">
          {origin}
        </p>
      )}
    </div>
  );
}
