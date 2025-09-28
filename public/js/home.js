import { HomeApp } from './components/HomeApp.js';

/**
 * Main entry point for the home page
 * Initializes the modular HomeApp component
 */

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new HomeApp();
  
  // Handle OAuth redirect callback if present
  app.handleOAuthCallback();
});