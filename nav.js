/* ═══════════════════════════════════════════════════
   EQTERS — nav.js  v2.0  (Animated Edition)
   Nav, Mobile Menu, Scroll Reveal, Progress Bar,
   Contact Form, Blog Filters
═══════════════════════════════════════════════════ */

/* ── Inject progress bar ── */
(function () {
  const bar = document.createElement('div');
  bar.id = 'progress-bar';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const max  = document.documentElement.scrollHeight - window.innerHeight;
    const pct  = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ── Nav scroll effect ── */
(function () {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const toggle = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
})();

/* ── Highlight active nav link ── */
(function () {
  const path   = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  const map    = { index: 'home', about: 'about', course: 'course', blog: 'blog', contact: 'contact' };
  const id     = map[path] || 'home';
  const link   = document.getElementById('nav-' + id);
  if (link) link.classList.add('active');
})();

/* ── Mobile menu toggle ── */
function toggleMenu() {
  const ham  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  ham.classList.toggle('open');
  menu.classList.toggle('open');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}
function closeMenu() {
  const ham  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!ham || !menu) return;
  ham.classList.remove('open');
  menu.classList.remove('open');
  document.body.style.overflow = '';
}
window.addEventListener('resize', () => { if (window.innerWidth > 1024) closeMenu(); });

/* ─────────────────────────────────────────────────
   SCROLL REVEAL
   Finds .reveal / .reveal-left / .reveal-right / .stagger
   and adds .visible when they enter the viewport.
───────────────────────────────────────────────── */
(function () {
  const selectors = '.reveal, .reveal-left, .reveal-right, .stagger';
  const items = Array.from(document.querySelectorAll(selectors));
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  items.forEach(el => io.observe(el));
})();

/* ─────────────────────────────────────────────────
   BLOG — category filter pills
───────────────────────────────────────────────── */
(function () {
  const pills = document.querySelectorAll('.cat-pill');
  if (!pills.length) return;
  pills.forEach(pill => {
    pill.addEventListener('click', function () {
      pills.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
    });
  });
})();

/* ─────────────────────────────────────────────────
   CONTACT FORM — submit, loading state & thank-you
───────────────────────────────────────────────── */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const formContainer = document.getElementById('form-container');
  const thankyouState = document.getElementById('thankyou-state');
  const submitBtn     = document.getElementById('submit-btn');
  const btnText       = document.getElementById('btn-text');
  const btnLoading    = document.getElementById('btn-loading');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        formContainer.style.animation = 'fadeOutUp 0.3s ease forwards';
        setTimeout(() => {
          formContainer.style.display = 'none';
          thankyouState.style.display = 'block';
          thankyouState.style.animation = 'fadeInUp 0.4s ease forwards';
        }, 300);
      } else {
        showError('Something went wrong — try again');
      }
    } catch {
      showError('Network error — try again');
    }
  });

  function showError(msg) {
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    btnText.textContent = msg;
    submitBtn.style.background = '#dc2626';
    setTimeout(() => {
      btnText.textContent = 'Send Message →';
      submitBtn.style.background = '';
    }, 3000);
  }

  window.resetForm = function () {
    form.reset();
    thankyouState.style.display = 'none';
    formContainer.style.display = 'block';
    formContainer.style.animation = 'fadeInUp 0.4s ease forwards';
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    btnText.textContent = 'Send Message →';
    submitBtn.style.background = '';
  };
})();

/* ─────────────────────────────────────────────────
   SMOOTH COUNT-UP  (numbers like "2025", stat blocks)
───────────────────────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el      = e.target;
      const target  = +el.dataset.count;
      const duration = 1400;
      const start   = performance.now();
      const tick    = (now) => {
        const pct  = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - pct, 3);
        el.textContent = Math.round(ease * target).toLocaleString();
        if (pct < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
})();
