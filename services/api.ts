import {
  CityResponse,
  LocationIqReverseResponse,
} from "@/interfaces/response.interface";
import { fetchWeatherApi } from "openmeteo";

export async function fetchWeatherData(lat: number, lon: number) {
  const params = {
    latitude: lat,
    longitude: lon,
    daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"],
    hourly: ["temperature_2m", "weather_code"],
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "wind_speed_10m",
      "weather_code",
    ],
    timezone: "auto",
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

  // Attributes for timezone and location
  const latitude = response.latitude();
  const longitude = response.longitude();
  const elevation = response.elevation();
  const timezone =
    response.timezone() ??
    Intl.DateTimeFormat().resolvedOptions().timeZone ??
    "UTC";
  const timezoneAbbreviation = response.timezoneAbbreviation();
  const utcOffsetSeconds = response.utcOffsetSeconds();

  //console.log(
  // `\nCoordinates: ${latitude}°N ${longitude}°E`,
  //  `\nElevation: ${elevation}m asl`,
  // `\nTimezone: ${timezone} ${timezoneAbbreviation}`,
  // `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`
  // );

  const current = response.current()!;
  const hourly = response.hourly()!;
  const daily = response.daily()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const dailyWeatherCode = daily.variables(0)?.valuesArray();
  const dailyTempMax = daily.variables(1)?.valuesArray();
  const dailyTempMin = daily.variables(2)?.valuesArray();
  const hourlyTemperature = hourly.variables(0)?.valuesArray();
  const hourlyWeatherCode = hourly.variables(1)?.valuesArray();

  const weatherData = {
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature_2m: current.variables(0)!.value(),
      relative_humidity_2m: current.variables(1)!.value(),
      apparent_temperature: current.variables(2)!.value(),
      precipitation: current.variables(3)!.value(),
      wind_speed_10m: current.variables(4)!.value(),
      weather_code: current.variables(5)!.value(),
    },
    hourly: {
      time: [
        ...Array(
          (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval()
        ),
      ].map(
        (_, i) =>
          new Date(
            (Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) *
              1000
          )
      ),
      temperature_2m: hourlyTemperature ? Array.from(hourlyTemperature) : [],
      weather_code: hourlyWeatherCode ? Array.from(hourlyWeatherCode) : [],
    },
    daily: {
      time: [
        ...Array(
          (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval()
        ),
      ].map(
        (_, i) =>
          new Date(
            (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) *
              1000
          )
      ),
      weather_code: dailyWeatherCode ? Array.from(dailyWeatherCode) : [],
      temperature_2m_max: dailyTempMax ? Array.from(dailyTempMax) : [],
      temperature_2m_min: dailyTempMin ? Array.from(dailyTempMin) : [],
    },
  };

  // 'weatherData' now contains a simple structure with arrays with datetime and weather data
  //console.log(
  //  `\nCurrent time: ${weatherData.current.time}`,
  //  `\nCurrent temperature_2m: ${weatherData.current.temperature_2m}`,
  //  `\nCurrent relative_humidity_2m: ${weatherData.current.relative_humidity_2m}`,
  //  `\nCurrent apparent_temperature: ${weatherData.current.apparent_temperature}`,
  //  `\nCurrent precipitation: ${weatherData.current.precipitation}`,
  //  `\nCurrent wind_speed_10m: ${weatherData.current.wind_speed_10m}`
  //);
  //console.log("\nHourly data", weatherData.hourly);
  //console.log("\nDaily data", weatherData.daily);

  //console.log(weatherData.current);

  return {
    current: weatherData.current,
    hourly: weatherData.hourly,
    daily: weatherData.daily,
    timezone,
  };
}

export async function geocodeCity(name: string): Promise<CityResponse> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return [];
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    trimmedName
  )}&count=5&language=en`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to geocode city: ${res.status}`);
  }

  const data = await res.json();
  const hits = Array.isArray(data?.results)
    ? (data.results as CityResponse)
    : ([] as CityResponse);

  return hits;
}

export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<LocationIqReverseResponse | null> {
  const apiKey = process.env.EXPO_PUBLIC_GEOCODE_KEY;
  const url = `https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${lat}&lon=${lon}&format=json&`;

  const res = await fetch(url);
  const data = await res.json();
  if (!data) return null;
  return data;
}
