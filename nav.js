/* ═══════════════════════════════════════════════════
   EQTERS — nav.js
   Shared navigation, mobile menu, contact form & blog
═══════════════════════════════════════════════════ */

/* ── Highlight active nav link based on current page ── */
(function () {
  const path = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  const map = { 'index': 'home', 'about': 'about', 'course': 'course', 'blog': 'blog', 'contact': 'contact' };
  const activeId = map[path] || 'home';
  const link = document.getElementById('nav-' + activeId);
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

/* ── Close menu on resize to desktop ── */
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024) closeMenu();
});


/* ═══════════════════════════════════════════════════
   BLOG — category filter pills
═══════════════════════════════════════════════════ */
(function () {
  const pills = document.querySelectorAll('.cat-pill');
  if (!pills.length) return; /* only runs on blog page */

  pills.forEach(pill => {
    pill.addEventListener('click', function () {
      pills.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
    });
  });
})();


/* ═══════════════════════════════════════════════════
   CONTACT FORM — submit, loading state & thank-you
═══════════════════════════════════════════════════ */
(function () {
  const form          = document.getElementById('contact-form');
  if (!form) return; /* only runs on contact page */

  const formContainer = document.getElementById('form-container');
  const thankyouState = document.getElementById('thankyou-state');
  const submitBtn     = document.getElementById('submit-btn');
  const btnText       = document.getElementById('btn-text');
  const btnLoading    = document.getElementById('btn-loading');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    /* Show loading state */
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        /* Swap form for thank-you card */
        formContainer.style.animation = 'fadeOutUp 0.3s ease forwards';
        setTimeout(() => {
          formContainer.style.display = 'none';
          thankyouState.style.display = 'block';
          thankyouState.style.animation = 'fadeInUp 0.4s ease forwards';
        }, 300);
      } else {
        showError('Something went wrong — try again');
      }
    } catch (err) {
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
