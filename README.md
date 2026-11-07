<div align="center">
  <h1>👋 Welcome to My Digital Home!</h1>
  <p>🚀 <strong>AI &amp; MLOps Engineer | Data Scientist | Problem Solver</strong></p>
  <p>Engineering production-grade machine learning pipelines, scalable AI architectures, and data-driven solutions.</p>

  <p>
    <a href="https://avijit-jana.github.io"><strong>🌐 Live Portfolio</strong></a> |
    <a href="https://linkedin.com/in/avijit-jana"><strong>💼 LinkedIn</strong></a> |
    <a href="https://github.com/avijit-jana"><strong>💻 GitHub</strong></a>
  </p>
</div>

---

Thanks for stopping by! This repository is my **"digital identity."** It’s a central hub where I showcase my work across Artificial Intelligence, Machine Learning, and MLOps. Engineered as an ultra-high-performance, responsive static website, it delivers a modern Bento Grid aesthetic that runs completely client-side with zero backend dependencies.

## 🌌 What's Inside?

- **Zero-Allocation 3D WebGL Particle System**: Built with **Three.js**, an interactive particle cloud simulates a dynamic neural network that reacts to cursor interaction. Engineered with preallocated single buffers (`DynamicDrawUsage`, `setDrawRange`), zero garbage collection churn, and automatic pausing via `IntersectionObserver` and the Page Visibility API for buttery 60/120 FPS rendering.
- **Refactored High-Impact Hero Showcase**: Features a live pulsing green availability indicator, bold technical title (*"AI & MLOps Engineer"*), WCAG AAA compliant text contrast (`#cbd5e1`), uniform `44px` non-wrapping skill pills, vibrant primary CTA, and an immovable, untakable portrait card encased in a dual-frequency ambient cyan/indigo radial glow.
- **Ultra-Smooth GPU Compositing**: Replaced viewport-repainting fixed backgrounds with an isolated compositor pseudo-element, converted scroll progress tracking to GPU-accelerated `transform: scaleX(...)`, and leveraged CSS `content-visibility: auto` to bypass rendering offscreen DOM nodes until approached.
- **Pre-Indexed Projects Grid**: Interactive, instant search and tag-filterable showcase powered by `projects.json`, rendering project cards dynamically in a single batch using `DocumentFragment` with automatic image fallback handlers.
- **Streamlined Navigation**: Focused 4-section anchor navigation (`About`, `Skills`, `Projects`, `Contact`) with a reflow-free `IntersectionObserver` scroll spy.
- **Client-Side Contact & Grammar Assist**: Direct contact options with client-side grammar correction powered by the LanguageTool API, protected by an 8-second timeout and bounded LRU caching.
- **Pure Dark Modernist Bento Aesthetic**: Operates in a dark slate canvas (`#090d16` to `#0f172a`) with translucent frosted surfaces (`backdrop-filter: blur(12px)`), electric indigo (`#6366f1`), and cyan (`#06b6d4`) accents.

## 🛠️ Tech Stack

This project is built purely as a **static web application** optimized for GitHub Pages:

| Layer                     | Technology                      | Details                                                                    |
| ------------------------- | ------------------------------- | -------------------------------------------------------------------------- |
| **Structure & Semantics** | HTML5                           | Clean semantic markup, SEO meta tags, OpenGraph, JSON-LD schema            |
| **Styling**               | Vanilla CSS3                    | Bento grid architecture, CSS tokens, glassmorphism, GPU-accelerated transforms |
| **Interactivity**         | Vanilla JavaScript (ES Modules) | Client-side search, Three.js 3D WebGL visualization, grammar checking     |
| **Data**                  | JSON                            | Client-side structured data for projects (`projects.json`)                 |
| **Hosting**               | GitHub Pages                    | Zero-build static hosting with `.nojekyll` support                         |

## 📂 Project Structure

```
├── .nojekyll                 # Prevents Jekyll processing on GitHub Pages
├── .gitignore                # Git ignore configuration
├── index.html                # Main entry point & semantic markup
├── robots.txt                # Search engine crawler directives
├── sitemap.xml               # Canonical sitemap for SEO
├── assets/
│   ├── css/
│   │   └── style.css         # Bento Grid Modernist stylesheet
│   ├── js/
│   │   ├── main.js           # Core client-side app logic & scroll spy
│   │   ├── hero-animation.js # Three.js zero-GC particle visualization
│   │   ├── grammer.js        # Client-side grammar checker with timeout
│   │   └── projects.json     # Project portfolio dataset
│   ├── images/               # Media assets, brand logo, and portrait
│   └── My_Resume.pdf         # Professional resume document
├── Changes/                  # Version change logs & refactoring notes
├── CODE_OF_CONDUCT.md        # Community guidelines & code etiquette
├── SECURITY.md               # Vulnerability reporting & security policy
└── README.md                 # Project documentation
```

## ⚡ Running Locally

Since this site is 100% static client-side web technology, you can preview it with any local static HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node (npx)
npx serve .

# Or using VS Code Live Server extension
```

Then visit `http://localhost:8000` in your web browser.

## ☁️ Deployment

This repository is configured for deployment to **GitHub Pages**:

1. Push this repository to GitHub on the `main` branch.
2. In your repository settings, navigate to **Settings > Pages**.
3. Under **Build and deployment > Source**, select **Deploy from a branch**.
4. Choose the `main` branch and `/ (root)` folder, then click **Save**.
5. The `.nojekyll` file at the root ensures GitHub Pages serves all assets directly without Jekyll preprocessing.

---

<div align="center">

[![Developed by Avijit Jana](https://img.shields.io/badge/DEVELOPED%20BY-AVIJIT%20JANA-0938BD?style=for-the-badge&logo=github&logoColor=white)](https://github.com/avijit-jana)

</div>
