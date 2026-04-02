// ── COUNTDOWN ──────────────────────────────────────────────
const countdownTarget = new Date('2026-04-30T23:59:00');

function formatUnit(value) {
  return String(Math.floor(value)).padStart(2, '0');
}

function updateCountdown() {
  const diff = countdownTarget - Date.now();
  if (diff < 0) return;

  document.getElementById('dias').textContent = formatUnit(diff / 864e5);
  document.getElementById('horas').textContent = formatUnit((diff % 864e5) / 36e5);
  document.getElementById('min').textContent = formatUnit((diff % 36e5) / 6e4);
  document.getElementById('seg').textContent = formatUnit((diff % 6e4) / 1e3);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ── SCROLL REVEAL ───────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.rv').forEach((element) => {
  revealObserver.observe(element);
});

// ── FAQ ACCORDION ───────────────────────────────────────────
document.querySelectorAll('.fi').forEach((item) => {
  const button = item.querySelector('.fbtn');
  if (!button) return;

  button.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.fi').forEach((faqItem) => {
      faqItem.classList.remove('open');
    });

    if (!isOpen) {
      item.classList.add('open');
    }
  });
});

// ── CAROUSEL FACTORY ────────────────────────────────────────
function makeCarousel(carouselId, dotsId, prevId, nextId, itemSelector) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const dotsWrapper = document.getElementById(dotsId);
  const items = carousel.querySelectorAll(itemSelector);
  let currentIndex = 0;

  function updateDots(activeIndex) {
    if (!dotsWrapper) return;

    dotsWrapper.querySelectorAll('.dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, items.length - 1));
    const activeItem = items[currentIndex];

    carousel.scrollTo({
      left: activeItem.offsetLeft - carousel.offsetLeft,
      behavior: 'smooth'
    });

    updateDots(currentIndex);
  }

  if (dotsWrapper) {
    dotsWrapper.innerHTML = '';

    items.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `dot${index === 0 ? ' active' : ''}`;
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ir para item ${index + 1}`);
      dot.addEventListener('click', () => goTo(index));
      dotsWrapper.appendChild(dot);
    });
  }

  const prevButton = document.getElementById(prevId);
  const nextButton = document.getElementById(nextId);

  if (prevButton) {
    prevButton.addEventListener('click', () => goTo(currentIndex - 1));
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => goTo(currentIndex + 1));
  }

  let isDragging = false;
  let startX = 0;
  let initialScrollLeft = 0;

  carousel.addEventListener('mousedown', (event) => {
    isDragging = true;
    carousel.classList.add('grabbing');
    startX = event.pageX - carousel.offsetLeft;
    initialScrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener('mouseleave', () => {
    isDragging = false;
    carousel.classList.remove('grabbing');
  });

  carousel.addEventListener('mouseup', () => {
    isDragging = false;
    carousel.classList.remove('grabbing');
  });

  carousel.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    event.preventDefault();
    const currentX = event.pageX - carousel.offsetLeft;
    carousel.scrollLeft = initialScrollLeft - (currentX - startX) * 1.5;
  });

  carousel.addEventListener(
    'scroll',
    () => {
      const center = carousel.scrollLeft + carousel.offsetWidth / 2;
      let closestIndex = 0;
      let minDistance = Infinity;

      items.forEach((item, index) => {
        const distance = Math.abs(
          item.offsetLeft + item.offsetWidth / 2 - center - carousel.offsetLeft
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex !== currentIndex) {
        currentIndex = closestIndex;
        updateDots(currentIndex);
      }
    },
    { passive: true }
  );
}

makeCarousel('whyCarousel', 'whyDots', 'whyPrev', 'whyNext', '.wc');
makeCarousel('modCarousel', 'modDots', null, null, '.mc');

// ── MODALITIES DOT STYLING ──────────────────────────────────
(function setupModalitiesDots() {
  const carousel = document.getElementById('modCarousel');
  const dotsWrapper = document.getElementById('modDots');
  if (!carousel || !dotsWrapper) return;

  const items = carousel.querySelectorAll('.mc');

  items.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `dot${index === 0 ? ' active' : ''}`;
    dot.type = 'button';
    dot.style.background = index === 0 ? '#fff' : 'rgba(255,255,255,0.2)';
    dotsWrapper.appendChild(dot);
  });

  carousel.addEventListener(
    'scroll',
    () => {
      const center = carousel.scrollLeft + carousel.offsetWidth / 2;
      let closestIndex = 0;
      let minDistance = Infinity;

      items.forEach((item, index) => {
        const distance = Math.abs(
          item.offsetLeft + item.offsetWidth / 2 - center - carousel.offsetLeft
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      dotsWrapper.querySelectorAll('.dot').forEach((dot, index) => {
        const isActive = index === closestIndex;
        dot.classList.toggle('active', isActive);
        dot.style.background = isActive ? '#fff' : 'rgba(255,255,255,0.2)';
        dot.style.width = isActive ? '24px' : '8px';
      });
    },
    { passive: true }
  );
})();
