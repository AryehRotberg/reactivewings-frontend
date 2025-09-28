/**
 * Animation functionality for stats counter and other visual effects
 */
export class Animations {
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