/**
 * FrameLab - Cinematic Portfolio & Digital Art Lab Engines
 * Pure Vanilla JavaScript | High-End Premium Interactions
 */

// Global State
let galleryItems = [];
let currentlySelectedId = null;

document.addEventListener('DOMContentLoaded', () => {
  initUTCClock();
  initHeroAnimations();
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
 * 1. REAL-TIME BRAZIL DIGITAL CLOCK (HORÁRIO DE SÃO PAULO/BRASÍLIA)
 */
function initUTCClock() {
  const clockEl = document.getElementById('clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const options = {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    try {
      const formatter = new Intl.DateTimeFormat('pt-BR', options);
      clockEl.textContent = formatter.format(now);
    } catch (e) {
      // Robust standard fallback in case Intl.DateTimeFormat fails
      const pad = (num) => String(num).padStart(2, '0');
      const brHours = (now.getUTCHours() - 3 + 24) % 24;
      clockEl.textContent = `${pad(brHours)}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
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
  const targetText = "FrameLab - Portfólio";
  const glitchChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZø⌘▲▼×#$@&+%_?/\\|{}[]<>_-$";
  
  let currentWordState = targetText.split("");
  let step = 0;
  let isGlitching = true;
  let ambientTick = 0;

  // Faster timer cycle for fluid matrix-like aesthetic (50ms interval)
  setInterval(() => {
    // If in major glitching/scramble & resolve phase
    if (isGlitching) {
      const output = targetText.split("").map((char, index) => {
        if (char === " " || char === "-") return char;
        
        // Progressively resolve from left to right based on step
        if (index < step) {
          return char;
        }
        
        // Characters near the resolution front have a chance of being resolved, others are completely randomized
        if (index < step + 3 && Math.random() < 0.3) {
          return char;
        }
        
        // Pick random glitch letter or number
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }).join("");

      document.title = output;
      step += 0.35; // Increment resolution progress speed

      // Once the text has fully resolved
      if (step >= targetText.length) {
        document.title = targetText;
        isGlitching = false;
        ambientTick = 0;
      }
    } else {
      // Ambient phase: Standard beautiful title, but with sub-second random organic aesthetic twitch/flicker
      ambientTick++;
      
      // Randomly glitch 1 or 2 letters into numerical code every now and then
      if (Math.random() < 0.15) {
        const glitchIndex1 = Math.floor(Math.random() * targetText.length);
        const glitchIndex2 = Math.floor(Math.random() * targetText.length);
        
        const temp = targetText.split("").map((char, index) => {
          if (char === " " || char === "-") return char;
          if (index === glitchIndex1 || index === glitchIndex2) {
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }
          return char;
        }).join("");
        
        document.title = temp;
        
        // Return quickly to true title on next animation frame
        setTimeout(() => {
          if (!isGlitching) document.title = targetText;
        }, 60);
      } else {
        document.title = targetText;
      }

      // Re-trigger massive clean scramble cycle every 4.5 seconds of ambient beauty
      if (ambientTick > 90) {
        isGlitching = true;
        step = 0;
      }
    }
  }, 50);
}

