export function isoToWeekday(iso: Date, locale: string = "en-US"): string {
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
    new Date(iso)
  );
}
export function isoToTime12h(iso: Date, timeZone?: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    hour12: true,
  }).format(new Date(iso));
}
