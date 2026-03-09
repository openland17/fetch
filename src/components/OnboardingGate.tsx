"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LoadingSkeleton from "./LoadingSkeleton";

const ONBOARDED_KEY = "fetch-onboarded";

export default function OnboardingGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    if (pathname === "/onboarding") {
      setShowChildren(true);
      return;
    }
    if (typeof window === "undefined") return;
    if (localStorage.getItem(ONBOARDED_KEY) === "1") {
      setShowChildren(true);
      return;
    }
    router.replace("/onboarding");
  }, [pathname, router]);

  if (!showChildren) {
    return (
      <div className="min-h-safe-screen w-full bg-offwhite flex flex-col">
        <LoadingSkeleton />
      </div>
    );
  }

  return <>{children}</>;
}
