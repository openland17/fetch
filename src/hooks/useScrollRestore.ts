"use client";

import { useEffect, RefObject } from "react";

const SCROLL_KEY_PREFIX = "fetch-scroll-";

export function useScrollRestore(
  pathname: string,
  scrollRef: RefObject<HTMLDivElement | null>
) {
  const key = SCROLL_KEY_PREFIX + pathname;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const saved = sessionStorage.getItem(key);
    if (saved !== null) {
      const top = Number(saved);
      if (Number.isFinite(top)) {
        const id = requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (scrollRef.current) scrollRef.current.scrollTop = top;
          });
        });
        return () => {
          cancelAnimationFrame(id);
          sessionStorage.setItem(key, String(el.scrollTop));
        };
      }
    }
    return () => {
      sessionStorage.setItem(key, String(el.scrollTop));
    };
  }, [key, scrollRef]);
}
