// assets/js/main.js
// ES module. Modern browsers supported by GitHub Pages.
import { fixGrammar } from './grammer.js';

// Responsibilities:
// - High-performance scroll tracking (progress bar + back-to-top via RAF compositor transform)
// - Layout-thrashing-free active navigation spy using IntersectionObserver
// - Fast projects loader with precomputed search index & DocumentFragment batch rendering
// - Visibility-aware dynamic hero greeting (pauses off-screen to preserve CPU/battery)
// - Mobile navigation with smooth anchor scrolling
// - Contact mailto & grammar helper with timeout safety

const PROJECTS_JSON = './assets/js/projects.json';
const MAX_PROJECTS_DISPLAY = 9; // 3x3 grid

let allProjects = [];

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initThemeToggle();
  initUnifiedScroll();
  initActiveNav();
  loadProjects();
  initContactForm();
  initDynamicGreeting();
  initFooterYear();
});

/* =============================================
   UNIFIED SCROLL & BACK-TO-TOP (RAF & COMPOSITOR OPTIMIZED)
   ============================================= */
function initUnifiedScroll() {
  const progressBar = document.getElementById('scrollProgress');
  const backToTopBtn = document.getElementById('backToTop');

  let isBackToTopVisible = false;
  let scrollTicking = false;

  function updateScrollState() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // 1. GPU-composited scroll progress bar (transform: scaleX)
    if (progressBar) {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollY / scrollHeight)) : 0;
      progressBar.style.transform = `scaleX(${progress})`;
    }

    // 2. Back-to-top button visibility (DOM updated only on state flip)
    if (backToTopBtn) {
      const shouldBeVisible = scrollY > 280;
      if (shouldBeVisible !== isBackToTopVisible) {
        isBackToTopVisible = shouldBeVisible;
        backToTopBtn.classList.toggle('visible', isBackToTopVisible);
      }
    }

    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateScrollState);
      scrollTicking = true;
    }
  }, { passive: true });

  // Initial call
  updateScrollState();

  // Smooth scroll back to top handler
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* =============================================
   ACTIVE NAV HIGHLIGHTING (INTERSECTION OBSERVER - ZERO REFLOW)
   ============================================= */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-list a');
  if (!sections.length || !navLinks.length) return;

  const linkMap = new Map();
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      linkMap.set(href.slice(1), link);
    }
  });

  let currentActiveId = '';

  function setActiveNav(id) {
    if (currentActiveId === id) return;
    currentActiveId = id;

    navLinks.forEach(link => link.classList.remove('active'));
    const targetLink = linkMap.get(id);
    if (targetLink) {
      targetLink.classList.add('active');
    }
  }

  if ('IntersectionObserver' in window) {
    // High-performance threshold detection without querying offsetTop/offsetHeight on scroll
    const observer = new IntersectionObserver((entries) => {
      // Find the most visible intersecting section
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    }, {
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
    });

    sections.forEach(section => observer.observe(section));
  }
}

/* =============================================
   FOOTER: Dynamic Current Year
   ============================================= */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* =============================================
   THEME ENFORCEMENT (DARK MODE ONLY)
   ============================================= */
function initThemeToggle() {
  document.body.classList.remove('theme-light');
  document.body.classList.add('theme-dark');
  try {
    localStorage.setItem('theme', 'theme-dark');
  } catch (_) {}

  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.style.display = 'none';
  }
}

/* =============================================
   NAV TOGGLE (mobile & smooth anchor scrolls)
   ============================================= */
function initNavToggle() {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('mainnav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    nav.classList.toggle('open');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !nav.contains(e.target)) {
      btn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    }
  });

  // Close menu and smooth scroll when clicking a link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        try {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        } catch (_) {
          // Fallback to default browser anchor behavior
        }
      }
      btn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    });
  });
}

/* =============================================
   CONTACT form handler
   ============================================= */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  const statusEl = document.createElement('div');
  statusEl.id = 'formStatus';
  statusEl.style.marginTop = '1rem';
  statusEl.style.padding = '0.75rem';
  statusEl.style.borderRadius = '8px';
  statusEl.style.display = 'none';
  if (form) form.appendChild(statusEl);

  function showStatus(msg, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.display = 'block';
    statusEl.style.backgroundColor = isError ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)';
    statusEl.style.color = isError ? '#f87171' : '#4ade80';
    statusEl.style.border = `1px solid ${isError ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`;
    
    setTimeout(() => {
      if (statusEl) statusEl.style.display = 'none';
    }, 5000);
  }

  window.handleContact = function (e) {
    e.preventDefault();
    const formEl = e.target;
    if (!formEl) return;

    const name = formEl.name ? formEl.name.value.trim() : '';
    const email = formEl.email ? formEl.email.value.trim() : '';
    const message = formEl.message ? formEl.message.value.trim() : '';

    if (!name || !email || !message) {
      showStatus('Please complete all fields.', true);
      return;
    }

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoUrl = `mailto:avijitjanascience24@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;
    showStatus('Opening your email client to send the message...', false);
    formEl.reset();
  };

  const fixBtn = document.getElementById('fixGrammarBtn');
  const messageArea = document.getElementById('message');
  if (fixBtn && messageArea) {
    fixBtn.addEventListener('click', async () => {
      const originalText = messageArea.value.trim();
      if (!originalText) return;

      fixBtn.disabled = true;
      const originalBtnText = fixBtn.innerHTML;
      fixBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Fixing...';

      try {
        const corrected = await fixGrammar(originalText);
        if (corrected && !corrected.startsWith('Error:')) {
          messageArea.value = corrected;
          fixBtn.innerHTML = '<i class="fa-solid fa-check"></i> Fixed!';
          setTimeout(() => {
            fixBtn.innerHTML = originalBtnText;
            fixBtn.disabled = false;
          }, 2000);
        } else {
          throw new Error(corrected || 'Correction failed');
        }
      } catch (err) {
        console.warn('Grammar fix note:', err.message);
        fixBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error';
        setTimeout(() => {
          fixBtn.innerHTML = originalBtnText;
          fixBtn.disabled = false;
        }, 2000);
      }
    });
  }
}

/* =============================================
   PROJECTS: load, render, filter
   ============================================= */
async function loadProjects() {
  try {
    const res = await fetch(PROJECTS_JSON);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      allProjects = [];
    } else {
      // Precompute normalized search index on each project for instantaneous search
      allProjects = data.map(p => ({
        ...p,
        _search: [
          p.title || '',
          p.description || '',
          ...(p.tech || []),
          ...(p.domains || [])
        ].join(' ').toLowerCase()
      }));
    }

    renderProjects(allProjects.slice(0, MAX_PROJECTS_DISPLAY));
    buildTagFilters(allProjects);
    initProjectSearch();
    updateProjectsInfo(allProjects.length, Math.min(MAX_PROJECTS_DISPLAY, allProjects.length));
  } catch (err) {
    console.error('Failed to load projects:', err);
    const grid = document.getElementById('projectsGrid');
    if (grid) {
      grid.innerHTML = '<p class="no-results">Failed to load projects. Please try again later.</p>';
    }
  }
}

/* RENDER PROJECTS: DocumentFragment Batch Insertion */
function renderProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  grid.innerHTML = '';

  if (!Array.isArray(projects) || !projects.length) {
    grid.innerHTML = `
      <div class="no-results">
        <i class="fa-solid fa-search" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p>No projects found matching your search.</p>
        <button class="btn secondary" onclick="clearSearch()">Clear Search</button>
      </div>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();

  projects.forEach((p, index) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.tabIndex = 0;
    card.style.animationDelay = `${index * 0.04}s`;
    
    const imgSrc = p.image || './assets/images/placeholder-project.png';
    const linkUrl = p.url || p.repo || '#';
    const targetAttr = p.external ? '_blank' : '_self';

    card.innerHTML = `
      <a class="project-media" href="${linkUrl}" aria-label="${escapeHtml(p.title)} - open project" target="${targetAttr}" rel="noopener">
        <img loading="${index < 3 ? 'eager' : 'lazy'}" width="400" height="225" decoding="async" alt="${escapeHtml(p.imageAlt || p.title)}" src="${imgSrc}" onerror="this.onerror=null;this.src='./assets/images/placeholder-project.png';" />
      </a>
      <div class="project-body">
        <div class="project-title-row">
          <i class="fa-brands fa-github repo-mark" aria-hidden="true"></i>
          <h3><a href="${linkUrl}" target="${targetAttr}" rel="noopener">${escapeHtml(p.title)}</a></h3>
        </div>
        <p class="proj-desc">${escapeHtml(p.description)}</p>
        <div class="project-meta">
          <div class="tags">${(p.tech || []).slice(0, 3).map(t =>
      `<button class="tag" data-tag="${escapeHtml(t)}" aria-label="Filter by ${escapeHtml(t)}"><span class="tag-dot"></span>${escapeHtml(t)}</button>`
    ).join('')}</div>
          <div class="proj-links">
            ${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener" aria-label="View source repo"><i class="fa-brands fa-github"></i></a>` : ''}
            ${p.url && p.url !== p.repo ? `<a href="${p.url}" target="_blank" rel="noopener" aria-label="Open project demo"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
          </div>
        </div>
      </div>
    `;
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);

  // Attach event delegation for tag clicks once to prevent listener leaks
  if (!grid.dataset.listenerAttached) {
    grid.addEventListener('click', e => {
      const t = e.target.closest('.tag');
      if (t && t.dataset.tag) {
        e.preventDefault();
        applyTagFilter(t.dataset.tag);
      }
    });
    grid.dataset.listenerAttached = 'true';
  }
}

/* Build tag filter UI from project list */
function buildTagFilters(projects) {
  if (!Array.isArray(projects)) return;
  const unique = new Set(projects.flatMap(p => p.tech || []));
  const container = document.getElementById('tagFilters');
  if (!container) return;

  container.innerHTML = '';
  const fragment = document.createDocumentFragment();

  // Show top 6 tags
  const sortedTags = Array.from(unique).sort().slice(0, 6);

  sortedTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'tag';
    btn.innerHTML = `<span class="tag-dot"></span>${escapeHtml(tag)}`;
    btn.setAttribute('data-tag', tag);
    btn.type = 'button';
    btn.addEventListener('click', () => applyTagFilter(tag));
    fragment.appendChild(btn);
  });

  container.appendChild(fragment);
}

/* Apply tag filter: toggles tag active state and filters grid */
function applyTagFilter(tag) {
  const search = document.getElementById('project-search');
  if (search) {
    const isAlreadyActive = search.value.trim().toLowerCase() === tag.toLowerCase();
    const newQuery = isAlreadyActive ? '' : tag;
    search.value = newQuery;
    filterProjects(newQuery);

    const tagBtns = document.querySelectorAll('.tag-filters .tag');
    tagBtns.forEach(btn => {
      btn.classList.toggle('active', !isAlreadyActive && btn.dataset.tag === tag);
    });
  }
}

/* Clear search */
window.clearSearch = function () {
  const search = document.getElementById('project-search');
  if (search) {
    search.value = '';
    filterProjects('');
  }
  const tagBtns = document.querySelectorAll('.tag-filters .tag');
  tagBtns.forEach(btn => btn.classList.remove('active'));
};

/* Project search input handler (debounced) */
function initProjectSearch() {
  const input = document.getElementById('project-search');
  if (!input) return;

  let debounceTimer = null;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      filterProjects(input.value);
      const val = input.value.trim().toLowerCase();
      const tagBtns = document.querySelectorAll('.tag-filters .tag');
      tagBtns.forEach(btn => {
        btn.classList.toggle('active', Boolean(val && btn.dataset.tag && btn.dataset.tag.toLowerCase() === val));
      });
    }, 180);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      clearTimeout(debounceTimer);
      filterProjects(input.value);
      const val = input.value.trim().toLowerCase();
      const tagBtns = document.querySelectorAll('.tag-filters .tag');
      tagBtns.forEach(btn => {
        btn.classList.toggle('active', Boolean(val && btn.dataset.tag && btn.dataset.tag.toLowerCase() === val));
      });
    }
  });
}

/* High-speed Filter using precomputed index */
function filterProjects(query = '') {
  const normalized = (query || '').trim().toLowerCase();

  let filtered;
  if (normalized && Array.isArray(allProjects)) {
    filtered = allProjects.filter(p => p._search.includes(normalized));
  } else {
    filtered = allProjects || [];
  }

  const displayed = filtered.slice(0, MAX_PROJECTS_DISPLAY);
  renderProjects(displayed);
  updateProjectsInfo(filtered.length, displayed.length, normalized);
}

/* Update projects info text */
function updateProjectsInfo(total = 0, shown = 0, searchTerm = '') {
  const infoEl = document.getElementById('projectsInfo');
  if (!infoEl) return;

  if (searchTerm) {
    infoEl.innerHTML = `<span>Showing ${shown} of ${total} matching projects</span>`;
  } else {
    infoEl.innerHTML = `<span>Showing ${shown} of ${total} projects</span>`;
  }
}

/* =============================================
   UTILITY FUNCTIONS
   ============================================= */
function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}

/* =============================================
   DYNAMIC TYPEWRITER (VISIBILITY AWARE - ZERO BACKGROUND LOAD)
   ============================================= */
function initDynamicGreeting() {
  const nounEl = document.getElementById('dynamic-noun');
  if (!nounEl) return;

  const phrases = [
    { noun: "Production MLOps", color: "#3b82f6", badgeIndex: 0 },
    { noun: "RAG & LLM Architect", color: "#a855f7", badgeIndex: 1 },
    { noun: "Cloud AI Infrastructure", color: "#22c55e", badgeIndex: 2 },
    { noun: "Autonomous Agents", color: "#06b6d4", badgeIndex: 1 },
    { noun: "Scalable Data Systems", color: "#3b82f6", badgeIndex: 0 },
  ];

  const typeSpeed = 70;
  const deleteSpeed = 35;
  const pauseAfterType = 2400;
  const pauseBeforeDelete = 400;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;
  let typeTimer = null;
  let isHeroVisible = true;

  // Set up DOM: typewriter text + block cursor
  nounEl.innerHTML = '<span class="typewriter-text"></span><span class="block-cursor"></span>';
  const textEl = nounEl.querySelector('.typewriter-text');
  if (!textEl) return;

  const badgeGrid = document.getElementById('heroBadgeGrid');

  syncPhrase(0);

  function syncPhrase(index) {
    const phrase = phrases[index];
    if (!phrase) return;

    nounEl.style.color = phrase.color;

    if (badgeGrid) {
      const badges = badgeGrid.querySelectorAll('.hero-badge-item');
      badges.forEach((badge, i) => {
        badge.classList.toggle('active', i === phrase.badgeIndex);
      });
    }
  }

  function typeWriter() {
    clearTimeout(typeTimer);

    // If hero is scrolled out of view or tab is hidden, stop running
    if (!isHeroVisible || document.hidden) {
      return;
    }

    if (!textEl) return;
    const currentPhrase = phrases[phraseIndex];
    if (!currentPhrase) return;

    if (isPaused) return;

    if (!isDeleting) {
      if (charIndex < currentPhrase.noun.length) {
        textEl.textContent = currentPhrase.noun.substring(0, charIndex + 1);
        charIndex++;
        typeTimer = setTimeout(typeWriter, typeSpeed);
      } else {
        isPaused = true;
        typeTimer = setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          typeTimer = setTimeout(typeWriter, pauseBeforeDelete);
        }, pauseAfterType);
      }
    } else {
      if (charIndex > 0) {
        textEl.textContent = currentPhrase.noun.substring(0, charIndex - 1);
        charIndex--;
        typeTimer = setTimeout(typeWriter, deleteSpeed);
      } else {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        syncPhrase(phraseIndex);
        typeTimer = setTimeout(typeWriter, typeSpeed);
      }
    }
  }

  // IntersectionObserver to pause typewriter when hero is off-screen
  const heroSection = document.querySelector('.hero-section');
  if ('IntersectionObserver' in window && heroSection) {
    const observer = new IntersectionObserver((entries) => {
      isHeroVisible = entries[0].isIntersecting;
      if (isHeroVisible && !document.hidden) {
        typeWriter();
      } else {
        clearTimeout(typeTimer);
      }
    }, { threshold: 0.05 });
    observer.observe(heroSection);
  }

  // Page visibility to pause when browser tab is inactive
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(typeTimer);
    } else if (isHeroVisible) {
      typeWriter();
    }
  }, { passive: true });

  typeWriter();
}
