import { BACKEND_SERVER_URL } from "../config";
import { getAuthHeaders, isAuthenticated } from "./auth";
import type { UserInfo } from "../types";

export async function getUserInfo(): Promise<UserInfo | null> {
    if (!isAuthenticated()) {
        return null;
    }

    try {
        const response = await fetch(`${BACKEND_SERVER_URL}users/user-info`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const userData: UserInfo = await response.json();
            return userData;
        } else {
            localStorage.removeItem("authToken");
            window.location.href = "/";
            return null;
        }
    } catch (err) {
        console.error("Error checking auth:", err);
        return null;
    }
}

export async function logoutUser(): Promise<void> {
    try {
        const response = await fetch(`${BACKEND_SERVER_URL}logout`, {
            method: "POST",
            headers: getAuthHeaders()
        });

        if (response.ok) {
            localStorage.removeItem("authToken");
        }
    } catch (err) {
        console.error("Error logging out:", err);
    }

    window.location.href = "/";
}
