/** @type {import('tailwindcss').Config} */

// Strict monochrome palette (Nothing-style). These are the ONLY colors allowed.
const mono = {
  black: "#000000",
  white: "#FFFFFF",
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
    // Replace the default palette entirely so only monochrome tokens are available.
    colors: {
      transparent: "transparent",
      ...mono,
      // Semantic aliases (preferred in components)
      bg: "#000000",
      surface: "#0A0A0A",
      surface2: "#161616",
      line: "#2A2A2A",
      text: "#FFFFFF",
      textDim: "#8A8A8A",
      textMuted: "#5A5A5A",
    },
    extend: {
      fontFamily: {
        // Dot-matrix display font, used sparingly (hero temp + tiny labels).
        dot: ["Doto_500Medium"],
        dotBold: ["Doto_700Bold"],
        // Readable monospace for body text, menus, lists.
        mono: ["SpaceMono_400Regular"],
        monoBold: ["SpaceMono_700Bold"],
      },
    },
  },
  plugins: [],
};
