export function getCurrentDate(timezone?: string): string {
  const now = new Date();
  const baseOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  if (!timezone) {
    return new Intl.DateTimeFormat("en-US", baseOptions).format(now);
  }

  try {
    return new Intl.DateTimeFormat("en-US", {
      ...baseOptions,
      timeZone: timezone,
    }).format(now);
  } catch (error) {
    if (error instanceof RangeError) {
      return new Intl.DateTimeFormat("en-US", baseOptions).format(now);
    }

    throw error;
  }
}

export const WEEKDAYS_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type WeekDayLongType = (typeof WEEKDAYS_LONG)[number];

function isWeekDayLong(x: string): x is WeekDayLongType {
  return (WEEKDAYS_LONG as readonly string[]).includes(x);
}

export function getCurrentWeekday(timezone?: string): WeekDayLongType {
  const now = new Date();

  const fmt = (tz?: string) =>
    new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: tz }).format(
      now
    );

  try {
    const out = fmt(timezone);
    if (isWeekDayLong(out)) return out;

    // ultra-safe fallback if some locale quirk occurs
    return fmt(undefined) as WeekDayLongType;
  } catch (e) {
    // Invalid time zone → fallback without tz
    const out = fmt(undefined);
    return isWeekDayLong(out) ? out : "Sunday";
  }
}
