
/* ==========================================================================
   PORTFOLIO SCRIPT
   Swiss-inspired design
   ========================================================================== */


/* 1. SCROLL REVEAL
   Reveal cards and section headings as they enter the viewport.
   Cards receive a small staggered delay.
========================================================================== */

const revealElements = document.querySelectorAll(
  '.card, section h2'
);

const revealGrids = document.querySelectorAll(
  '.projects, .skills, .education, .experience'
);

// Assign staggered animation delays to cards.
revealGrids.forEach(grid => {
  Array.from(grid.children).forEach((card, index) => {
    if (card.classList.contains('card')) {
      card.dataset.delay = `${Math.min(index, 8) * 60}ms`;
    }
  });
});

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

function revealImmediately() {
  revealElements.forEach(element => {
    element.classList.add('visible');
  });
}

if (
  prefersReducedMotion ||
  !('IntersectionObserver' in window)
) {
  revealImmediately();
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const delay = element.dataset.delay;

      if (delay) {
        element.style.transitionDelay = delay;

        // Reset the delay after the animation.
        setTimeout(() => {
          element.style.transitionDelay = '';
        }, 1000);
      }

      element.classList.add('visible');

      // No need to observe an element once revealed.
      observer.unobserve(element);
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(element => {
    observer.observe(element);
  });
}


/* 2. DARK / LIGHT THEME */

const themeToggle = document.getElementById('checkbox');

const prefersLight = window.matchMedia(
  '(prefers-color-scheme: light)'
);

function getSavedTheme() {
  try {
    return localStorage.getItem('theme');
  } catch {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // Theme still works if storage is unavailable.
  }
}

function setTheme(theme, persist = true) {
  const isDark = theme === 'dark';

  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.classList.toggle('light', !isDark);

  if (themeToggle) {
    themeToggle.checked = !isDark;
  }

  if (persist) {
    saveTheme(theme);
  }
}

// Synchronise the toggle with the current theme.
const initialTheme =
  document.documentElement.classList.contains('dark')
    ? 'dark'
    : 'light';

setTheme(initialTheme, false);

if (themeToggle) {
  themeToggle.addEventListener('change', () => {
    setTheme(themeToggle.checked ? 'light' : 'dark');
  });
}

// Follow system preferences if no preference has been saved.
prefersLight.addEventListener('change', event => {
  if (getSavedTheme()) return;

  setTheme(event.matches ? 'light' : 'dark', false);
});

// Synchronise theme changes across browser tabs.
window.addEventListener('storage', event => {
  if (event.key !== 'theme') return;

  if (event.newValue === 'light' || event.newValue === 'dark') {
    setTheme(event.newValue, false);
  }
});



/* 3. ROBOTICS RESOURCE SEARCH
   Filters resources by their visible text and data-tags.
   Only runs on pages containing the resource search field.
========================================================================== */

const resourceSearch = document.getElementById('resource-search');

if (resourceSearch) {
  const resourceCards = document.querySelectorAll(
    '.education .card'
  );

  resourceSearch.addEventListener('input', () => {
    const query = resourceSearch.value.trim().toLowerCase();

    resourceCards.forEach(card => {
      const content = card.textContent.toLowerCase();
      const tags = (card.dataset.tags || '').toLowerCase();

      const matches =
        !query ||
        content.includes(query) ||
        tags.includes(query);

      card.classList.toggle('hidden', !matches);
    });
  });
}


/* 4. LOADER
   Optional: supports pages that still contain #loader.
   If the loader is removed from the HTML, the rest of the script
   continues working normally.
========================================================================== */

const loader = document.getElementById('loader');

if (loader) {
  document.body.classList.add('loading');

  function hideLoader() {
    setTimeout(() => {
      loader.classList.add('fade-out');
      document.body.classList.remove('loading');
    }, prefersReducedMotion ? 0 : 350);
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader, {
      once: true
    });
  }
}


/* ==========================================================================
   END OF SCRIPT
   No command palette, custom cursor, click ripple or terminal behaviour.
   ========================================================================== */
