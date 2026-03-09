/**
 * Format a visit date for display.
 * Today → "Today"
 * Yesterday → "Yesterday"
 * Within a week → "X days ago"
 * Older → "Mar 5" format
 */
export function formatVisitDate(isoDate: string): string {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return "—";
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.floor(
    (startOfToday.getTime() - startOfDate.getTime()) / 86400000
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;

  const month = d.toLocaleString("en-AU", { month: "short" });
  const day = d.getDate();
  return `${month} ${day}`;
}

/**
 * Format duration in minutes as "X min" or "Xh Ym"
 */
export function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes < 0) return "—";
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/**
 * Format total seconds as "X min" or "Xh Ym" for live timer
 */
export function formatDurationFromSeconds(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0 min";
  const minutes = Math.floor(totalSeconds / 60);
  return formatDuration(minutes);
}
