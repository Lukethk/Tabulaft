// Force scroll to top on reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

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

// Hero card 3D tilt animation
const heroSection = document.querySelector('.hero');
const heroCard = document.querySelector('.hero-card');
const sparkOne = document.querySelector('.spark.one');
const sparkTwo = document.querySelector('.spark.two');

if (heroSection && heroCard) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Tilt the card
    const rotateX = (y / rect.height) * -20;
    const rotateY = (x / rect.width) * 20;
    
    heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    
    // Move the sparks for parallax depth using CSS vars
    if (sparkOne) {
      sparkOne.style.setProperty('--mouse-x', `${x * 0.05}px`);
      sparkOne.style.setProperty('--mouse-y', `${y * 0.05}px`);
    }
    if (sparkTwo) {
      sparkTwo.style.setProperty('--mouse-x', `${x * -0.05}px`);
      sparkTwo.style.setProperty('--mouse-y', `${y * -0.05}px`);
    }
  });

  heroSection.addEventListener('mouseleave', () => {
    heroCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    if (sparkOne) {
      sparkOne.style.setProperty('--mouse-x', '0px');
      sparkOne.style.setProperty('--mouse-y', '0px');
    }
    if (sparkTwo) {
      sparkTwo.style.setProperty('--mouse-x', '0px');
      sparkTwo.style.setProperty('--mouse-y', '0px');
    }
  });
}

// Custom Cursor Logic with Trail
const cursor = document.getElementById('custom-cursor');
const cursorTrail = document.getElementById('cursor-trail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

if (cursor && cursorTrail) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.2;
    trailY += (mouseY - trailY) * 0.2;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  const hoverElements = document.querySelectorAll('a, button, .hero-button, .upload-button, .work');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorTrail.classList.add('hidden'); // Optional: hide trail on hover
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorTrail.classList.remove('hidden');
    });
  });
}

// Parallax Scroll Value
window.addEventListener('scroll', () => {
  document.body.style.setProperty('--scroll', window.pageYOffset);
});


// Text Animation Logic
function splitTextIntoSpans(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeValue.trim() !== '') {
      textNodes.push(node);
    }
  }

  let wordIndex = 0;
  textNodes.forEach(textNode => {
    const text = textNode.nodeValue;
    const words = text.split(/(\s+)/);
    const fragment = document.createDocumentFragment();
    
    words.forEach(word => {
      if (word.trim() !== '') {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word;
        span.style.animationDelay = `${wordIndex * 0.05}s`;
        fragment.appendChild(span);
        wordIndex++;
      } else {
        fragment.appendChild(document.createTextNode(word));
      }
    });
    textNode.parentNode.replaceChild(fragment, textNode);
  });
}

const textObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("start-jump");
        textObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
);

document.querySelectorAll('.animate-text').forEach(el => {
  splitTextIntoSpans(el);
  textObserver.observe(el);
});
