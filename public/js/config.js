/**
 * Global Configuration for ReactiveWings Frontend
 * Centralized URL and environment management
 */

window.AppConfig = {
    // Server URLs
    URLS: {
        // Frontend server
        FRONTEND_BASE: window.location.origin,
        
        // Backend API server - will be loaded from server config
        API_BASE: null,
        
        // API endpoints (can be proxy or direct)
        get API_ENDPOINTS() {
            const useProxy = AppConfig.FEATURES.USE_PROXY;
            const baseUrl = useProxy ? `${AppConfig.URLS.FRONTEND_BASE}/api` : AppConfig.URLS.API_BASE;
            
            console.log('[AppConfig.API_ENDPOINTS]', 'useProxy:', useProxy, 'baseUrl:', baseUrl, 'API_BASE:', AppConfig.URLS.API_BASE);
            
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
        USE_PROXY: true, // Set to true to use Node.js server proxy, false to call backend directly
        ENABLE_LOGGING: true,
        ENABLE_ERROR_REPORTING: true
    },
    
    // Initialize configuration by loading from server
    async init() {
        try {
            const response = await fetch('/config.json');
            const config = await response.json();
            
            // Debug logging
            this.log('Raw config from server:', config);
            this.log('API_BASE_URL from server:', config.API_BASE_URL);
            this.log('Current window location:', window.location.href);
            this.log('Current window protocol:', window.location.protocol);
            
            // Force HTTP for API calls since backend doesn't have SSL
            let apiBaseUrl = config.API_BASE_URL;
            if (apiBaseUrl && apiBaseUrl.startsWith('https://')) {
                apiBaseUrl = apiBaseUrl.replace('https://', 'http://');
                this.log('Forced HTTPS to HTTP for backend API:', apiBaseUrl);
            }
            
            this.URLS.API_BASE = apiBaseUrl;
            this.log('Final API_BASE set to:', this.URLS.API_BASE);
            
        } catch (error) {
            this.error('Failed to load configuration from server:', error);
            throw new Error('Failed to initialize application configuration');
        }
    },
    
    // Utility methods
    getApiUrl(endpoint) {
        return this.URLS.API_ENDPOINTS[endpoint] || `${this.URLS.API_ENDPOINTS.BASE}/${endpoint}`;
    },
    
    log(...args) {
        if (this.FEATURES.ENABLE_LOGGING) {
            console.log('[AppConfig]', ...args);
        }
    },
    
    error(...args) {
        if (this.FEATURES.ENABLE_ERROR_REPORTING) {
            console.error('[AppConfig]', ...args);
        }
    }
};

// Legacy compatibility - maintain the old CONFIG object reference
window.CONFIG = {
    get USE_PROXY() {
        return AppConfig.FEATURES.USE_PROXY;
    },
    API: {
        get PROXY_BASE_URL() {
            return `${AppConfig.URLS.FRONTEND_BASE}/api/`;
        },
        get DIRECT_BASE_URL() {
            return `${AppConfig.URLS.API_BASE}/`;
        },
        getBaseUrl() {
            return AppConfig.FEATURES.USE_PROXY ? this.PROXY_BASE_URL : this.DIRECT_BASE_URL;
        }
    },
    get FEATURES() {
        return AppConfig.FEATURES;
    }
};

// Initialize configuration when the script loads
AppConfig.init().catch(error => {
    AppConfig.error('Failed to initialize application:', error);
});