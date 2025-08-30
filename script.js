document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile nav toggle ---
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('#nav a');

  const closeMenu = () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.innerHTML = '☰';
    navToggle.style.color = 'var(--text-primary)';
  };

  const openMenu = () => {
    nav.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.innerHTML = '&times;';
    navToggle.style.color = '#fff';
  };

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

  // --- Lightbox Gallery Logic ---
  const galleryItems = document.querySelectorAll('.masonry a');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  if (lightbox && lightboxImg && closeBtn && prevBtn && nextBtn) {
    const images = Array.from(galleryItems).map(item => item.href);
    let currentIndex = 0;

    const showImage = (index) => {
      lightboxImg.src = images[index];
      currentIndex = index;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    
    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = 'auto';
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        showImage(index);
      });
    });

    const showNextImage = () => {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    };

    const showPrevImage = () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    };

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('open')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
      }
    });
  }

  // --- Animation au défilement (Fade-in) ---
  const animatedElements = document.querySelectorAll('.fade-in');
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
});
