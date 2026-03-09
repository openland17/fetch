"use client";

import { type ReactNode } from "react";
import { AppStateProvider } from "@/hooks/useAppState";

export default function Providers({ children }: { children: ReactNode }) {
  return <AppStateProvider>{children}</AppStateProvider>;
}
