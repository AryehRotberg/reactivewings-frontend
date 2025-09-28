/**
 * Main Flight Application controller for dashboard
 * Orchestrates all dashboard functionality and initialization
 */
export class FlightApp {
    constructor() {
        this.apiService = null;
        this.subscriptionManager = null;
        this.LoadingManager = null;
        this.UIUtils = null;
    }

    async init() {
        // Load all required modules dynamically
        await this.loadModules();
        
        this.LoadingManager.showPageLoading();
        
        try {
            this.handleOAuthCallback();

            if (!this.isAuthenticated()) {
                console.log("User not authenticated, redirecting to home");
                window.location.href = "/";
                return;
            }
            
            await new Promise(resolve => setTimeout(resolve, 800));
            
            this.UIUtils.initializeMenu();
            await this.subscriptionManager.initializeSubscriptionForm();
            this.initializeEventHandlers();
            this.UIUtils.setDefaultScheduledDate();
            
            await this.subscriptionManager.loadUserSubscriptions();
            
        } catch (error) {
            console.error("Error during application initialization:", error);
            this.UIUtils.showMessage("subscriptionsList", `Failed to initialize application: ${error.message}`, true);
        } finally {
            this.LoadingManager.hidePageLoading();
        }
    }

    async loadModules() {
        try {
            // Load all required modules
            const [
                { ApiService },
                { LoadingManager },
                { UIUtils },
                { SubscriptionManager }
            ] = await Promise.all([
                import('../services/ApiService.js'),
                import('../utils/LoadingManager.js'),
                import('../utils/UIUtils.js'),
                import('../managers/SubscriptionManager.js')
            ]);
            
            // Initialize services
            this.apiService = new ApiService();
            this.LoadingManager = LoadingManager;
            this.UIUtils = UIUtils;
            this.subscriptionManager = new SubscriptionManager();
            
            console.log('All modules loaded successfully');
        } catch (error) {
            console.error('Error loading modules:', error);
            throw error;
        }
    }

    handleOAuthCallback() {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            console.log("📥 Received token from backend:", token);
            localStorage.setItem("auth_token", token);

            window.history.replaceState({}, document.title, "/dashboard");
            
            this.showAuthenticationSuccess();
        }
    }

    isAuthenticated() {
        const token = localStorage.getItem("auth_token");
        return !!token;
    }

    showAuthenticationSuccess() {
        const div = document.createElement("div");
        div.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            background: #4caf50; color: white;
            padding: 15px 20px; border-radius: 5px;
            z-index: 9999;
        `;
        div.textContent = "✅ Authentication Successful!";
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 4000);
    }

    initializeEventHandlers() {
        document.getElementById("refreshSubscriptions").addEventListener("click", () => {
            this.subscriptionManager.loadUserSubscriptions();
        });

        document.getElementById("logout").addEventListener("click", this.logoutUser.bind(this));
    }

    logoutUser() {
        this.apiService.logout();
    }
}