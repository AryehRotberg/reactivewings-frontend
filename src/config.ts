// In production (Vercel), use /api proxy for API calls. In development, use local backend
const defaultUrl = import.meta.env.PROD 
  ? "/api/" 
  : "http://localhost:8080/";

export const BACKEND_SERVER_URL = import.meta.env.VITE_BACKEND_URL || defaultUrl;

// For OAuth redirects, we need the actual backend URL (not proxied)
export const BACKEND_OAUTH_URL = import.meta.env.VITE_BACKEND_OAUTH_URL || 
  (import.meta.env.PROD 
    ? "http://34.56.197.29.nip.io:8080/" 
    : "http://localhost:8080/");
