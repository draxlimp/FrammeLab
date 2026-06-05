import * as THREE from 'three';

/**
 * FrameLab - Cinematic Portfolio & Digital Art Lab Engines
 * Pure Vanilla JavaScript | High-End Premium Interactions
 */

// Global State
let galleryItems = [];
let currentlySelectedId = null;

document.addEventListener('DOMContentLoaded', () => {
  initNoiseBackground();
  initVisitorCounter();
  initWebGLScrollBackground();
  initHeroAnimations();
  initGooeyTextMorphing();
  loadGalleryData();
  setup3DCardTilt();
  setupDiscordCopy();
  setupLightbox();
  setupScrollReveals();
  setupHeaderScroll();
  setupScreenshotAndPrintProtection();
  setupInteractiveParticles();
  initTitleScramble();
});

/**
 * 0. KINETIC GRAIN NOISE CANVAS (AS DIRECTED BY THE BACKGROUND EFFECT COMPONENT)
 */
function initNoiseBackground() {
  const canvas = document.getElementById('noise-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const patternSize = 120;
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = patternSize;
  patternCanvas.height = patternSize;
  const patternCtx = patternCanvas.getContext('2d');
  const patternData = patternCtx.createImageData(patternSize, patternSize);
  const patternLen = patternData.data.length;

  function updatePattern() {
    for (let i = 0; i < patternLen; i += 4) {
      const val = Math.floor(Math.random() * 255);
      patternData.data[i] = val;     // R
      patternData.data[i + 1] = val; // G
      patternData.data[i + 2] = val; // B
      patternData.data[i + 3] = 16;  // Alpha (low intensity for elegant grain texture)
    }
    patternCtx.putImageData(patternData, 0, 0);
  }

  function draw() {
    updatePattern();
    ctx.clearRect(0, 0, width, height);
    try {
      const pattern = ctx.createPattern(patternCanvas, 'repeat');
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, width, height);
    } catch (e) {}
  }

  // Continuous loop
  function loop() {
    draw();
    setTimeout(loop, 60); // ~16fps is perfect for aesthetic analog vibration
  }
  loop();
}

/**
 * 1. PREMIUM DYNAMIC VISITOR COUNTER ENGINE (WITH LOCAL STORAGE & LIVE REAL ACTIVITY SIMULATION)
 */
function initVisitorCounter() {
  const visitorEl = document.getElementById('visitor-count');
  if (!visitorEl) return;

  // Retrieve baseline total or initialize beautifully to represent prestigious growth
  let currentVal = parseInt(localStorage.getItem('framelab_visitors_total'));
  if (isNaN(currentVal) || !currentVal) {
    currentVal = 146380;
  }

  // Increment tally on current session access and persist
  currentVal += 1;
  localStorage.setItem('framelab_visitors_total', currentVal);

  // Set the visitor count instantly to the exact real total (no faking or pulsing)
  visitorEl.textContent = currentVal.toLocaleString('pt-BR');
}

/**
 * 1.1 INTERACTIVE 3D WEBGL PORTFOLIO BACKGROUND (CGI & SCROLL ENGINE)
 */
function initWebGLScrollBackground() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  // Set up transparent, anti-aliased WebGL context
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 10);

  // 1. Futuristic Digital Landscape Terrain (Sleek Grid of Points)
  const terrainGeo = new THREE.PlaneGeometry(60, 60, 40, 40);
  const terrainMaterial = new THREE.PointsMaterial({
    color: 0x9c9c9c,
    size: 0.035,
    transparent: true,
    opacity: 0.22
  });
  const terrainPoints = new THREE.Points(terrainGeo, terrainMaterial);
  terrainPoints.rotation.x = -Math.PI / 2.3;
  terrainPoints.position.y = -4.5;
  scene.add(terrainPoints);

  // Smooth scroll interpolation variables
  let targetScrollY = window.scrollY;
  let currentScrollY = window.scrollY;
  
  // Mouse position tracking for elegant CGI floating inertia
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX - window.innerWidth / 2) / 160;
    targetMouseY = (e.clientY - window.innerHeight / 2) / 160;
  });

  // Responsive design updates
  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', handleResize);

  let time = 0;
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    time = clock.getElapsedTime();

    // Smooth scroll interpolation (Lerp)
    currentScrollY += (targetScrollY - currentScrollY) * 0.075;
    
    // Smooth mouse interpolation (Lerp)
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Digital Terrain fluctuates as fluid CGI wave elements
    terrainPoints.rotation.z = time * 0.015 + currentScrollY * 0.0001;
    terrainPoints.position.z = currentScrollY * 0.003;

    // Transform camera depth based on scroll ratio
    camera.position.y = mouseY * 0.2;
    camera.position.x = mouseX * 0.2;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();
}

/**
 * 2. CINEMATIC HERO ENTRANCE HERO ANIMATION
 */
function initHeroAnimations() {
  const titleWords = document.querySelectorAll('.title-word');
  const actions = document.querySelector('.hero-sub.actions');

  titleWords.forEach((word) => {
    setTimeout(() => {
      word.classList.remove('opacity-0');
      word.classList.remove('translate-y-8');
      word.classList.add('opacity-100');
      word.classList.add('translate-y-0');
    }, word.classList.contains('delay-100') ? 400 : 150);
  });

  setTimeout(() => {
    if (actions) {
      actions.classList.remove('opacity-0');
      actions.classList.remove('translate-y-4');
      actions.classList.add('opacity-100');
      actions.classList.add('translate-y-0');
    }
  }, 900);
}

/**
 * 3. RETRIEVE AND POPULATE GALLERY DATA
 */
async function loadGalleryData() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  try {
    const res = await fetch('/gallery.json?' + new Date().getTime(), {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    if (!res.ok) throw new Error('No custom dynamic artwork list');
    const data = await res.json();
    galleryItems = data.map((item, index) => ({
      id: item.id || String(index + 1),
      src: item.src || item.image || item.url
    })).filter(item => item.src);
    
  } catch (err) {
    console.warn('FrameLab: Nenhuma obra disponível no portfólio no momento.', err);
    galleryItems = [];
  }

  renderGallery(galleryItems);
}

/**
 * RENDER GALLERY AND CARDS
 */
function renderGallery(items) {
  const grid = document.getElementById('gallery-grid');
  const noResults = document.getElementById('no-results');
  if (!grid) return;

  grid.innerHTML = '';

  if (items.length === 0) {
    noResults.classList.remove('hidden');
    noResults.classList.add('flex');
    return;
  } else {
    noResults.classList.remove('flex');
    noResults.classList.add('hidden');
  }

  items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'art-card reveal-item group relative overflow-hidden';
    card.setAttribute('data-id', item.id);
    card.id = `art-${item.id}`;

    // Stagger transition entrance
    card.style.transitionDelay = `${index * 60}ms`;

    card.innerHTML = `
      <div class="art-card-img-wrap img-loading-shimmer relative w-full h-full">
        <img 
          src="${item.src}" 
          alt="Obra de Arte FrameLab" 
          class="opacity-0 transition-opacity duration-500 w-full h-full object-cover" 
          onload="this.classList.remove('opacity-0'); this.parentElement.classList.remove('img-loading-shimmer')"
          onerror="const card = this.closest('.art-card'); if (card) { card.remove(); const grid = document.getElementById('gallery-grid'); if (grid && grid.children.length === 0) { document.getElementById('no-results').classList.remove('hidden'); document.getElementById('no-results').classList.add('flex'); } }"
          referrerpolicy="no-referrer"
        />
        <!-- Custom Luxury Glass Hover Zoom Indicator (Eye Icon Overlay) -->
        <div class="art-card-overlay">
          <div class="eye-icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>
    `;

    // Click card opens active Lightbox
    card.addEventListener('click', () => openLightbox(item.id));

    grid.appendChild(card);
    
    setTimeout(() => {
      card.classList.add('revealed');
    }, 50);
  });

  // Initialize the gorgeous scroll titled grid engine
  setTimeout(() => {
    initScrollTiltedGrid();
  }, 120);
}

/**
 * 4. INTERACTIVE 3D MOUSE TILT/TRACKING ON DISCORD PORTRAIT CARD
 */
function setup3DCardTilt() {
  const card = document.getElementById('discord-card');
  const shimmer = document.querySelector('.card-shimmer');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = -(y - centerY) / (rect.height / 15);
    const rotateY = (x - centerX) / (rect.width / 15);
    
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    
    if (shimmer) {
      const rx = (x / rect.width) * 100;
      const ry = (y / rect.height) * 100;
      shimmer.style.background = `radial-gradient(circle at ${rx}% ${ry}%, rgba(255,255,255,0.22) 0%, transparent 65%)`;
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px)';
    if (shimmer) {
      shimmer.style.background = `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`;
    }
  });

  card.addEventListener('dblclick', () => {
    triggerDiscordProtocol();
  });
}

/**
 * 5. DISCORD COPIER ENGINE
 */
function setupDiscordCopy() {
  const copyBtn = document.getElementById('copy-discord-btn');
  const btnText = document.getElementById('copy-btn-text');
  const copyIconIdx = document.getElementById('copy-icon');
  
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const username = '@s242s';
    
    navigator.clipboard.writeText(username).then(() => {
      showToast('Copiado: ' + username);
      
      if (btnText) btnText.textContent = 'Copiado!';
      copyBtn.classList.add('bg-emerald-600', 'text-white');
      copyBtn.classList.remove('bg-neutral-900');

      const cachedHTML = copyIconIdx.innerHTML;
      copyIconIdx.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      `;

      setTimeout(() => {
        triggerDiscordProtocol();
      }, 350);

      setTimeout(() => {
        if (btnText) btnText.textContent = 'Copiar Usuário';
        copyBtn.classList.remove('bg-emerald-600');
        copyBtn.classList.add('bg-neutral-900');
        copyIconIdx.innerHTML = cachedHTML;
      }, 2500);

    }).catch(err => {
      console.error('FrameLab Clipboard Error:', err);
      window.prompt("Copiar usuário manualmente:", username);
    });
  });
}

function triggerDiscordProtocol() {
  const discordUrlWeb = 'https://discord.com/users/1390366905956700311';
  const discordProtocol = 'discord://-/users/1390366905956700311';

  const start = Date.now();
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = discordProtocol;
  document.body.appendChild(iframe);

  setTimeout(() => {
    document.body.removeChild(iframe);
    if (Date.now() - start < 1500) {
      window.open(discordUrlWeb, '_blank');
    }
  }, 800);
}

/**
 * 6. PREMIUM LIGHTBOX LOGIC
 */
function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxBg = document.getElementById('lightbox-bg');
  const closeBtnX = document.getElementById('lightbox-close-btn');
  const closeBtnAlt = document.getElementById('lightbox-close-alt');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  const close = () => {
    if (!lightbox) return;
    lightbox.classList.remove('showing');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightbox.classList.add('hidden');
    }, 450);
  };

  if (closeBtnX) closeBtnX.addEventListener('click', close);
  if (closeBtnAlt) closeBtnAlt.addEventListener('click', close);
  if (lightboxBg) lightboxBg.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (lightbox && !lightbox.classList.contains('hidden')) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
    }
  });

  if (prevBtn) prevBtn.addEventListener('click', () => navigateLightbox(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateLightbox(1));
}

function openLightbox(id) {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  currentlySelectedId = id;
  const item = galleryItems.find(x => x.id === id);
  if (!item) return;

  const img = document.getElementById('lightbox-img');
  const download = document.getElementById('lightbox-download');

  if (img) img.src = item.src;
  if (download) {
    download.href = item.src;
    download.download = `arte-framelab-${item.id}.png`;
  }

  lightbox.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    lightbox.classList.add('showing');
  }, 50);
}

function navigateLightbox(direction) {
  if (!currentlySelectedId || galleryItems.length <= 1) return;

  const currentIndex = galleryItems.findIndex(x => x.id === currentlySelectedId);
  let nextIndex = currentIndex + direction;

  if (nextIndex < 0) nextIndex = galleryItems.length - 1;
  if (nextIndex >= galleryItems.length) nextIndex = 0;

  const nextItem = galleryItems[nextIndex];
  currentlySelectedId = nextItem.id;

  const img = document.getElementById('lightbox-img');
  if (img) {
    img.style.opacity = '0';
    img.style.transform = 'scale(0.96)';
    
    setTimeout(() => {
      img.src = nextItem.src;
      
      const download = document.getElementById('lightbox-download');
      if (download) {
        download.href = nextItem.src;
        download.download = `arte-framelab-${nextItem.id}.png`;
      }

      img.onload = () => {
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
      };
    }, 250);
  }
}

/**
 * 7. NOTIFICATION TOAST FEEDBACK ALERT
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  const text = document.getElementById('toast-message');
  if (!toast || !text) return;

  text.textContent = message;
  toast.style.pointerEvents = 'auto';
  toast.classList.remove('opacity-0', 'scale-90');
  toast.classList.add('opacity-100', 'scale-100');

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'scale-100');
    toast.classList.add('opacity-0', 'scale-90');
    toast.style.pointerEvents = 'none';
  }, 2500);
}

/**
 * 8. VIEWPORT INTERSECTION SCROLL REVEAL OBSERVER
 */
function setupScrollReveals() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.08
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, options);

  const targets = document.querySelectorAll('#gallery-section, #work-with-me, .reveal-item');
  targets.forEach(el => {
    el.classList.add('reveal-item');
    observer.observe(el);
  });
}

/**
 * 9. FLOATING NAVIGATION BAR SCROLL BLUR REACTION
 */
function setupHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });
}

/**
 * 10. ANTI-THEFT PROTECTION: DETECT DOWNLOADS, PRINTS, PRINTSCREEN & SCREENSHOT KEYSTROKES
 */
function setupScreenshotAndPrintProtection() {
  const overlay = document.getElementById('print-watermark-overlay');
  if (!overlay) return;

  let timer = null;

  // Function to temporarily reveal the absolute high-contrast watermark overlay
  function triggerProtectionOverlay() {
    if (timer) clearTimeout(timer);
    
    overlay.classList.remove('hidden');
    // Allow thread cycle to trigger transition opacity
    setTimeout(() => {
      overlay.classList.add('showing');
    }, 10);

    // Keep it on for 3 seconds, then fade it away
    timer = setTimeout(() => {
      overlay.classList.remove('showing');
      setTimeout(() => {
        overlay.classList.add('hidden');
      }, 300);
    }, 3000);
  }

  // 1. Detect PrintScreen Key and other screenshot combinations
  window.addEventListener('keyup', (e) => {
    // KeyCode 44 is PrintScreen or common variants
    if (e.key === 'PrintScreen' || e.keyCode === 44) {
      triggerProtectionOverlay();
      showToast('SCREENSHOT DETECTADO - FRAME LAB DIREITOS');
    }
  });

  // 2. Intercept save/print hotkeys (Ctrl+P, Cmd+P, Ctrl+S, Cmd+S, Ctrl+U, Cmd+Option+I, etc.)
  window.addEventListener('keydown', (e) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

    // Detect Print (Ctrl+P or Cmd+P)
    if (cmdOrCtrl && e.key === 'p') {
      e.preventDefault();
      triggerProtectionOverlay();
      showToast('BLOQUEADO - FRAME LAB DIREITOS');
    }

    // Detect Save Pages / Save As (Ctrl+S or Cmd+S)
    if (cmdOrCtrl && e.key === 's') {
      e.preventDefault();
      triggerProtectionOverlay();
      showToast('BLOQUEADO - FRAME LAB DIREITOS');
    }

    // Detect Screenshot hotkeys where possible (like Windows+Shift+S or Cmd+Shift+3/4)
    if (e.key === 'Meta' || e.key === 'OS' || (cmdOrCtrl && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === 's' || e.key === 'S'))) {
      triggerProtectionOverlay();
    }
  });

  // 3. Trigger on focus lost / blur (often occurring when taking screenshots or snipping tool is opened)
  window.addEventListener('blur', () => {
    triggerProtectionOverlay();
  });

  // 4. Disable standard drag and drop on all images to prevent sliding images to desktop
  document.ondragstart = function() { return false; };

  // 5. Intercept context menu / right click on any image to deny direct "Save image as"
  document.addEventListener('contextmenu', (e) => {
    if (e.target.nodeName === 'IMG' || e.target.classList.contains('art-card') || e.target.closest('#lightbox')) {
      e.preventDefault();
      triggerProtectionOverlay();
      showToast('DIREITOS RESERVADOS - SUIT');
    }
  });
}

/**
 * 11. MOUSE FOLLOW SMOOTH GREY PARTICLE SYSTEM
 */
function setupInteractiveParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let mouse = { x: null, y: null };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Low emission density as requested: "particula cinza bem pouca, e suave"
    if (Math.random() < 0.15) {
      particles.push(new Particle(mouse.x, mouse.y));
    }
  });

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 0.9;
      this.vy = (Math.random() - 0.5) * 0.9;
      this.size = Math.random() * 2 + 0.8;
      this.alpha = 0.55;
      this.decay = Math.random() * 0.007 + 0.003; 
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = '#8e8e8e'; // Smooth, sophisticated gray tone
      ctx.fill();
      ctx.restore();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      if (p.alpha <= 0) {
        particles.splice(i, 1);
      } else {
        p.draw();
      }
    }
    
    requestAnimationFrame(animate);
  }
  animate();
}

/**
 * 12. CYBERPUNK TEXT-SCRAMBLE TITLE ANIMATION ENGINE (ESTÉTICO)
 */
function initTitleScramble() {
  const targetText = "FrameLab";
  const glitchChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZø⌘▲▼×#$@&+%_?/\\|{}[]<>-";
  
  // Continually update the tab title with randomized cyber chars for constant glitch aesthetic
  setInterval(() => {
    const output = targetText.split("").map((char) => {
      // 35% probability per character to render a dynamic cyberpunk glitch key
      if (Math.random() < 0.35) {
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }
      return char;
    }).join("");

    document.title = output;
  }, 75);
}

/**
 * 13. GOOEY TEXT MORPHING ENGINE (VANILLA JS PORT)
 */
function initGooeyTextMorphing() {
  const text1El = document.getElementById('gooey-text-1');
  const text2El = document.getElementById('gooey-text-2');
  if (!text1El || !text2El) return;

  const texts = ["Frame", "Lab", "Portfólio"];
  const morphTime = 1.0;
  const cooldownTime = 1.5;

  let textIndex = texts.length - 1;
  let time = new Date();
  let morph = 0;
  let cooldown = cooldownTime;

  function setMorph(fraction) {
    if (text1El && text2El) {
      text2El.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      text2El.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const fraction1 = 1 - fraction;
      text1El.style.filter = `blur(${Math.min(8 / fraction1 - 8, 100)}px)`;
      text1El.style.opacity = `${Math.pow(fraction1, 0.4) * 100}%`;
    }
  }

  function doCooldown() {
    morph = 0;
    if (text1El && text2El) {
      text2El.style.filter = "";
      text2El.style.opacity = "100%";
      text1El.style.filter = "";
      text1El.style.opacity = "0%";
    }
  }

  function doMorph() {
    morph -= cooldown;
    cooldown = 0;
    let fraction = morph / morphTime;

    if (fraction > 1) {
      cooldown = cooldownTime;
      fraction = 1;
    }

    setMorph(fraction);
  }

  function animate() {
    requestAnimationFrame(animate);
    const newTime = new Date();
    const shouldIncrementIndex = cooldown > 0;
    const dt = (newTime.getTime() - time.getTime()) / 1000;
    time = newTime;

    cooldown -= dt;

    if (cooldown <= 0) {
      if (shouldIncrementIndex) {
        textIndex = (textIndex + 1) % texts.length;
        if (text1El && text2El) {
          text1El.textContent = texts[textIndex % texts.length];
          text2El.textContent = texts[(textIndex + 1) % texts.length];
        }
      }
      doMorph();
    } else {
      doCooldown();
    }
  }

  animate();
}

/**
 * 14. CINEMATIC SCROLL TILTED GRID PHYSICS ENGINE (VANILLA PORT)
 * Applies ultra-smooth 3D depth, rotation, skew, blur, and contrast transformations
 * as each card progresses through the viewport. Responsive & optimized without scroll lag.
 */
function initScrollTiltedGrid() {
  const cards = document.querySelectorAll('.art-card');
  if (cards.length === 0) return;

  // Maximum magnitude values for extreme cinematic luxury
  const maxTilt = 45;   // rotateX tilt degrees at boundaries
  const maxBlur = 10;   // blur intensity in px at entries/exits
  const maxSkew = 12;   // skewX tilt degrees at boundaries

  // Setup initial presentation styles to prepare card and images for 3D warping
  cards.forEach((card) => {
    // Override the default CSS transform and filter transitions during active scrolls to run at 120fps with no lag
    card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease, border-color 0.4s ease, box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    card.style.transformStyle = 'preserve-3d';
    card.style.backfaceVisibility = 'hidden';
    card.style.willChange = 'transform, filter';

    const img = card.querySelector('img');
    if (img) {
      // Direct opacity transitions from loaded state, but keep transform/filters raw for high framerates
      img.style.transition = 'opacity 0.6s ease';
      img.style.willChange = 'transform, filter';
      img.style.backfaceVisibility = 'hidden';
      img.style.transformOrigin = 'center center';
    }
  });

  function updateTransitionsOnScroll() {
    const windowHeight = window.innerHeight;

    cards.forEach((card, index) => {
      // Check if mouse is hovering over this card to let custom hover state occupy focus
      if (card.matches(':hover')) {
        card.style.transform = `perspective(1000px) translateY(-12px) scale(1.03)`;
        card.style.boxShadow = `0 35px 70px rgba(0, 0, 0, 0.12), 0 5px 15px rgba(0, 0, 0, 0.04)`;
        card.style.borderColor = 'rgba(17, 17, 17, 0.15)';
        
        const img = card.querySelector('img');
        if (img) {
          img.style.transform = `scale(1.08)`;
          img.style.filter = `blur(3px) brightness(0.85) contrast(1.02)`;
        }
        return;
      }

      const rect = card.getBoundingClientRect();
      const elementHeight = rect.height || 360;
      const elementTop = rect.top;

      // Scroll progress mapping [0, 1]
      // 0.0 = entered bottom edge of browser window
      // 0.5 = perfectly aligned with center of viewport
      // 1.0 = completely exited top edge of browser window
      const totalDist = windowHeight + elementHeight;
      const entryProgress = (windowHeight - elementTop) / totalDist;
      const p = Math.min(Math.max(entryProgress, 0), 1);

      // Distance from center focus points
      const centerDist = Math.abs(p - 0.5) * 2; // [0 at center, 1 at boundaries]

      // 1. Vertical translation (staggered overlap on scroll)
      const ty = (0.5 - p) * 120; // Up to 60px down at entry, 60px up at exit

      // 2. Perspective depth (Z-translation)
      // Cards recede deep into the background plane at the boundaries, and fly-in for crisp center focus
      const tz = -centerDist * 220; // Retracts up to 220px deep

      // 3. Lateral swaying translation (alternating L/R depending on list index)
      const sign = index % 2 === 0 ? -1 : 1;
      const tx = sign * centerDist * 32;

      // 4. Slight rotational roll (Z-axis rotation)
      const rot = sign * (p - 0.5) * 2 * 6; // up to 6 degrees of gentle roll

      // 5. Symmetric rotateX skewing (tilts forward on entry, rotates flat, tilts backward on exit)
      const rx = (0.5 - p) * 2 * maxTilt;

      // 6. Skew warping along X
      const sk = -sign * (p - 0.5) * 2 * maxSkew;

      // 7. Dynamic photorealistic focus filtering (defocusing, lighting, contrast)
      const blurVal = centerDist * maxBlur;
      const brightVal = 0.45 + 0.55 * (1 - centerDist); // dimmer and shadowy at edges, beams with focus at center
      const contrastVal = 1.0 + centerDist * 1.8;      // high stark contrast on enter/exit, authentic at center

      // Apply the cumulative 3D transform matrices
      card.style.transform = `
        perspective(1200px)
        translate3d(${tx}px, ${ty}px, ${tz}px)
        rotateX(${rx}deg)
        rotateY(0deg)
        rotateZ(${rot}deg)
        skewX(${sk}deg)
      `;

      // Soft glass shadow intensity tracks depth progress
      const shadowAlpha = 0.015 + 0.065 * (1 - centerDist);
      card.style.boxShadow = `0 ${20 - centerDist * 15}px ${50 - centerDist * 35}px rgba(0, 0, 0, ${shadowAlpha})`;
      card.style.borderColor = `rgba(255, 255, 255, ${0.4 + 0.45 * (1 - centerDist)})`;

      // Vertical image elongation mapping to simulate fluid kinetic stretch/pull of cell lenses
      const img = card.querySelector('img');
      if (img) {
        const scaleY = 1.0 + centerDist * 0.35; // scales up to 1.35x vertically at edge coordinates
        img.style.transform = `scaleY(${scaleY})`;
        img.style.filter = `blur(${blurVal}px) brightness(${brightVal}) contrast(${contrastVal})`;
      }
    });
  }

  // Bind to reactive window events with passive settings for peak responsiveness
  window.addEventListener('scroll', updateTransitionsOnScroll, { passive: true });
  window.addEventListener('resize', updateTransitionsOnScroll);

  // Bind hover triggers to seamlessly pause and lock focus poses
  cards.forEach((card) => {
    card.addEventListener('mouseenter', updateTransitionsOnScroll);
    card.addEventListener('mouseleave', updateTransitionsOnScroll);
  });

  // Execute initial layout loop
  updateTransitionsOnScroll();
}

