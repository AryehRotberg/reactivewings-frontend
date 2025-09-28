/**
 * Main entry point for the home page
 * Inline HomeApp to avoid Vercel bundling CJS for this file.
 */

import { Navigation } from './components/Navigation.js';
import { Animations } from './components/Animations.js';

class HomeApp {
  constructor() {
    this.navigation = null;
    this.animations = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeComponents();
  }

  initializeComponents() {
    this.navigation = new Navigation();
    this.animations = new Animations();
    this.setupKeyboardAccessibility();
  }

  setupEventListeners() {
    const primaryButton = document.querySelector('.primary-button');
    if (primaryButton) {
      primaryButton.addEventListener('click', this.redirectToManager.bind(this));
    }

    const signInButton = document.querySelector('.nav-cta');
    if (signInButton) {
      signInButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.redirectToManager();
      });
    }
  }

  redirectToManager() {
    const button = document.querySelector('.primary-button');
    const spinner = document.querySelector('.loading-spinner');

    if (button) {
      button.style.pointerEvents = 'none';
      button.style.opacity = '0.8';
    }
    if (spinner) {
      spinner.style.display = 'inline-block';
    }

    setTimeout(() => {
      this.checkLoginStatus();
    }, 600);
  }

  async checkLoginStatus() {
    const userInfo = await this.checkAuthStatus();
    if (userInfo) {
      window.location.href = 'dashboard';
    } else {
      this.login();
    }
  }

  login() {
    window.location.href = AppConfig.getApiUrl('OAUTH_GOOGLE');
  }

  getStoredToken() {
    return localStorage.getItem('auth_token');
  }

  async checkAuthStatus() {
    const token = this.getStoredToken();
    console.log('Checking auth with token:', token);
    if (!token) {
      console.log('🚫 No token found, user not authenticated.');
      return null;
    }

    try {
      const response = await fetch(AppConfig.getApiUrl('USER_INFO'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ User authenticated:', userData);
        return userData;
      } else {
        console.log('🚫 Invalid/expired token, status:', response.status);
        localStorage.removeItem('auth_token');
        return null;
      }
    } catch (err) {
      console.error('❌ Error checking auth:', err);
      return null;
    }
  }

  handleOAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      console.log('📥 Received token from backend:', token);
      localStorage.setItem('auth_token', token);
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.href = 'dashboard';
    }
  }

  setupKeyboardAccessibility() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.classList.contains('primary-button')) {
        this.redirectToManager();
      }
    });
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    const app = new HomeApp();
    app.handleOAuthCallback();
    console.log('HomeApp initialized successfully');
  } catch (error) {
    console.error('Error initializing HomeApp:', error);
    document.body.innerHTML += `
      <div style="position: fixed; top: 10px; right: 10px; background: red; color: white; padding: 10px; border-radius: 5px; z-index: 9999;">
        ❌ Initialization failed. Please refresh the page.
      </div>
    `;
  }
});