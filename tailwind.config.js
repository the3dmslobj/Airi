/** @type {import('tailwindcss').Config} */

// Strict PICO-8 palette. These are the ONLY colors allowed in the app.
// Raw swatches (pico names) are the source of truth; semantic aliases map to them.
const pico = {
  black: "#000000",
  darkBlue: "#1D2B53",
  darkPurple: "#7E2553",
  darkGreen: "#008751",
  brown: "#AB5236",
  darkGrey: "#5F574F",
  lightGrey: "#C2C3C7",
  white: "#FFF1E8",
  red: "#FF004D",
  orange: "#FFA300",
  yellow: "#FFEC27",
  green: "#00E436",
  blue: "#29ADFF",
  lavender: "#83769C",
  pink: "#FF77A8",
  peach: "#FFCCAA",
};

module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    // Replace the default palette entirely so only PICO-8 tokens are available.
    colors: {
      transparent: "transparent",
      // Raw PICO-8 swatches
      ...pico,
      // Semantic aliases (preferred in components)
      bg: pico.darkBlue,
      surface: pico.black,
      surface2: pico.darkPurple,
      border: pico.lavender,
      text: pico.white,
      textDim: pico.lightGrey,
      textMuted: pico.lavender,
      accent: pico.red,
      // Weather-state accents
      sun: pico.yellow,
      rain: pico.blue,
      snow: pico.white,
      storm: pico.darkPurple,
      cloud: pico.lightGrey,
      fog: pico.lavender,
      overcast: pico.darkGrey,
      drizzle: pico.blue,
    },
    extend: {
      fontFamily: {
        pixel: ["Silkscreen_400Regular"],
        pixelBold: ["Silkscreen_700Bold"],
        term: ["VT323_400Regular"],
      },
    },
  },
  plugins: [],
};
