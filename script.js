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