import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initScrollMotion() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Cursor-following spotlight on .spotlight-card elements
  document.querySelectorAll<HTMLElement>('.spotlight-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });

  if (prefersReduced) return;

  // 2. Lenis buttery inertia smooth scroll synced with GSAP ScrollTrigger
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Smooth anchor scrolling through Lenis
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

  // Expose lenis globally for programmatic scrolls (e.g., Scope Estimator CTA)
  (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

  // 3. Top Scroll Progress Beam
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

  // 4. Hero kinetic entrance + scroll depth parallax
  const heroItems = document.querySelectorAll('[data-hero-animate]');
  if (heroItems.length) {
    gsap.from(heroItems, {
      y: 28,
      opacity: 0,
      duration: 0.85,
      stagger: 0.09,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
    });
  }

  const heroOrb = document.querySelector('[data-parallax-orb]');
  const heroSection = document.querySelector('[data-hero-section]');
  if (heroOrb && heroSection) {
    gsap.to(heroOrb, {
      yPercent: 45,
      scale: 1.25,
      opacity: 0.45,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  const heroContent = document.querySelector('[data-hero-stage]');
  if (heroContent && heroSection) {
    gsap.to(heroContent, {
      y: -36,
      scale: 0.97,
      opacity: 0.65,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8,
      },
    });
  }

  // 5. Generic scroll-triggered reveals
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

  // 6. Staggered card groups
  document.querySelectorAll<HTMLElement>('[data-stagger-group]').forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>('[data-stagger-item]');
    if (!items.length) return;
    gsap.from(items, {
      y: 36,
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

  // 7. 3D Perspective Phone Mockup Scroll Parallax + Hover Tilt
  document.querySelectorAll<HTMLElement>('[data-phone-stage]').forEach((stage) => {
    const frame = stage.querySelector<HTMLElement>('[data-phone-frame]');
    if (!frame) return;

    gsap.fromTo(
      frame,
      { rotateY: -14, rotateX: 8, y: 26, scale: 0.94 },
      {
        rotateY: 0,
        rotateX: 0,
        y: -14,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: stage,
          start: 'top bottom',
          end: 'center center',
          scrub: 1.1,
        },
      }
    );

    stage.addEventListener('pointermove', (e) => {
      const rect = stage.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(frame, {
        rotateY: nx * 14,
        rotateX: -ny * 10,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });

    stage.addEventListener('pointerleave', () => {
      gsap.to(frame, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    });
  });

  // 8. Scroll-Scrubbed AI Pipeline Laser Beam
  const aiBeam = document.getElementById('aiPipelineBeam');
  const aiSection = document.getElementById('aiBlueprintCard');
  if (aiBeam && aiSection) {
    gsap.fromTo(
      aiBeam,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: aiSection,
          start: 'top 80%',
          end: 'center 45%',
          scrub: 0.8,
        },
      }
    );

    const nodes = aiSection.querySelectorAll<HTMLElement>('[data-ai-node]');
    gsap.from(nodes, {
      y: 22,
      opacity: 0,
      stagger: 0.12,
      duration: 0.65,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: aiSection,
        start: 'top 82%',
        once: true,
      },
    });
  }

  // 9. Scroll-Scrubbed Process Progress Beam
  const processBeam = document.getElementById('processBeam');
  const processGrid = document.getElementById('processStepsGrid');
  if (processBeam && processGrid) {
    gsap.fromTo(
      processBeam,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: processGrid,
          start: 'top 80%',
          end: 'bottom 55%',
          scrub: 0.8,
        },
      }
    );
  }
}

initScrollMotion();
