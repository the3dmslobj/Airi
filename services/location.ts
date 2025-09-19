import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";

export function useCurrentLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    async function run() {
      try {
        // 1) Permission
        const { status, canAskAgain } =
          await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError(
            canAskAgain
              ? "Location permission denied. Please allow access."
              : "Location permission permanently denied. Enable it in Settings."
          );
          return;
        }

        // 2) Services enabled?
        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
          setError("Location services are off. Turn them on and try again.");
          return;
        }

        // 3) Optional fast fallback
        const last = await Location.getLastKnownPositionAsync();
        if (mounted.current && last) setLocation(last);

        // 4) Fresh fix with timeout
        const fresh = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced, // or Low for speed, High for precision
          // Note: timeInterval is not used here
        });

        if (mounted.current) {
          setLocation(fresh);
          setError(null);
        }
      } catch (e: any) {
        if (mounted.current) setError(e?.message ?? "Failed to get location.");
      }
    }

    run();

    return () => {
      mounted.current = false;
    };
  }, []);

  return { location, error };
}
