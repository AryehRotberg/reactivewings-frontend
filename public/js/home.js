/**
 * Main entry point for the home page
 * Self-contained (no imports) to avoid any bundling/CJS issues in the browser.
 */

// ---- Inlined Navigation component ----
class Navigation {
  constructor() {
    this.header = document.getElementById('header');
    this.mobileToggle = document.querySelector('.mobile-menu-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.init();
  }
  init() {
    this.setupScrollEffect();
    this.setupMobileMenu();
    this.setupSmoothScrolling();
  }
  setupScrollEffect() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        this.header && this.header.classList.add('scrolled');
      } else {
        this.header && this.header.classList.remove('scrolled');
      }
    });
  }
  setupMobileMenu() {
    if (this.mobileToggle && this.navMenu) {
      this.mobileToggle.addEventListener('click', () => {
        this.navMenu.classList.toggle('active');
        this.mobileToggle.classList.toggle('active');
      });
      const navLinks = this.navMenu.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.navMenu.classList.remove('active');
          this.mobileToggle.classList.remove('active');
        });
      });
    }
  }
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || href.length <= 1) return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
}

// ---- Inlined Animations component ----
class Animations {
  constructor() {
    this.init();
  }
  init() {
    this.setupStatsAnimation();
  }
  setupStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const finalValue = parseInt(target.dataset.value);
          const duration = 2000;
          this.animateValue(target, 0, finalValue, duration);
          observer.unobserve(target);
        }
      });
    });
    statNumbers.forEach(stat => observer.observe(stat));
  }
  animateValue(element, start, end, duration) {
    const startTime = performance.now();
    const updateValue = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      let current = start + (end - start) * easeOutQuart;
      if (end >= 1000000) {
        element.textContent = (current / 1000000).toFixed(1) + 'M+';
      } else if (end >= 1000) {
        element.textContent = (current / 1000).toFixed(0) + 'K+';
      } else if (end < 100) {
        element.textContent = current.toFixed(2);
      } else {
        element.textContent = Math.round(current).toLocaleString();
      }
      if (progress < 1) requestAnimationFrame(updateValue);
    };
    requestAnimationFrame(updateValue);
  }
}

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