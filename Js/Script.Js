const stage = document.getElementById('stage');
const dotsBox = document.getElementById('dots');
const cards = [...stage.querySelectorAll('.cat-card')];
let current = Math.floor(cards.length / 2);     

const dots = cards.map((_, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
  b.addEventListener('click', () => go(i));
  dotsBox.appendChild(b);
  return b;
});

function render() {
  cards.forEach((card, i) => {
    const offset = i - current;
    card.style.setProperty('--o', offset);
    card.classList.toggle('active', offset === 0);
    card.classList.toggle('hidden', Math.abs(offset) > 2);
  });
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

function go(i) {
  current = Math.max(0, Math.min(cards.length - 1, i));
  render();
}

cards.forEach((card, i) => card.addEventListener('click', e => {
  if (i !== current) { e.preventDefault(); go(i); }
}));

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') go(current + 1);
  if (e.key === 'ArrowLeft') go(current - 1);
});

let startX = null;
stage.addEventListener('pointerdown', e => startX = e.clientX);
stage.addEventListener('pointerup', e => {
  if (startX === null) return;
  const dx = e.clientX - startX;
  if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
  startX = null;
});

render();

const counters = document.querySelectorAll('.count');
const statsSection = document.querySelector('.our-collaps');

function animateCount(el) {
  const target = +el.dataset.target;
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = '+' + Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      counters.forEach(animateCount);
      el.textContent = '+0';
    }
  });
}, { threshold: 0.4 });

statsObserver.observe(statsSection);