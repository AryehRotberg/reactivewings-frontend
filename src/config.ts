// In production (Vercel), use /api proxy. In development, use local backend
const defaultUrl = import.meta.env.PROD 
  ? "/api/" 
  : "http://localhost:8080/";

export const BACKEND_SERVER_URL = import.meta.env.VITE_BACKEND_URL || defaultUrl;
