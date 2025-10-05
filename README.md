# Reactive Wings – Flight Subscription Manager (Frontend)

Single Page Application for searching flights, subscribing to status updates, and managing user subscriptions. Built with React + TypeScript + Vite and deployed to Vercel.

Live behavior depends on a backend API (proxied via /api in production). OAuth sign-in is handled by the backend (Google), which redirects back with a token stored in localStorage.

## Features

- Google OAuth sign-in (handled by backend)
- Search for flights by airline code, flight number, and date
- Subscribe/unsubscribe to flight updates
- View active subscriptions with details (ETA, destination, terminal, counters, etc.)
- Simple toast notifications and loading states
- SPA routing with dashboard protection

## Tech Stack

- React 19, React Router 7
- TypeScript 5
- Vite 7
- ESLint (JS + TS + React Hooks + React Refresh)
- Deployed on Vercel with SPA rewrites and API proxying

## Getting Started

1) Install dependencies

```bash
npm install
```

2) Configure environment variables

Create a .env.local file at the repo root (see .env.example):

```env
# Local development backend base URL (must include trailing slash)
VITE_BACKEND_URL=http://localhost:8080/

# OAuth initiation/redirect base URL (the backend origin)
VITE_BACKEND_OAUTH_URL=http://localhost:8080/
```

Notes:
- In production, API calls are proxied to /api by Vercel (see vercel.json). OAuth still needs the direct backend origin.
- If these are not set, sensible fallbacks are used (see src/config.ts).

3) Run the dev server

```bash
npm run dev
```

4) Build for production

```bash
npm run build
```

5) Preview the production build locally

```bash
npm run preview
```

## Scripts

- dev: Start Vite dev server
- build: Type-check then build
- preview: Preview built app
- lint: Run ESLint

## Environment and Configuration

Key config is in `src/config.ts`:

- `BACKEND_SERVER_URL`
  - Production: `/api/` (rewritten by Vercel to your backend)
  - Development: `VITE_BACKEND_URL` or `http://localhost:8080/`
- `BACKEND_OAUTH_URL`
  - `VITE_BACKEND_OAUTH_URL` or a fallback origin
  - Used for initiating OAuth flows: `${BACKEND_OAUTH_URL}oauth2/authorization/google`

Vercel rewrites (see `vercel.json`):

- `/api/:path*` → `http://34.56.197.29.nip.io:8080/:path` (update to your backend)
- `/(.*)` → `/index.html` to support SPA routing
- Cache headers for `/assets/*`

## Authentication Flow

1. User clicks Sign In on the home page.
2. If there is no valid token, the app redirects to `${BACKEND_OAUTH_URL}oauth2/authorization/google`.
3. After OAuth, the backend redirects back to the frontend with `?token=...`.
4. The app stores `authToken` in `localStorage` and navigates to `/dashboard`.
5. Authenticated API requests include `Authorization: Bearer <token>`.

Tokens are stored in `localStorage`. For production, consider hardening this (expiration handling, secure storage, logout/rotation flows, etc.).

## API Endpoints Used

- `GET /flights/search?airlineCode=&flightNumber=&scheduledDate=`
- `POST /users/subscribe` (JSON body of Flight)
- `POST /users/unsubscribe?airlineCode=&flightNumber=&scheduledDate=`
- `GET /users/user-info`
- `POST /logout`

In production, these are invoked under `/api/*` due to the Vercel rewrite. In development, they use `VITE_BACKEND_URL` directly.

## Project Structure

```
src/
  pages/               # Home and Dashboard pages
  components/          # UI components (nav, forms, lists, toast, etc.)
  hooks/               # useUserInfo, useAuthCallback, useToast
  services/            # auth, flights, user API helpers
  types/               # TypeScript interfaces (Flight, UserInfo, etc.)
  utils/               # date formatting helpers
  styles/              # CSS modules for components/pages
```

Entry points:
- `src/main.tsx` renders `src/App.tsx`
- Routes: `/` (Home), `/dashboard` (Dashboard)

## Development Notes

- SPA routing requires server-side rewrite to `index.html` in production (already configured in `vercel.json`).
- If you see CORS errors in local dev, ensure your backend allows the Vite dev server origin or use a local reverse proxy.
- Date inputs expect YYYY-MM-DD; ensure you pass a trailing slash in backend URLs as configured.

## Deployment (Vercel)

1. Connect the repo to Vercel.
2. Ensure `vercel.json` is included for SPA rewrites and API proxying.
3. Configure environment variables as needed (e.g., `VITE_BACKEND_OAUTH_URL`).
4. Vercel will build using `npm run build` and serve the `dist/` output.

## Linting

ESLint is set up via `eslint.config.js` with recommended configs for JS, TS, React Hooks, and React Refresh.

Run:

```bash
npm run lint
```

## License

No license specified yet.

## Acknowledgements

- Vite + React + TypeScript template as the base

