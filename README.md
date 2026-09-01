# 🎓 AI Student Portfolio Website with 3D Three.js Interactive Guide

A modern, responsive, and futuristic student portfolio website featuring an interactive **Three.js 3D Student/AI Companion ("Aero")** who gestures, reacts, and explains each section as you scroll down the page.

---

## 🚀 Features

- **🤖 3D Interactive Student Avatar (`Three.js`)**:
  - Procedurally modeled 3D Student Robot featuring a graduation cap, swaying tassel, glowing cyber visor, digital eyes, holographic AI core, and articulated gesturing arms.
  - Accompanied by a floating satellite drone companion (**Orb-E**) and a dynamic neural particle constellation background.
  - Interactive mouse parallax (character looks towards cursor) and idle floating physics.
- **💬 Scroll-Triggered Contextual Explanations**:
  - As you scroll through sections (**Hero**, **About**, **Skills**, **Projects**, **Timeline**, **Contact**), the 3D character smoothly transitions between poses and narrates insights via an interactive HUD dialogue bubble.
- **🔊 Speech Narration (TTS)**:
  - Optional browser-native Text-To-Speech audio toggle button allowing visitors to hear the companion talk.
- **✨ Sections & Content**:
  - **Hero**: Student headline, quick stats counters (GPA, projects, commits, hackathons).
  - **About Me**: Academic background, research focus (LLMs, RAG, Vision), student philosophy.
  - **Skills Matrix**: Categorized tech stacks (Deep Learning, Programming Languages, Web & 3D, Dev Tools).
  - **Featured Projects**: Showcase cards with live demo / GitHub links and tag pills.
  - **Roadmap & Timeline**: Academic track, internships, hackathon victories, certifications.
  - **Interactive Contact**: Form with instant visual feedback and social profile links.
- **💎 Glassmorphism UI**:
  - Built with clean HTML5, CSS3 variables, glassmorphism cards, and Lucide icons.
  - Fully responsive for mobile, tablet, and widescreen displays.

---

## 📁 File Structure

```
C:\Develop\ai-website\
├── index.html       # Semantic HTML5 layout & section structures
├── style.css        # Futuristic dark glassmorphism styling & animations
├── avatar3d.js      # Three.js 3D student model, lighting, particles & animations
├── main.js          # Scroll detection, TTS narration, dialogue controller
└── README.md        # Project overview and customization guide
```

---

## 🌐 How to Run the Website

### Option 1: Direct Browser Launch
Simply double-click [`index.html`](file:///C:/Develop/ai-website/index.html) or right-click and choose **Open with > Chrome / Edge / Firefox**.

### Option 2: Local HTTP Server (Recommended)
You can run a lightweight local server from PowerShell or terminal:

```powershell
# Using Python
cd C:\Develop\ai-website
python -m http.server 8000

# Open http://localhost:8000 in your browser
```

---

## 🎨 How to Customize

1. **Change Name & Bio**: Open [`index.html`](file:///C:/Develop/ai-website/index.html) and search for `Adithya` to replace with your name, bio, links, and university details.
2. **Add / Edit Projects**: Modify the `<article class="project-card">` elements in `index.html` with your custom project titles, descriptions, and GitHub links.
3. **Customize 3D Guide Speeches**: Open [`main.js`](file:///C:/Develop/ai-website/main.js) and update the `sectionExplanations` object with any custom dialogue you'd like your 3D student companion to say.
