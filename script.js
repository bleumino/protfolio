// script.js

// Reveal cards and section headers as they scroll into view, staggered within each grid
document.querySelectorAll('.projects, .skills, .education, .experience').forEach(grid => {
  Array.from(grid.children).forEach((card, i) => {
    if (card.classList.contains('card')) {
      card.dataset.delay = `${Math.min(i, 8) * 60}ms`;
    }
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay;
      if (delay) {
        entry.target.style.transitionDelay = delay;
        setTimeout(() => { entry.target.style.transitionDelay = ''; }, 700);
      }
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, h2').forEach(el => observer.observe(el));

// Dark/light toggle — checked (sun side) = light theme, unchecked (moon side) = dark theme
// Initial theme was already applied to <html> by the inline head script (avoids a flash).
// Here we just sync the checkbox to match, and persist future choices.
const checkbox = document.getElementById('checkbox');

function setTheme(isLight, persist = true) {
  document.documentElement.classList.toggle('light', isLight);
  checkbox.checked = isLight;
  if (persist) localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

checkbox.checked = document.documentElement.classList.contains('light');
checkbox.addEventListener('change', () => setTheme(checkbox.checked));

// Follow system theme changes live, but only if the visitor hasn't picked one explicitly
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
  if (localStorage.getItem('theme')) return;
  setTheme(e.matches, false);
});

// Add IDE file-like prefixes to section headers, e.g. "Projects" -> "projects.md"
document.querySelectorAll('h2').forEach(header => {
  header.textContent = header.textContent.toLowerCase().replace(/ /g, '_') + '.md';
});

// Custom cursor: a small dot that follows the mouse and reacts to hoverable elements
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

document.addEventListener('mousemove', e => {
  cursor.style.top = `${e.clientY}px`;
  cursor.style.left = `${e.clientX}px`;
});

document.querySelectorAll('a, .card, input, .checkbox-label').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

// Click ripple
document.addEventListener('click', e => {
  const circle = document.createElement('div');
  circle.style.position = 'fixed';
  circle.style.width = '20px';
  circle.style.height = '20px';
  circle.style.border = '2px solid var(--accent)';
  circle.style.borderRadius = '50%';
  circle.style.top = `${e.clientY}px`;
  circle.style.left = `${e.clientX}px`;
  circle.style.pointerEvents = 'none';
  circle.style.transform = 'translate(-50%, -50%)';
  circle.style.opacity = '0.7';
  circle.style.zIndex = '9998';
  document.body.appendChild(circle);
  setTimeout(() => circle.remove(), 300);
});

// Loader
document.body.classList.add('loading');

window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('fade-out');
    document.body.classList.remove('loading');
  }, 1200);
});

// Terminal-style resource search (robotics.html only — no-op if not present)
const resourceSearch = document.getElementById('resource-search');
if (resourceSearch) {
  resourceSearch.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    document.querySelectorAll('.education .card').forEach(card => {
      const text = card.textContent.toLowerCase();
      const tags = (card.dataset.tags || '').toLowerCase();
      const matches = !query || text.includes(query) || tags.includes(query);
      card.classList.toggle('hidden', !matches);
    });
  });
}

// -----------------------------------------------------------------------
// Command palette — a hidden mini terminal. Press "/" or click the >_
// button to open it. Type "help" once inside for the full command list.
// -----------------------------------------------------------------------
(function () {
  const page = document.title.includes('404') ? '404' : (document.querySelector('.winbar-path')?.textContent || '~');

  const trigger = document.createElement('button');
  trigger.className = 'cmdk-trigger';
  trigger.type = 'button';
  trigger.setAttribute('aria-label', 'Open command palette');
  trigger.title = 'Press / to open';
  trigger.textContent = '>_';
  document.body.appendChild(trigger);

  const overlay = document.createElement('div');
  overlay.className = 'cmdk-overlay';
  overlay.innerHTML = `
    <div class="cmdk-window" role="dialog" aria-label="Command palette">
      <div class="cmdk-titlebar">
        <div class="winbar-dots" aria-hidden="true"><span></span><span></span><span></span></div>
        <span class="cmdk-path">${page} — visitor-shell</span>
      </div>
      <div class="cmdk-output" id="cmdk-output"></div>
      <div class="cmdk-inputline">
        <span class="prompt">$</span>
        <input type="text" id="cmdk-input" autocomplete="off" spellcheck="false" placeholder="type 'help' and press enter" />
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const output = overlay.querySelector('#cmdk-output');
  const input = overlay.querySelector('#cmdk-input');
  const history = [];
  let historyIndex = -1;

  // Let the custom cursor react to the new interactive elements
  [trigger, input].forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  function print(text, cls = '') {
    const line = document.createElement('div');
    line.className = `cmdk-line ${cls}`;
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function printEcho(cmd) {
    const line = document.createElement('div');
    line.className = 'cmdk-line cmdk-echo';
    line.innerHTML = `<span class="prompt">$</span> ${cmd.replace(/</g, '&lt;')}`;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function greet() {
    print("visitor-shell v1.0 — type 'help' to see what this does.", 'cmdk-muted');
  }

  function openPalette() {
    overlay.classList.add('open');
    if (!output.dataset.greeted) {
      greet();
      output.dataset.greeted = '1';
    }
    setTimeout(() => input.focus(), 10);
  }

  function closePalette() {
    overlay.classList.remove('open');
  }

  const COMMANDS = {
    help() {
      print('available commands:', 'cmdk-muted');
      [
        'whoami       — who runs this site',
        'about        — a short bio',
        'skills       — technical skills',
        'open <page>  — index | robotics | home',
        'theme <mode> — dark | light | (no arg to toggle)',
        'contact      — social links',
        'coffee       — brew something',
        'sudo <...>   — try it',
        'date         — current date & time',
        'clear        — clear the screen',
        'exit         — close this window',
      ].forEach(l => print('  ' + l));
    },
    whoami() {
      print("nghia — IT student (Machine Learning) at Flinders University, Adelaide.");
    },
    about() {
      print("Building things from scratch, learning languages, and experimenting with");
      print("digital identities and content. Interested in clarity, taste, and how systems work.");
    },
    skills() {
      print('Python, SQL, C++ — competent   |   HTML, CSS — intermediate   |   Java — basic/intermediate');
    },
    open(arg) {
      const target = (arg || '').toLowerCase();
      if (target === 'robotics') { print('opening robotics.html…'); setTimeout(() => (window.location.href = 'robotics.html'), 400); }
      else if (target === 'index' || target === 'home' || target === '') { print('opening index.html…'); setTimeout(() => (window.location.href = 'index.html'), 400); }
      else print(`no such page: ${arg}. try "open index" or "open robotics".`, 'cmdk-error');
    },
    theme(arg) {
      const mode = (arg || '').toLowerCase();
      if (mode === 'dark') { setTheme(false); print('theme set to dark.'); }
      else if (mode === 'light') { setTheme(true); print('theme set to light.'); }
      else { setTheme(!checkbox.checked); print(`theme toggled to ${checkbox.checked ? 'light' : 'dark'}.`); }
    },
    contact() {
      print('linkedin.com/in/nghia-tran-b59615331');
      print('github.com/bleumino');
      print('instagram.com/bleumino1');
    },
    coffee() {
      print('       ( (');
      print('        ) )');
      print('     ........');
      print('     |      |]');
      print('     \\      /');
      print('      `----`');
      print('brewing... done. you may now continue debugging.', 'cmdk-muted');
    },
    sudo(arg) {
      print(`Permission denied: visitor is not in the sudoers file.`, 'cmdk-error');
      print('This incident will be reported (jk — nothing is logged).', 'cmdk-muted');
    },
    date() {
      print(new Date().toString());
    },
    clear() {
      output.innerHTML = '';
    },
    exit() {
      closePalette();
    },
  };

  function run(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    printEcho(trimmed);
    history.push(trimmed);
    historyIndex = history.length;

    const [cmd, ...rest] = trimmed.split(/\s+/);
    const key = cmd.toLowerCase();
    const arg = rest.join(' ');

    if (COMMANDS[key]) {
      COMMANDS[key](arg);
    } else {
      print(`command not found: ${cmd}. type "help" for a list of commands.`, 'cmdk-error');
    }
  }

  trigger.addEventListener('click', openPalette);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePalette();
  });

  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement.tagName;
    const typing = tag === 'INPUT' || tag === 'TEXTAREA';

    if (e.key === '/' && !typing) {
      e.preventDefault();
      openPalette();
    } else if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closePalette();
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      run(input.value);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) { historyIndex--; input.value = history[historyIndex]; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) { historyIndex++; input.value = history[historyIndex]; }
      else { historyIndex = history.length; input.value = ''; }
    }
  });

  // One-time hint for first-time visitors
  if (!localStorage.getItem('cmdk-hint-shown')) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        trigger.classList.add('hint');
        setTimeout(() => trigger.classList.remove('hint'), 3600);
        localStorage.setItem('cmdk-hint-shown', '1');
      }, 1800);
    });
  }
})();