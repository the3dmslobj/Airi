export interface CurrentWeatherType {
  /** ISO string, e.g. "2025-09-19T08:45:00.000Z" */
  time: Date;

  /** °C */
  temperature_2m: number;

  /** °C (feels like) */
  apparent_temperature: number;

  /** % */
  relative_humidity_2m: number;

  /** mm (per interval, often 1h) */
  precipitation: number;

  /** m/s */
  wind_speed_10m: number;
  weather_code: number;
}
