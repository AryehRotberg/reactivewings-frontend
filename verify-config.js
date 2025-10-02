// Quick verification script to check configuration
console.log('=== Configuration Check ===\n');

// Simulate production environment
const PROD = true;
const VITE_BACKEND_URL = process.env.VITE_BACKEND_URL;
const VITE_BACKEND_OAUTH_URL = process.env.VITE_BACKEND_OAUTH_URL;

console.log('Environment:', PROD ? 'PRODUCTION' : 'DEVELOPMENT');
console.log('VITE_BACKEND_URL:', VITE_BACKEND_URL || '(not set)');
console.log('VITE_BACKEND_OAUTH_URL:', VITE_BACKEND_OAUTH_URL || '(not set)');
console.log('');

// What the config.ts will produce
const BACKEND_SERVER_URL = PROD 
  ? "/api/" 
  : (VITE_BACKEND_URL || "http://localhost:8080/");

const BACKEND_OAUTH_URL = VITE_BACKEND_OAUTH_URL || 
  (PROD 
    ? "http://34.56.197.29.nip.io:8080/" 
    : "http://localhost:8080/");

console.log('=== Resulting URLs ===\n');
console.log('BACKEND_SERVER_URL:', BACKEND_SERVER_URL);
console.log('BACKEND_OAUTH_URL:', BACKEND_OAUTH_URL);
console.log('');

console.log('=== Example API Calls ===\n');
console.log('User Info:', `${BACKEND_SERVER_URL}users/user-info`);
console.log('  → Browser sees: https://reactivewings.vercel.app/api/users/user-info');
console.log('  → Vercel proxies to: http://34.56.197.29.nip.io:8080/users/user-info');
console.log('');
console.log('OAuth:', `${BACKEND_OAUTH_URL}oauth2/authorization/google`);
console.log('  → Direct redirect to backend');
console.log('');

console.log('=== What You Need to Do ===\n');
console.log('1. In Vercel Settings → Environment Variables:');
console.log('   - DELETE: VITE_BACKEND_URL (if exists)');
console.log('   - ADD/UPDATE: VITE_BACKEND_OAUTH_URL = http://34.56.197.29.nip.io:8080/');
console.log('');
console.log('2. Redeploy in Vercel after removing the env var');
console.log('');
console.log('3. Clear browser cache or hard refresh (Ctrl+Shift+R)');
