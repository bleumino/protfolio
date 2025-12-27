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

