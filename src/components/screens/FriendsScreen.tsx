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
      {/* Header */}
      <header
        className="bg-navy text-white pt-[env(safe-area-inset-top)] pb-4 px-4 shrink-0"
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
            <p className="text-charcoal font-medium text-base mb-2">
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
            {/* Pending suggestions */}
            {hasSuggestions && (
              <section className="bg-lightblue px-4 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-2 h-2 rounded-full bg-orange shrink-0"
                    aria-hidden
                  />
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

            {/* Confirmed friends */}
            <section className="px-4 py-4">
              <p className="section-label">
                CONFIRMED FRIENDS
              </p>
              <div className="space-y-3">
                {sortedFriends.map((friend, i) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    priority={!hasSuggestions && i === 0}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
