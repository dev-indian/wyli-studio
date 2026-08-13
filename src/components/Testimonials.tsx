/**
 * Testimonials — client reviews section.
 * Placeholder: awaiting verified client reviews from WYLI.
 */

import { useEffect, useRef } from 'react';
import { gsap } from '@/animations/gsap';

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      '.testimonials-heading',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%' },
      },
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-background overflow-hidden relative">
      <div className="container mx-auto px-6 mb-16 text-center">
        <span className="text-primary font-sans uppercase tracking-[0.2em] text-xs font-medium block mb-4 testimonials-heading" style={{ opacity: 0 }}>
          Client Stories
        </span>
        <h2
          className="testimonials-heading font-serif text-4xl md:text-5xl text-foreground font-light"
          style={{ opacity: 0 }}
        >
          What Our Clients <span className="italic text-primary">Say</span>
        </h2>
      </div>

      <div className="max-w-2xl mx-auto text-center">
        <p className="text-muted-foreground font-light leading-relaxed">
          Client reviews are coming soon. We are grateful for the trust our guests place in WYLI, and we look forward to sharing their experiences here.
        </p>
      </div>
    </section>
  );
}
