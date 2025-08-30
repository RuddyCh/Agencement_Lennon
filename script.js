// --- Mobile nav toggle ---
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('#nav a'); // Get all links inside the nav

  // Function to close the menu
  const closeMenu = () => {
    nav.classList.remove('open');
    navToggle.innerHTML = '☰'; // Reset to hamburger icon
    navToggle.style.color = 'var(--blue-night)'; // Reset color
  };

  // Function to open the menu
  const openMenu = () => {
    nav.classList.add('open');
    navToggle.innerHTML = '&times;'; // Change to a cross (X)
    navToggle.style.color = '#fff'; // Change color to white for visibility on the dark menu
  };

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      // Toggle menu state
      if (nav.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Add event listener to each link to close the menu on click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }
});


// --- Lightbox Gallery Logic ---
document.addEventListener('DOMContentLoaded', () => {
  const galleryItems = document.querySelectorAll('.masonry .tile img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  if (!lightbox || !lightboxImg || !closeBtn || !prevBtn || !nextBtn) {
    return;
  }

  let currentIndex = 0;
  const images = Array.from(galleryItems).map(item => item.src);

  const showImage = (index) => {
    lightboxImg.src = images[index];
    currentIndex = index;
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      showImage(index);
    });
  });

  const closeLightbox = () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
  };

  const showNextImage = () => {
    const newIndex = (currentIndex + 1) % images.length;
    showImage(newIndex);
  };

  const showPrevImage = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(newIndex);
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
    if (lightbox.style.display === 'block') {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      }
    }
  });
});

// --- Animation au défilement (Fade-in) ---
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.fade-in');

  if (animatedElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  animatedElements.forEach(element => {
    observer.observe(element);
  });
});
