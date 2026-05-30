import { SavedLocation } from "@/interfaces/savedLocation.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Store } from "@reduxjs/toolkit";
import type { RootState } from "./store";

const STORAGE_KEY = "airi.savedLocations";

// Read the persisted saved locations, returning null if none/invalid.
export async function loadSavedLocations(): Promise<SavedLocation[] | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedLocation[]) : null;
  } catch {
    return null;
  }
}

// Subscribe to the store and write savedLocations back to storage on change.
export function persistSavedLocations(store: Store<RootState>) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastItems = store.getState().savedLocations.items;

  store.subscribe(() => {
    const items = store.getState().savedLocations.items;
    if (items === lastItems) return; // nothing relevant changed
    lastItems = items;

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {
        // best-effort persistence; ignore write failures
      });
    }, 300);
  });
}
