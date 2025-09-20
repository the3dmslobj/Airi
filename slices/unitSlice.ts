import { createSlice } from "@reduxjs/toolkit";

interface InitialStateType {
  tempUnit: "c" | "f";
  windUnit: "kmh" | "mph";
  precUnit: "mm" | "in";
}

const initialState: InitialStateType = {
  tempUnit: "c",
  windUnit: "kmh",
  precUnit: "mm",
};

const unitsSlice = createSlice({
  name: "units",
  initialState,
  reducers: {
    tempUnitToggle: (state) => {
      state.tempUnit = state.tempUnit === "c" ? "f" : "c";
    },
    windUnitToggle: (state) => {
      state.windUnit = state.windUnit === "kmh" ? "mph" : "kmh";
    },
    precUnitToggle: (state) => {
      state.precUnit = state.precUnit === "mm" ? "in" : "mm";
    },
    toImperial: (state) => {
      state.precUnit = "in";
      state.tempUnit = "f";
      state.windUnit = "mph";
    },
    toMetric: (state) => {
      state.precUnit = "mm";
      state.tempUnit = "c";
      state.windUnit = "kmh";
    },
  },
});

export const {
  tempUnitToggle,
  windUnitToggle,
  precUnitToggle,
  toImperial,
  toMetric,
} = unitsSlice.actions;
export default unitsSlice.reducer;
