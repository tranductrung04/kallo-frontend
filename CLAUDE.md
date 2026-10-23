# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

## Commands

Run from repository root:

```bash
npm install
npm run typecheck
npm run self-check
npm run start
npm run android
npm run ios
```

- `npm run typecheck` runs strict TypeScript checking with `tsc --noEmit`.
- `npm run self-check` runs assertion-based checks for phases 1 through 7. Run any individual phase with its matching `node scripts/<name>.js` command; available scripts are `self-check.js` and `phase2-self-check.js` through `phase7-self-check.js`.
- `npm run start` launches the Expo development server; `npm run android` and `npm run ios` launch it on the matching platform.
- No lint script, test runner, or production build script is configured in `package.json`.

## Architecture

- Expo SDK 57 + React Native 0.86 + React 19 + TypeScript. `App.tsx` is the entry point. It composes gesture handling, safe-area context, theme, auth, offline sync, system, activity, nutrition, meal-plan, and gamification providers before rendering `RootNavigator`; preserve this order when adding consumers.
- `src/navigation/RootNavigator.tsx` selects loading splash, signed-out auth, profile onboarding, or signed-in root stack from `AuthProvider` status. `MainTabNavigator.tsx` owns the five tabs (Home, Diary, AI scan CTA, Meal Plan, Profile). Root stack screens host food logging, scanners, activity, meal plans, assistant, reports, gamification, notifications, and reminders.
- `src/navigation/types.ts` is the source of truth for typed root, auth, onboarding, and tab route params. Update it whenever adding or changing a route, then register the screen in the appropriate navigator.
- Code is feature-first under `src/features/`. Domains keep their own types, utilities, providers/state, components, and screens. Current domains include auth, nutrition, activity, meal-plan, assistant, report, gamification, system, and profile-related UI. Keep domain logic out of navigators and generic shared components.
- Domain providers expose typed hooks and persist local state with AsyncStorage. Nutrition, activity, meal-plan, gamification, and system flows are local-first with best-effort API calls. `src/services/api/client.ts` attaches JWT access tokens and coordinates one concurrent `/auth/refresh` retry; `EXPO_PUBLIC_API_URL` overrides the default `http://localhost:8080/api`.
- `src/services/offline/` owns the client-UUID sync queue. `OfflineSyncProvider` persists queue and connectivity/sync state, retries pending or failed items through `syncManager.ts`, and `OfflineBanner` surfaces global status.
- `src/components/common/` is the typed reusable UI kit. Components consume `useTheme()`. `src/theme/` contains light/dark semantic tokens for colors, typography, spacing, radii, and shadows; theme selection persists through AsyncStorage.
- `src/assets/images/index.ts` is the typed asset registry. `res/` is the source asset directory and `src/assets/images/` contains copied app-local assets; keep registry entries and source files synchronized with `npm run copy-assets`.
- `@/*` resolves to `src/*` through matching Babel and TypeScript configuration. `app.json` defines the Kallo Expo identity, portrait orientation, automatic system UI style, camera/image permissions, and Android/iOS bundle identifiers.

## Project references

- `README.md` documents Node.js 18+, npm setup, Expo Go/device launch, self-check phases, and asset syncing.
- `docs/REQUIREMENT.md` contains product requirements; `docs/UI_IMPLEMENTATION_PLAN.md` tracks phase delivery; `docs/DESIGN.md` is the source for dual-theme semantic tokens, typography, spacing, and visual rules.
- `EXPO_PUBLIC_API_URL` configures the backend URL for local development or another environment.
