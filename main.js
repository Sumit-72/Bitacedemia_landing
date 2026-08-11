/**
 * BitAcademia Portal - Interactive Core Logic
 * Canvas ambient backdrop, animated button click ripples, 3D card tilt,
 * copy-to-clipboard toast notifications, and Google Analytics tracking.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initRippleEffect();
  initCardTiltEffect();
  initCopyIpButtons();
  initAnalyticsTracking();
  initAutoNetworkCheck();
});

/* ==========================================
   1. Dynamic Ambient Particle Canvas
   ========================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 25), 60);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? 'rgba(6, 182, 212, ' : 'rgba(139, 92, 246, ';
      this.alpha = Math.random() * 0.4 + 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw particle connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================
   2. Animated Click Ripple Effect
   ========================================== */
function initRippleEffect() {
  const rippleBtns = document.querySelectorAll('.ripple-btn');

  rippleBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      circle.classList.add('ripple-circle');

      const rect = this.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height);

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
      circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;

      const existingRipple = this.querySelector('.ripple-circle');
      if (existingRipple) {
        existingRipple.remove();
      }

      this.appendChild(circle);
    });
  });
}

/* ==========================================
   3. 3D Glassmorphism Card Tilt
   ========================================== */
function initCardTiltEffect() {
  const cards = document.querySelectorAll('.access-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 25;
      const rotateY = (centerX - x) / 25;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* ==========================================
   4. Copy IP to Clipboard with Toast
   ========================================== */
function initCopyIpButtons() {
  const copyBtns = document.querySelectorAll('.copy-ip-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async e => {
      e.preventDefault();
      const ip = btn.getAttribute('data-ip');
      if (!ip) return;

      try {
        await navigator.clipboard.writeText(ip);
        showToast(`Copied ${ip} to clipboard!`);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = ip;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast(`Copied ${ip} to clipboard!`);
      }
    });
  });
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

/* ==========================================
   5. Google Analytics (GA4) Click Event Tracking
   ========================================== */
function initAnalyticsTracking() {
  const bitBtn = document.getElementById('btn-bit-network');
  const outsideBtn = document.getElementById('btn-outside-network');

  if (bitBtn) {
    bitBtn.addEventListener('click', () => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'click_bit_network', {
          event_category: 'outbound_network_link',
          event_label: 'BIT Network (172.16.220.105:3000)',
          transport_type: 'beacon'
        });
      }
    });
  }

  if (outsideBtn) {
    outsideBtn.addEventListener('click', () => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'click_outside_network', {
          event_category: 'outbound_network_link',
          event_label: 'Outside Network (139.167.188.221:3000)',
          transport_type: 'beacon'
        });
      }
    });
  }
}

/* ==========================================
   6. Automatic Network Route Suggestion
   ========================================== */
function initAutoNetworkCheck() {
  const badgeText = document.querySelector('#auto-detect-badge .status-text');
  const cardBit = document.getElementById('card-bit');
  const cardOutside = document.getElementById('card-outside');

  // Attempt a subtle test ping to the local 172.16 subnet endpoint
  const img = new Image();
  const timeout = setTimeout(() => {
    if (badgeText) badgeText.textContent = 'Network Ready';
  }, 2500);

  img.onload = () => {
    clearTimeout(timeout);
    if (badgeText) badgeText.textContent = 'Detected: IN BIT NETWORK';
    if (cardBit) {
      cardBit.style.borderColor = 'rgba(6, 182, 212, 0.6)';
    }
  };

  img.onerror = () => {
    // If local network check fails or times out, user is likely on Outside Network
    clearTimeout(timeout);
    if (badgeText) badgeText.textContent = 'Network Auto-Detect Ready';
  };

  // Trigger test fetch with cache bust
  img.src = 'http://172.16.220.105:3000/favicon.ico?' + Date.now();
}
