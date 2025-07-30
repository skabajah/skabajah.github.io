document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const examples = document.querySelector('.examples');
  const subNav = document.querySelector('.sub-nav');
  const chevron = examples.querySelector('.chevron');

  if (!examples || !subNav || !chevron) {
    console.warn('Missing .examples, .sub-nav, or .chevron element');
    return;
  }

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      if (link !== examples) {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          navLinks.classList.remove('active');
          examples.classList.remove('active');
          subNav.classList.remove('open');
          chevron.classList.remove('rotate');
        });
      }
    });
  }

  // Close submenu initially
  examples.classList.remove('active');
  subNav.classList.remove('open');
  chevron.classList.remove('rotate');

  // Toggle submenu and chevron on click
  examples.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isActive = examples.classList.contains('active');

    examples.classList.toggle('active');
    subNav.classList.toggle('open');
    chevron.classList.toggle('rotate');
  });
});
