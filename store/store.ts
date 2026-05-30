import { configureStore } from "@reduxjs/toolkit";
import savedLocationsReducer from "../slices/savedLocationsSlice";
import unitsReducer from "../slices/unitSlice";

const store = configureStore({
  reducer: {
    units: unitsReducer,
    savedLocations: savedLocationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
