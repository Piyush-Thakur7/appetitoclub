/**
 * Appetito Club - Main Scripts File
 * College Project Presentation Reference
 * Handles all custom UX enhancements, animations, scroll effects, carousel, filters, lightbox, and form validations.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================
     1. Sticky Header & Active Link Highlighting
     ========================================== */
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Update navbar background when page scrolls
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightActiveLink();
  });

  // Highlight active link in navbar based on current scroll position
  function highlightActiveLink() {
    let currentPath = window.location.pathname;
    let pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    if (pageName === '') pageName = 'index.html';

    navLinks.forEach(link => {
      let linkHref = link.getAttribute('href');
      if (linkHref === pageName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  highlightActiveLink(); // Initial run

  /* ==========================================
     2. Mobile Hamburger Menu Toggle
     ========================================== */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = hamburger.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }

  /* ==========================================
     3. Parallax Hero Background Effect
     ========================================== */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      let offset = window.pageYOffset;
      // Move background slower than page scroll rate (parallax ratio 0.4)
      heroBg.style.transform = `translateY(${offset * 0.4}px)`;
    });
  }

  /* ==========================================
     4. Intersection Observer: Reveal on Scroll
     ========================================== */
  // Create an Intersection Observer that monitors elements with class '.reveal'
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once animated, we don't need to observe it anymore
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null, // Viewport
    threshold: 0.15 // Trigger when 15% of the element is visible
  });

  document.querySelectorAll('.reveal').forEach(element => {
    revealObserver.observe(element);
  });

  /* ==========================================
     5. Animated Stats Counter (Count-Up)
     ========================================== */
  const statsSection = document.querySelector('.stats-section');
  const statNumbers = document.querySelectorAll('.stat-number');
  let startedCounting = false;

  const countUp = () => {
    statNumbers.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const speed = 200; // Lower is slower
      const increment = target / speed;

      const updateCount = () => {
        const current = +stat.innerText;
        if (current < target) {
          stat.innerText = Math.ceil(current + increment);
          setTimeout(updateCount, 15);
        } else {
          stat.innerText = target;
        }
      };
      updateCount();
    });
  };

  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !startedCounting) {
        startedCounting = true;
        countUp();
        statsObserver.unobserve(statsSection);
      }
    }, {
      threshold: 0.5 // Trigger when half of the stats section is in view
    });

    statsObserver.observe(statsSection);
  }

  /* ==========================================
     6. Testimonials Carousel
     ========================================== */
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const nextButton = document.querySelector('.carousel-btn.next');
  const prevButton = document.querySelector('.carousel-btn.prev');

  if (track && slides.length > 0) {
    let currentIdx = 0;
    
    const moveToSlide = (index) => {
      track.style.transform = `translateX(-${index * 100}%)`;
      currentIdx = index;
    };

    if (nextButton && prevButton) {
      nextButton.addEventListener('click', () => {
        let nextIdx = currentIdx + 1;
        if (nextIdx >= slides.length) nextIdx = 0;
        moveToSlide(nextIdx);
      });

      prevButton.addEventListener('click', () => {
        let prevIdx = currentIdx - 1;
        if (prevIdx < 0) prevIdx = slides.length - 1;
        moveToSlide(prevIdx);
      });
      
      // Auto autoplay carousel every 5 seconds
      let autoPlay = setInterval(() => {
        let nextIdx = currentIdx + 1;
        if (nextIdx >= slides.length) nextIdx = 0;
        moveToSlide(nextIdx);
      }, 5000);

      // Pause autoplay on mouse hover
      const carouselContainer = document.querySelector('.carousel-wrapper');
      if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlay));
        carouselContainer.addEventListener('mouseleave', () => {
          autoPlay = setInterval(() => {
            let nextIdx = currentIdx + 1;
            if (nextIdx >= slides.length) nextIdx = 0;
            moveToSlide(nextIdx);
          }, 5000);
        });
      }
    }
  }

  /* ==========================================
     7. Menu Categorized Filtering Tabs (menu.html)
     ========================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item-wrapper');

  if (filterButtons.length > 0 && menuItems.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle Active button class
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        menuItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.classList.remove('hide');
            // Slight delay for smooth fade-in
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            // Hide element from layout after animation
            setTimeout(() => {
              item.classList.add('hide');
            }, 300);
          }
        });
      });
    });
  }

  /* ==========================================
     8. Lightbox Zoom Gallery Modal (gallery.html)
     ========================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  if (galleryItems.length > 0 && lightbox && lightboxImg) {
    let imagesList = [];
    let currentImgIdx = 0;

    // Collect all image references from page
    galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-item-title')?.innerText || '';
      if (img) {
        imagesList.push({
          src: img.src,
          caption: title
        });

        // Click event to open lightbox
        item.addEventListener('click', () => {
          currentImgIdx = index;
          openLightbox(imagesList[currentImgIdx]);
        });
      }
    });

    const openLightbox = (imgData) => {
      lightboxImg.src = imgData.src;
      if (lightboxCaption) lightboxCaption.innerText = imgData.caption;
      lightbox.classList.add('active');
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', () => {
        currentImgIdx--;
        if (currentImgIdx < 0) currentImgIdx = imagesList.length - 1;
        openLightbox(imagesList[currentImgIdx]);
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', () => {
        currentImgIdx++;
        if (currentImgIdx >= imagesList.length) currentImgIdx = 0;
        openLightbox(imagesList[currentImgIdx]);
      });
    }

    // Keyboard support (Escape and Arrow keys)
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
      if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
    });
  }

  /* ==========================================
     9. Event Enquiry Modal (events.html)
     ========================================== */
  const enquireBtns = document.querySelectorAll('.enquire-btn');
  const enquiryModal = document.getElementById('enquiryModal');
  const closeModalBtn = document.querySelector('.close-modal');
  const eventSelect = document.getElementById('event-type');

  if (enquireBtns.length > 0 && enquiryModal) {
    enquireBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Pre-select appropriate category in modal selection dropdown if match exists
        const eventName = btn.getAttribute('data-event');
        if (eventSelect && eventName) {
          eventSelect.value = eventName;
        }
        enquiryModal.classList.add('active');
      });
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        enquiryModal.classList.remove('active');
      });
    }

    // Close on overlay click
    enquiryModal.addEventListener('click', (e) => {
      if (e.target === enquiryModal) {
        enquiryModal.classList.remove('active');
      }
    });
  }

  /* ==========================================
     10. Client-Side Form Validation
     ========================================== */
  const contactForm = document.getElementById('contactForm');
  const modalEnquiryForm = document.getElementById('modalEnquiryForm');

  const validateForm = (form) => {
    if (!form) return false;
    let isValid = true;

    const inputs = form.querySelectorAll('.form-control[required]');
    inputs.forEach(input => {
      const errorMsg = input.nextElementSibling;
      
      // Reset state
      input.classList.remove('is-invalid', 'is-valid');
      if (errorMsg && errorMsg.classList.contains('error-msg')) {
        errorMsg.style.display = 'none';
      }

      // Check empty
      if (input.value.trim() === '') {
        isValid = false;
        input.classList.add('is-invalid');
        if (errorMsg) {
          errorMsg.innerText = 'This field is required.';
          errorMsg.style.display = 'block';
        }
      } 
      // Check Email format
      else if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          isValid = false;
          input.classList.add('is-invalid');
          if (errorMsg) {
            errorMsg.innerText = 'Please enter a valid email address.';
            errorMsg.style.display = 'block';
          }
        } else {
          input.classList.add('is-valid');
        }
      } 
      // Check Phone format (10+ digits)
      else if (input.type === 'tel') {
        const phoneRegex = /^[0-9\-\+\s]{10,15}$/;
        if (!phoneRegex.test(input.value.trim().replace(/\s/g, ''))) {
          isValid = false;
          input.classList.add('is-invalid');
          if (errorMsg) {
            errorMsg.innerText = 'Please enter a valid phone number (min 10 digits).';
            errorMsg.style.display = 'block';
          }
        } else {
          input.classList.add('is-valid');
        }
      } 
      // Standard valid
      else {
        input.classList.add('is-valid');
      }
    });

    return isValid;
  };

  // Add validation triggers
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(contactForm)) {
        alert('Thank you! Your message has been sent successfully. We will get back to you shortly.');
        contactForm.reset();
        contactForm.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-valid'));
      }
    });
  }

  if (modalEnquiryForm) {
    modalEnquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(modalEnquiryForm)) {
        alert('Thank you! Your event enquiry has been received. Our team will contact you to plan the details.');
        modalEnquiryForm.reset();
        modalEnquiryForm.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-valid'));
        if (enquiryModal) enquiryModal.classList.remove('active');
      }
    });
  }
});
