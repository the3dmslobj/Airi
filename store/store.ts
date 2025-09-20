import { configureStore } from "@reduxjs/toolkit";
import unitsReducer from "../slices/unitSlice";

const store = configureStore({
  reducer: {
    units: unitsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
