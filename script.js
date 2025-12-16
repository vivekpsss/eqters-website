// --- Smooth scrolling for internal links ---
document.querySelectorAll('a.nav-link, a.navbar-brand').forEach(el => {
  el.addEventListener('click', function(e){
    const href = this.getAttribute('href');
    if(!href || !href.startsWith('#')) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if(target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({top,behavior:'smooth'});
    }
    // collapse mobile menu after click
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if(navbarCollapse && navbarCollapse.classList.contains('show')){
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
      bsCollapse.hide();
    }
  });
});

// --- Scroll progress bar ---
const scrollBar = document.getElementById('scrollBar');
window.addEventListener('scroll', ()=> {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = (window.scrollY / (docHeight || 1)) * 100;
  if(scrollBar) scrollBar.style.width = percent + '%';
});



// --- Parallax floating shapes on mouse move ---
const floats = document.querySelectorAll('.float-shape');
window.addEventListener('mousemove', (e)=>{
  floats.forEach(el=>{
    const speed = parseFloat(el.dataset.speed) || 0.2;
    const x = (window.innerWidth - e.clientX*speed)/100;
    const y = (window.innerHeight - e.clientY*speed)/100;
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
});

// --- Intersection observer for reveal animations + counters ---
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.querySelectorAll('.fade-in').forEach(n=>n.classList.add('visible'));

      // counters
      entry.target.querySelectorAll('.stat-number').forEach(numEl=>{
        if(numEl.dataset.animated) return;
        numEl.dataset.animated = 'true';
        const target = parseInt(numEl.getAttribute('data-target') || '0',10);
        let current = 0;
        const step = Math.max(1, Math.round(target / 60));
        const iv = setInterval(()=>{
          current += step;
          if(current >= target){
            numEl.textContent = target;
            clearInterval(iv);
          } else numEl.textContent = current;
        }, 16);
      });
    }
  });
},{threshold:0.12});

document.querySelectorAll('.section-card, .hero, #services').forEach(el=>{
  if(el) io.observe(el);
});

// --- Rotating hero text (simple loop) ---
const rotatingPhrases = [
  'Learn Trading the Right Way',
  'Confidence. Clarity. Mentorship.',
  'Trade Smart — Not Hard',
  'From Beginner to Confident Trader'
];
let rotIdx = 0;
const rotEl = document.querySelector('.rotating-text');
if(rotEl){
  rotEl.textContent = rotatingPhrases[0];
  setInterval(()=>{
    rotEl.classList.remove('fade-text');
    setTimeout(()=>{
      rotEl.textContent = rotatingPhrases[rotIdx % rotatingPhrases.length];
      rotEl.classList.add('fade-text');
      rotIdx++;
    }, 250);
  }, 3500);
}

// --- Theme toggle (if you add a toggle button later) ---
const themeToggle = document.getElementById('themeToggle');
if(themeToggle){
  const apply = (isDark)=>{
    document.body.classList.toggle('dark', isDark);
    themeToggle.textContent = isDark ? '☀️' : '🌙';
  };
  const saved = localStorage.getItem('eqters_dark') === '1';
  apply(saved);
  themeToggle.addEventListener('click', ()=>{
    const dark = !document.body.classList.contains('dark');
    apply(dark);
    localStorage.setItem('eqters_dark', dark ? '1' : '0');
  });
}

// --- Testimonials autoplay tweak (bootstrap carousel is used) ---
const tst = document.querySelector('#testimonials');
if(tst){
  const carousel = new bootstrap.Carousel(tst, {interval:4000, ride:'carousel'});
}



// --- Button ripple effect on click (subtle) ---
document.querySelectorAll('.btn').forEach(btn=>{
  btn.addEventListener('click', function(e){
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    btn.appendChild(ripple);
    setTimeout(()=>ripple.remove(), 600);
  });
});

// --- little GSAP hero entrance ---
window.addEventListener('load', ()=>{
  if(window.gsap){
    gsap.from('.hero-title',{y:30,opacity:0,duration:1.1,ease:'power3.out'});
    gsap.from('.hero-sub',{y:18,opacity:0,duration:1.1,delay:0.2,ease:'power3.out'});
    gsap.from('.hero-cta',{y:10,opacity:0,duration:1,delay:0.4});
  }
});

/**
 * sendWhatsApp - builds prefilled WhatsApp message and opens chat
 * Usage: called from form onsubmit with `this` as the form element.
 */
function sendWhatsApp(e, form) {
  e.preventDefault();

  // Replace with your WhatsApp number (no +, no spaces)
  const waNumber = '919074619231';

  const service = form.dataset.service || 'Enquiry';
  const name = (form.querySelector('input[name="name"]') || {}).value || '';
  const phone = (form.querySelector('input[name="phone"]') || {}).value || '';

  // Basic validation: at least one field or proceed anyway
  // (optional) you can require name/phone by uncommenting validation lines
  // if(!name && !phone){ alert('Please enter your name or phone'); return false; }

  // Build message — adjust template as you like
  let msg = `Hi, I\'m interested in "${service}".%0A`;
  if(name) msg += `Name: ${encodeURIComponent(name)}%0A`;
  if(phone) msg += `Phone: ${encodeURIComponent(phone)}%0A`;
  msg += `%0APlease let me know the next steps.`;

  // wa.me URL
  const url = `https://wa.me/${waNumber}?text=${msg}`;

  // Open WhatsApp in new tab/window (works for desktop + mobile)
  window.open(url, '_blank');

  return false;
}

document.addEventListener("DOMContentLoaded", function () {

  emailjs.init("pVS3tAHN_bYevC9oa"); // PUBLIC KEY

  const contactForm = document.getElementById("contactForm");
  const formAlert = document.getElementById("formAlert");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.classList.add("was-validated");
      return;
    }

    // Show loading message
    formAlert.style.display = "block";
    formAlert.innerHTML =
      "<div class='alert alert-info'>⏳ Sending message…</div>";

    emailjs.sendForm(
      "service_xzyk4ny",
      "template_osl26mo",
      contactForm
    ).then(
      function () {
        showAutoAlert(
          "success",
          "✅ Message sent successfully. We’ll contact you soon."
        );
        contactForm.reset();
        contactForm.classList.remove("was-validated");
      },
      function () {
        showAutoAlert(
          "danger",
          "❌ Failed to send message. Please try again."
        );
      }
    );
  });

  // Auto dismiss alert function
  function showAutoAlert(type, message) {
    formAlert.style.display = "block";
    formAlert.innerHTML =
      `<div class="alert alert-${type} fade show">${message}</div>`;

    // Auto hide after 4 seconds
    setTimeout(() => {
      const alertBox = formAlert.querySelector(".alert");
      if (!alertBox) return;

      alertBox.classList.remove("show");
      alertBox.classList.add("fade");

      setTimeout(() => {
        formAlert.style.display = "none";
        formAlert.innerHTML = "";
      }, 500);
    }, 4000);
  }

});












