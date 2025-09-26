/**
 * Global Configuration for ReactiveWings Frontend
 * Centralized URL and environment management
 */

window.AppConfig = {
    // Environment detection
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    
    // Server URLs
    URLS: {
        // Frontend server
        FRONTEND_BASE: window.location.origin,
        
        // Backend API server
        API_BASE: (() => {
            // Check if there's a global config from server-side
            if (typeof window.SERVER_CONFIG !== 'undefined' && window.SERVER_CONFIG.API_BASE_URL) {
                return window.SERVER_CONFIG.API_BASE_URL;
            }
            // Default to localhost for development
            return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? 'http://localhost:8080' 
                : 'https://api.reactivewings.com';
        })(),
        
        // API endpoints (can be proxy or direct)
        get API_ENDPOINTS() {
            const useProxy = AppConfig.FEATURES.USE_PROXY;
            const baseUrl = useProxy ? `${AppConfig.URLS.FRONTEND_BASE}/api` : AppConfig.URLS.API_BASE;
            
            return {
                BASE: baseUrl,
                USER_INFO: `${baseUrl}/users/user-info`,
                FLIGHTS_SEARCH: `${baseUrl}/flights/search`,
                SUBSCRIBE: `${baseUrl}/users/subscribe`,
                UNSUBSCRIBE: `${baseUrl}/users/unsubscribe`,
                LOGOUT: `${baseUrl}/logout`,
                OAUTH_GOOGLE: `${AppConfig.URLS.API_BASE}/oauth2/authorization/google`
            };
        }
    },
    
    // Feature flags
    FEATURES: {
        USE_PROXY: false, // Set to true to use Node.js server proxy, false to call backend directly
        ENABLE_LOGGING: true,
        ENABLE_ERROR_REPORTING: true
    },
    
    // Utility methods
    getApiUrl(endpoint) {
        return this.URLS.API_ENDPOINTS[endpoint] || `${this.URLS.API_ENDPOINTS.BASE}/${endpoint}`;
    },
    
    log(...args) {
        if (this.FEATURES.ENABLE_LOGGING && this.isDevelopment) {
            console.log('[AppConfig]', ...args);
        }
    },
    
    error(...args) {
        if (this.FEATURES.ENABLE_ERROR_REPORTING) {
            console.error('[AppConfig]', ...args);
        }
    }
};

// Log configuration for debugging
AppConfig.log('Configuration loaded:', {
    isDevelopment: AppConfig.isDevelopment,
    frontendBase: AppConfig.URLS.FRONTEND_BASE,
    apiBase: AppConfig.URLS.API_BASE,
    useProxy: AppConfig.FEATURES.USE_PROXY
});

// Legacy compatibility - maintain the old CONFIG object reference
window.CONFIG = {
    USE_PROXY: AppConfig.FEATURES.USE_PROXY,
    API: {
        PROXY_BASE_URL: `${AppConfig.URLS.FRONTEND_BASE}/api/`,
        DIRECT_BASE_URL: `${AppConfig.URLS.API_BASE}/`,
        getBaseUrl() {
            return AppConfig.FEATURES.USE_PROXY ? this.PROXY_BASE_URL : this.DIRECT_BASE_URL;
        }
    },
    isDevelopment: AppConfig.isDevelopment,
    FEATURES: AppConfig.FEATURES
};