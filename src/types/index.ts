export interface Dog {
  id: string;
  name: string;
  breed: string;
  colour: string;
  photoUrl: string;
  tagId: string | null;
  isOwnDog?: boolean;
}

export interface ParkDog {
  dog: Dog;
  isFriend: boolean;
  arrivedMinutesAgo: number;
}

export interface ParkActivity {
  text: string;
  minutesAgo: number;
}

export interface Park {
  id: string;
  name: string;
  suburb: string;
  latitude: number;
  longitude: number;
  isFenced: boolean;
  hasSmallDogArea: boolean;
  hasAgility: boolean;
  hasWaterAccess: boolean;
  distanceKm: number;
  activeDogCount: number;
  friendCount: number;
  activeDogs: ParkDog[];
  recentActivity?: ParkActivity[];
}

export interface Friendship {
  id: string;
  dog: Dog;
  confirmedAt: string;
  totalMinutesTogether: number;
  totalEncounters: number;
  lastSeenAt: string;
}

export interface FriendshipSuggestion {
  id: string;
  dog: Dog;
  minutesTogether: number;
  encounters: number;
  parkName: string;
}

export interface VisitDog {
  dog: Dog;
  minutesNear: number;
  isFriend: boolean;
  hasPendingSuggestion?: boolean;
}

export interface Visit {
  id: string;
  parkId: string;
  parkName: string;
  date: string;
  durationMinutes: number;
  dogsEncountered: VisitDog[];
  isActive?: boolean;
  /** When the visit started (ISO string). Used for live timer; if missing, durationMinutes is used. */
  startedAt?: string;
}

export type NotificationType =
  | "friend_alert"
  | "visit_summary"
  | "friendship_suggestion"
  | "friendship_confirmed";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  parkId?: string;
  dogName?: string;
  read: boolean;
}
