/**
 * Main application functionality and initialization for home page
 */
export class HomeApp {
  constructor() {
    this.navigation = null;
    this.animations = null;
    
    this.init();
  }
  
  async init() {
    this.setupEventListeners();
    await this.initializeComponents();
  }
  
  /**
   * Initialize all application components
   */
  async initializeComponents() {
    try {
      // Dynamically import and initialize navigation component
      const { Navigation } = await import('./Navigation.js');
      this.navigation = new Navigation();
      
      // Dynamically import and initialize animations component
      const { Animations } = await import('./Animations.js');
      this.animations = new Animations();
      
      // Setup keyboard accessibility
      this.setupKeyboardAccessibility();
    } catch (error) {
      console.error('Error loading components:', error);
    }
  }
  
  /**
   * Setup main event listeners
   */
  setupEventListeners() {
    // Primary button click handler
    const primaryButton = document.querySelector('.primary-button');
    if (primaryButton) {
      primaryButton.addEventListener('click', this.redirectToManager.bind(this));
    }
    
    // Sign in button click handler
    const signInButton = document.querySelector('.nav-cta');
    if (signInButton) {
      signInButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.redirectToManager();
      });
    }
  }
  
  /**
   * Handle redirect to flight manager with loading state
   */
  redirectToManager() {
    const button = document.querySelector('.primary-button');
    const spinner = document.querySelector('.loading-spinner');
    
    // Show loading state
    button.style.pointerEvents = 'none';
    button.style.opacity = '0.8';
    spinner.style.display = 'inline-block';
    
    // Redirect after brief delay for user feedback
    setTimeout(() => {
      this.checkLoginStatus();
    }, 600);
  }

  /**
   * Check if user is authenticated with JWT token
   */
  async checkLoginStatus() {
    const userInfo = await this.checkAuthStatus();
    if (userInfo) {
      // User is authenticated, redirect to dashboard
      window.location.href = "dashboard";
    } else {
      // User not authenticated, redirect to login
      this.login();
    }
  }

  /**
   * Redirect user to Google login via Spring Boot
   */
  login() {
    window.location.href = AppConfig.getApiUrl('OAUTH_GOOGLE');
  }

  /**
   * Get stored JWT token from localStorage
   */
  getStoredToken() {
    return localStorage.getItem("auth_token");
  }

  /**
   * Check if user is authenticated (send token in Authorization header)
   */
  async checkAuthStatus() {
    const token = this.getStoredToken();
    console.log("Checking auth with token:", token);
    if (!token) {
      console.log("🚫 No token found, user not authenticated.");
      return null;
    }

    try {
      const response = await fetch(AppConfig.getApiUrl('USER_INFO'), {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("✅ User authenticated:", userData);
        return userData;
      } else {
        console.log("🚫 Invalid/expired token, status:", response.status);
        // Clear invalid token
        localStorage.removeItem("auth_token");
        return null;
      }
    } catch (err) {
      console.error("❌ Error checking auth:", err);
      return null;
    }
  }

  /**
   * Handle OAuth redirect with ?token=... parameter
   */
  handleOAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      console.log("📥 Received token from backend:", token);
      localStorage.setItem("auth_token", token);

      // Remove token from URL for security
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Redirect to dashboard
      window.location.href = "dashboard";
    }
  }
  
  /**
   * Setup keyboard accessibility
   */
  setupKeyboardAccessibility() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.classList.contains('primary-button')) {
        this.redirectToManager();
      }
    });
  }
}