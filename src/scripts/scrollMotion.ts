import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { mountWebglAurora } from './webglAurora';

gsap.registerPlugin(ScrollTrigger);

let activeCleanupFns: Array<() => void> = [];

export function cleanupMotionEngine() {
  activeCleanupFns.forEach((fn) => {
    try {
      fn();
    } catch {
      // ignore teardown errors
    }
  });
  activeCleanupFns = [];
  ScrollTrigger.getAll().forEach((st) => st.kill());
}

function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  const onToggle = () => {
    const hidden = menu.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', String(!hidden));
  };
  btn.addEventListener('click', onToggle);

  const links = menu.querySelectorAll('.mobile-nav-link');
  const onLink = () => {
    menu.classList.add('hidden');
    btn.setAttribute('aria-expanded', 'false');
  };
  links.forEach((l) => l.addEventListener('click', onLink));

  activeCleanupFns.push(() => {
    btn.removeEventListener('click', onToggle);
    links.forEach((l) => l.removeEventListener('click', onLink));
  });
}

function initCommandPalette(scrollToHash: (hash: string) => void) {
  const backdrop = document.getElementById('cmdPaletteBackdrop');
  const input = document.getElementById('cmdSearchInput') as HTMLInputElement | null;
  const toast = document.getElementById('cmdToast');
  if (!backdrop || !input) return;

  const items = Array.from(backdrop.querySelectorAll<HTMLButtonElement>('.cmd-item'));
  let selectedIndex = 0;

  const visibleItems = () => items.filter((el) => !el.classList.contains('hidden'));

  const highlight = () => {
    const vis = visibleItems();
    selectedIndex = Math.max(0, Math.min(selectedIndex, Math.max(0, vis.length - 1)));
    items.forEach((el) => el.classList.remove('bg-white/[0.1]', 'text-white'));
    const cur = vis[selectedIndex];
    if (cur) cur.classList.add('bg-white/[0.1]', 'text-white');
  };

  const open = () => {
    backdrop.classList.remove('hidden');
    backdrop.classList.add('flex');
    input.value = '';
    items.forEach((el) => el.classList.remove('hidden'));
    selectedIndex = 0;
    highlight();
    setTimeout(() => input.focus(), 20);
  };

  const close = () => {
    backdrop.classList.add('hidden');
    backdrop.classList.remove('flex');
  };

  const execute = (btn: HTMLButtonElement) => {
    const copyVal = btn.dataset.cmdCopy;
    if (copyVal) {
      navigator.clipboard?.writeText(copyVal);
      if (toast) {
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 1500);
      }
      return;
    }

    const action = btn.dataset.cmdAction;
    if (action === 'blueprint') {
      const sel = document.querySelector<HTMLSelectElement>('select[name="service"]');
      if (sel) sel.value = 'blueprint';
    }

    const href = btn.dataset.cmdHref;
    const isExt = btn.dataset.cmdExternal === 'true';
    close();

    if (!href) return;
    if (isExt) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
    const hashIdx = href.indexOf('#');
    if (hashIdx !== -1) {
      const pathPart = href.slice(0, hashIdx).replace(/\/$/, '') || '/';
      const curPath = window.location.pathname.replace(/\/$/, '') || '/';
      if (pathPart === curPath) {
        scrollToHash(href.slice(hashIdx));
        return;
      }
    }
    window.location.href = href;
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (backdrop.classList.contains('hidden')) open();
      else close();
      return;
    }
    if (backdrop.classList.contains('hidden')) return;

    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex++;
      highlight();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex--;
      highlight();
    } else if (e.key === 'Enter') {
      const vis = visibleItems();
      if (vis[selectedIndex]) {
        e.preventDefault();
        execute(vis[selectedIndex]);
      }
    }
  };

  const onInput = () => {
    const q = input.value.trim().toLowerCase();
    items.forEach((el) => {
      const match = (el.dataset.cmdLabel || '').includes(q);
      el.classList.toggle('hidden', !match);
    });
    selectedIndex = 0;
    highlight();
  };

  const onBackdropClick = (e: MouseEvent) => {
    if (e.target === backdrop) close();
  };

  const openers = document.querySelectorAll('[data-open-cmd]');
  openers.forEach((o) => o.addEventListener('click', open));
  items.forEach((el) => el.addEventListener('click', () => execute(el)));
  input.addEventListener('input', onInput);
  backdrop.addEventListener('click', onBackdropClick);
  window.addEventListener('keydown', onKeyDown);

  activeCleanupFns.push(() => {
    openers.forEach((o) => o.removeEventListener('click', open));
    input.removeEventListener('input', onInput);
    backdrop.removeEventListener('click', onBackdropClick);
    window.removeEventListener('keydown', onKeyDown);
  });
}

function initScrollStory() {
  const track = document.getElementById('scrollStoryTrack');
  if (!track) return;

  const stepCards = track.querySelectorAll<HTMLElement>('.story-step-card');
  const stagePanes = track.querySelectorAll<HTMLElement>('.story-stage-pane');
  const railFill = document.getElementById('storyRailFill');
  let currentIdx = -1;

  const setVisualStep = (idx: number) => {
    if (idx === currentIdx) return;
    currentIdx = idx;

    stepCards.forEach((card, i) => {
      const active = i === idx;
      card.classList.toggle('bg-white/[0.05]', active);
      card.classList.toggle('border-[#00E599]/50', active);
      card.classList.toggle('opacity-100', active);
      card.classList.toggle('bg-transparent', !active);
      card.classList.toggle('border-white/[0.06]', !active);
      card.classList.toggle('opacity-45', !active);
    });

    stagePanes.forEach((pane, i) => {
      const active = i === idx;
      pane.style.clipPath = active ? 'inset(0% 0% 0% 0%)' : 'inset(8% 0% 8% 0%)';
      pane.classList.toggle('opacity-100', active);
      pane.classList.toggle('scale-100', active);
      pane.classList.toggle('opacity-0', !active);
      pane.classList.toggle('scale-[0.97]', !active);
      pane.classList.toggle('pointer-events-none', !active);
    });
  };

  stepCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      setVisualStep(idx);
      if (railFill) {
        railFill.style.transform = `scaleY(${(idx + 1) / stepCards.length})`;
      }
    });
  });

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top+=64',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = Math.max(0, Math.min(1, self.progress));
        if (railFill) {
          railFill.style.transform = `scaleY(${Math.max(0.04, p)})`;
        }
        const idx = Math.min(stepCards.length - 1, Math.floor(p * stepCards.length));
        setVisualStep(idx);
      },
    });
    return () => st.kill();
  });

  mm.add('(max-width: 1023px)', () => {
    if (railFill) railFill.style.transform = `scaleY(${1 / stepCards.length})`;
  });

  activeCleanupFns.push(() => mm.revert());
  setVisualStep(0);
}

function initCustomCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const ring = document.getElementById('cursorRing');
  const dot = document.getElementById('cursorDot');
  const label = document.getElementById('cursorLabel');
  if (!ring || !dot) return;

  let tx = -100;
  let ty = -100;
  let rx = -100;
  let ry = -100;
  let rafId = 0;

  const onMove = (e: PointerEvent) => {
    tx = e.clientX;
    ty = e.clientY;
    dot.style.transform = `translate3d(${tx - 3}px, ${ty - 3}px, 0)`;
  };

  const loop = () => {
    rafId = requestAnimationFrame(loop);
    rx += (tx - rx) * 0.16;
    ry += (ty - ry) * 0.16;
    const w = ring.offsetWidth / 2;
    ring.style.transform = `translate3d(${rx - w}px, ${ry - w}px, 0)`;
  };

  const onEnter = (el: HTMLElement) => {
    const text = el.dataset.cursor || '';
    ring.classList.add('cursor-active');
    if (label && text) {
      label.textContent = text;
      label.classList.remove('opacity-0');
    }
  };

  const onLeave = () => {
    ring.classList.remove('cursor-active');
    if (label) label.classList.add('opacity-0');
  };

  const targets = document.querySelectorAll<HTMLElement>('[data-cursor]');
  targets.forEach((el) => {
    el.addEventListener('pointerenter', () => onEnter(el));
    el.addEventListener('pointerleave', onLeave);
  });

  window.addEventListener('pointermove', onMove, { passive: true });
  rafId = requestAnimationFrame(loop);

  activeCleanupFns.push(() => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('pointermove', onMove);
  });
}

export function mountMotionEngine() {
  cleanupMotionEngine();
  initMobileMenu();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Cursor spotlight on glass/swiss cards
  document.querySelectorAll<HTMLElement>('.spotlight-card').forEach((card) => {
    const onMove = (e: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };
    card.addEventListener('pointermove', onMove, { passive: true });
    activeCleanupFns.push(() => card.removeEventListener('pointermove', onMove));
  });

  initScrollStory();

  let lenis: Lenis | null = null;
  const scrollToHash = (hash: string) => {
    if (hash === '#') {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: -64 });
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  initCommandPalette(scrollToHash);

  if (prefersReduced) return;

  initCustomCursor();

  // Pure WebGL GLSL silk-light shader in Hero
  const unmountGl = mountWebglAurora('heroWebglCanvas');
  activeCleanupFns.push(unmountGl);

  // Lenis buttery smooth scroll synced with GSAP
  lenis = new Lenis({
    duration: 1.08,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  lenis.on('scroll', ScrollTrigger.update);
  const tickerFn = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);
  (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

  activeCleanupFns.push(() => {
    gsap.ticker.remove(tickerFn);
    lenis?.destroy();
  });

  // Intercept same-page hash anchors cleanly
  document.querySelectorAll<HTMLAnchorElement>('a[href*="#"]').forEach((anchor) => {
    const onClick = (e: MouseEvent) => {
      const href = anchor.getAttribute('href');
      if (!href) return;
      const hashIdx = href.indexOf('#');
      if (hashIdx === -1) return;
      const pathPart = href.slice(0, hashIdx);
      const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
      const normalizedPath = pathPart.replace(/\/$/, '') || '/';
      if (pathPart && normalizedPath !== currentPath) return;
      e.preventDefault();
      scrollToHash(href.slice(hashIdx));
    };
    anchor.addEventListener('click', onClick);
    activeCleanupFns.push(() => anchor.removeEventListener('click', onClick));
  });

  // Magnetic buttons
  document.querySelectorAll<HTMLElement>('.magnetic-btn').forEach((btn) => {
    const onMove = (e: PointerEvent) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) * 0.16;
      const dy = (e.clientY - rect.top - rect.height / 2) * 0.16;
      gsap.to(btn, { x: dx, y: dy, duration: 0.28, ease: 'power2.out', overwrite: 'auto' });
    };
    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
    };
    btn.addEventListener('pointermove', onMove, { passive: true });
    btn.addEventListener('pointerleave', onLeave);
    activeCleanupFns.push(() => {
      btn.removeEventListener('pointermove', onMove);
      btn.removeEventListener('pointerleave', onLeave);
    });
  });

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

  // Hero kinetic entrance
  const heroItems = document.querySelectorAll('[data-hero-animate]');
  if (heroItems.length) {
    gsap.from(heroItems, {
      y: 30,
      opacity: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
    });
  }

  // Kinetic scroll-velocity horizontal typography band
  document.querySelectorAll<HTMLElement>('[data-kinetic-band]').forEach((band) => {
    gsap.fromTo(
      band,
      { xPercent: 4 },
      {
        xPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: band,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      }
    );
  });

  // Crisp scroll reveals (triggers immediately upon entering viewport)
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: el,
        start: 'top 95%',
        once: true,
      },
    });
  });

  // Staggered architectural grid groups
  document.querySelectorAll<HTMLElement>('[data-stagger-group]').forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>('[data-stagger-item]');
    if (!items.length) return;
    gsap.from(items, {
      y: 18,
      opacity: 0,
      scale: 0.985,
      duration: 0.45,
      stagger: 0.05,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: group,
        start: 'top 95%',
        once: true,
      },
    });
  });

  // Refresh ScrollTrigger positions once web fonts finish loading
  document.fonts?.ready.then(() => {
    ScrollTrigger.refresh();
  });

  // 3D perspective stage tilt
  document.querySelectorAll<HTMLElement>('[data-phone-stage]').forEach((stage) => {
    const frame = stage.querySelector<HTMLElement>('[data-phone-frame]');
    if (!frame) return;

    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(frame, { rotateY: nx * 11, rotateX: -ny * 8, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
    };
    const onLeave = () => {
      gsap.to(frame, { rotateY: 0, rotateX: 0, duration: 0.65, ease: 'power3.out', overwrite: 'auto' });
    };
    stage.addEventListener('pointermove', onMove, { passive: true });
    stage.addEventListener('pointerleave', onLeave);
    activeCleanupFns.push(() => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
    });
  });
}
