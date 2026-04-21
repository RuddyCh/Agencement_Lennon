document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. HEADER SCROLL STATE ──────────────────────────────────
  // Ajout d'une classe .scrolled pour l'ombre du header au scroll
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // ─── 2. MENU MOBILE ──────────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navClose = document.getElementById('navClose');
  const nav = document.getElementById('mobileNav');

  if (navToggle && nav && navClose) {
    const openNav = () => {
      nav.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      // FIX ACCESSIBILITÉ : masquer le contenu principal pour les lecteurs d'écran
      nav.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden';
    };

    const closeNav = () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    // État initial
    nav.setAttribute('aria-hidden', 'true');

    navToggle.addEventListener('click', openNav);
    navClose.addEventListener('click', closeNav);

    // Fermeture auto sur clic lien
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    // Fermeture touche Échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeNav();
        navToggle.focus(); // Rend le focus au bouton d'ouverture
      }
    });

    // Fermeture clic extérieur
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== navToggle) {
        closeNav();
      }
    });
  }

  // ─── 3. BANDEAU COOKIES ──────────────────────────────────────
  // FIX : Utilisation de la valeur hex directe (var(--navy) ne fonctionne pas en JS inline)
  const NAVY = '#0D1F3C';

  const createCookieBanner = () => {
    if (document.getElementById('cookie-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Gestion des cookies');

    Object.assign(banner.style, {
      position: 'fixed',
      bottom: '0',
      left: '0',
      width: '100%',
      backgroundColor: NAVY,
      color: 'white',
      padding: '1rem',
      zIndex: '2000',
      boxShadow: '0 -5px 20px rgba(0,0,0,.15)',
      borderTop: '2px solid rgba(196,149,90,.4)'
    });

    banner.innerHTML = `
      <div class="container" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
        <p style="margin:0;font-size:.9rem;line-height:1.5">
          Nous utilisons des cookies pour améliorer votre expérience.
          <a href="politique-cookies.html" style="text-decoration:underline;color:#DDB97A">En savoir plus</a>.
        </p>
        <div style="display:flex;gap:.625rem;flex-shrink:0">
          <button id="accept-cookies" class="btn btn-primary" style="padding:.6rem 1.25rem">Accepter</button>
          <button id="decline-cookies" class="btn btn-outline" style="padding:.6rem 1.25rem">Refuser</button>
        </div>
      </div>`;

    document.body.appendChild(banner);

    document.getElementById('accept-cookies')?.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      banner.remove();
    });

    document.getElementById('decline-cookies')?.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'false');
      banner.remove();
    });
  };

  if (localStorage.getItem('cookiesAccepted') === null) {
    // Délai léger pour ne pas bloquer le rendu initial
    setTimeout(createCookieBanner, 800);
  }

  document.getElementById('manageCookies')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('cookiesAccepted');
    createCookieBanner();
  });

  // ─── 4. LIGHTBOX ─────────────────────────────────────────────
  // FIX : Sélecteurs mis à jour (.lightbox-close, .lightbox-prev, .lightbox-next sont des <button>)
  // FIX : aria-hidden géré correctement à l'ouverture et fermeture
  const galleryLinks = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = lightbox?.querySelector('.lightbox-close');
  const prevBtn = lightbox?.querySelector('.lightbox-prev');
  const nextBtn = lightbox?.querySelector('.lightbox-next');

  if (lightbox && galleryLinks.length > 0 && lightboxImg) {
    const images = Array.from(galleryLinks).map(link => ({
      src: link.href,
      alt: link.querySelector('img')?.alt || ''
    }));
    let currentIndex = 0;

    const showImage = (index) => {
      currentIndex = (index + images.length) % images.length;
      lightboxImg.src = images[currentIndex].src;
      lightboxImg.alt = images[currentIndex].alt;
      lightbox.classList.add('open');
      // FIX : aria-hidden correctement mis à jour
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // Focus le bouton fermer pour l'accessibilité clavier
      setTimeout(() => closeBtn?.focus(), 50);
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      // Rendre le focus à l'item galerie d'origine
      galleryLinks[currentIndex]?.focus();
    };

    const showNextImage = () => showImage(currentIndex + 1);
    const showPrevImage = () => showImage(currentIndex - 1);

    galleryLinks.forEach((link, index) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        showImage(index);
      });
    });

    closeBtn?.addEventListener('click', closeLightbox);
    nextBtn?.addEventListener('click', showNextImage);
    prevBtn?.addEventListener('click', showPrevImage);

    // Fermer en cliquant le fond
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'ArrowLeft') showPrevImage();
    });
  }

  // ─── 5. ANIMATIONS FADE-IN AU SCROLL ─────────────────────────
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

    animatedElements.forEach(el => observer.observe(el));
  }

  // ─── 6. COUNTER ANIMATION POUR LES STATS HERO ───────────────
  // NOUVEAU : Animation des chiffres (+4 ans, 100%) pour plus d'impact visuel
  const counterElements = document.querySelectorAll('[data-count]');

  if (counterElements.length > 0) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const startTime = performance.now();

      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = Math.round(easedProgress * target);

        el.textContent = `${current}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    };

    // Déclenche les counters dès que le hero est visible
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // ─── 7. FORMULAIRE DE CONTACT ────────────────────────────────
  // Gestion asynchrone du formulaire avec Formspree
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const submitBtn = contactForm.querySelector('.form-submit');
    const submitText = contactForm.querySelector('.submit-text');
    const submitLoading = contactForm.querySelector('.submit-loading');
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validation native HTML5
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      // État chargement
      submitBtn.disabled = true;
      submitText.hidden = true;
      submitLoading.hidden = false;
      successMsg.hidden = true;
      errorMsg.hidden = true;

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          contactForm.reset();
          successMsg.hidden = false;
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          throw new Error('Server error');
        }
      } catch {
        errorMsg.hidden = false;
      } finally {
        submitBtn.disabled = false;
        submitText.hidden = false;
        submitLoading.hidden = true;
      }
    });
  }

});
