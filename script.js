/**
 * Agencement Lennon - Scripts principaux
 *
 * Ce fichier gère :
 * 1. Le menu de navigation mobile.
 * 2. La galerie d'images interactive (lightbox).
 * 3. Les animations d'apparition au défilement.
 * 4. La mise en évidence du lien actif dans la navigation.
 */
document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------
  // 1. GESTION DU MENU DE NAVIGATION MOBILE
  // ----------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('#nav a');

  if (navToggle && nav) {
    const closeMenu = () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.innerHTML = '<span class="visually-hidden">Ouvrir le menu</span>☰';
      navToggle.style.color = 'var(--text-primary)';
    };

    const openMenu = () => {
      nav.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.innerHTML = '<span class="visually-hidden">Fermer le menu</span>×';
      navToggle.style.color = '#fff';
    };

    navToggle.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Ferme le menu quand on clique sur un lien
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }


  // ----------------------------------------------
  // 2. GESTION DE LA GALERIE D'IMAGES (LIGHTBOX)
  // ----------------------------------------------
  const galleryItems = document.querySelectorAll('.masonry a');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  if (lightbox && lightboxImg && closeBtn && prevBtn && nextBtn && galleryItems.length > 0) {
    const images = Array.from(galleryItems).map(item => {
      const img = item.querySelector('img');
      return { src: item.href, alt: img ? img.alt || '' : '' };
    });

    let currentIndex = 0;

    const updateLightbox = (index) => {
      const { src, alt } = images[index];
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      currentIndex = index;
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = 'auto';
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        updateLightbox(index);
      });
    });

    const showNextImage = () => {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightbox(currentIndex);
    };

    const showPrevImage = () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightbox(currentIndex);
    };

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('open')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
      }
    });
  }


  // ----------------------------------------------
  // 3. ANIMATIONS D'APPARITION AU DÉFILEMENT
  // ----------------------------------------------
  const animatedElements = document.querySelectorAll('.fade-in');
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => observer.observe(element));
  }

  // ----------------------------------------------
  // 4. MISE EN ÉVIDENCE DU LIEN ACTIF AU DÉFILEMENT
  // ----------------------------------------------
  const sections = document.querySelectorAll('main section[id]');
  const scrollNavLinks = document.querySelectorAll('#nav a[href^="#"]');

  if (sections.length > 0 && scrollNavLinks.length > 0) {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          const activeLink = document.querySelector(`#nav a[href="#${id}"]`);

          // Supprime la classe active de tous les liens
          scrollNavLinks.forEach(link => link.classList.remove('nav-active'));

          // Ajoute la classe active au lien correspondant à la section visible
          if (activeLink) {
            activeLink.classList.add('nav-active');
          }
        }
      });
    };

    const observerOptions = {
      // La section est considérée active lorsqu'elle entre dans une zone
      // commençant 150px en dessous du haut de la fenêtre.
      rootMargin: "-150px 0px -50% 0px"
    };

    const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => sectionObserver.observe(section));
  }
});
