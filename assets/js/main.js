// assets/js/main.js
// ES module. Modern browsers supported by GitHub Pages.
import { fixGrammar } from './grammer.js';
// Responsibilities:
// - Load projects.json and render filterable/sortable 3x3 project grid (max 9 shown)
// - Lightweight accessibility helpers, smooth browsing, and floating back-to-top tool
// - Contact mailto handler

const PROJECTS_JSON = './assets/js/projects.json';
const MAX_PROJECTS_DISPLAY = 9; // 3x3 grid

let allProjects = [];

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initThemeToggle();
  initScrollProgress();
  initActiveNav();
  loadProjects();
  initContactForm();
  initDynamicGreeting();
  initFooter();
});

/* =============================================
   SCROLL PROGRESS BAR (OPTIMIZED)
   ============================================= */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });
}

/* =============================================
   ACTIVE NAV HIGHLIGHTING (SMOOTH SCROLL SPY)
   ============================================= */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-list a');
  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120; // Offset for header height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* =============================================
   FOOTER: Date and Floating Back to Top Tool
   ============================================= */
function initFooter() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    const toggleBackToTop = () => {
      if (window.scrollY > 280) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

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

function updateThemeIcon(btn) {
  if (!btn) return;
  btn.style.display = 'none';
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
    const res = await fetch(PROJECTS_JSON, { cache: 'no-cache' });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    allProjects = await res.json();
    if (!Array.isArray(allProjects)) {
      allProjects = [];
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

/* RENDER PROJECTS: 3x3 GitHub Style Cards */
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

  projects.forEach((p, index) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.tabIndex = 0;
    card.style.animationDelay = `${index * 0.04}s`;
    card.innerHTML = `
      <a class="project-media" href="${p.url || p.repo || '#'}" aria-label="${escapeHtml(p.title)} - open project" target="${p.external ? '_blank' : '_self'}" rel="noopener">
        <img loading="${index < 3 ? 'eager' : 'lazy'}" width="400" height="225" decoding="async" alt="${escapeHtml(p.imageAlt || p.title)}" src="${p.image || './assets/images/placeholder-project.png'}" />
      </a>
      <div class="project-body">
        <div class="project-title-row">
          <i class="fa-brands fa-github repo-mark" aria-hidden="true"></i>
          <h3><a href="${p.url || p.repo || '#'}" target="${p.external ? '_blank' : '_self'}" rel="noopener">${escapeHtml(p.title)}</a></h3>
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
    grid.appendChild(card);
  });

  // Attach event delegation for tag clicks once to prevent listener leaks
  if (!grid.dataset.listenerAttached) {
    grid.addEventListener('click', e => {
      const t = e.target.closest('.tag');
      if (t) {
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

  // Only show top 6 tags to keep it clean
  const sortedTags = Array.from(unique).sort().slice(0, 6);

  sortedTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'tag';
    btn.innerHTML = `<span class="tag-dot"></span>${escapeHtml(tag)}`;
    btn.setAttribute('data-tag', tag);
    btn.type = 'button';
    btn.addEventListener('click', () => applyTagFilter(tag));
    container.appendChild(btn);
  });
}

/* Apply tag filter: highlights tag and filters grid */
function applyTagFilter(tag) {
  const search = document.getElementById('project-search');
  if (search) {
    search.value = tag;
    filterProjects(tag);
  }
}

/* Clear search */
window.clearSearch = function () {
  const search = document.getElementById('project-search');
  if (search) {
    search.value = '';
    filterProjects('');
  }
};

/* Project search input handler */
function initProjectSearch() {
  const input = document.getElementById('project-search');
  if (!input) return;

  let debounceTimer;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      filterProjects(input.value);
    }, 200);
  });

  // Allow Enter key to search
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      filterProjects(input.value);
    }
  });
}

/* Filter logic - shows max 9 matching projects in 3x3 grid */
function filterProjects(query = '') {
  const normalized = (query || '').trim().toLowerCase();

  let filtered;
  if (normalized && Array.isArray(allProjects)) {
    filtered = allProjects.filter(p => {
      const hay = [p.title, p.description, ...(p.tech || []), ...(p.domains || [])].join(' ').toLowerCase();
      return hay.includes(normalized);
    });
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
   DYNAMIC TYPEWRITER: Block cursor, synced badges & sub-headline
   ============================================= */
function initDynamicGreeting() {
  const nounEl = document.getElementById('dynamic-noun');
  if (!nounEl) return;

  // Phrase config: noun, color, subtitle, active badge index
  const phrases = [
    {
      noun: "Data Scientist",
      color: "#3b82f6",
      subtitle: "Building production-ready ML systems and data-driven insights.",
      badgeIndex: 0,
      badgeIcon: "fa-solid fa-brain",
      badgeText: "End-to-End MLOps"
    },
    {
      noun: "ML Engineer",
      color: "#a855f7",
      subtitle: "Designing scalable machine learning pipelines for production.",
      badgeIndex: 1,
      badgeIcon: "fa-solid fa-robot",
      badgeText: "RAG & LLM Apps"
    },
    {
      noun: "Problem Solver",
      color: "#22c55e",
      subtitle: "Turning complex data challenges into measurable business value.",
      badgeIndex: 2,
      badgeIcon: "fa-solid fa-cloud",
      badgeText: "AWS Cloud"
    },
    {
      noun: "Agent Builder",
      color: "#f97316",
      subtitle: "Building autonomous AI agents for complex workflows.",
      badgeIndex: 0,
      badgeIcon: "fa-solid fa-robot",
      badgeText: "Agent Builder"
    },
    {
      noun: "Data Analyst",
      color: "#3b82f6",
      subtitle: "Transforming complex data into actionable business insights.",
      badgeIndex: 0,
      badgeIcon: "fa-solid fa-chart-line",
      badgeText: "Data Visualization"
    },
  ];

  const typeSpeed = 70;
  const deleteSpeed = 35;
  const pauseAfterType = 2500;
  const pauseBeforeDelete = 400;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  // Set up DOM: typewriter text + block cursor
  nounEl.innerHTML = '<span class="typewriter-text"></span><span class="block-cursor"></span>';
  const textEl = nounEl.querySelector('.typewriter-text');
  if (!textEl) return;

  const subtitleEl = document.getElementById('heroSubtitle');
  const badgeGrid = document.getElementById('heroBadgeGrid');

  // Initially sync to first phrase
  syncPhrase(0);

  function syncPhrase(index) {
    const phrase = phrases[index];
    if (!phrase) return;

    // Update accent color
    nounEl.style.color = phrase.color;

    // Sync subtitle with fade effect
    if (subtitleEl) {
      subtitleEl.style.opacity = '0';
      subtitleEl.style.transform = 'translateY(10px)';
      setTimeout(() => {
        if (subtitleEl) {
          subtitleEl.textContent = phrase.subtitle;
          subtitleEl.style.opacity = '1';
          subtitleEl.style.transform = 'translateY(0)';
        }
      }, 200);
    }

    // Sync badge grid — highlight active, update icon+text
    if (badgeGrid) {
      const badges = badgeGrid.querySelectorAll('.hero-badge-item');
      badges.forEach((badge, i) => {
        badge.classList.remove('active');
        if (i === phrase.badgeIndex) {
          badge.classList.add('active');
          const icon = badge.querySelector('i');
          const span = badge.querySelector('span');
          if (icon) icon.className = phrase.badgeIcon;
          if (span) span.textContent = phrase.badgeText;
        }
      });
    }
  }

  function typeWriter() {
    if (!textEl) return;
    const currentPhrase = phrases[phraseIndex];
    if (!currentPhrase) return;

    if (isPaused) return;

    if (!isDeleting) {
      if (charIndex < currentPhrase.noun.length) {
        textEl.textContent = currentPhrase.noun.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeWriter, typeSpeed);
      } else {
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          setTimeout(typeWriter, pauseBeforeDelete);
        }, pauseAfterType);
      }
    } else {
      if (charIndex > 0) {
        textEl.textContent = currentPhrase.noun.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(typeWriter, deleteSpeed);
      } else {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        syncPhrase(phraseIndex);
        setTimeout(typeWriter, typeSpeed);
      }
    }
  }

  typeWriter();
}
