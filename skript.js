/* Kleine Bewegungen: Einblenden beim Scrollen, aktive Navigation, dunkle Navigation über dunklen Abschnitten */
(function () {
  const reduziert = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Ganzseiten-Aufnahme (Headless Chrome mit sehr hohem Fenster): Leiste auf Bildschirmhöhe festnageln
  if (location.search.includes('vollbild')) {
    document.documentElement.classList.add('vollbild');
    document.documentElement.style.setProperty('--vh', '900px');
  }

  // HELLO ! in einzelne Buchstaben zerlegen, damit sie nacheinander hochkommen
  document.querySelectorAll('.hello').forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      s.textContent = ch === ' ' ? ' ' : ch;
      s.style.animationDelay = (0.08 * i + 0.1) + 's';
      el.appendChild(s);
    });
  });

  // Einblenden beim Scrollen
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('ist-da'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  document.querySelectorAll('.reveal, .hero, .arbeitsweise').forEach(el => io.observe(el));
  if (reduziert) document.querySelectorAll('.reveal, .hero, .arbeitsweise').forEach(el => el.classList.add('ist-da'));

  // Navigation: aktiver Punkt und Farbe je nach Abschnitt
  const nav = document.querySelector('.nav');
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  const abschnitte = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const dunkle = [...document.querySelectorAll('.dunkel')];
  function aktualisieren() {
    const y = window.scrollY + 80;
    let aktiv = null;
    abschnitte.forEach(s => { if (s.offsetTop <= y) aktiv = s; });
    links.forEach(a => a.classList.toggle('aktiv', aktiv && a.getAttribute('href') === '#' + aktiv.id));
    const naviY = window.scrollY + 30;
    const istDunkel = dunkle.some(d => naviY >= d.offsetTop && naviY < d.offsetTop + d.offsetHeight);
    nav && nav.classList.toggle('dunkel', istDunkel);
  }
  window.addEventListener('scroll', aktualisieren, { passive: true });
  window.addEventListener('resize', aktualisieren);
  aktualisieren();

  // Jahr im Fuß
  const j = document.querySelector('[data-jahr]');
  if (j) j.textContent = new Date().getFullYear();
})();
