# Airi

A weather app for iOS, Android, and web — built with Expo and React Native, wrapped in a **Nothing-style monochrome dot-matrix** interface.

## Features

- **Current conditions** — temperature, feels-like, humidity, wind, and precipitation for your location.
- **Hourly & daily forecasts** — scrollable hourly view (per weekday) and a multi-day outlook.
- **Animated dot-matrix weather** — each weather state is drawn as a monochrome dot glyph and animated (pulsing sun, falling rain/snow, flashing storm) on the current view.
- **Search any city** — geocoded place search.
- **Saved locations** — star cities and switch between them; persisted on device. Device location is always available.
- **Unit switching** — °C/°F, km/h / mph, mm / in, persisted across sessions.
- **Pull-to-refresh**, loading skeletons, and a retry-able error state.

## Tech stack

- **Expo SDK 56** + **React Native 0.85** (New Architecture) with **Expo Router**
- **NativeWind** (Tailwind) for styling, with a strict monochrome token set
- **Redux Toolkit** (units, saved locations) + **AsyncStorage** persistence
- **TanStack Query** for weather/geocoding data
- **Reanimated** for the dot-matrix weather animations
- Fonts: **Doto** (dot-matrix display) + **Space Mono** (body), via Google Fonts
- Data: [Open-Meteo](https://open-meteo.com) (forecast + geocoding); [LocationIQ](https://locationiq.com) for reverse geocoding

## Getting started

```bash
# install dependencies
npm install

# start the dev server
npm start
```

Then press `i` (iOS simulator), `a` (Android emulator), or `w` (web). A native build (`npm run ios` / `npm run android`) is needed to see the app icon and splash screen.

### Environment

Reverse geocoding (turning device coordinates into a city name) uses LocationIQ. Create a `.env` file:

```
EXPO_PUBLIC_GEOCODE_KEY=your_locationiq_key
```

City search and weather data come from Open-Meteo and need no key.

## Scripts

| Script | Description |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run ios` / `npm run android` | Build & run on a simulator/emulator |
| `npm run web` | Run in the browser |
| `npm run lint` | Lint with `expo lint` |

`node scripts/generate-icons.js` regenerates the dot-matrix app icon and splash assets.

## Project structure

```
app/                Expo Router screens (index = home, locations = saved list)
components/          UI + DotMatrixWeather (animated dot glyphs)
services/            Open-Meteo / geocoding API + React Query options + location hook
slices/ store/       Redux Toolkit state (units, saved locations) + persistence
interfaces/          Shared TypeScript types
utils/               Formatting and date/unit helpers
assets/              Fonts and generated icon/splash images
```

## Design system

Strict monochrome (black/white/greys), defined as the only allowed tokens in `tailwind.config.js`: dotted hairline borders, sharp corners, **Doto** used sparingly for the hero temperature and tiny labels, **Space Mono** for everything readable.
