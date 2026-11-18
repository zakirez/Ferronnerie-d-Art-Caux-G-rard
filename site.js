document.documentElement.classList.add('js');
const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!expanded));
  navigation.dataset.open = String(!expanded);
});

const dialog = document.querySelector('.lightbox');
const photos = [...document.querySelectorAll('a[data-photo]')];
if (photos.length && typeof dialog.showModal === 'function') {
  let index = 0;
  let trigger;
  const image = dialog.querySelector('img');
  function showPhoto(position) {
    index = (position + photos.length) % photos.length;
    const photo = photos[index];
    image.src = photo.href;
    image.alt = photo.querySelector('img').alt;
    dialog.querySelector('output').textContent = `${index + 1} / ${photos.length}`;
  }
  photos.forEach((photo, position) => photo.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    trigger = photo;
    showPhoto(position);
    dialog.showModal();
  }));
  dialog.querySelector('[data-prev]').onclick = () => showPhoto(index - 1);
  dialog.querySelector('[data-next]').onclick = () => showPhoto(index + 1);
  dialog.querySelector('[data-close]').onclick = () => dialog.close();
  dialog.addEventListener('close', () => trigger.focus());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') showPhoto(index - 1);
    if (event.key === 'ArrowRight') showPhoto(index + 1);
  });
}

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('.hero-motion');

if (motionButton) {
  const hero = motionButton.closest('.hero');
  const updateMotionButton = () => {
    motionButton.hidden = motionPreference.matches;
  };

  updateMotionButton();
  motionPreference.addEventListener('change', updateMotionButton);
  motionButton.addEventListener('click', () => {
    const paused = hero.classList.toggle('is-paused');
    motionButton.textContent = paused ? 'Relancer le zoom' : 'Mettre le zoom en pause';
  });
}

if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const items = document.querySelectorAll(
    '.top .logo, .top .nav a, .top .social a, .top .menu, main .hero-media, main .inner-photo, main .atelier-intro-photo, main .inner-copy > a, main h1, main h2, main p, main .rule, ' +
    'main .actions .btn, main .feature, main .rows li, main .badge, ' +
    'main .tile, main address, main .map, main .title a, .foot .logo, .foot p'
  );
  const observer = new IntersectionObserver(entries => {
    let order = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const item = entry.target;
      item.style.setProperty('--reveal-delay', `${Math.min(order, 5) * 55}ms`);
      item.classList.add('reveal-in');
      observer.unobserve(item);
      order += 1;
    }
  });

  items.forEach(item => observer.observe(item));
}
