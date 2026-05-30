import { queryOptions } from "@tanstack/react-query";
import { fetchWeatherData, geocodeCity } from "./api";

export function geocodeCityQueryOptions(city?: string | null) {
  const rawCity = city ?? "";
  const trimmedCity = rawCity.trim();

  return queryOptions({
    queryKey: ["cities", rawCity],
    queryFn: () => geocodeCity(trimmedCity),
    enabled: Boolean(trimmedCity),
  });
}

export function weatherQueryOptions(lat?: number | null, lon?: number | null) {
  const hasCoords =
    typeof lat === "number" &&
    typeof lon === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lon);

  return queryOptions({
    queryKey: ["weather", lat, lon],
    queryFn: () => fetchWeatherData(lat as number, lon as number),
    enabled: hasCoords,
    staleTime: 1000 * 60 * 10, // weather is fine to reuse for ~10 min
  });
}
