import type { Visit, VisitDog } from "@/types";
import { getDogById } from "./dogs";

function vd(
  dogId: string,
  minutesNear: number,
  isFriend: boolean,
  hasPendingSuggestion?: boolean
): VisitDog | null {
  const dog = getDogById(dogId);
  return dog
    ? { dog, minutesNear, isFriend, hasPendingSuggestion }
    : null;
}

function encounter(
  specs: Array<[string, number, boolean, boolean?]>
): VisitDog[] {
  return specs
    .map(([id, mins, isFriend, pending]) =>
      vd(id, mins, isFriend, pending ?? false)
    )
    .filter((x): x is VisitDog => x !== null);
}

export const VISITS_INITIAL: Visit[] = [
  {
    id: "v-newstead-today",
    parkName: "Newstead Park",
    date: new Date().toISOString(),
    durationMinutes: 42,
    dogsEncountered: encounter([
      ["bella", 14, true, false],
      ["luna", 11, true, false],
      ["rex", 6, false, true],
      ["milo", 3, false, false],
    ]),
    isActive: true,
    startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "v-colmslie-yesterday",
    parkName: "Colmslie Reserve",
    date: new Date(Date.now() - 86400000).toISOString(),
    durationMinutes: 35,
    dogsEncountered: encounter([
      ["charlie", 12, true, false],
      ["ziggy", 8, false, false],
    ]),
  },
  {
    id: "v-newfarm-2d",
    parkName: "New Farm Park",
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    durationMinutes: 55,
    dogsEncountered: encounter([
      ["bella", 18, true, false],
      ["scout", 12, false, true],
      ["rosie", 5, false, false],
    ]),
  },
  {
    id: "v-newstead-4d",
    parkName: "Newstead Park",
    date: new Date(Date.now() - 4 * 86400000).toISOString(),
    durationMinutes: 38,
    dogsEncountered: encounter([
      ["luna", 15, true, false],
      ["rex", 9, false, true],
    ]),
  },
  {
    id: "v-newfarm-1w",
    parkName: "New Farm Park",
    date: new Date(Date.now() - 7 * 86400000).toISOString(),
    durationMinutes: 45,
    dogsEncountered: encounter([
      ["daisy", 10, true, false],
      ["hugo", 7, false, false],
    ]),
  },
  {
    id: "v-sunset-1w",
    parkName: "Sunset Park",
    date: new Date(Date.now() - 7 * 86400000).toISOString(),
    durationMinutes: 30,
    dogsEncountered: encounter([
      ["archie", 8, false, false],
      ["pepper", 4, false, false],
    ]),
  },
  {
    id: "v-newstead-10d",
    parkName: "Newstead Park",
    date: new Date(Date.now() - 10 * 86400000).toISOString(),
    durationMinutes: 50,
    dogsEncountered: encounter([
      ["bella", 20, true, false],
      ["luna", 12, true, false],
      ["coco", 6, false, false],
    ]),
  },
  {
    id: "v-colmslie-2w",
    parkName: "Colmslie Reserve",
    date: new Date(Date.now() - 14 * 86400000).toISOString(),
    durationMinutes: 40,
    dogsEncountered: encounter([
      ["charlie", 15, true, false],
      ["frankie", 9, false, false],
    ]),
  },
  {
    id: "v-riverside-3w",
    parkName: "Riverside Dog Park",
    date: new Date(Date.now() - 21 * 86400000).toISOString(),
    durationMinutes: 28,
    dogsEncountered: encounter([
      ["archie", 10, false, false],
      ["willow", 6, false, false],
    ]),
  },
];
