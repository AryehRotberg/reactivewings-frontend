/**
 * Navigation functionality for header and mobile menu
 */
export class Navigation {
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