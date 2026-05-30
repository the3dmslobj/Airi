import { SavedLocation } from "@/interfaces/savedLocation.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SavedLocationsState {
  items: SavedLocation[];
}

const initialState: SavedLocationsState = {
  items: [],
};

const savedLocationsSlice = createSlice({
  name: "savedLocations",
  initialState,
  reducers: {
    // Replaces the list with whatever was persisted in storage.
    hydrate: (state, action: PayloadAction<SavedLocation[]>) => {
      state.items = action.payload;
    },
    addLocation: (state, action: PayloadAction<SavedLocation>) => {
      if (state.items.some((item) => item.id === action.payload.id)) return;
      state.items.push(action.payload);
    },
    removeLocation: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { hydrate, addLocation, removeLocation } =
  savedLocationsSlice.actions;
export default savedLocationsSlice.reducer;
