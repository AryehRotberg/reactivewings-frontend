
/**
 * Main entry point for the dashboard page
 * Initializes the modular FlightApp component using dynamic imports
 */

// Initialize the application when the window loads
window.addEventListener("load", async () => {
    try {
        console.log('Loading FlightApp module...');
        
        // Use dynamic import to avoid transpilation issues
        const { FlightApp } = await import('./components/FlightApp.js');
        
        console.log('FlightApp module loaded successfully');
        
        const flightApp = new FlightApp();
        await flightApp.init();
        
        console.log('FlightApp initialized successfully');
    } catch (error) {
        console.error('Error loading or initializing FlightApp:', error);
        
        // Fallback: Show error message to user
        document.body.innerHTML += `
            <div style="position: fixed; top: 10px; right: 10px; background: red; color: white; padding: 10px; border-radius: 5px; z-index: 9999;">
                ❌ Module loading failed. Please refresh the page.
            </div>
        `;
    }
});
