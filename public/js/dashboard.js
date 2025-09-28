/**
 * Main entry point for the dashboard page (modular ESM)
 */

window.addEventListener('load', async () => {
  try {
    console.log('Loading FlightApp module...');
    const { FlightApp } = await import('./components/FlightApp.js');
    console.log('FlightApp module loaded successfully');
    const app = new FlightApp();
    await app.init();
    console.log('FlightApp initialized successfully');
  } catch (error) {
    console.error('Error loading or initializing FlightApp:', error);
    document.body.innerHTML += `
      <div style="position: fixed; top: 10px; right: 10px; background: red; color: white; padding: 10px; border-radius: 5px; z-index: 9999;">
        ❌ Module loading failed. Please refresh the page.
      </div>
    `;
  }
});
