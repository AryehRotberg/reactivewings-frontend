/**
 * Subscription Manager for handling flight subscriptions
 * Manages loading, displaying, creating, and deleting subscriptions
 */
export class SubscriptionManager {
    constructor() {
        this.apiService = null;
        this.LoadingManager = null;
        this.UIUtils = null;
        this.currentSubscriptions = [];
        this.modulesLoaded = false;
    }

    async loadModules() {
        if (this.modulesLoaded) return;
        
        try {
            const [
                { ApiService },
                { LoadingManager },
                { UIUtils }
            ] = await Promise.all([
                import('../services/ApiService.js'),
                import('../utils/LoadingManager.js'),
                import('../utils/UIUtils.js')
            ]);
            
            this.apiService = new ApiService();
            this.LoadingManager = LoadingManager;
            this.UIUtils = UIUtils;
            this.modulesLoaded = true;
        } catch (error) {
            console.error('Error loading SubscriptionManager modules:', error);
            throw error;
        }
    }

    async loadUserSubscriptions() {
        await this.loadModules();
        
        this.LoadingManager.showSectionLoading('subscriptionsSection');
        this.LoadingManager.showButtonLoading('refreshSubscriptions');
        
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
                this.currentSubscriptions.forEach((sub, index) => {
                    subscriptionsHtml += this.UIUtils.generateSubscriptionHTML(sub, index);
                });
                subscriptionsDiv.innerHTML = subscriptionsHtml;
                
                this.attachDeleteEventListeners();
            } else {
                subscriptionsDiv.innerHTML = this.UIUtils.generateEmptyStateHTML();
            }
            
        } catch (error) {
            console.error("Error loading subscriptions:", error);
            document.getElementById("subscriptionsList").innerHTML = `<div class="message error">❌ Failed to load subscriptions: ${error.message}</div>`;
            this.currentSubscriptions = [];
        } finally {
            this.LoadingManager.hideSectionLoading('subscriptionsSection');
            this.LoadingManager.hideButtonLoading('refreshSubscriptions');
        }
    }

    attachDeleteEventListeners() {
        const deleteButtons = document.querySelectorAll('.delete-subscription-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
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
            this.UIUtils.showMessage("subscriptionsList", "Subscription deleted successfully!");
            this.loadUserSubscriptions();
        } catch (error) {
            console.error("Error deleting subscription:", error);
            this.UIUtils.showMessage("subscriptionsList", `Failed to delete subscription: ${error.message}`, true);
        } finally {
            buttonElement.disabled = false;
            buttonElement.classList.remove('loading');
        }
    }

    async subscribeToFlight(airlineCode, flightNumber, scheduledDate) {
        await this.loadModules();
        
        this.LoadingManager.showButtonLoading('subscribeBtn');

        try {
            this.UIUtils.validateSubscriptionForm(airlineCode, flightNumber, scheduledDate);

            const searchResults = await this.apiService.searchFlights(airlineCode, flightNumber, scheduledDate);
            
            if (!searchResults || searchResults.length === 0) {
                this.UIUtils.showMessage("subscriptionMessage", "No flights found with the specified criteria.", true);
                return;
            }

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

            await this.apiService.subscribeToFlight(flightData);

            this.UIUtils.showMessage("subscriptionMessage", "Flight subscription added successfully!");
            document.getElementById("subscriptionForm").reset();
            this.loadUserSubscriptions();
            
        } catch (error) {
            console.error("Subscription error:", error);
            this.UIUtils.showMessage("subscriptionMessage", `Failed to subscribe: ${error.message}`, true);
        } finally {
            this.LoadingManager.hideButtonLoading('subscribeBtn');
        }
    }

    async initializeSubscriptionForm() {
        await this.loadModules();
        document.getElementById("subscriptionForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const airlineCode = document.getElementById("airlineCode").value;
            const flightNumber = document.getElementById("flightNumber").value;
            const scheduledDate = document.getElementById("scheduledDate").value;

            await this.subscribeToFlight(airlineCode, flightNumber, scheduledDate);
        });
    }
}