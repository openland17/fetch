import type { Friendship, FriendshipSuggestion } from "@/types";
import { getDogById } from "./dogs";

function f(
  id: string,
  dogId: string,
  confirmedAt: string,
  totalMinutesTogether: number,
  totalEncounters: number,
  lastSeenAt: string
): Friendship | null {
  const dog = getDogById(dogId);
  return dog
    ? {
        id,
        dog,
        confirmedAt,
        totalMinutesTogether,
        totalEncounters,
        lastSeenAt,
      }
    : null;
}

function s(
  id: string,
  dogId: string,
  minutesTogether: number,
  encounters: number,
  parkName: string
): FriendshipSuggestion | null {
  const dog = getDogById(dogId);
  return dog
    ? { id, dog, minutesTogether, encounters, parkName }
    : null;
}

export const FRIENDSHIPS_INITIAL: Friendship[] = [
  f(
    "fb-bella",
    "bella",
    "2024-08-15T10:00:00.000Z",
    192,
    12,
    "Today at Newstead Park"
  ),
  f(
    "fb-luna",
    "luna",
    "2024-09-01T14:30:00.000Z",
    108,
    7,
    "Today at Newstead Park"
  ),
  f(
    "fb-charlie",
    "charlie",
    "2024-09-20T09:00:00.000Z",
    66,
    5,
    "Yesterday at Colmslie Reserve"
  ),
  f(
    "fb-daisy",
    "daisy",
    "2024-10-01T11:00:00.000Z",
    42,
    3,
    "3 days ago at New Farm"
  ),
].filter((x): x is Friendship => x !== null);

export const FRIENDSHIP_SUGGESTIONS_INITIAL: FriendshipSuggestion[] = [
  s("sug-rex", "rex", 18, 3, "Newstead Park"),
  s("sug-scout", "scout", 12, 2, "New Farm Park"),
].filter((x): x is FriendshipSuggestion => x !== null);
