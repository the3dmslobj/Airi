import { configureStore } from "@reduxjs/toolkit";
import savedLocationsReducer, {
  hydrate,
} from "../slices/savedLocationsSlice";
import unitsReducer from "../slices/unitSlice";
import {
  loadSavedLocations,
  persistSavedLocations,
} from "./persistSavedLocations";

const store = configureStore({
  reducer: {
    units: unitsReducer,
    savedLocations: savedLocationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Rehydrate saved locations from storage, then persist future changes.
loadSavedLocations().then((items) => {
  if (items) store.dispatch(hydrate(items));
});
persistSavedLocations(store);

export default store;
