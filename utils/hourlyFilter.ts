import { HourlyWeatherType } from "@/interfaces/weather.interface";

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

interface HourlyBlockFiltered extends HourlyWeatherType {}

/** Get full weekday name from an ISO time. */
function weekdayOf(iso: string | Date, timeZone?: string): WeekDayLongType {
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long", // "Monday", "Tuesday", ...
  }).format(new Date(iso));
  return wd as WeekDayLongType;
}

/**
 * Filters an HourlyBlock to only entries matching a given weekday (e.g., "Monday").
 * If `timeZone` is provided, weekday is computed in that zone.
 */
export function filterHourlyByWeekday(
  hourly: HourlyWeatherType,
  weekday: WeekDayLongType,
  timeZone?: string
): HourlyBlockFiltered {
  const idxs: number[] = [];

  for (let i = 0; i < hourly.time.length; i++) {
    if (weekdayOf(hourly.time[i], timeZone) === weekday) idxs.push(i);
  }

  const pick = <T>(arr: T[]) => idxs.map((i) => arr[i]);

  return {
    time: pick(hourly.time),
    temperature_2m: pick(hourly.temperature_2m),
    weather_code: pick(hourly.weather_code),
  };
}
