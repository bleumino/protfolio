// script.js
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

// Observe all cards and section headers
document.querySelectorAll('.card, h2').forEach(el => observer.observe(el));

// Select the checkbox input
const checkbox = document.getElementById('checkbox');

// Listen for changes (when the user clicks the toggle)
checkbox.addEventListener('change', () => {
  // Toggle the 'dark' class on the body
  document.body.classList.toggle('dark');
});

// Add IDE file-like prefixes to section headers
const sectionHeaders = document.querySelectorAll('h2');
sectionHeaders.forEach(header => {
  header.textContent = header.textContent.toLowerCase().replace(/ /g, '_') + '.md';
});

const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

// Apply IDE-style cursor: thin vertical bar with blinking effect
const style = document.createElement('style');
style.textContent = `
  .custom-cursor {
    position: fixed;
    width: 2px;
    height: 20px;
    background-color: #7c7cff;
    pointer-events: none;
    transform: translate(-50%, -50%);
    animation: blink 1s step-start infinite;
    z-index: 9999;
  }
  @keyframes blink {
    0%, 50% { opacity: 1; }
    50.01%, 100% { opacity: 0; }
  }
  .custom-cursor.hovering {
    background-color: #6b6bff;
  }
`;
document.head.appendChild(style);

document.addEventListener('mousemove', e => {
  cursor.style.top = `${e.clientY}px`;
  cursor.style.left = `${e.clientX}px`;
});

// Optional: change color subtly on hover
const hoverElements = document.querySelectorAll('a, .card');
hoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

document.addEventListener('click', e => {
  const circle = document.createElement('div');
  circle.style.position = 'fixed';
  circle.style.width = '20px';
  circle.style.height = '20px';
  circle.style.border = '2px solid #7c7cff';
  circle.style.borderRadius = '50%';
  circle.style.top = `${e.clientY}px`;
  circle.style.left = `${e.clientX}px`;
  circle.style.pointerEvents = 'none';
  circle.style.transform = 'translate(-50%, -50%)';
  circle.style.opacity = '0.7';
  document.body.appendChild(circle);

  setTimeout(() => circle.remove(), 300);
});

const links = document.querySelectorAll('a');
links.forEach(link => {
  link.addEventListener('mouseenter', () => cursor.style.backgroundColor = '#f39c12'); // example: orange
  link.addEventListener('mouseleave', () => cursor.style.backgroundColor = '#7c7cff'); // default blue
});

