export interface Milestone {
  label: string;
  emoji: string;
}

export function getMilestone(encounters: number, minutesTogether: number): Milestone {
  if (encounters >= 10 || minutesTogether >= 180) {
    return { label: "Best Friends", emoji: "⭐" };
  }
  if (encounters >= 5) {
    return { label: "Park Buddies", emoji: "🐾" };
  }
  return { label: "First Meet", emoji: "🤝" };
}
