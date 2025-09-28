/**
 * Main entry point for the dashboard page
 * Self-contained file (no imports) to avoid any CJS/ESM transform issues.
 */

// ---- Inlined LoadingManager ----
class LoadingManager {
    static showPageLoading() {
        const el = document.getElementById('pageLoadingOverlay');
        if (el) el.style.display = 'flex';
    }
    static hidePageLoading() {
        const el = document.getElementById('pageLoadingOverlay');
        if (el) el.style.display = 'none';
    }
    static showSectionLoading(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) section.classList.add('section-loading');
    }
    static hideSectionLoading(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) section.classList.remove('section-loading');
    }
    static showButtonLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            const originalStyle = button.style.cssText;
            const originalClasses = button.className;
            button.dataset.originalStyle = originalStyle;
            button.dataset.originalClasses = originalClasses;
            button.classList.add('loading');
            button.disabled = true;
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner-beside';
            spinner.id = buttonId + '_spinner';
            button.parentNode && button.parentNode.insertBefore(spinner, button.nextSibling);
        }
    }
    static hideButtonLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.classList.remove('loading');
            button.disabled = false;
            if (button.dataset.originalStyle !== undefined) {
                button.style.cssText = button.dataset.originalStyle;
                delete button.dataset.originalStyle;
            }
            if (button.dataset.originalClasses !== undefined) {
                delete button.dataset.originalClasses;
            }
            const spinner = document.getElementById(buttonId + '_spinner');
            if (spinner) spinner.remove();
        }
    }
}

// ---- Inlined UIUtils ----
class UIUtils {
    static showMessage(elementId, message, isError = false) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Element with id '${elementId}' not found. Message: ${message}`);
            return;
        }
        element.innerHTML = `<div class="message ${isError ? 'error' : 'success'}">${isError ? '❌' : '✅'} ${message}</div>`;
        setTimeout(() => {
            if (element) element.innerHTML = '';
        }, 5000);
    }
    static formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    }
    static formatScheduledTimeForAPI(scheduledTime) {
        if (!scheduledTime) return '';
        const date = new Date(scheduledTime);
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    }
    static generateSubscriptionHTML(sub, index) {
        return `
            <div class="subscription-item">
                <div class="subscription-details">
                    <div class="detail-item">
                        <span class="detail-label">Flight</span>
                        <span class="detail-value"><span class="flight-icon">✈️</span>${sub.airlineCode} ${sub.flightNumber}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Airline Company</span>
                        <span class="detail-value">${sub.airlineName}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Estimated Time</span>
                        <span class="detail-value">${this.formatDate(sub.estimatedTime)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Destination</span>
                        <span class="detail-value">${sub.cityEn || 'N/A'} (${sub.countryEn || 'N/A'})</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Status</span>
                        <span class="detail-value">${sub.statusEn || 'Unknown'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Terminal</span>
                        <span class="detail-value">${sub.terminal || 'NOT CONFIRMED'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Counters</span>
                        <span class="detail-value">${sub.counters || 'NOT CONFIRMED'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Check-in Zone</span>
                        <span class="detail-value">${sub.checkinZone || 'NOT CONFIRMED'}</span>
                    </div>
                </div>
                <button class="btn btn-danger delete-subscription-btn" 
                        data-airline-code="${sub.airlineCode}" 
                        data-flight-number="${sub.flightNumber}" 
                        data-scheduled-time="${this.formatScheduledTimeForAPI(sub.scheduledTime)}" 
                        data-index="${index}">
                    <span class="btn-icon">🗑️</span>
                    <span class="btn-text">Remove Subscription</span>
                </button>
            </div>
        `;
    }
    static generateEmptyStateHTML() {
        return `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
                <h3>No Active Subscriptions</h3>
                <p>Subscribe to your first flight to get started!</p>
            </div>
        `;
    }
    static initializeMenu() {
        document.getElementById("menuToggle").addEventListener("click", function() {
            const menu = document.getElementById("menuDropdown");
            const toggle = document.getElementById("menuToggle");
            menu.classList.toggle("show");
            toggle.classList.toggle("active");
        });
        document.addEventListener("click", function(event) {
            const menuContainer = document.querySelector(".menu-container");
            const menu = document.getElementById("menuDropdown");
            const toggle = document.getElementById("menuToggle");
            if (!menuContainer.contains(event.target)) {
                menu.classList.remove("show");
                toggle.classList.remove("active");
            }
        });
    }
    static validateSubscriptionForm(airlineCode, flightNumber, scheduledDate) {
        if (!airlineCode || !flightNumber || !scheduledDate) {
            throw new Error("Please fill in all fields.");
        }
    }
    static setDefaultScheduledDate() {
        const today = new Date();
        const formattedDate = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
        const scheduledDateField = document.getElementById('scheduledDate');
        if (scheduledDateField) scheduledDateField.value = formattedDate;
    }
}

// ---- Inlined ApiService ----
class ApiService {
    constructor() {
        this.CONFIG = window.CONFIG;
    }
    get baseUrl() {
        let url;
        if (typeof AppConfig !== 'undefined' && AppConfig.URLS.API_BASE) {
            url = AppConfig.URLS.API_ENDPOINTS.BASE + '/';
        } else if (typeof this.CONFIG !== 'undefined') {
            url = this.CONFIG.API.getBaseUrl();
        } else {
            url = "http://localhost:8080/";
        }
        console.log('[API.baseUrl]', 'Constructed baseUrl:', url);
        return url;
    }
    getStoredToken() { return localStorage.getItem("auth_token"); }
    getAuthHeaders() {
        const token = this.getStoredToken();
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        return headers;
    }
    async getUserInfo() {
        try {
            const response = await fetch(this.baseUrl + "users/user-info", { method: "GET", headers: this.getAuthHeaders() });
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("auth_token");
                    window.location.href = "/";
                    return;
                }
                throw new Error(`Failed to fetch user info: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching user info:", error);
            throw error;
        }
    }
    async searchFlights(airlineCode, flightNumber, scheduledTime) {
        const searchUrl = `${this.baseUrl}flights/search?airlineCode=${airlineCode}&flightNumber=${flightNumber}&scheduledDate=${scheduledTime}`;
        const response = await fetch(searchUrl, { method: "GET", headers: { "Content-Type": "application/json" } });
        if (!response.ok) throw new Error(`Flight search failed: ${response.status}`);
        return await response.json();
    }
    async subscribeToFlight(flightData) {
        const response = await fetch(this.baseUrl + "users/subscribe", { method: "POST", headers: this.getAuthHeaders(), body: JSON.stringify(flightData) });
        if (response.status === 401) {
            localStorage.removeItem("auth_token");
            window.location.href = "/";
            return;
        }
        if (!response.ok) throw new Error(`Subscription failed: ${response.status}`);
        return await response.json();
    }
    async unsubscribeFromFlight(airlineCode, flightNumber, scheduledTime) {
        const params = new URLSearchParams({ airlineCode, flightNumber, scheduledDate: scheduledTime });
        const headers = this.getAuthHeaders();
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        const response = await fetch(this.baseUrl + "users/unsubscribe?" + params.toString(), { method: "POST", headers });
        if (response.status === 401) {
            localStorage.removeItem("auth_token");
            window.location.href = "/";
            return;
        }
        if (!response.ok) throw new Error(`Failed to delete subscription: ${response.status}`);
        return { success: true };
    }
    async logout() {
        try {
            await fetch(this.baseUrl + "logout", { method: "POST", headers: this.getAuthHeaders() });
            localStorage.removeItem("auth_token");
            console.log("Logged out successfully");
            window.location.href = "/";
        } catch (err) {
            localStorage.removeItem("auth_token");
            console.error("Logout request failed:", err);
            window.location.href = "/";
        }
    }
}

// ---- Inlined SubscriptionManager ----
class SubscriptionManager {
    constructor() {
        this.apiService = new ApiService();
        this.currentSubscriptions = [];
    }
    async loadUserSubscriptions() {
        LoadingManager.showSectionLoading('subscriptionsSection');
        LoadingManager.showButtonLoading('refreshSubscriptions');
        try {
            const userInfo = await this.apiService.getUserInfo();
            document.getElementById("userInfo").innerHTML = `
                <div class="user-info">
                    <h3>👤 User Information</h3>
                    <p><strong>Email:</strong> ${userInfo.email}</p>
                </div>
            `;
            const subscriptionsDiv = document.getElementById("subscriptionsList");
            this.currentSubscriptions = userInfo.subscriptions || [];
            if (this.currentSubscriptions.length > 0) {
                let subscriptionsHtml = "<h3>✈️ Active Subscriptions</h3>";
                this.currentSubscriptions.forEach((sub, index) => { subscriptionsHtml += UIUtils.generateSubscriptionHTML(sub, index); });
                subscriptionsDiv.innerHTML = subscriptionsHtml;
                this.attachDeleteEventListeners();
            } else {
                subscriptionsDiv.innerHTML = UIUtils.generateEmptyStateHTML();
            }
        } catch (error) {
            console.error("Error loading subscriptions:", error);
            document.getElementById("subscriptionsList").innerHTML = `<div class="message error">❌ Failed to load subscriptions: ${error.message}</div>`;
            this.currentSubscriptions = [];
        } finally {
            LoadingManager.hideSectionLoading('subscriptionsSection');
            LoadingManager.hideButtonLoading('refreshSubscriptions');
        }
    }
    attachDeleteEventListeners() {
        const deleteButtons = document.querySelectorAll('.delete-subscription-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const airlineCode = button.getAttribute('data-airline-code');
                const flightNumber = button.getAttribute('data-flight-number');
                const scheduledTime = button.getAttribute('data-scheduled-time');
                const index = button.getAttribute('data-index');
                this.deleteSubscription(airlineCode, flightNumber, scheduledTime, index, button);
            });
        });
    }
    async deleteSubscription(airlineCode, flightNumber, scheduledTime, index, buttonElement) {
        buttonElement.disabled = true;
        buttonElement.classList.add('loading');
        try {
            await this.apiService.unsubscribeFromFlight(airlineCode, flightNumber, scheduledTime);
            UIUtils.showMessage("subscriptionsList", "Subscription deleted successfully!");
            this.loadUserSubscriptions();
        } catch (error) {
            console.error("Error deleting subscription:", error);
            UIUtils.showMessage("subscriptionsList", `Failed to delete subscription: ${error.message}`, true);
        } finally {
            buttonElement.disabled = false;
            buttonElement.classList.remove('loading');
        }
    }
    async subscribeToFlight(airlineCode, flightNumber, scheduledDate) {
        LoadingManager.showButtonLoading('subscribeBtn');
        try {
            UIUtils.validateSubscriptionForm(airlineCode, flightNumber, scheduledDate);
            const searchResults = await this.apiService.searchFlights(airlineCode, flightNumber, scheduledDate);
            if (!searchResults || searchResults.length === 0) {
                UIUtils.showMessage("subscriptionMessage", "No flights found with the specified criteria.", true);
                return;
            }
            const s = searchResults[0];
            const flightData = {
                id: s.id, flightId: s.flightId, airlineCode: s.airlineCode, flightNumber: s.flightNumber,
                scheduledTime: s.scheduledTime, estimatedTime: s.estimatedTime, statusEn: s.statusEn,
                airlineName: s.airlineName, airportCode: s.airportCode, cityEn: s.cityEn, cityHe: s.cityHe,
                countryEn: s.countryEn, countryHe: s.countryHe, terminal: s.terminal, counters: s.counters,
                checkinZone: s.checkinZone, lastUpdated: new Date().toISOString()
            };
            await this.apiService.subscribeToFlight(flightData);
            UIUtils.showMessage("subscriptionMessage", "Flight subscription added successfully!");
            document.getElementById("subscriptionForm").reset();
            this.loadUserSubscriptions();
        } catch (error) {
            console.error("Subscription error:", error);
            UIUtils.showMessage("subscriptionMessage", `Failed to subscribe: ${error.message}`, true);
        } finally {
            LoadingManager.hideButtonLoading('subscribeBtn');
        }
    }
    initializeSubscriptionForm() {
        document.getElementById("subscriptionForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const airlineCode = document.getElementById("airlineCode").value;
            const flightNumber = document.getElementById("flightNumber").value;
            const scheduledDate = document.getElementById("scheduledDate").value;
            await this.subscribeToFlight(airlineCode, flightNumber, scheduledDate);
        });
    }
}

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
