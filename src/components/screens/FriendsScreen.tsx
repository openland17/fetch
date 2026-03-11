"use client";

import Link from "next/link";
import { useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/hooks/useAppState";
import { useScrollRestore } from "@/hooks/useScrollRestore";
import FriendshipSuggestionCard from "@/components/FriendshipSuggestionCard";
import FriendCard from "@/components/FriendCard";
import Button from "@/components/ui/Button";

export default function FriendsScreen() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { state, addFriendFromSuggestion, dismissSuggestion } = useApp();

  useScrollRestore(pathname, scrollRef);

  const sortedFriends = useMemo(() => {
    return [...state.friendships].sort(
      (a, b) =>
        new Date(b.confirmedAt).getTime() - new Date(a.confirmedAt).getTime()
    );
  }, [state.friendships]);

  const hasSuggestions = state.suggestions.length > 0;
  const hasFriends = state.friendships.length > 0;
  const isEmpty = !hasSuggestions && !hasFriends;

  return (
    <div className="flex flex-col min-h-full">
      <header
        className="bg-gradient-to-b from-navy to-[#0F2A45] text-white pt-[env(safe-area-inset-top)] pb-4 px-4 shrink-0"
        style={{ paddingTop: "calc(1rem + env(safe-area-inset-top))" }}
      >
        <h1 className="text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis">
          Cooper&apos;s&nbsp;Friends
        </h1>
        <p className="text-sm text-grey mt-0.5">
          {state.friendships.length} friend
          {state.friendships.length !== 1 ? "s" : ""}
        </p>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-auto overflow-x-hidden scroll-touch"
        style={{ paddingBottom: "var(--scroll-padding-bottom)" }}
      >
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
            <span className="text-6xl mb-4" aria-hidden>
              🐕
            </span>
            <p className="text-charcoal font-semibold text-base mb-2">
              Take Cooper to the park to start making friends!
            </p>
            <p className="text-grey text-sm mb-6">
              When Cooper plays with the same dogs a few times, they&apos;ll
              show up here.
            </p>
            <Link href="/">
              <Button variant="primary" size="md">
                Find a Park
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {hasSuggestions && (
              <section className="bg-gradient-to-b from-lightblue to-offwhite px-4 py-4 rounded-b-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange" />
                  </span>
                  <p className="section-label mb-0">
                    NEW MATCHES
                  </p>
                </div>
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {state.suggestions.map((suggestion, i) => (
                      <FriendshipSuggestionCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        onConfirm={addFriendFromSuggestion}
                        onDismiss={dismissSuggestion}
                        priority={i === 0}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}

            <section className="px-4 py-4">
              <p className="section-label">
                CONFIRMED FRIENDS
              </p>
              <div className="space-y-3">
                {sortedFriends.map((friend, i) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.04 }}
                  >
                    <FriendCard
                      friend={friend}
                      priority={!hasSuggestions && i === 0}
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
