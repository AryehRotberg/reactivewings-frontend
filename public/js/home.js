/**
 * Navigation functionality for header and mobile menu
 */

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
  
  /**
   * Handle header scroll effect
   */
  setupScrollEffect() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
    });
  }
  
  /**
   * Handle mobile menu toggle
   */
  setupMobileMenu() {
    if (this.mobileToggle && this.navMenu) {
      this.mobileToggle.addEventListener('click', () => {
        this.navMenu.classList.toggle('active');
        this.mobileToggle.classList.toggle('active');
      });
      
      // Close mobile menu when clicking on nav links
      const navLinks = this.navMenu.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.navMenu.classList.remove('active');
          this.mobileToggle.classList.remove('active');
        });
      });
    }
  }
  
  /**
   * Setup smooth scrolling for navigation links
   */
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        
        // Skip if href is just "#" or empty
        if (href === '#' || href.length <= 1) {
          return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// Export for use in main.js
window.Navigation = Navigation;/**
 * Animation functionality for stats counter and other visual effects
 */

class Animations {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupStatsAnimation();
  }
  
  /**
   * Setup and trigger stats counter animation
   */
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
  
  /**
   * Animate a numeric value from start to end over a duration
   * @param {HTMLElement} element - The element to animate
   * @param {number} start - Starting value
   * @param {number} end - Ending value
   * @param {number} duration - Animation duration in milliseconds
   */
  animateValue(element, start, end, duration) {
    const startTime = performance.now();
    
    const updateValue = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      let current = start + (end - start) * easeOutQuart;
      
      // Format the number based on its size
      if (end >= 1000000) {
        element.textContent = (current / 1000000).toFixed(1) + 'M+';
      } else if (end >= 1000) {
        element.textContent = (current / 1000).toFixed(0) + 'K+';
      } else if (end < 100) {
        element.textContent = current.toFixed(2);
      } else {
        element.textContent = Math.round(current).toLocaleString();
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };
    
    requestAnimationFrame(updateValue);
  }
}

// Export for use in main.js
window.Animations = Animations;/**
 * Main application functionality and initialization
 */

class MainApp {
  constructor() {
    this.navigation = null;
    this.animations = null;
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.initializeComponents();
  }
  
  /**
   * Initialize all application components
   */
  initializeComponents() {
    // Initialize navigation component
    if (window.Navigation) {
      this.navigation = new window.Navigation();
    }
    
    // Initialize animations component
    if (window.Animations) {
      this.animations = new window.Animations();
    }
    
    // Setup keyboard accessibility
    this.setupKeyboardAccessibility();
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
      // window.location.href = "dashboard.html";
      this.checkLoginStatus();
    }, 600);
  }

  async checkLoginStatus() {
    try {
      const response = await fetch(AppConfig.getApiUrl('USER_INFO'), {
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          },
          credentials: "include" // important: send cookies (session/JWT)
      });

      if (!response.ok) {
          throw new Error(`Failed to fetch user info: ${response.status}`);
      }

      window.location.href = "dashboard";
    } catch (error) {
        window.location.href = AppConfig.getApiUrl('OAUTH_GOOGLE');
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

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new MainApp();
});