"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Friendship,
  FriendshipSuggestion,
  Notification,
  Visit,
  VisitDog,
} from "@/types";
import { FRIENDSHIPS_INITIAL } from "@/data/friendships";
import { FRIENDSHIP_SUGGESTIONS_INITIAL } from "@/data/friendships";
import { NOTIFICATIONS_INITIAL } from "@/data/notifications";
import { VISITS_INITIAL } from "@/data/visits";
import { getParkById } from "@/data/parks";

const STORAGE_KEY = "fetch-app-state";

export interface NotificationPrefs {
  friendAlerts: boolean;
  visitSummaries: boolean;
}

export interface AppState {
  currentScreen: string | null;
  friendships: Friendship[];
  suggestions: FriendshipSuggestion[];
  isCheckedIn: boolean;
  invisibleMode: boolean;
  notificationPrefs: NotificationPrefs;
  notifications: Notification[];
  dismissedSuggestions: string[];
  visits: Visit[];
}

function getDefaultState(): AppState {
  return {
    currentScreen: null,
    friendships: FRIENDSHIPS_INITIAL,
    suggestions: FRIENDSHIP_SUGGESTIONS_INITIAL,
    isCheckedIn: false,
    invisibleMode: false,
    notificationPrefs: { friendAlerts: true, visitSummaries: true },
    notifications: NOTIFICATIONS_INITIAL,
    dismissedSuggestions: [],
    visits: VISITS_INITIAL,
  };
}

const MAX_VISIT_MS = 3 * 60 * 60 * 1000; // 3 hours

function sanitizeVisits(visits: Visit[], isCheckedIn: boolean): { visits: Visit[]; isCheckedIn: boolean } {
  let checkedIn = isCheckedIn;
  const sanitized = visits.map((v) => {
    if (!v.isActive) return v;
    if (v.startedAt) {
      const elapsed = Date.now() - new Date(v.startedAt).getTime();
      if (elapsed > MAX_VISIT_MS || elapsed < 0) {
        checkedIn = false;
        return { ...v, isActive: false, durationMinutes: Math.min(180, Math.max(1, Math.round(elapsed / 60000))) };
      }
    }
    return v;
  });
  if (checkedIn && !sanitized.some((v) => v.isActive)) checkedIn = false;
  return { visits: sanitized, isCheckedIn: checkedIn };
}

function loadState(): AppState {
  if (typeof window === "undefined") return getDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const base: AppState = {
          ...getDefaultState(),
          ...parsed,
          friendships: parsed.friendships ?? getDefaultState().friendships,
          suggestions: parsed.suggestions ?? getDefaultState().suggestions,
          notificationPrefs:
            parsed.notificationPrefs ?? getDefaultState().notificationPrefs,
          notifications: parsed.notifications ?? getDefaultState().notifications,
          visits: parsed.visits ?? getDefaultState().visits,
          dismissedSuggestions:
            parsed.dismissedSuggestions ?? getDefaultState().dismissedSuggestions,
        };
    const { visits, isCheckedIn } = sanitizeVisits(base.visits, base.isCheckedIn);
    return { ...base, visits, isCheckedIn };
  } catch {
    return getDefaultState();
  }
}

function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

type SetStateFn = (prev: AppState) => AppState;

interface AppContextValue {
  state: AppState;
  setState: (value: AppState | SetStateFn) => void;
  addFriendFromSuggestion: (suggestionId: string) => void;
  dismissSuggestion: (suggestionId: string) => void;
  setCheckedIn: (checkedIn: boolean) => void;
  checkIn: (parkId: string) => void;
  endVisit: () => void;
  setInvisibleMode: (on: boolean) => void;
  setNotificationPrefs: (prefs: Partial<AppState["notificationPrefs"]>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;
  setCurrentScreen: (screen: string | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(getDefaultState);

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setCheckedIn = useCallback((checkedIn: boolean) => {
    setState((prev) => ({ ...prev, isCheckedIn: checkedIn }));
  }, []);

  const checkIn = useCallback((parkId: string) => {
    setState((prev) => {
      if (prev.isCheckedIn) return prev;
      const park = getParkById(parkId);
      if (!park) return prev;
      const friendIds = new Set(prev.friendships.map((f) => f.dog.id));
      const suggestionIds = new Set(prev.suggestions.map((s) => s.dog.id));
      const dogsEncountered: VisitDog[] = park.activeDogs.map((pd) => ({
        dog: pd.dog,
        minutesNear: 0,
        isFriend: friendIds.has(pd.dog.id),
        hasPendingSuggestion: suggestionIds.has(pd.dog.id),
      }));
      const newVisit: Visit = {
        id: `v-${parkId}-${Date.now()}`,
        parkId,
        parkName: park.name,
        date: new Date().toISOString(),
        durationMinutes: 0,
        dogsEncountered,
        isActive: true,
        startedAt: new Date().toISOString(),
      };
      return {
        ...prev,
        isCheckedIn: true,
        visits: [newVisit, ...prev.visits],
      };
    });
  }, []);

  const endVisit = useCallback(() => {
    setState((prev) => {
      const activeIdx = prev.visits.findIndex((v) => v.isActive);
      if (activeIdx === -1) return { ...prev, isCheckedIn: false };
      const active = prev.visits[activeIdx];
      const elapsed = active.startedAt
        ? Math.round((Date.now() - new Date(active.startedAt).getTime()) / 60000)
        : active.durationMinutes;
      const updated: Visit = {
        ...active,
        isActive: false,
        durationMinutes: Math.min(180, Math.max(1, elapsed)),
      };
      const visits = [...prev.visits];
      visits[activeIdx] = updated;
      return { ...prev, isCheckedIn: false, visits };
    });
  }, []);

  const setInvisibleMode = useCallback((on: boolean) => {
    setState((prev) => ({ ...prev, invisibleMode: on }));
  }, []);

  const setNotificationPrefs = useCallback(
    (prefs: Partial<AppState["notificationPrefs"]>) => {
      setState((prev) => ({
        ...prev,
        notificationPrefs: { ...prev.notificationPrefs, ...prefs },
      }));
    },
    []
  );

  const setCurrentScreen = useCallback((screen: string | null) => {
    setState((prev) => ({ ...prev, currentScreen: screen }));
  }, []);

  const addFriendFromSuggestion = useCallback((suggestionId: string) => {
    setState((prev) => {
      const suggestion = prev.suggestions.find((s) => s.id === suggestionId);
      if (!suggestion) return prev;
      const newFriend: Friendship = {
        id: `fb-${suggestion.dog.id}`,
        dog: suggestion.dog,
        confirmedAt: new Date().toISOString(),
        totalMinutesTogether: suggestion.minutesTogether,
        totalEncounters: suggestion.encounters,
        lastSeenAt: suggestion.parkName,
      };
      return {
        ...prev,
        friendships: [...prev.friendships, newFriend],
        suggestions: prev.suggestions.filter((s) => s.id !== suggestionId),
        dismissedSuggestions: [...prev.dismissedSuggestions, suggestionId],
      };
    });
  }, []);

  const dismissSuggestion = useCallback((suggestionId: string) => {
    setState((prev) => ({
      ...prev,
      suggestions: prev.suggestions.filter((s) => s.id !== suggestionId),
      dismissedSuggestions: [...prev.dismissedSuggestions, suggestionId],
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((n) => n.id !== id),
    }));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      setState,
      addFriendFromSuggestion,
      dismissSuggestion,
      setCheckedIn,
      checkIn,
      endVisit,
      setInvisibleMode,
      setNotificationPrefs,
      markNotificationRead,
      markAllNotificationsRead,
      dismissNotification,
      setCurrentScreen,
    }),
    [
      state,
      addFriendFromSuggestion,
      dismissSuggestion,
      setCheckedIn,
      checkIn,
      endVisit,
      setInvisibleMode,
      setNotificationPrefs,
      markNotificationRead,
      markAllNotificationsRead,
      dismissNotification,
      setCurrentScreen,
    ]
  );

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppStateProvider");
  }
  return ctx;
}
