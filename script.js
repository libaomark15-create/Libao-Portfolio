const navItems = [...document.querySelectorAll('.nav-item')];
const sections = [...document.querySelectorAll('main section[id]')];
const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.14 });

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navItems.forEach((item) => item.classList.toggle('active', item.getAttribute('href') === `#${visible.target.id}`));
}, { rootMargin: '-35% 0px -50% 0px', threshold: [0, .1, .5] });

sections.forEach((section) => sectionObserver.observe(section));

const viewport = document.getElementById('galleryViewport');
const track = document.getElementById('projectTrack');
const previous = document.getElementById('galleryPrev');
const next = document.getElementById('galleryNext');
let galleryOffset = 0;
let pointerStart = 0;
let startOffset = 0;
let pointerActive = false;

function galleryLimit() {
  return Math.min(0, viewport.clientWidth - track.scrollWidth - 4);
}

function moveGallery(nextOffset, animate = true) {
  galleryOffset = Math.max(galleryLimit(), Math.min(0, nextOffset));
  track.style.transition = animate ? 'transform .55s cubic-bezier(.22,.75,.25,1)' : 'none';
  track.style.transform = `translateX(${galleryOffset}px)`;
}

previous.addEventListener('click', () => moveGallery(galleryOffset + Math.min(360, viewport.clientWidth * .75)));
next.addEventListener('click', () => moveGallery(galleryOffset - Math.min(360, viewport.clientWidth * .75)));

viewport.addEventListener('pointerdown', (event) => {
  pointerActive = true;
  pointerStart = event.clientX;
  startOffset = galleryOffset;
  viewport.setPointerCapture(event.pointerId);
  viewport.classList.add('is-dragging');
});

viewport.addEventListener('pointermove', (event) => {
  if (!pointerActive) return;
  moveGallery(startOffset + event.clientX - pointerStart, false);
});

function releaseGallery(event) {
  if (!pointerActive) return;
  pointerActive = false;
  viewport.classList.remove('is-dragging');
  if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
  moveGallery(galleryOffset);
}

viewport.addEventListener('pointerup', releaseGallery);
viewport.addEventListener('pointercancel', releaseGallery);
window.addEventListener('resize', () => moveGallery(galleryOffset, false));
