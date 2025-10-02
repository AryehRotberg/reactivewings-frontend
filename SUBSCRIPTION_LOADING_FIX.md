# Subscription Loading Fix

## Problem
When users first logged in and landed on the dashboard, they saw "No Active Subscriptions" even though subscriptions existed. The page required a manual refresh to load the data.

## Root Cause
**Race condition during OAuth callback:**

1. User logs in via OAuth → redirected to `/dashboard?token=...`
2. `DashboardPage` mounts → `useUserInfo` hook starts fetching user data
3. `useAuthCallback` processes the token and stores it in localStorage
4. `useAuthCallback` navigates to clean `/dashboard` URL
5. **BUT** the initial fetch from step 2 may have happened before the token was stored!

Result: The API call was made without proper authentication, returning no subscriptions.

## Solution
Modified `useAuthCallback` to accept a callback function that triggers when a token is processed:

### Changes Made:

#### 1. `src/hooks/useAuthCallback.ts`
- Added optional `onTokenProcessed` callback parameter
- Detects when a token is present in the URL
- Calls the callback after processing the token
- This allows the parent component to refetch data with the new auth token

#### 2. `src/pages/DashboardPage.tsx`
- Passes a callback to `useAuthCallback` that refetches user info
- Ensures subscriptions are loaded after authentication is complete

## Flow After Fix

1. User logs in → redirected to `/dashboard?token=abc123`
2. `DashboardPage` mounts → `useUserInfo` starts initial fetch
3. `useAuthCallback` processes token → stores in localStorage
4. `useAuthCallback` detects token was just processed → **calls callback**
5. **Callback triggers `refetch()`** → fetches user info with proper auth
6. Navigation cleans URL to `/dashboard`
7. ✅ Subscriptions are now visible!

## Testing
After deploying this fix:
1. Clear localStorage and cookies
2. Log in via Google OAuth
3. You should be redirected to dashboard with subscriptions immediately visible
4. No manual refresh required

## Additional Benefits
- Better user experience - instant data load after login
- Eliminates confusion about "No Active Subscriptions" message
- More reliable authentication flow
