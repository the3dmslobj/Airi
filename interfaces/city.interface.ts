export type FeatureCode = "PPL" | "PPLA" | string; // fallback to string for safety

export interface CityResult {
  id: number;

  // Names & location
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;

  // Admin hierarchy
  admin1?: string;
  admin1_id?: number;
  admin2?: string;
  admin2_id?: number;
  admin3?: string;
  admin3_id?: number;

  // Country
  country: string;
  country_code: string; // ISO2 (e.g., "MM", "TR")
  country_id?: number;

  // Misc
  population?: number;
  timezone: string; // e.g., "Asia/Yangon"
  feature_code?: FeatureCode; // e.g., "PPL", "PPLA"
}
