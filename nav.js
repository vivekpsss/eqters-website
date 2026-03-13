/* ═══════════════════════════════════════════════════
   EQTERS — nav.js
   Shared navigation & mobile menu logic
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
