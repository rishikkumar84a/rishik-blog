// Main JavaScript for Rishik's Blog

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle functionality
  const setupMobileMenu = () => {
    const header = document.querySelector('header');
    if (!header) return;
    
    // Create mobile menu button if it doesn't exist
    if (!document.querySelector('.mobile-menu-btn')) {
      const mobileBtn = document.createElement('button');
      mobileBtn.className = 'mobile-menu-btn';
      mobileBtn.innerHTML = '<span></span><span></span><span></span>';
      mobileBtn.setAttribute('aria-label', 'Toggle menu');
      
      const nav = header.querySelector('nav');
      if (nav) {
        header.insertBefore(mobileBtn, nav);
        
        mobileBtn.addEventListener('click', function() {
          nav.classList.toggle('active');
          this.classList.toggle('active');
        });
      }
    }
  };
  
  // Smooth scrolling for anchor links
  const setupSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      });
    });
  };
  
  // Form validation
  const setupFormValidation = () => {
    const contactForm = document.querySelector('form[action="/contact"]');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        let isValid = true;
        const nameInput = this.querySelector('#name');
        const emailInput = this.querySelector('#email');
        const messageInput = this.querySelector('#message');
        
        // Simple validation
        if (nameInput && nameInput.value.trim() === '') {
          isValid = false;
          showError(nameInput, 'Please enter your name');
        } else if (nameInput) {
          removeError(nameInput);
        }
        
        if (emailInput) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailInput.value.trim() === '') {
            isValid = false;
            showError(emailInput, 'Please enter your email');
          } else if (!emailRegex.test(emailInput.value.trim())) {
            isValid = false;
            showError(emailInput, 'Please enter a valid email');
          } else {
            removeError(emailInput);
          }
        }
        
        if (messageInput && messageInput.value.trim() === '') {
          isValid = false;
          showError(messageInput, 'Please enter your message');
        } else if (messageInput) {
          removeError(messageInput);
        }
        
        if (!isValid) {
          e.preventDefault();
        }
      });
    }
  };
  
  // Helper functions for form validation
  const showError = (input, message) => {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      const existingError = formGroup.querySelector('.error-message');
      if (existingError) {
        existingError.textContent = message;
      } else {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
      }
      input.classList.add('error');
    }
  };
  
  const removeError = (input) => {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      const existingError = formGroup.querySelector('.error-message');
      if (existingError) {
        existingError.remove();
      }
      input.classList.remove('error');
    }
  };
  
  // Add CSS for mobile menu and error messages
  const addDynamicStyles = () => {
    if (!document.getElementById('dynamic-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'dynamic-styles';
      styleElement.textContent = `
        @media (max-width: 768px) {
          header .container {
            position: relative;
          }
          
          .mobile-menu-btn {
            display: block;
            background: none;
            border: none;
            cursor: pointer;
            padding: 10px;
            z-index: 101;
          }
          
          .mobile-menu-btn span {
            display: block;
            width: 25px;
            height: 3px;
            background-color: var(--secondary-color);
            margin: 5px 0;
            transition: var(--transition);
          }
          
          .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
          }
          
          .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
          }
          
          .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -7px);
          }
          
          nav {
            position: fixed;
            top: 0;
            right: -100%;
            width: 70%;
            height: 100vh;
            background-color: white;
            box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
            transition: right 0.3s ease;
            z-index: 100;
            padding-top: 70px;
          }
          
          nav.active {
            right: 0;
          }
          
          nav ul {
            flex-direction: column;
            align-items: flex-start;
            padding: 0 20px;
          }
          
          nav ul li {
            margin: 10px 0;
            width: 100%;
          }
          
          .dropdown-content {
            position: static;
            display: none;
            box-shadow: none;
            padding-left: 20px;
          }
          
          .dropdown.active .dropdown-content {
            display: block;
          }
        }
        
        .error-message {
          color: var(--accent-color);
          font-size: 0.85rem;
          margin-top: 5px;
        }
        
        input.error, textarea.error {
          border-color: var(--accent-color);
        }
      `;
      document.head.appendChild(styleElement);
    }
  };
  
  // Handle dropdown menus on mobile
  const setupMobileDropdowns = () => {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('a');
      if (link && window.innerWidth <= 768) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        });
      }
    });
  };
  
  // Initialize all functionality
  setupMobileMenu();
  setupSmoothScroll();
  setupFormValidation();
  addDynamicStyles();
  setupMobileDropdowns();
  
  // Handle window resize
  window.addEventListener('resize', function() {
    setupMobileDropdowns();
  });
});