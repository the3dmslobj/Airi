export function isoToWeekday(iso: Date, locale: string = "en-US"): string {
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
    new Date(iso)
  );
}
