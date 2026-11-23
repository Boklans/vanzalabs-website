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

  const iconOpen = btn.querySelector<SVGElement>('[data-menu-icon="open"]');
  const iconClose = btn.querySelector<SVGElement>('[data-menu-icon="close"]');

  const syncState = (isOpen: boolean) => {
    menu.classList.toggle('hidden', !isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    iconOpen?.classList.toggle('hidden', isOpen);
    iconClose?.classList.toggle('hidden', !isOpen);
  };

  const onToggle = () => {
    syncState(menu.classList.contains('hidden'));
  };
  btn.addEventListener('click', onToggle);

  const links = menu.querySelectorAll('.mobile-nav-link');
  const onLink = () => syncState(false);
  links.forEach((l) => l.addEventListener('click', onLink));

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
      syncState(false);
    }
  };
  window.addEventListener('keydown', onKeyDown);

  activeCleanupFns.push(() => {
    btn.removeEventListener('click', onToggle);
    links.forEach((l) => l.removeEventListener('click', onLink));
    window.removeEventListener('keydown', onKeyDown);
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

function initScrollStory(getLenis: () => Lenis | null) {
  const track = document.getElementById('scrollStoryTrack');
  if (!track) return;

  const stepCards = track.querySelectorAll<HTMLElement>('.story-step-card');
  const stagePanes = track.querySelectorAll<HTMLElement>('.story-stage-pane');
  const railFill = document.getElementById('storyRailFill');
  const mobileRailFill = document.getElementById('storyMobileRailFill');
  const mobileMeta = document.getElementById('storyMobileMeta');
  const mobileTitle = document.getElementById('storyMobileTitle');
  const mobileDesc = document.getElementById('storyMobileDesc');
  const total = stepCards.length;
  let currentIdx = -1;
  let activeSt: ScrollTrigger | null = null;
  let lockedUntil = 0;

  const updateRails = (progress: number) => {
    const clamped = Math.max(0.05, Math.min(1, progress));
    if (railFill) railFill.style.transform = `scaleY(${clamped})`;
    if (mobileRailFill) mobileRailFill.style.transform = `scaleX(${clamped})`;
  };

  const setVisualStep = (idx: number) => {
    if (idx === currentIdx) return;
    currentIdx = idx;

    stepCards.forEach((card, i) => {
      const active = i === idx;
      card.setAttribute('aria-pressed', String(active));
      card.classList.toggle('bg-white/[0.05]', active);
      card.classList.toggle('border-[#00E599]/50', active);
      card.classList.toggle('opacity-100', active);
      card.classList.toggle('bg-transparent', !active);
      card.classList.toggle('border-white/[0.06]', !active);
      card.classList.toggle('opacity-45', !active);
    });

    const activeCard = stepCards[idx];
    if (activeCard) {
      if (mobileMeta) mobileMeta.textContent = `${activeCard.dataset.stepTag || ''} · ${activeCard.dataset.stepTime || ''}`;
      if (mobileTitle) mobileTitle.textContent = activeCard.dataset.stepTitle || '';
      if (mobileDesc) mobileDesc.textContent = activeCard.dataset.stepDesc || '';
    }

    stagePanes.forEach((pane, i) => {
      const active = i === idx;
      pane.style.clipPath = active ? 'inset(0% 0% 0% 0%)' : 'inset(6% 0% 6% 0%)';
      pane.classList.toggle('opacity-100', active);
      pane.classList.toggle('scale-100', active);
      pane.classList.toggle('opacity-0', !active);
      pane.classList.toggle('scale-[0.97]', !active);
      pane.classList.toggle('pointer-events-none', !active);
      pane.setAttribute('aria-hidden', String(!active));
    });
  };

  const unlockOnUserScroll = () => {
    lockedUntil = 0;
  };
  window.addEventListener('wheel', unlockOnUserScroll, { passive: true });
  window.addEventListener('touchstart', unlockOnUserScroll, { passive: true });
  activeCleanupFns.push(() => {
    window.removeEventListener('wheel', unlockOnUserScroll);
    window.removeEventListener('touchstart', unlockOnUserScroll);
  });

  stepCards.forEach((card, idx) => {
    const onCardClick = () => {
      setVisualStep(idx);
      const targetProgress =
        total <= 1 ? 0 : idx === 0 ? 0.04 : idx === total - 1 ? 0.9 : (idx + 0.35) / total;

      updateRails(targetProgress);

      if (activeSt) {
        const range = activeSt.end - activeSt.start;
        if (range > 0) {
          const targetY = activeSt.start + targetProgress * range;
          const currentY = window.scrollY;
          const isInsidePinned = currentY >= activeSt.start - 20 && currentY <= activeSt.end + 20;
          const lenis = getLenis();

          if (isInsidePinned) {
            lockedUntil = 0;
            if (lenis) {
              lenis.scrollTo(targetY, { immediate: true, force: true });
            } else {
              window.scrollTo({ top: targetY, behavior: 'auto' });
            }
            ScrollTrigger.update();
          } else {
            lockedUntil = performance.now() + 650;
            if (lenis) {
              lenis.scrollTo(targetY, {
                duration: 0.55,
                force: true,
                onComplete: () => {
                  lockedUntil = 0;
                  ScrollTrigger.update();
                },
              });
            } else {
              window.scrollTo({ top: targetY, behavior: 'smooth' });
            }
          }
        }
      }
    };
    card.addEventListener('click', onCardClick);
    activeCleanupFns.push(() => card.removeEventListener('click', onCardClick));
  });

  // Scroll-driven sticky storytelling across ALL viewports (mobile + desktop)
  const createTrigger = () => {
    const navOffset = window.innerWidth >= 1024 ? 64 : 56;
    return ScrollTrigger.create({
      trigger: track,
      start: `top top+=${navOffset}`,
      end: 'bottom bottom',
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = Math.max(0, Math.min(1, self.progress));
        updateRails(p);
        if (performance.now() < lockedUntil) return;
        const idx = Math.min(total - 1, Math.floor(p * total));
        setVisualStep(idx);
      },
    });
  };

  activeSt = createTrigger();
  activeCleanupFns.push(() => {
    activeSt?.kill();
    activeSt = null;
  });

  setVisualStep(0);
  updateRails(0.05);
}

// Smooth, tactile viewport-entry IntersectionObserver reveals
function initInstantReveals() {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal], [data-stagger-item]'));
  if (!targets.length) return;

  targets.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      el.classList.add('is-visible');
    } else {
      el.classList.add('reveal-ready');
    }
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const parent = el.parentElement;
          if (el.hasAttribute('data-stagger-item') && parent) {
            const siblings = Array.from(parent.querySelectorAll<HTMLElement>('[data-stagger-item]'));
            const idx = Math.max(0, siblings.indexOf(el));
            el.style.transitionDelay = `${Math.min(idx, 5) * 75}ms`;
          }
          el.classList.add('is-visible');
          io.unobserve(el);
        }
      });
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.05 }
  );

  targets.forEach((el) => {
    if (!el.classList.contains('is-visible')) {
      io.observe(el);
    }
  });

  activeCleanupFns.push(() => io.disconnect());
}

export function mountMotionEngine() {
  cleanupMotionEngine();
  initMobileMenu();

  // Always start cleanly at the top on page load/reload unless an explicit #hash target is present
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }

  // Expose refresh hook so dynamic collapsible sections (like mobile AI demo) keep ScrollTrigger accurate
  (window as unknown as { __refreshScrollTriggers?: () => void }).__refreshScrollTriggers = () => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Cursor spotlight on glass/swiss cards (desktop fine pointer only)
  if (hasFinePointer) {
    document.querySelectorAll<HTMLElement>('.spotlight-card').forEach((card) => {
      const onMove = (e: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      };
      card.addEventListener('pointermove', onMove, { passive: true });
      activeCleanupFns.push(() => card.removeEventListener('pointermove', onMove));
    });
  }

  let lenis: Lenis | null = null;
  initScrollStory(() => lenis);
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

  // Pure WebGL GLSL silk-light shader in Hero (renders a crisp static frame if prefers-reduced-motion)
  const unmountGl = mountWebglAurora('heroWebglCanvas', prefersReduced);
  activeCleanupFns.push(unmountGl);

  if (prefersReduced) return;

  initInstantReveals();

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

  // Magnetic primary buttons (desktop fine pointer only)
  if (hasFinePointer) {
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
  }

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
      y: 26,
      opacity: 0,
      duration: 0.8,
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

  // 3D perspective stage tilt (desktop fine pointer only)
  if (hasFinePointer) {
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

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
