import { BACKEND_SERVER_URL } from '../config';
import { getAuthHeaders } from './auth';
import type { Flight } from '../types';

export async function searchFlights(
    airlineCode: string,
    flightNumber: string,
    scheduledDate: string
): Promise<Flight[] | null> {
    try {
        const params = new URLSearchParams({
            airlineCode,
            flightNumber,
            scheduledDate
        });

        const response = await fetch(
            `${BACKEND_SERVER_URL}flights/search?${params.toString()}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.ok) {
            const foundFlight = await response.json();
            return foundFlight;
        }
        return null;
    } catch (err) {
        console.error("Error receiving flights: ", err);
        return null;
    }
}

export async function subscribeToFlight(
    searchResults: Flight[]
): Promise<Flight | null> {
    if (searchResults && searchResults.length > 0) {
        const flightData: Flight = {
            ...searchResults[0],
            lastUpdated: new Date().toISOString()
        };

        try {
            const response = await fetch(`${BACKEND_SERVER_URL}users/subscribe`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(flightData)
            });

            if (response.ok) {
                return await response.json();
            }

            if (response.status === 401) {
                localStorage.removeItem("authToken");
                window.location.href = "/";
                return null;
            }
        } catch (err) {
            console.error("Error subscribing to flight: ", err);
            throw err;
        }
    }
    return null;
}

export async function unsubscribeFromFlight(
    airlineCode: string,
    flightNumber: string,
    scheduledDate: string
): Promise<{ success: boolean } | null> {
    try {
        const params = new URLSearchParams({
            airlineCode,
            flightNumber,
            scheduledDate
        });

        const headers = getAuthHeaders();
        headers["Content-Type"] = "application/x-www-form-urlencoded";

        const response = await fetch(
            `${BACKEND_SERVER_URL}users/unsubscribe?${params.toString()}`,
            {
                method: "POST",
                headers: headers
            }
        );

        if (response.status === 401) {
            localStorage.removeItem("authToken");
            window.location.href = "/";
            return null;
        }

        return { success: true };
    } catch (err) {
        console.error("Error unsubscribing from a flight: ", err);
        return null;
    }
}
