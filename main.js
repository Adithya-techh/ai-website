/**
 * main.js
 * Main Controller for AI Student Portfolio
 * Handles Scroll Detection, 3D Guide Narration, Audio TTS, and UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const speechTextElem = document.getElementById('guide-speech-text');
  const sectionBadgeElem = document.getElementById('current-section-badge');
  const guideStatusElem = document.getElementById('guide-status-text');
  const ttsBtn = document.getElementById('tts-toggle-btn');
  const ttsIcon = document.getElementById('tts-icon');
  const minimizeBtn = document.getElementById('guide-minimize-btn');
  const guideCard = document.querySelector('.guide-card');
  const prevBtn = document.getElementById('prev-section-btn');
  const nextBtn = document.getElementById('next-section-btn');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const contactForm = document.getElementById('portfolio-contact-form');
  const formFeedback = document.getElementById('form-feedback');

  // Section Narrations and Explanations
  const sectionExplanations = {
    hero: {
      name: 'Overview',
      speech: "Welcome to my portfolio! 👋 I'm Aero, Adithya's 3D AI companion. Scroll down and I'll walk you through his AI projects, academic journey, and technical skills!"
    },
    about: {
      name: 'About Me',
      speech: "Meet Adithya! 🎓 A passionate B.Tech Computer Science & AI student exploring Deep Learning, Computer Vision, and full-stack software architectures."
    },
    skills: {
      name: 'Technical Skills',
      speech: "Here is the technical toolkit! ⚡ From PyTorch and YOLOv8 to Three.js WebGL and Cloud deployments, built for high-performance intelligent computing."
    },
    projects: {
      name: 'Featured Projects',
      speech: "Check out these featured AI projects! 🚀 Real-time gesture recognition, RAG research assistants, autonomous simulation, and health diagnostic CNNs."
    },
    experience: {
      name: 'Timeline & Awards',
      speech: "Adithya's milestones! 🏆 Hackathon 1st place victories, AI research internships, top academic GPA, and certifications from DeepLearning.AI & Google Cloud."
    },
    contact: {
      name: 'Get In Touch',
      speech: "Looking for an enthusiastic AI engineering intern or project collaborator? 📬 Drop a message below or connect via LinkedIn and GitHub!"
    }
  };

  const sectionOrder = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];
  let currentSectionIndex = 0;
  let isTTSActive = false;
  let typewriterTimeout = null;

  // Initialize Speech Synthesis support
  const synth = window.speechSynthesis;

  function speakText(text) {
    if (!isTTSActive || !synth) return;
    synth.cancel(); // Stop ongoing speech

    const cleanText = text.replace(/[\u{1F300}-\u{1FAFF}]/gu, ''); // Strip emojis for cleaner voice
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.1;

    // Pick best English voice if available
    const voices = synth.getVoices();
    const voice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Zira')));
    if (voice) utterance.voice = voice;

    synth.speak(utterance);
  }

  // Typewriter effect for speech bubble
  function typeWriterEffect(text, element, speed = 18) {
    if (typewriterTimeout) clearTimeout(typewriterTimeout);
    element.innerHTML = '';
    let i = 0;

    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        typewriterTimeout = setTimeout(type, speed);
      }
    }
    type();
  }

  // Update guide state for section
  function updateGuideSection(sectionId) {
    const data = sectionExplanations[sectionId];
    if (!data) return;

    currentSectionIndex = sectionOrder.indexOf(sectionId);

    // Update 3D avatar pose
    if (window.globalAvatarScene) {
      window.globalAvatarScene.setSectionPose(sectionId);
    }

    // Update HUD text & badge
    if (sectionBadgeElem) {
      sectionBadgeElem.textContent = `Section: ${data.name}`;
    }

    if (speechTextElem) {
      typeWriterEffect(`"${data.speech}"`, speechTextElem);
    }

    // Speak text if TTS is enabled
    speakText(data.speech);

    // Update active nav link
    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Intersection Observer for scroll spy
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (id && sectionExplanations[id]) {
          updateGuideSection(id);
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });

  // TTS Voice Toggle
  if (ttsBtn) {
    ttsBtn.addEventListener('click', () => {
      isTTSActive = !isTTSActive;
      ttsBtn.classList.toggle('active', isTTSActive);
      
      if (isTTSActive) {
        ttsBtn.setAttribute('title', 'Voice Narration Enabled (Click to Mute)');
        const currentSecId = sectionOrder[currentSectionIndex];
        speakText(sectionExplanations[currentSecId].speech);
      } else {
        ttsBtn.setAttribute('title', 'Voice Narration Disabled (Click to Enable)');
        if (synth) synth.cancel();
      }
    });
  }

  // Minimize Guide HUD Toggle
  if (minimizeBtn && guideCard) {
    minimizeBtn.addEventListener('click', () => {
      guideCard.classList.toggle('minimized');
      const isMin = guideCard.classList.contains('minimized');
      const minIcon = document.getElementById('minimize-icon');
      if (minIcon) {
        minIcon.setAttribute('data-lucide', isMin ? 'chevron-up' : 'chevron-down');
        lucide.createIcons();
      }
    });
  }

  // Next & Prev Section Controls
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentSectionIndex > 0) {
        const targetId = sectionOrder[currentSectionIndex - 1];
        const elem = document.getElementById(targetId);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentSectionIndex < sectionOrder.length - 1) {
        const targetId = sectionOrder[currentSectionIndex + 1];
        const elem = document.getElementById(targetId);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Mobile Navigation Drawer Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Contact Form Submission (Interactive Simulation)
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submit-btn');
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span> <i data-lucide="loader-2" class="spin-icon"></i>`;
        lucide.createIcons();
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Message Sent!</span> <i data-lucide="check"></i>`;
          lucide.createIcons();
        }

        if (formFeedback) {
          formFeedback.className = 'form-feedback-msg success';
          formFeedback.textContent = "Thank you! Your message has been sent successfully. I will get back to you shortly.";
        }

        contactForm.reset();

        // 3D Avatar responds to message
        if (speechTextElem) {
          typeWriterEffect('"Message received! 🚀 Thank you for reaching out. Looking forward to connecting with you!"', speechTextElem);
        }
        if (isTTSActive) {
          speakText("Message received! Thank you for reaching out. Looking forward to connecting with you!");
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.innerHTML = `<span>Send Message</span> <i data-lucide="send"></i>`;
            lucide.createIcons();
          }
        }, 4000);
      }, 1200);
    });
  }

  // Dynamic Year in Footer
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
});
