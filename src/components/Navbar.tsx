/**
 * Navbar — floating pill-shaped glassmorphism navbar.
 *
 * Behaviour:
 *  • Always visible on all pages
 *  • Pill shrinks slightly after scrolling (py tightens via CSS transition)
 *  • Active route highlighted with primary colour
 *  • Mobile: logo + hamburger → fullscreen overlay
 */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';
import { gsap } from '@/animations/gsap';

const BASE = import.meta.env.BASE_URL;
const LOGO_SRC = `${BASE}assets/logo.jpg`;

const NAV_LINKS = [
  { label: 'Home',         href: '/'             },
  { label: 'Services',     href: '/services'     },
  { label: 'Gallery',      href: '/gallery'      },
  { label: 'About',        href: '/about'        },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact',      href: '/contact'      },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [location,    navigate]       = useLocation();

  // ── Scroll detection ─────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Slide-in entrance ───────────────────────────────────────────────────
  useEffect(() => {
    gsap.fromTo('.wyli-navbar',
      { y: -80, opacity: 0 },
      { y: 0,   opacity: 1, duration: 1.0, ease: 'power3.out' },
    );
  }, []);

  // ── Close mobile menu on route change ────────────────────────────────────
  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const toggleMobile = () => {
    const next = !mobileOpen;
    setMobileOpen(next);
    if (next) {
       gsap.to('.wyli-mobile-menu', { autoAlpha: 1, duration: 0.3 });
       gsap.fromTo('.wyli-mobile-link',
         { y: 20, opacity: 0 },
         { y: 0,  opacity: 1, duration: 0.45, stagger: 0.07, ease: 'power2.out', delay: 0.1 },
       );
    } else {
       gsap.to('.wyli-mobile-menu', { autoAlpha: 0, duration: 0.25 });
    }
  };

  return (
    <>
      {/* ── Floating pill ─────────────────────────────────────────────────── */}
      <nav
        className={`wyli-navbar fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-500
          ${scrolled ? 'top-2' : 'top-4'}
          bg-black/40 backdrop-blur-xl border border-white/10
          rounded-full shadow-2xl shadow-black/30
          flex items-center gap-0
          max-w-[calc(100vw-1.5rem)] w-auto
          ${scrolled ? 'px-3 py-1.5' : 'px-4 py-2'}`}
        style={{ opacity: 0 }}   /* GSAP sets to 1 on mount */
      >
        {/* Logo + brand name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 mr-4 shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          <img
            src={LOGO_SRC}
            alt="WYLI Logo"
            className="w-8 h-8 rounded-full object-cover border border-primary/30"
            loading="eager"
          />
          <span className="font-serif tracking-[0.18em] text-primary text-sm hidden sm:block">
            WYLI
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center">
          {NAV_LINKS.map((link) => {
            const isActive = location === link.href || (link.href !== '/' && location.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1 font-sans text-[11px] uppercase tracking-[0.12em] transition-colors duration-200 whitespace-nowrap
                  ${isActive ? 'text-primary' : 'text-white/70 hover:text-white'}`}
                onClick={(e) => handleLink(e as unknown as React.MouseEvent<HTMLAnchorElement>, link.href)}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Book button (desktop) */}
        <Link
          href="/book"
          className="hidden md:flex ml-4 luxury-btn luxury-btn-primary text-[10px] tracking-widest px-4 py-1.5"
          style={{ borderRadius: '9999px', fontSize: '10px' }}
        >
          Book Now
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-3 text-primary p-1 focus:outline-none"
          onClick={toggleMobile}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* ── Mobile fullscreen overlay ─────────────────────────────────────── */}
      <div
        className="wyli-mobile-menu fixed inset-0 z-[90] bg-background/95 backdrop-blur-xl
          invisible flex flex-col justify-center items-center gap-8"
      >
        <img
          src={LOGO_SRC}
          alt="WYLI Logo"
          className="w-20 h-20 rounded-full object-cover border-2 border-primary/40 mb-4"
        />
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="wyli-mobile-link font-serif text-2xl text-white/80 hover:text-primary
              tracking-[0.15em] uppercase opacity-0 transition-colors duration-200"
            onClick={(e) => handleLink(e as unknown as React.MouseEvent<HTMLAnchorElement>, link.href)}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/book"
          className="wyli-mobile-link luxury-btn luxury-btn-primary mt-4 opacity-0"
          onClick={() => setMobileOpen(false)}
        >
          Book Appointment
        </Link>
      </div>
    </>
  );
}
