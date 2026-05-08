# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered food calorie calculator. Users capture/upload food images, the app detects food items via Claude Vision API and calculates nutrition using a built-in database. Monorepo with NestJS backend and Expo React Native mobile app.

## Common Commands

### Backend
```bash
cd backend
npm install                # Install deps
npm run start:dev          # Dev server with watch (port 3000)
npm run build              # Compile to dist/
npm run start:prod         # Run compiled version
```

### Mobile (Expo SDK 54)
```bash
cd mobile
npm install                # Install deps
npx expo start             # Start Metro bundler
npx expo start --clear     # Clear cache and start
# Press i=iOS, a=Android, w=web
```

### Docker
```bash
docker compose up -d                    # Start Postgres + backend
docker compose up -d --build backend    # Rebuild and restart backend
docker compose logs -f backend          # View backend logs
```

## Architecture

### Backend (NestJS)
- **Entry**: `backend/src/main.ts` — sets global prefix `/api`, CORS, validation pipes, Swagger at `/api/docs`
- **Modules** in `src/modules/`:
  - `auth/` — JWT auth via Passport, register/login endpoints, password hashing with crypto
  - `food-analysis/` — Core feature. `AiVisionService` sends base64 images to Claude Vision API, `NutritionDatabaseService` maps detected foods to nutrition data (80+ foods, fuzzy matching, per-100g scaled by serving size)
  - `meals/` — Meal/MealItem CRUD with pagination, daily summary, weekly report aggregation
  - `users/` — Profile management, BMR-based calorie target calculation
  - `nutrition/` — Daily nutrition logs and goal tracking
- **Database**: PostgreSQL + TypeORM. `synchronize: true` in dev (disabled in production). All entities in `*/entities/`
- **Auth flow**: Register → login → JWT token stored in mobile SecureStore → sent as Bearer header

### Mobile (Expo React Native)
- **Entry**: `mobile/App.tsx` — loads theme, checks auth, wraps in NavigationContainer
- **Navigation**: `src/navigation/AppNavigator.tsx` — conditional stack: unauthenticated (Splash → Auth) vs authenticated (Bottom Tabs + Analysis modal). Uses Ionicons.
- **State**: Zustand stores in `src/stores/`:
  - `authStore` — login/register/logout, token in SecureStore
  - `foodStore` — image analysis, meal saving, meal history with pagination
  - `profileStore` — user profile CRUD
  - `themeStore` — light/dark toggle persisted in AsyncStorage
- **API**: `src/services/api.ts` — Axios with auth interceptor, Platform-aware base URL (localhost for iOS, 192.168.x for Android)
- **Image**: `src/services/image.ts` — Expo ImagePicker for camera/gallery
- **Types**: `src/types/index.ts` — shared TypeScript interfaces
- **Theme**: `src/theme/colors.ts` — includes `fonts` property required by React Navigation v7

### AI Workflow
1. Mobile captures/uploads image
2. Backend compresses with Sharp (max 1024px, 80% JPEG)
3. Base64 sent to Claude Vision API with structured prompt requesting JSON
4. Detected foods matched against built-in nutrition DB
5. Per-item macros scaled by estimated serving size, returned to mobile

## Key Technical Notes

- React Navigation v7 requires `fonts` property in theme (regular/medium/bold/heavy) or it crashes with "Cannot read property 'regular'"
- Mobile API URL must match platform: `localhost` for iOS simulator, `10.0.2.2` for Android emulator, LAN IP for physical devices
- Docker compose sets `NODE_ENV=development` so TypeORM auto-creates tables
- `AI_API_KEY` env var is required for food analysis — set in `backend/.env` or docker-compose env
- `react-native-chart-kit` is incompatible with RN 0.81 — weekly chart uses raw `react-native-svg` instead
