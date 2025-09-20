export interface CurrentWeatherType {
  time: Date;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  precipitation: number;
  weather_code: number; // e.g. 0 = clear, 45 = fog (depends on provider table)
  wind_speed_10m: number;
}

export interface DailyWeatherType {
  time: Date[]; // one per day
  weather_code: number[]; // same length as time
  temperature_2m_max: number[]; // same length as time
  temperature_2m_min: number[]; // same length as time
}

export interface HourlyWeatherType {
  time: Date[]; // one per hour
  weather_code: number[]; // same length as time
  temperature_2m: number[]; // same length as time
}
