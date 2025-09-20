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
