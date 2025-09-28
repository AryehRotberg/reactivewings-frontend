
import { FlightApp } from './components/FlightApp.js';

/**
 * Main entry point for the dashboard page
 * Initializes the modular FlightApp component
 */

// Initialize the application when the window loads
window.addEventListener("load", () => {
    const flightApp = new FlightApp();
    flightApp.init();
});
