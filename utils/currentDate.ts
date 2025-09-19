export function getCurrentDate(timezone: string): string {
  const now = new Date();

  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(now);
}
