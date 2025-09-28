/**
 * Main entry point for the home page
 * Initializes the modular HomeApp component using dynamic imports
 */

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Loading HomeApp module...');
    
    // Use dynamic import to avoid transpilation issues
    const { HomeApp } = await import('./components/HomeApp.js');
    
    console.log('HomeApp module loaded successfully');
    
    const app = new HomeApp();
    
    // Initialize the app (this will load modules)
    await app.init();
    
    // Handle OAuth redirect callback if present
    app.handleOAuthCallback();
    
    console.log('HomeApp initialized successfully');
  } catch (error) {
    console.error('Error loading or initializing HomeApp:', error);
    
    // Fallback: Show error message to user
    document.body.innerHTML += `
      <div style="position: fixed; top: 10px; right: 10px; background: red; color: white; padding: 10px; border-radius: 5px; z-index: 9999;">
        ❌ Module loading failed. Please refresh the page.
      </div>
    `;
  }
});