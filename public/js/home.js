/**
 * Main entry point for the home page (modular ESM)
 */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Loading HomeApp module...');
    const { HomeApp } = await import('./components/HomeApp.js');
    console.log('HomeApp module loaded successfully');
    const app = new HomeApp();
    app.handleOAuthCallback();
    console.log('HomeApp initialized successfully');
  } catch (error) {
    console.error('Error loading or initializing HomeApp:', error);
    document.body.innerHTML += `
      <div style="position: fixed; top: 10px; right: 10px; background: red; color: white; padding: 10px; border-radius: 5px; z-index: 9999;">
        ❌ Module loading failed. Please refresh the page.
      </div>
    `;
  }
});