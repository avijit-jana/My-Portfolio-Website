<div align="center">
  <h1>👋 Welcome to My Digital Home!</h1>
  <p>🚀 <strong>Data Scientist | ML Engineer | AI Builder</strong></p>
  <p>Crafting intelligent systems that merge <strong>data science, MLOps, and scalable engineering</strong>.</p>

  <p>
    <a href="https://avijit-jana.github.io"><strong>🌐 Live Portfolio</strong></a> |
    <a href="https://linkedin.com/in/avijit-jana"><strong>💼 LinkedIn</strong></a> |
    <a href="https://github.com/avijit-jana"><strong>💻 GitHub</strong></a>
  </p>
</div>

---

Thanks for stopping by! This repository is my **"digital identity."** It’s a central hub where I showcase my work across Data Science, Machine Learning, and MLOps. Designed as a high-performance, responsive static website, it delivers a clean, modern experience that runs completely client-side.

## 🌌 What's Inside?

- **3D Neural Network Animation**: Built with **Three.js**, an interactive particle cloud simulates an interconnected neural network that responds directly to your cursor movement.
- **Data-Driven Projects Grid**: An interactive, real-time searchable and tag-filterable showcase powered by `projects.json`, rendering project cards dynamically without full page reloads.
- **Client-Side Contact & Grammar Assist**: Seamless, direct contact options with integrated client-side grammar correction powered by the LanguageTool API.
- **Dynamic Persona Typewriter**: Interactive headline and competency badges synchronized with dynamic typewriter effects.
- **Dark/Light Mode**: Smooth theme toggling with persistent preferences via `localStorage`.

## 🛠️ Tech Stack

This project is built purely as a **static web application** optimized for GitHub Pages:

| Layer | Technology | Details |
| --- | --- | --- |
| **Structure & Semantics** | HTML5 | Clean semantic markup, SEO meta tags, OpenGraph, JSON-LD schema |
| **Styling** | Vanilla CSS3 | Responsive layouts, CSS variables, glassmorphism, fluid typography |
| **Interactivity** | Vanilla JavaScript (ES Modules) | Client-side search, filtering, Three.js 3D visualization, grammar checking |
| **Data** | JSON | Client-side structured data for projects |
| **Hosting** | GitHub Pages | Zero-build static hosting with `.nojekyll` support |

## 📂 Project Structure

```
├── .nojekyll                 # Prevents Jekyll processing on GitHub Pages
├── .gitignore                # Git ignore configuration
├── index.html                # Main entry point
├── robots.txt                # Search engine crawler directives
├── sitemap.xml               # Canonical sitemap for SEO
├── assets/
│   ├── css/
│   │   └── style.css         # Main stylesheet
│   ├── js/
│   │   ├── main.js           # Core client-side application logic
│   │   ├── hero-animation.js # Three.js particle visualization
│   │   ├── grammer.js        # Client-side grammar checker integration
│   │   └── projects.json     # Project portfolio dataset
│   ├── images/               # Media assets and logos
│   └── My_Resume.pdf         # Resume document
└── README.md
```

## ⚡ Running Locally

Since this site is 100% static client-side web technology, you can run it with any static server:

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

![Badge](https://img.shields.io/badge/Developed%20By-Avijit_Jana-navy?style=for-the-badge)

</div>
