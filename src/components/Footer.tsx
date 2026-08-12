import { useEffect, useRef } from 'react';
import { SiInstagram, SiWhatsapp } from 'react-icons/si';
import { gsap } from '@/animations/gsap';
import { revealOnScroll } from '@/animations/scrollReveal';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    // Brand name fade-up
    revealOnScroll('.footer-brand', { trigger: footer, start: 'top 90%', duration: 1.0, y: 30 });

    // Divider line expands from centre
    gsap.fromTo('.footer-divider',
      { scaleX: 0, opacity: 0 },
      {
        scaleX: 1, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: footer, start: 'top 88%' },
      },
    );

    // Nav links stagger upward
    revealOnScroll('.footer-link', {
      trigger: footer, start: 'top 85%', duration: 0.8, stagger: 0.06, y: 20,
    });

    // Social icons
    revealOnScroll('.footer-social', {
      trigger: footer, start: 'top 80%', duration: 0.8, stagger: 0.1, y: 15,
    });

    // Copyright
    revealOnScroll('.footer-copy', { trigger: footer, start: 'top 75%', duration: 0.8 });
  }, []);

  return (
    <footer
      ref={footerRef}
      className="bg-background pt-16 pb-8 border-t border-white/5 relative overflow-hidden"
    >
      <div className="container mx-auto px-6 text-center">

        <h2
          className="footer-brand font-serif text-4xl md:text-5xl tracking-[0.2em] text-primary/80 mb-12"
          style={{ opacity: 0 }}
        >
          WYLI
        </h2>

        <div
          className="footer-divider w-24 h-[1px] bg-primary/40 mx-auto mb-12 origin-center"
          style={{ opacity: 0 }}
        />

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 mb-12">
          {['Home', 'Services', 'Gallery', 'About', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="footer-link font-sans text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              style={{ opacity: 0 }}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex justify-center gap-6 mb-12">
          <a
            href="https://www.instagram.com/_wylistudio/"
            className="footer-social text-muted-foreground hover:text-primary transition-colors hover:scale-110 inline-block transition-transform duration-200"
            style={{ opacity: 0 }}
          >
            <SiInstagram size={20} />
          </a>
          <a
            href="https://wa.me/919696197594?text=Hi!%20I%20have%20a%20query%20about%20WYLI."
            className="footer-social text-muted-foreground hover:text-primary transition-colors hover:scale-110 inline-block transition-transform duration-200"
            style={{ opacity: 0 }}
          >
            <SiWhatsapp size={20} />
          </a>
        </div>

        <div
          className="footer-copy text-xs font-sans text-muted-foreground/50 tracking-wider"
          style={{ opacity: 0 }}
        >
          &copy; {new Date().getFullYear()} WYLI GLOW & GROOMING STUDIO. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
