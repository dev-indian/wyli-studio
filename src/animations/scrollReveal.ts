/**
 * scrollReveal — shared utility for section entry animations.
 *
 * Respects reduced-motion preferences and scales movement distance
 * for tablet / mobile to reduce perceived effort.
 */
import { gsap, ScrollTrigger } from './gsap';

// Detect preference once at module level
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function motionY(base: number): number {
  if (prefersReducedMotion) return 0;
  if (typeof window === 'undefined') return base;
  if (window.innerWidth < 768)  return base * 0.5;  // mobile  — 50 % movement
  if (window.innerWidth < 1024) return base * 0.7;  // tablet  — 70 % movement
  return base;                                        // desktop — full
}

interface RevealOptions {
  /** Pixels to slide up from. Default: 40 */
  y?: number;
  /** Animation duration in seconds. Default: 1.0 */
  duration?: number;
  /** Stagger delay between elements. Default: 0 */
  stagger?: number;
  /** ScrollTrigger start position. Default: 'top 82%' */
  start?: string;
  /** GSAP ease. Default: 'power3.out' */
  ease?: string;
  /** Trigger element (uses target when omitted). */
  trigger?: string | Element;
  /** Scale from value. Default: 1 (no scale) */
  scaleFrom?: number;
}

/**
 * Reveal one or more elements as they scroll into view.
 * Elements must start with opacity:0 via inline style or CSS class.
 */
export function revealOnScroll(
  target: string | Element | Element[],
  options: RevealOptions = {},
) {
  const {
    y         = 40,
    duration  = 1.0,
    stagger   = 0,
    start     = 'top 82%',
    ease      = 'power3.out',
    scaleFrom = 1,
  } = options;

  const triggerEl = options.trigger ?? (typeof target === 'string' ? target : Array.isArray(target) ? target[0] : target);
  const yDist = motionY(y);

  const fromVars: gsap.TweenVars = { opacity: 0, y: yDist };
  if (scaleFrom !== 1) fromVars.scale = scaleFrom;

  const toVars: gsap.TweenVars = {
    opacity:  1,
    y:        0,
    duration,
    stagger,
    ease,
    scrollTrigger: {
      trigger: triggerEl,
      start,
    },
  };
  if (scaleFrom !== 1) toVars.scale = 1;

  return gsap.fromTo(target, fromVars, toVars);
}

/**
 * Staggered reveal — shorthand for multiple children.
 */
export function revealStagger(
  selector: string,
  trigger: string | Element,
  options: Omit<RevealOptions, 'trigger' | 'stagger'> & { stagger?: number } = {},
) {
  return revealOnScroll(selector, {
    stagger: 0.12,
    ...options,
    trigger,
  });
}

/** Kill all ScrollTriggers created by this module (useful on HMR). */
export function killRevealTriggers() {
  ScrollTrigger.getAll().forEach((st) => st.kill());
}
