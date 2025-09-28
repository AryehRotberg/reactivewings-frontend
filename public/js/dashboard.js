/**
 * Main entry point for the dashboard page
 * Inline FlightApp to avoid importing a file that may be served as CommonJS.
 */

import { ApiService } from './services/ApiService.js';
import { LoadingManager } from './utils/LoadingManager.js';
import { UIUtils } from './utils/UIUtils.js';
import { SubscriptionManager } from './managers/SubscriptionManager.js';

class FlightApp {
    constructor() {
        this.apiService = new ApiService();
        this.subscriptionManager = new SubscriptionManager();
    }

    async init() {
        LoadingManager.showPageLoading();
        
        try {
            this.handleOAuthCallback();

            if (!this.isAuthenticated()) {
                console.log("User not authenticated, redirecting to home");
                window.location.href = "/";
                return;
            }
            
            await new Promise(resolve => setTimeout(resolve, 800));
            
            UIUtils.initializeMenu();
            this.subscriptionManager.initializeSubscriptionForm();
            this.initializeEventHandlers();
            UIUtils.setDefaultScheduledDate();
            
            await this.subscriptionManager.loadUserSubscriptions();
            
        } catch (error) {
            console.error("Error during application initialization:", error);
            UIUtils.showMessage("subscriptionsList", `Failed to initialize application: ${error.message}`, true);
        } finally {
            LoadingManager.hidePageLoading();
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

// Initialize the application when the window loads
window.addEventListener("load", async () => {
    try {
        const flightApp = new FlightApp();
        await flightApp.init();
        console.log('FlightApp initialized successfully');
    } catch (error) {
        console.error('Error initializing FlightApp:', error);
        document.body.innerHTML += `
            <div style="position: fixed; top: 10px; right: 10px; background: red; color: white; padding: 10px; border-radius: 5px; z-index: 9999;">
                ❌ Initialization failed. Please refresh the page.
            </div>
        `;
    }
});
