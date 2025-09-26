# URL Centralization - Configuration Management

## 🎯 Overview

This document describes the centralized URL configuration system implemented for the ReactiveWings frontend project. All hardcoded URLs have been replaced with a centralized configuration system that supports environment-specific settings and easy maintenance.

## 🔧 Implementation

### 1. Global Configuration System

**File: `public/js/config.js`**

Created a global `AppConfig` object that provides:
- **Environment Detection**: Automatically detects development vs production
- **Centralized URLs**: Single source of truth for all API endpoints
- **Feature Flags**: Easy toggling of proxy mode and other features
- **Utility Methods**: Helper functions for URL construction
- **Legacy Compatibility**: Maintains backward compatibility with existing code

### 2. Environment Variables

**File: `.env`**
```env
# Server Configuration
PORT=3000
NODE_ENV=development
SERVER_URL=http://localhost:3000

# Backend API Configuration
API_BASE_URL=http://localhost:8080

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000
```

### 3. Server Configuration

**File: `server.js`**
- Replaced all hardcoded URLs with environment variables
- Added `/config.json` endpoint to expose server configuration to frontend
- Dynamic logging with environment-based URLs
- Security headers use configurable API base URL

## 📁 Files Modified

### Frontend JavaScript Files

1. **`public/js/config.js`** (NEW)
   - Global configuration object
   - Environment detection
   - URL management
   - Feature flags

2. **`public/js/home.js`**
   - ❌ Removed: `window.location.href = "http://localhost:8080/oauth2/authorization/google"`
   - ❌ Removed: `this.baseUrl` (undefined reference)
   - ✅ Added: `AppConfig.getApiUrl('USER_INFO')`
   - ✅ Added: `AppConfig.getApiUrl('OAUTH_GOOGLE')`

3. **`public/js/dashboard.js`**
   - ❌ Removed: Hardcoded `DIRECT_BASE_URL: 'http://localhost:8080/'`
   - ❌ Removed: Inline configuration object
   - ✅ Added: Reference to global `AppConfig`
   - ✅ Added: Fallback to legacy CONFIG for compatibility

### Backend Files

4. **`server.js`**
   - ❌ Removed: `"http://localhost:8080"` in CSP headers
   - ❌ Removed: `http://localhost:${PORT}` in console logs
   - ✅ Added: `process.env.API_BASE_URL` for CSP
   - ✅ Added: `process.env.SERVER_URL` for logging
   - ✅ Added: `/config.json` endpoint

5. **`.env`**
   - ✅ Added: `SERVER_URL` environment variable

### HTML Files

6. **`public/index.html`**
   - ✅ Added: `<script src="js/config.js"></script>` before other scripts

7. **`public/dashboard.html`**
   - ✅ Added: `<script src="js/config.js"></script>` before other scripts

## 🌐 URL Configuration

### Development Environment
```javascript
AppConfig.URLS = {
  FRONTEND_BASE: "http://localhost:3000",
  API_BASE: "http://localhost:8080",
  API_ENDPOINTS: {
    BASE: "http://localhost:8080", // or "http://localhost:3000/api" if proxy mode
    USER_INFO: "http://localhost:8080/users/user-info",
    FLIGHTS_SEARCH: "http://localhost:8080/flights/search",
    SUBSCRIBE: "http://localhost:8080/users/subscribe",
    UNSUBSCRIBE: "http://localhost:8080/users/unsubscribe",
    LOGOUT: "http://localhost:8080/logout",
    OAUTH_GOOGLE: "http://localhost:8080/oauth2/authorization/google"
  }
}
```

### Production Environment
URLs automatically adjust based on:
- **Frontend**: Uses `window.location.origin`
- **Backend**: Uses `https://api.reactivewings.com` (configurable)
- **Environment Variables**: Server-side configuration takes precedence

## ⚙️ Configuration Options

### Proxy Mode Toggle
```javascript
// Enable proxy mode (routes through Node.js server)
AppConfig.FEATURES.USE_PROXY = true;  // API calls go to /api/* endpoints

// Direct mode (default)
AppConfig.FEATURES.USE_PROXY = false; // API calls go directly to backend
```

### Environment-Based URLs
```javascript
// Automatic environment detection
AppConfig.isDevelopment; // true if localhost, false if production

// Dynamic API base URL
AppConfig.URLS.API_BASE; // localhost:8080 in dev, api.reactivewings.com in prod
```

## 🔍 Usage Examples

### Getting API URLs
```javascript
// Get specific endpoint
const userInfoUrl = AppConfig.getApiUrl('USER_INFO');

// Get base API URL
const apiBase = AppConfig.URLS.API_ENDPOINTS.BASE;

// OAuth redirect
window.location.href = AppConfig.getApiUrl('OAUTH_GOOGLE');
```

### Making API Calls
```javascript
// Old way (hardcoded)
fetch("http://localhost:8080/users/user-info")

// New way (centralized)
fetch(AppConfig.getApiUrl('USER_INFO'))
```

## 🎯 Benefits

1. **Environment Flexibility**: Easy switching between development/staging/production
2. **Maintainability**: Single place to update all URLs
3. **Feature Toggles**: Easy to enable/disable proxy mode
4. **Type Safety**: Centralized endpoint definitions reduce typos
5. **Debugging**: Built-in logging for configuration values
6. **Scalability**: Easy to add new environments or endpoints
7. **Backward Compatibility**: Existing code continues to work

## 🚀 Deployment Considerations

### Development
```bash
# Default development settings
npm start
```

### Production
```bash
# Set production environment variables
export NODE_ENV=production
export API_BASE_URL=https://api.reactivewings.com
export SERVER_URL=https://app.reactivewings.com
npm start
```

### Docker
```dockerfile
# Set URLs via environment variables
ENV API_BASE_URL=https://api.reactivewings.com
ENV SERVER_URL=https://app.reactivewings.com
```

## 🔍 Testing the Configuration

### 1. Check Console Logs
Open browser console to see configuration loading:
```
[AppConfig] Configuration loaded: {
  isDevelopment: true,
  frontendBase: "http://localhost:3000",
  apiBase: "http://localhost:8080",
  useProxy: false
}
```

### 2. Access Configuration Endpoint
Visit: `http://localhost:3000/config.json`
```json
{
  "API_BASE_URL": "http://localhost:8080",
  "SERVER_URL": "http://localhost:3000",
  "NODE_ENV": "development"
}
```

### 3. Test URL Generation
```javascript
// In browser console
AppConfig.getApiUrl('USER_INFO')
// Returns: "http://localhost:8080/users/user-info"
```

This centralized configuration system ensures consistent URL management across the entire application while providing flexibility for different deployment environments.