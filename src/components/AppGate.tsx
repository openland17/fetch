"use client";

import InitialLoadGate from "./InitialLoadGate";
import OnboardingGate from "./OnboardingGate";
import PageTransition from "./PageTransition";

export default function AppGate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InitialLoadGate>
      <OnboardingGate>
        <PageTransition>{children}</PageTransition>
      </OnboardingGate>
    </InitialLoadGate>
  );
}
