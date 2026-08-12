/**
 * Testimonials — scrolling marquee of client reviews.
 * All 7 reviewers specified by the salon owner.
 * GSAP fade-in reveal on section entry.
 */
import { useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import { gsap } from '@/animations/gsap';

const reviews = [
  {
    name: 'Swastik Shukla',
    role: 'Regular Client',
    content:
      'WYLI has completely redefined what a salon visit means for me. The precision in every cut, the warm towel, the cold coffee — it all adds up to an experience you want to repeat every week.',
  },
  {
    name: 'Harsh Rajput',
    role: 'Beard Grooming Client',
    content:
      'I came in for a beard trim and left with a perfect shape-up and a face I barely recognized — in the best way. The stylist understood exactly what I was going for without me explaining twice.',
  },
  {
    name: 'Jitesh Sharma',
    role: 'First-time Visitor',
    content:
      'Best salon in Varanasi, no question. The ambiance alone sets it apart, but the skill of the staff makes it a must-visit. Booked my next appointment before I even left the chair.',
  },
  {
    name: 'Aditya Singh',
    role: 'Regular Client',
    content:
      "I've been coming here for six months now and the consistency is remarkable. Same quality, same professionalism, every single visit. That's rare to find anywhere in this city.",
  },
  {
    name: 'Aman Verma',
    role: 'Hair Patch Client',
    content:
      'The hair patch consultation was thorough, honest, and completely pressure-free. The result looks so natural that even close friends didn\'t notice until I told them. Life-changing, honestly.',
  },
  {
    name: 'Rahul Gupta',
    role: 'Premium Service Client',
    content:
      'Immaculate hygiene standards, a calm atmosphere, and staff who actually know their craft. Every product they use is premium, and you can feel the difference. Worth every rupee.',
  },
  {
    name: 'Ayush Mishra',
    role: 'Styling Client',
    content:
      'These guys understand modern cuts and current trends better than any salon I\'ve visited in the region. They give honest advice and deliver exactly what they promise. Highly recommend.',
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Section heading fade-in on scroll entry
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

      {/* Marquee row */}
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex gap-6 px-3 items-stretch">
          {[...reviews, ...reviews].map((review, i) => (
            <div
              key={i}
              className="w-[340px] md:w-[440px] shrink-0 bg-card border border-white/5 border-t-primary/20 border-t p-8 flex flex-col justify-between whitespace-normal hover:border-primary/30 transition-colors duration-500"
            >
              <div>
                <div className="flex text-primary mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} fill="currentColor" className="mr-1" />
                  ))}
                </div>
                <p className="font-sans text-muted-foreground font-light leading-relaxed italic mb-8 text-sm">
                  "{review.content}"
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-serif text-sm">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-sans text-sm text-foreground font-medium">{review.name}</h4>
                  <p className="font-sans text-[11px] text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee keyframe (scoped to this component) */}
      <style>{`
        @keyframes testimonial-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: testimonial-marquee 40s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
