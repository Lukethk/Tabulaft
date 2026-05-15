const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

// Navigation animation
const navLinksArray = Array.from(document.querySelectorAll('.nav a'));
const navPill = document.querySelector('.nav-pill');
const sections = document.querySelectorAll('section');

function updateNavPill(link) {
  if (!navPill) return;
  const left = link.style.left || getComputedStyle(link).left;
  const width = link.style.width || getComputedStyle(link).width;
  navPill.style.left = left;
  navPill.style.width = width;
  
  navLinksArray.forEach(l => l.style.color = 'var(--black)');
  link.style.color = 'var(--white)';
}

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 300) {
      current = section.getAttribute('id');
    }
  });

  navLinksArray.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}` || (current === '' && link.getAttribute('href') === '#inicio')) {
      link.classList.add('active');
      updateNavPill(link);
    }
  });
});

const nav = document.querySelector('.nav');
nav.addEventListener('mouseleave', () => {
  const active = document.querySelector('.nav a.active');
  if (active) updateNavPill(active);
});

navLinksArray.forEach(link => {
  link.addEventListener('mouseenter', function() {
    updateNavPill(this);
  });

  link.addEventListener('click', function(e) {
    navLinksArray.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    updateNavPill(this);
  });
});

// Initial active pill setup
const activeLink = document.querySelector('.nav a.active');
if (activeLink) {
  updateNavPill(activeLink);
}

// Loader animation
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('hidden');
    // Remove loader from DOM after transition
    setTimeout(() => {
      loader.remove();
    }, 500);
  }
});
