/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        dmBold: ["dm-bold", "System"],
        briBold: ["bri-bold", "System"],
        dmLight: ["dm-light", "System"],
        dm: ["dm-medium", "System"],
        dmSemiBold: ["dm-semi", "System"],
        dmSemiBoldItalic: ["dm-semiItalic", "System"],
      },
      colors: {
        n900: "hsl(243, 96%, 9%)",
        n800: "hsl(243, 27%, 20%)",
        n700: "hsl(243, 23%, 24%)",
        n600: "hsl(243, 23%, 30%)",
        n300: "hsl(240, 6%, 70%)",
        n200: "hsl(250, 6%, 84%)",
        n0: "hsl(0, 0%, 100%)",
        o500: "hsl(28, 100%, 52%)",
        b700: "hsl(248, 70%, 36%)",
        b500: "hsl(233, 67%, 56%)",
      },
    },
  },
  plugins: [],
};
