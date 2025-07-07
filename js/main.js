// ===== MAIN JAVASCRIPT FOR PORTFOLIO =====

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeParticles();
    initializeTypingEffect();
    initializeLazyLoading();
    initializeThemeToggle();
    initializePerformanceOptimizations();
});

// ===== NAVIGATION FUNCTIONALITY =====
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger bars
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                bar.style.transform = navMenu.classList.contains('active') 
                    ? `rotate(${index === 0 ? 45 : index === 1 ? 0 : -45}deg) translate(${index === 1 ? '100%' : '0'}, ${index === 0 ? '6px' : index === 2 ? '-6px' : '0'})`
                    : 'none';
                bar.style.opacity = navMenu.classList.contains('active') && index === 1 ? '0' : '1';
            });
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            // Reset hamburger bars
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        });
    });

    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function highlightActiveSection() {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveSection);
    highlightActiveSection(); // Initial call
}

// ===== SMOOTH SCROLLING =====
function initializeScrollEffects() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    const heroParticles = document.querySelector('.hero-particles');
    
    if (heroSection && heroParticles) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const parallaxSpeed = 0.5;
            
            heroParticles.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }
}

// ===== SCROLL ANIMATIONS =====
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Stagger animations for timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    const timelineItems = document.querySelectorAll('.timeline-item');
                    timelineItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('revealed');
                        }, index * 200);
                    });
                }
                
                // Stagger animations for cards
                if (entry.target.classList.contains('publication-item') || 
                    entry.target.classList.contains('skill-category') ||
                    entry.target.classList.contains('achievement-item')) {
                    const cards = entry.target.parentElement.querySelectorAll(entry.target.className.split(' ')[0]);
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('revealed');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(`
        .hero-text, .hero-image, .section-header, .about-content,
        .timeline-item, .publication-item, .skill-category,
        .achievement-item, .contact-card, .education-card
    `);
    
    animatableElements.forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
}

// ===== PARTICLE SYSTEM =====
function initializeParticles() {
    const particlesContainer = document.querySelector('.hero-particles');
    
    if (!particlesContainer) return;
    
    // Create floating particles
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(0, 168, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 20 + 10}s infinite linear;
            pointer-events: none;
        `;
        
        particlesContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 30000);
    }
    
    // Create particles periodically
    setInterval(createParticle, 2000);
    
    // Add CSS for particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ===== TYPING EFFECT =====
function initializeTypingEffect() {
    const titleElement = document.querySelector('.title-highlight');
    
    if (!titleElement) return;
    
    const titles = [
        'AI Research Scientist',
        'Computer Vision Expert',
        'Machine Learning Engineer',
        'Computational Biologist',
        'Research Innovator'
    ];
    
    let currentTitleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function typeEffect() {
        const currentTitle = titles[currentTitleIndex];
        
        if (isDeleting) {
            titleElement.textContent = currentTitle.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typeSpeed = 50;
        } else {
            titleElement.textContent = currentTitle.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typeSpeed = 100;
        }
        
        if (!isDeleting && currentCharIndex === currentTitle.length) {
            setTimeout(() => {
                isDeleting = true;
            }, 2000);
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentTitleIndex = (currentTitleIndex + 1) % titles.length;
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start typing effect after a delay
    setTimeout(typeEffect, 1000);
}

// ===== LAZY LOADING =====
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== THEME TOGGLE (OPTIONAL) =====
function initializeThemeToggle() {
    // This is a placeholder for potential theme switching functionality
    // Currently using a fixed dark theme, but can be extended
    
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Listen for changes in system theme preference
    prefersDarkScheme.addEventListener('change', (e) => {
        // Could implement theme switching logic here
        console.log('System theme changed to:', e.matches ? 'dark' : 'light');
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function initializePerformanceOptimizations() {
    // Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttle resize events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Optimize scroll performance
    const optimizedScrollHandler = debounce(() => {
        // Scroll-dependent operations
        updateScrollProgress();
    }, 10);
    
    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    
    // Optimize resize performance
    const optimizedResizeHandler = throttle(() => {
        // Resize-dependent operations
        handleResize();
    }, 250);
    
    window.addEventListener('resize', optimizedResizeHandler);
}

// ===== SCROLL PROGRESS INDICATOR =====
function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Update progress bar if it exists
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }
}

// ===== RESPONSIVE HANDLER =====
function handleResize() {
    // Handle responsive changes
    const isMobile = window.innerWidth <= 768;
    
    // Adjust animations for mobile
    if (isMobile) {
        // Reduce motion for better performance on mobile
        document.body.classList.add('reduced-motion');
    } else {
        document.body.classList.remove('reduced-motion');
    }
}

// ===== FORM VALIDATION (IF CONTACT FORM EXISTS) =====
function initializeFormValidation() {
    const contactForm = document.querySelector('#contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show success message
        showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
        
        // Reset form
        this.reset();
    });
}

// ===== UTILITY FUNCTIONS =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    `;
    
    // Set background color based on type
    const colors = {
        success: '#00ff88',
        error: '#ff4757',
        info: '#00a8ff',
        warning: '#ffc107'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// ===== EASTER EGGS =====
function initializeEasterEggs() {
    // Konami code easter egg
    let konamiCode = [];
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join('') === konamiSequence.join('')) {
            showNotification('🎉 You found the secret! Welcome to the matrix...', 'success');
            // Add special effect
            document.body.style.animation = 'matrix 2s ease-in-out';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);
        }
    });
    
    // Add matrix animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes matrix {
            0% { filter: hue-rotate(0deg); }
            50% { filter: hue-rotate(180deg) saturate(2); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initializeAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Keyboard navigation for custom elements
    const interactiveElements = document.querySelectorAll('.btn, .nav-link, .social-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                element.click();
            }
        });
    });
}

// ===== ANALYTICS (PLACEHOLDER) =====
function initializeAnalytics() {
    // Placeholder for analytics tracking
    // Could integrate with Google Analytics, Mixpanel, etc.
    
    function trackEvent(eventName, properties = {}) {
        console.log('Event tracked:', eventName, properties);
        // Implement actual tracking here
    }
    
    // Track navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('navigation_click', {
                section: link.getAttribute('href')
            });
        });
    });
    
    // Track button clicks
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('button_click', {
                button_text: btn.textContent.trim()
            });
        });
    });
}

// ===== INITIALIZE ALL FEATURES =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeParticles();
    initializeTypingEffect();
    initializeLazyLoading();
    initializeThemeToggle();
    initializePerformanceOptimizations();
    initializeFormValidation();
    initializeEasterEggs();
    initializeAccessibility();
    initializeAnalytics();
    
    // Show loading complete
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        showNotification,
        debounce,
        throttle
    };
} 