import { queryOptions } from "@tanstack/react-query";
import { geocodeCity } from "./api";

export function geocodeCityQueryOptions(city?: string | null) {
  const rawCity = city ?? "";
  const trimmedCity = rawCity.trim();

  return queryOptions({
    queryKey: ["cities", rawCity],
    queryFn: () => geocodeCity(trimmedCity),
    enabled: Boolean(trimmedCity),
  });
}
