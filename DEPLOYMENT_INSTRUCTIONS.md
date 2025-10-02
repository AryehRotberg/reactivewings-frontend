# Deployment Instructions - Mixed Content Fix

## Problem
The frontend was making HTTP requests to the backend from an HTTPS page, causing "Mixed Content" errors.

## Solution
Configured Vercel to proxy API requests through the frontend domain (HTTPS), while OAuth redirects go directly to the backend.

## Changes Made

### 1. `src/config.ts`
- **`BACKEND_SERVER_URL`**: Uses `/api/` proxy in production, `http://localhost:8080/` in development
- **`BACKEND_OAUTH_URL`**: Uses direct backend URL for OAuth redirects

### 2. `vercel.json`
- Added proxy rewrite: `/api/*` → `http://34.56.197.29.nip.io:8080/*`
- All API calls now go through HTTPS via Vercel's proxy

### 3. `src/pages/HomePage.tsx`
- Updated to use `BACKEND_OAUTH_URL` for OAuth redirects (needs direct URL)

### 4. `.env`
- Added `VITE_BACKEND_OAUTH_URL` for local development

## Deployment Steps

### Step 1: Commit and Push Changes
```bash
git add .
git commit -m "Fix: Configure Vercel proxy to resolve mixed content error"
git push origin main
```

### Step 2: Configure Vercel Environment Variables ⚠️ CRITICAL
In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. **DELETE** `VITE_BACKEND_URL` if it exists (this must be removed!)
3. Add or update:
   - **Name**: `VITE_BACKEND_OAUTH_URL`
   - **Value**: `http://34.56.197.29.nip.io:8080/`
   - **Environment**: Production, Preview, Development (all)

### Step 3: Redeploy
After removing the environment variable:
- Go to **Deployments** tab
- Click **"Redeploy"** on the latest deployment (must redeploy for env changes to take effect)

**Important**: Simply pushing code won't update environment variables. You MUST manually remove `VITE_BACKEND_URL` from Vercel settings and redeploy.

## How It Works

### API Calls (e.g., `/users/user-info`)
```
Browser → https://reactivewings.vercel.app/api/users/user-info (HTTPS ✅)
         ↓
Vercel Proxy → http://34.56.197.29.nip.io:8080/users/user-info (server-side)
```

### OAuth Redirects
```
Browser → http://34.56.197.29.nip.io:8080/oauth2/authorization/google
         ↓
Google OAuth → Backend → Redirect to frontend with token
```

## Testing
After deployment, test:
1. ✅ Visit https://reactivewings.vercel.app
2. ✅ Click "Sign In" (should redirect to Google OAuth)
3. ✅ After login, dashboard should load without mixed content errors
4. ✅ Check browser console - no HTTP requests should be visible

## Future Improvements
When you set up HTTPS for your GKE backend:
1. Update `VITE_BACKEND_OAUTH_URL` in Vercel to use HTTPS
2. Optionally remove the proxy and use direct HTTPS calls
