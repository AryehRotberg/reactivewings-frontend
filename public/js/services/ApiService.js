/**
 * API Service for handling all backend communication
 * Centralized location for all HTTP requests to the backend
 */
export class ApiService {
    constructor() {
        this.CONFIG = window.CONFIG;
    }

    get baseUrl() {
        let url;
        if (typeof AppConfig !== 'undefined' && AppConfig.URLS.API_BASE) {
            url = AppConfig.URLS.API_ENDPOINTS.BASE + '/';
        }
        else if (typeof this.CONFIG !== 'undefined') {
            url = this.CONFIG.API.getBaseUrl();
        }
        else {
            url = "http://localhost:8080/";
        }
        
        console.log('[API.baseUrl]', 'Constructed baseUrl:', url);
        return url;
    }

    getStoredToken() {
        return localStorage.getItem("auth_token");
    }

    getAuthHeaders() {
        const token = this.getStoredToken();
        const headers = {
            "Content-Type": "application/json"
        };
        
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        
        return headers;
    }

    async getUserInfo() {
        try {
            const response = await fetch(this.baseUrl + "users/user-info", {
                method: "GET",
                headers: this.getAuthHeaders()
            });
    
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
    }

    async subscribeToFlight(flightData) {
        const response = await fetch(this.baseUrl + "users/subscribe", {
            method: "POST",
            headers: this.getAuthHeaders(),
            body: JSON.stringify(flightData)
        });

        if (response.status === 401) {
            localStorage.removeItem("auth_token");
            window.location.href = "/";
            return;
        }

        if (!response.ok) {
            throw new Error(`Subscription failed: ${response.status}`);
        }

        return await response.json();
    }

    async unsubscribeFromFlight(airlineCode, flightNumber, scheduledTime) {
        const params = new URLSearchParams({
            airlineCode: airlineCode,
            flightNumber: flightNumber,
            scheduledDate: scheduledTime
        });

        const headers = this.getAuthHeaders();
        headers["Content-Type"] = "application/x-www-form-urlencoded";

        const response = await fetch(this.baseUrl + "users/unsubscribe?" + params.toString(), {
            method: "POST",
            headers: headers
        });

        if (response.status === 401) {
            localStorage.removeItem("auth_token");
            window.location.href = "/";
            return;
        }

        if (!response.ok) {
            throw new Error(`Failed to delete subscription: ${response.status}`);
        }

        return { success: true };
    }

    async logout() {
        try {
            const response = await fetch(this.baseUrl + "logout", {
                method: "POST",
                headers: this.getAuthHeaders()
            });
            
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