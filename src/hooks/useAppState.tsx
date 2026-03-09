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
} from "@/types";
import { FRIENDSHIPS_INITIAL } from "@/data/friendships";
import { FRIENDSHIP_SUGGESTIONS_INITIAL } from "@/data/friendships";
import { NOTIFICATIONS_INITIAL } from "@/data/notifications";
import { VISITS_INITIAL } from "@/data/visits";

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
    isCheckedIn: true,
    invisibleMode: false,
    notificationPrefs: { friendAlerts: true, visitSummaries: true },
    notifications: NOTIFICATIONS_INITIAL,
    dismissedSuggestions: [],
    visits: VISITS_INITIAL,
  };
}

function loadState(): AppState {
  if (typeof window === "undefined") return getDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
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
  setInvisibleMode: (on: boolean) => void;
  setNotificationPrefs: (prefs: Partial<AppState["notificationPrefs"]>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
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

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      setState,
      addFriendFromSuggestion,
      dismissSuggestion,
      setCheckedIn,
      setInvisibleMode,
      setNotificationPrefs,
      markNotificationRead,
      markAllNotificationsRead,
      setCurrentScreen,
    }),
    [
      state,
      addFriendFromSuggestion,
      dismissSuggestion,
      setCheckedIn,
      setInvisibleMode,
      setNotificationPrefs,
      markNotificationRead,
      markAllNotificationsRead,
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
