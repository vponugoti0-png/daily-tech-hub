import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";

export function formatDate(value: string): string {
  const d = parseISO(value);
  if (!isValid(d)) return value;
  return format(d, "MMM d, yyyy");
}

export function formatDateTime(value: string): string {
  const d = parseISO(value);
  if (!isValid(d)) return value;
  return format(d, "MMM d, yyyy · HH:mm 'UTC'");
}

export function relativeTime(value: string): string {
  const d = parseISO(value);
  if (!isValid(d)) return value;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function todayISODate(): string {
  return format(new Date(), "yyyy-MM-dd");
}
