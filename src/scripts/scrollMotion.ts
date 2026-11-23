import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

function initHeroCanvas() {
  const canvas = document.getElementById('heroMeshCanvas') as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let rafId = 0;
  let visible = true;
  const mouse = { x: -9999, y: -9999 };

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
  }

  let particles: Particle[] = [];

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(54, Math.max(24, Math.floor((width * height) / 22000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 1,
    }));
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const heroSection = canvas.parentElement;
  heroSection?.addEventListener(
    'pointermove',
    (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    },
    { passive: true }
  );
  heroSection?.addEventListener('pointerleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    },
    { threshold: 0.01 }
  );
  io.observe(canvas);

  const draw = () => {
    rafId = requestAnimationFrame(draw);
    if (!visible) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      const mdx = mouse.x - p.x;
      const mdy = mouse.y - p.y;
      const mDist = Math.hypot(mdx, mdy);
      if (mDist < 160 && mDist > 1) {
        p.x += (mdx / mDist) * 0.45;
        p.y += (mdy / mDist) * 0.45;
      }

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 145) {
          const alpha = (1 - dist / 145) * 0.18;
          ctx.strokeStyle = `rgba(52, 211, 153, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      // Mouse link
      if (mDist < 175) {
        const alpha = (1 - mDist / 175) * 0.35;
        ctx.strokeStyle = `rgba(96, 165, 250, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }

      ctx.fillStyle = mDist < 160 ? 'rgba(110, 231, 183, 0.9)' : 'rgba(52, 211, 153, 0.5)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  rafId = requestAnimationFrame(draw);
  window.addEventListener('beforeunload', () => cancelAnimationFrame(rafId));
}

function initScrollStory() {
  const track = document.getElementById('scrollStoryTrack');
  if (!track) return;

  const stepCards = track.querySelectorAll<HTMLElement>('.story-step-card');
  const stagePanes = track.querySelectorAll<HTMLElement>('.story-stage-pane');
  const railFill = document.getElementById('storyRailFill');
  let currentIdx = -1;

  const activateStep = (idx: number) => {
    if (idx === currentIdx) return;
    currentIdx = idx;

    stepCards.forEach((card, i) => {
      const active = i === idx;
      card.classList.toggle('bg-emerald-500/[0.08]', active);
      card.classList.toggle('border-emerald-400/45', active);
      card.classList.toggle('opacity-100', active);
      card.classList.toggle('bg-white/[0.015]', !active);
      card.classList.toggle('border-white/[0.06]', !active);
      card.classList.toggle('opacity-55', !active);
    });

    stagePanes.forEach((pane, i) => {
      const active = i === idx;
      pane.classList.toggle('opacity-100', active);
      pane.classList.toggle('scale-100', active);
      pane.classList.toggle('opacity-0', !active);
      pane.classList.toggle('scale-95', !active);
      pane.classList.toggle('pointer-events-none', !active);
    });

    if (railFill) {
      railFill.style.transform = `scaleY(${(idx + 1) / stepCards.length})`;
    }
  };

  // Click fallback for all viewports
  stepCards.forEach((card, idx) => {
    card.addEventListener('click', () => activateStep(idx));
  });

  // Scroll-scrubbed switching on desktop
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (railFill) {
          railFill.style.transform = `scaleY(${Math.max(0.08, p)})`;
        }
        const idx = Math.min(stepCards.length - 1, Math.floor(p * stepCards.length));
        if (idx !== currentIdx) {
          currentIdx = idx;
          stepCards.forEach((card, i) => {
            const active = i === idx;
            card.classList.toggle('bg-emerald-500/[0.08]', active);
            card.classList.toggle('border-emerald-400/45', active);
            card.classList.toggle('opacity-100', active);
            card.classList.toggle('bg-white/[0.015]', !active);
            card.classList.toggle('border-white/[0.06]', !active);
            card.classList.toggle('opacity-55', !active);
          });
          stagePanes.forEach((pane, i) => {
            const active = i === idx;
            pane.classList.toggle('opacity-100', active);
            pane.classList.toggle('scale-100', active);
            pane.classList.toggle('opacity-0', !active);
            pane.classList.toggle('scale-95', !active);
            pane.classList.toggle('pointer-events-none', !active);
          });
        }
      },
    });
  });

  activateStep(0);
}

export function initScrollMotion() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Cursor spotlight on glass cards
  document.querySelectorAll<HTMLElement>('.spotlight-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });

  initScrollStory();

  if (prefersReduced) return;

  initHeroCanvas();

  // Magnetic primary buttons
  document.querySelectorAll<HTMLElement>('.magnetic-btn').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) * 0.16;
      const dy = (e.clientY - rect.top - rect.height / 2) * 0.16;
      gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
    });
    btn.addEventListener('pointerleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
    });
  });

  // Lenis buttery smooth scroll synced with GSAP
  const lenis = new Lenis({
    duration: 1.12,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll<HTMLAnchorElement>('a[href*="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href) return;
      const hashIdx = href.indexOf('#');
      if (hashIdx === -1) return;
      const pathPart = href.slice(0, hashIdx);
      const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
      const normalizedPath = pathPart.replace(/\/$/, '') || '/';
      if (pathPart && normalizedPath !== currentPath) return;

      const targetId = href.slice(hashIdx);
      if (targetId === '#') {
        e.preventDefault();
        lenis.scrollTo(0);
        return;
      }
      const targetEl = document.querySelector<HTMLElement>(targetId);
      if (targetEl) {
        e.preventDefault();
        lenis.scrollTo(targetEl, { offset: -64 });
      }
    });
  });

  (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

  // Top Scroll Progress Beam
  const progressBar = document.getElementById('scrollProgressBar');
  if (progressBar) {
    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.15,
      },
    });
  }

  // Hero kinetic entrance + scroll depth parallax
  const heroItems = document.querySelectorAll('[data-hero-animate]');
  if (heroItems.length) {
    gsap.from(heroItems, {
      y: 28,
      opacity: 0,
      duration: 0.85,
      stagger: 0.08,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
    });
  }

  const heroOrb = document.querySelector('[data-parallax-orb]');
  const heroSection = document.querySelector('[data-hero-section]');
  if (heroOrb && heroSection) {
    gsap.to(heroOrb, {
      yPercent: 40,
      scale: 1.25,
      opacity: 0.4,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  // Section reveal
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 34,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
        once: true,
      },
    });
  });

  // Staggered card groups
  document.querySelectorAll<HTMLElement>('[data-stagger-group]').forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>('[data-stagger-item]');
    if (!items.length) return;
    gsap.from(items, {
      y: 34,
      opacity: 0,
      scale: 0.96,
      duration: 0.72,
      stagger: 0.09,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: group,
        start: 'top 84%',
        once: true,
      },
    });
  });

  // 3D Perspective Stage Tilt
  document.querySelectorAll<HTMLElement>('[data-phone-stage]').forEach((stage) => {
    const frame = stage.querySelector<HTMLElement>('[data-phone-frame]');
    if (!frame) return;

    stage.addEventListener('pointermove', (e) => {
      const rect = stage.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(frame, {
        rotateY: nx * 12,
        rotateX: -ny * 9,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });

    stage.addEventListener('pointerleave', () => {
      gsap.to(frame, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.65,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    });
  });
}

initScrollMotion();
