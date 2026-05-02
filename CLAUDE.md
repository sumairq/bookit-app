# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bookit is a full-stack web application for discovering and booking curated experiences. It is a monorepo with a separate Express/MongoDB backend and a React/TypeScript frontend.

## Commands

### Backend (`/backend`)
```bash
npm start           # Development server with nodemon
npm run start:prod  # Production mode
npm run seed:import # Import seed data from dev-data/
npm run seed:delete # Delete seed data
```

### Frontend (`/frontend`)
```bash
npm run dev     # Vite dev server on port 5173
npm run build   # TypeScript check + Vite production build
npm run lint    # ESLint
npm run preview # Preview production build
```

### Database Migrations (`/backend`)
```bash
npx migrate-mongo up    # Apply pending migrations
npx migrate-mongo down  # Revert last migration
npx migrate-mongo status # Show migration status
```

## Architecture

### Backend (Express 5 + MongoDB/Mongoose)

- **Entry**: `server.js` (DB connection, env loading) → `app.js` (Express setup, middleware, routes)
- **Route → Controller pattern**: Each resource has a routes file and a controller file. `handlerFactory.js` provides generic `getOne`, `getAll`, `createOne`, `updateOne`, `deleteOne` handlers that most controllers delegate to.
- **Error handling**: `appError.js` + `catchAsync.js` wrap all async controllers; `errorController.js` handles global errors with dev/prod modes.
- **API features**: `utils/apiFeatures.js` implements filtering, sorting, field limiting, and pagination via URL query params.
- **Image uploads**: Multer (memory storage) + Sharp for processing; used in experience and user routes.
- **Auth**: JWT stored in HTTP-only cookie (`sameSite: 'none'` for cross-origin). `authController.js` handles signup, login, protect middleware, role restrictions, and password reset.
- **Security middleware stack**: helmet, cors (allowed: localhost:5173 and 3000), rate-limit, mongo-sanitize, xss-clean, hpp.

### Frontend (React 19 + TypeScript + Vite)

- **Routing**: React Router 7 in `App.tsx`. Protected routes redirect to `/login` if unauthenticated.
- **Auth state**: `AuthContext` / `AuthProvider` — session is restored on mount by calling `GET /users/me`.
- **API layer**: Axios instance in `api/axios.ts` (baseURL from `VITE_API_URL`, `withCredentials: true`). Resource-specific helpers in `api/experiences.ts`.
- **Data fetching**: Custom hooks (`useExperiences`, `useExperience`, `useMyExperiences`) handle loading/error state.
- **React Compiler**: Enabled via `babel-plugin-react-compiler` for automatic memoization — avoid manual `useMemo`/`useCallback` unless profiling shows a need.

### Data Models

| Model | Key relationships |
|-------|-------------------|
| Experience | hosts → User[], reviews (virtual), geospatial startLocation |
| User | role enum: `user`, `guide`, `lead-guide`, `admin` |
| Review | experience → Experience, user → User; unique compound index |
| Booking | experience → Experience, user → User |

### Naming Conventions

The project was refactored from a "tours" app ("Natours"); original naming survives in some places:
- MongoDB database name is `Natours`
- `tour` ↔ `experience`, `guides` ↔ `hosts`, `maxGroupSize` ↔ `capacity`, `difficulty` ↔ `category`, `startDates` ↔ `timeSlots`

### Environment

- Backend reads `backend/config.env` (loaded by dotenv in `server.js`).
- Frontend reads `frontend/.env` — only `VITE_API_URL` is used.
- `backend/config.env.example` documents all required variables.
