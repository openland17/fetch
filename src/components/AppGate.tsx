"use client";

import { usePathname } from "next/navigation";
import InitialLoadGate from "./InitialLoadGate";
import OnboardingGate from "./OnboardingGate";
import AppShell from "./AppShell";
import PageTransition from "./PageTransition";

export default function AppGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOnboarding = pathname === "/onboarding";

  return (
    <InitialLoadGate>
      <OnboardingGate>
        {isOnboarding ? (
          children
        ) : (
          <AppShell>
            <PageTransition>{children}</PageTransition>
          </AppShell>
        )}
      </OnboardingGate>
    </InitialLoadGate>
  );
}
