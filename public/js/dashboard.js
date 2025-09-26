/**
 * Dashboard configuration - uses global AppConfig
 * This section is kept for backward compatibility but now uses centralized config
 */

// Use the global configuration (loaded from config.js)
const CONFIG = window.CONFIG;/**
 * API Service Module
 * Handles all HTTP requests to the backend API
 */

const API = {
    get baseUrl() {
        // Use global configuration
        if (typeof AppConfig !== 'undefined') {
            return AppConfig.URLS.API_ENDPOINTS.BASE + '/';
        }
        // Fallback to legacy CONFIG if AppConfig is not available
        if (typeof CONFIG !== 'undefined') {
            return CONFIG.API.getBaseUrl();
        }
        return "http://localhost:8080/";
    },

    /**
     * Fetch user information and subscriptions
     */
    async getUserInfo() {
        try {
            const response = await fetch(this.baseUrl + "users/user-info", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include" // important: send cookies (session/JWT)
            });
    
            if (!response.ok) {
                throw new Error(`Failed to fetch user info: ${response.status}`);
            }
    
            return await response.json();
        } catch (error) {
            window.location.href = this.baseUrl + "oauth2/authorization/google";
        }
    },

    /**
     * Search for flights
     */
    async searchFlights(airlineCode, flightNumber, scheduledTime) {
        const searchUrl = `${this.baseUrl}flights/search?airlineCode=${airlineCode}&flightNumber=${flightNumber}&scheduledDate=${scheduledTime}`;
        
        const response = await fetch(searchUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Flight search failed: ${response.status}`);
        }

        return await response.json();
    },

    /**
     * Subscribe to flight updates
     */
    async subscribeToFlight(flightData) {
        const response = await fetch(this.baseUrl + "users/subscribe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include", // important: send cookies (session/JWT)
            body: JSON.stringify(flightData)
        });

        if (!response.ok) {
            throw new Error(`Subscription failed: ${response.status}`);
        }

        return await response.json();
    },

    /**
     * Unsubscribe from flight updates
     */
    async unsubscribeFromFlight(airlineCode, flightNumber, scheduledTime) {
        const params = new URLSearchParams({
            airlineCode: airlineCode,
            flightNumber: flightNumber,
            scheduledDate: scheduledTime
        });

        const response = await fetch(this.baseUrl + "users/unsubscribe?" + params.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            credentials: "include" // important: send cookies (session/JWT)
        });

        if (!response.ok) {
            throw new Error(`Failed to delete subscription: ${response.status}`);
        }

        return { success: true };
    },

    async logout() {
        await fetch(this.baseUrl + "logout", {
            method: "POST",
            credentials: "include" // important if cookies are used
        })
        .then(() => {
            // Clear any tokens you stored in frontend
            console.log("Logged out successfully");
            window.location.href = "/"; // your post-logout page
        })
        .catch(err => alert("Logout failed: " + err.message));
    }
};
/**
 * Loading States Module
 * Manages loading indicators for different UI elements
 */

const LoadingManager = {
    
    /**
     * Show/hide page loading overlay
     */
    showPageLoading() {
        document.getElementById('pageLoadingOverlay').style.display = 'flex';
    },

    hidePageLoading() {
        document.getElementById('pageLoadingOverlay').style.display = 'none';
    },

    /**
     * Show/hide section loading
     */
    showSectionLoading(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('section-loading');
        }
    },

    hideSectionLoading(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.remove('section-loading');
        }
    },

    /**
     * Show/hide button loading
     */
    showButtonLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            // Store original styles to prevent any changes
            const originalStyle = button.style.cssText;
            const originalClasses = button.className;
            button.dataset.originalStyle = originalStyle;
            button.dataset.originalClasses = originalClasses;
            
            // Add loading class and disable button
            button.classList.add('loading');
            button.disabled = true;
            
            // Add spinner next to button (not inside)
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner-beside';
            spinner.id = buttonId + '_spinner';
            button.parentNode.insertBefore(spinner, button.nextSibling);
        }
    },

    hideButtonLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            // Remove loading class and re-enable button
            button.classList.remove('loading');
            button.disabled = false;
            
            // Restore original styles if any were stored
            if (button.dataset.originalStyle !== undefined) {
                button.style.cssText = button.dataset.originalStyle;
                delete button.dataset.originalStyle;
            }
            
            // Restore original classes if needed
            if (button.dataset.originalClasses !== undefined) {
                delete button.dataset.originalClasses;
            }
            
            // Remove spinner
            const spinner = document.getElementById(buttonId + '_spinner');
            if (spinner) {
                spinner.remove();
            }
        }
    }
};/**
 * UI Utilities Module
 * Handles UI interactions, messaging, and utility functions
 */

const UIUtils = {
    
    /**
     * Display messages to the user
     */
    showMessage(elementId, message, isError = false) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Element with id '${elementId}' not found. Message: ${message}`);
            return;
        }
        element.innerHTML = `<div class="message ${isError ? 'error' : 'success'}">${isError ? '❌' : '✅'} ${message}</div>`;
        setTimeout(() => {
            if (element) {
                element.innerHTML = '';
            }
        }, 5000);
    },

    /**
     * Format date for display
     */
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    },

    /**
     * Convert scheduled_time to yyyy-mm-dd format for API
     */
    formatScheduledTimeForAPI(scheduledTime) {
        if (!scheduledTime) return '';
        const date = new Date(scheduledTime);
        // Format as yyyy-mm-dd
        return date.getFullYear() + '-' + 
                String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                String(date.getDate()).padStart(2, '0');
    },

    /**
     * Generate HTML for subscription item
     */
    generateSubscriptionHTML(sub, index) {
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
                <button class="btn btn-danger" id="deleteBtn_${index}" onclick="SubscriptionManager.deleteSubscription('${sub.airlineCode}', '${sub.flightNumber}', '${this.formatScheduledTimeForAPI(sub.scheduledTime)}', ${index})">
                    <span class="btn-icon">🗑️</span>
                    <span class="btn-text">Remove Subscription</span>
                </button>
            </div>
        `;
    },

    /**
     * Generate empty state HTML
     */
    generateEmptyStateHTML() {
        return `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
                <h3>No Active Subscriptions</h3>
                <p>Subscribe to your first flight to get started!</p>
            </div>
        `;
    },

    /**
     * Initialize menu functionality
     */
    initializeMenu() {
        // Menu toggle functionality
        document.getElementById("menuToggle").addEventListener("click", function() {
            const menu = document.getElementById("menuDropdown");
            const toggle = document.getElementById("menuToggle");
            
            menu.classList.toggle("show");
            toggle.classList.toggle("active");
        });

        // Close menu when clicking outside
        document.addEventListener("click", function(event) {
            const menuContainer = document.querySelector(".menu-container");
            const menu = document.getElementById("menuDropdown");
            const toggle = document.getElementById("menuToggle");
            
            if (!menuContainer.contains(event.target)) {
                menu.classList.remove("show");
                toggle.classList.remove("active");
            }
        });
    },

    /**
     * Validate form input
     */
    validateSubscriptionForm(airlineCode, flightNumber, scheduledDate) {
        if (!airlineCode || !flightNumber || !scheduledDate) {
            throw new Error("Please fill in all fields.");
        }
    }
};/**
 * Subscription Manager Module
 * Handles subscription-related functionality
 */

const SubscriptionManager = {
    currentSubscriptions: [],

    /**
     * Load and display user subscriptions
     */
    async loadUserSubscriptions() {
        LoadingManager.showSectionLoading('subscriptionsSection');
        LoadingManager.showButtonLoading('refreshSubscriptions');
        
        try {
            const userInfo = await API.getUserInfo();
            
            // Display user info
            document.getElementById("userInfo").innerHTML = `
                <div class="user-info">
                    <h3>👤 User Information</h3>
                    <p><strong>Email:</strong> ${userInfo.email}</p>
                </div>
            `;

            // Display subscriptions
            const subscriptionsDiv = document.getElementById("subscriptionsList");
            this.currentSubscriptions = userInfo.subscriptions || [];
            
            if (this.currentSubscriptions.length > 0) {
                let subscriptionsHtml = "<h3>✈️ Active Subscriptions</h3>";
                this.currentSubscriptions.forEach((sub, index) => {
                    subscriptionsHtml += UIUtils.generateSubscriptionHTML(sub, index);
                });
                subscriptionsDiv.innerHTML = subscriptionsHtml;
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
    },

    /**
     * Delete a subscription
     */
    async deleteSubscription(airlineCode, flightNumber, scheduledTime, index) {
        const deleteButtonId = `deleteBtn_${index}`;
        LoadingManager.showButtonLoading(deleteButtonId);
        
        try {
            await API.unsubscribeFromFlight(airlineCode, flightNumber, scheduledTime);
            UIUtils.showMessage("subscriptionsList", "Subscription deleted successfully!");
            this.loadUserSubscriptions(); // Refresh the list
        } catch (error) {
            console.error("Error deleting subscription:", error);
            UIUtils.showMessage("subscriptionsList", `Failed to delete subscription: ${error.message}`, true);
        } finally {
            LoadingManager.hideButtonLoading(deleteButtonId);
        }
    },

    /**
     * Subscribe to a flight
     */
    async subscribeToFlight(airlineCode, flightNumber, scheduledDate) {
        LoadingManager.showButtonLoading('subscribeBtn');

        try {
            // Validate input
            UIUtils.validateSubscriptionForm(airlineCode, flightNumber, scheduledDate);

            // Search for the flight
            const searchResults = await API.searchFlights(airlineCode, flightNumber, scheduledDate);
            
            if (!searchResults || searchResults.length === 0) {
                UIUtils.showMessage("subscriptionMessage", "No flights found with the specified criteria.", true);
                return;
            }

            // Prepare subscription data
            const flightData = {
                id: searchResults[0].id,
                flightId: searchResults[0].flightId,
                airlineCode: searchResults[0].airlineCode,
                flightNumber: searchResults[0].flightNumber,
                scheduledTime: searchResults[0].scheduledTime,
                estimatedTime: searchResults[0].estimatedTime,
                statusEn: searchResults[0].statusEn,
                airlineName: searchResults[0].airlineName,
                airportCode: searchResults[0].airportCode,
                cityEn: searchResults[0].cityEn,
                cityHe: searchResults[0].cityHe,
                countryEn: searchResults[0].countryEn,
                countryHe: searchResults[0].countryHe,
                terminal: searchResults[0].terminal,
                counters: searchResults[0].counters,
                checkinZone: searchResults[0].checkinZone,
                lastUpdated: new Date().toISOString()
            };

            // Subscribe to the flight
            await API.subscribeToFlight(flightData);

            UIUtils.showMessage("subscriptionMessage", "Flight subscription added successfully!");
            document.getElementById("subscriptionForm").reset();
            this.loadUserSubscriptions(); // Refresh the list
            
        } catch (error) {
            console.error("Subscription error:", error);
            UIUtils.showMessage("subscriptionMessage", `Failed to subscribe: ${error.message}`, true);
        } finally {
            LoadingManager.hideButtonLoading('subscribeBtn');
        }
    },

    /**
     * Initialize subscription form handler
     */
    initializeSubscriptionForm() {
        document.getElementById("subscriptionForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const airlineCode = document.getElementById("airlineCode").value;
            const flightNumber = document.getElementById("flightNumber").value;
            const scheduledDate = document.getElementById("scheduledDate").value;

            await this.subscribeToFlight(airlineCode, flightNumber, scheduledDate);
        });
    }
};/**
 * Main Application Module
 * Initializes the application and coordinates between modules
 */

const FlightApp = {
    
    /**
     * Initialize the application
     */
    async init() {
        LoadingManager.showPageLoading();
        
        try {
            // Add a small delay to show the loading animation
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Initialize UI components
            UIUtils.initializeMenu();
            SubscriptionManager.initializeSubscriptionForm();
            this.initializeEventHandlers();
            this.setDefaultScheduledDate();
            
            // Load initial data
            await SubscriptionManager.loadUserSubscriptions();
            
        } catch (error) {
            console.error("Error during application initialization:", error);
            UIUtils.showMessage("subscriptionsList", `Failed to initialize application: ${error.message}`, true);
        } finally {
            LoadingManager.hidePageLoading();
        }
    },

    /**
     * Initialize event handlers for buttons and other interactions
     */
    initializeEventHandlers() {
        // Refresh button handler
        document.getElementById("refreshSubscriptions").addEventListener("click", () => {
            SubscriptionManager.loadUserSubscriptions();
        });

        // Logout button handler
        document.getElementById("logout").addEventListener("click", this.logoutUser);
    },

    /**
     * Set today's date as default for scheduled date field
     */
    setDefaultScheduledDate() {
        const today = new Date();
        const formattedDate = today.getFullYear() + '-' + 
            String(today.getMonth() + 1).padStart(2, '0') + '-' + 
            String(today.getDate()).padStart(2, '0');
        
        const scheduledDateField = document.getElementById('scheduledDate');
        if (scheduledDateField) {
            scheduledDateField.value = formattedDate;
        }
    },

    /**
     * Logout functionality
     */
    logoutUser() {
        API.logout();
    }
};

// Initialize application when page loads
window.addEventListener("load", () => {
    FlightApp.init();
});