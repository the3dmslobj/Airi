import { CityResponse } from "@/interfaces/response.interface";
import { fetchWeatherApi } from "openmeteo";

export async function fetchWeatherData() {
  const params = {
    latitude: 52.52,
    longitude: 13.41,
    hourly: "temperature_2m",
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
  const timezone = response.timezone();
  const timezoneAbbreviation = response.timezoneAbbreviation();
  const utcOffsetSeconds = response.utcOffsetSeconds();

  console.log(
    `\nCoordinates: ${latitude}°N ${longitude}°E`,
    `\nElevation: ${elevation}m asl`,
    `\nTimezone: ${timezone} ${timezoneAbbreviation}`,
    `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`
  );
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
