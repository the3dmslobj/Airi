# AGENTS.md

Guidance for AI agents working in this repository (Airi — an Expo / React Native weather app).

## Dependencies

**Before installing or upgrading ANY dependency, read the official Expo docs first.**

- Check the [Expo docs](https://docs.expo.dev) and the package's own page for the version compatible with the current Expo SDK before adding it.
- For any Expo or React Native package, install with `npx expo install <pkg>` — NOT `npm install <pkg>`. `expo install` pins the version that matches the installed SDK; raw `npm install` can pull an incompatible version.
- After changing dependencies, run `npx expo install --check` and `npx expo-doctor` and resolve anything they flag before committing.
- When upgrading the SDK, follow Expo's official upgrade guide for that version (read it first — each SDK has breaking changes) and check the release notes / migration guide.

## Commits & workflow

- **Do NOT use skills in this project** (no brainstorming, writing-plans, TDD, etc.). Work directly while still honoring these conventions.
- **Split work into small, self-contained units and commit between each one.** Don't bundle unrelated changes into one large commit.
- Use conventional commit prefixes: `feat:` (new feature), `fix:` (bug fix), `docs:` (docs), `chore:` (deps/maintenance/tooling).
- **Do NOT add a `Co-Authored-By: Claude` trailer** to commit messages. Keep messages plain.

## Verification

- Type-check with `npx tsc --noEmit` before committing code changes.
- `npm run lint` runs `expo lint`.

## Project notes

- Expo SDK 56, expo-router (single route today: `app/index.tsx`), New Architecture enabled by default.
- Styling: NativeWind (Tailwind classes via `className`).
- State: Redux Toolkit (`slices/`, `store/`) for unit preferences; TanStack React Query (`services/queryOptions.ts`) for data fetching.
- Weather data: Open-Meteo (`services/api.ts`); reverse geocoding via LocationIQ (`EXPO_PUBLIC_GEOCODE_KEY`).
