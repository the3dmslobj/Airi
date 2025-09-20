import { CityResult } from "./city.interface";
import {
  CurrentWeatherType,
  DailyWeatherType,
  HourlyWeatherType,
} from "./weather.interface";

export type CityResponse = CityResult[];

export interface LocationIqReverseResponse {
  place_id: string | number;
  osm_type: "node" | "way" | "relation" | string;
  osm_id: string | number;

  lat: string; // e.g. "37.7871093"
  lon: string; // e.g. "-122.40650920869942"

  display_name: string;
  licence?: string;

  // [south, north, west, east] — all strings per API
  boundingbox: [string, string, string, string];

  address?: {
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city_district?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string; // e.g. "us"
    train_station?: string; // provider-specific extras can appear
    [key: string]: string | undefined; // keep flexible for other fields
  };

  // Some responses include an "error" field on failure/rate limit
  error?: string;
}

export interface WeatherResponse {
  timezone: string;
  current: CurrentWeatherType;
  daily: DailyWeatherType;
  hourly: HourlyWeatherType;
}
