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

function round(value: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

type SpeedOut = "kmh" | "mph";
type LengthOut = "mm" | "in";
type TempOut = "c" | "f";

/** value is in km/h; convert only if target is 'mph' */
export function convertWind(
  valueKmh: number,
  to: SpeedOut = "kmh",
  decimals = 0
): number {
  return to === "mph"
    ? round(valueKmh / 1.609344, decimals) // km/h → mph
    : round(valueKmh, decimals);
}

/** value is in mm; convert only if target is 'in' */
export function convertPrec(
  valueMm: number,
  to: LengthOut = "mm",
  decimals = 0
): number {
  return to === "in"
    ? round(valueMm / 25.4, decimals) // mm → inches
    : round(valueMm, decimals);
}

/** value is in °C; convert only if target is 'f' */
export function convertTemp(
  valueC: number,
  to: TempOut = "c",
  decimals = 0
): number {
  return to === "f"
    ? round((valueC * 9) / 5 + 32, decimals) // °C → °F
    : round(valueC, decimals);
}
