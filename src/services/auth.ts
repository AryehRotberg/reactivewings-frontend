import type { AuthHeaders } from '../types';

export function getAuthHeaders(): AuthHeaders {
    const token = localStorage.getItem("authToken");
    const headers: AuthHeaders = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
}

export function isAuthenticated(): boolean {
    return !!localStorage.getItem("authToken");
}

export function handleOauthCallback(): void {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
        localStorage.setItem("authToken", token);
        window.history.replaceState({}, document.title, "/dashboard");
    }
}

export function clearAuth(): void {
    localStorage.removeItem("authToken");
}
