import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/animations/gsap';
import { splitAndAnimate } from '@/animations/splitText';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Image reveal animation
    gsap.fromTo(imageRef.current,
      { clipPath: 'inset(100% 0 0 0)' },
      {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.5,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
        }
      }
    );

    // Image parallax
    gsap.fromTo('.about-img-inner',
      { scale: 1.2 },
      {
        scale: 1,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
        }
      }
    );

    // Text animation
    if (headingRef.current) {
      splitAndAnimate(headingRef.current, {
        types: 'words',
        duration: 1,
        stagger: 0.02,
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
        }
      });
    }

    // Paragraph fade in
    gsap.fromTo('.about-text p',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about-text',
          start: 'top 75%',
        }
      }
    );

  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-32 md:py-48 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          <div className="col-span-1 lg:col-span-5 order-2 lg:order-1 about-text">
            <div className="mb-4 flex items-center gap-4">
              <span className="h-[1px] w-12 bg-primary inline-block"></span>
              <span className="text-primary font-sans uppercase tracking-[0.2em] text-xs font-medium">The Story</span>
            </div>
            
            <h2 
              ref={headingRef}
              className="font-serif text-5xl md:text-7xl leading-tight text-foreground font-light mb-10"
            >
              Where Craft Meets <span className="italic text-primary block mt-2">Ritual</span>
            </h2>
            
            <div className="space-y-6 text-muted-foreground font-sans font-light leading-relaxed">
              <p>
                Located at Gilat Bazar, Varanasi, WYLI Glow & Grooming Studio is a sanctuary for everyone. We believe that grooming is not a chore—it is a ritual. A moment of pause in a relentless world.
              </p>
              <p>
                Our master stylists combine time-honored techniques with contemporary precision. From the weight of a hot towel to the undeniable sharpness of a fresh look, every detail is considered, every movement intentional.
              </p>
              <p className="text-foreground/90 font-medium pt-4">
                Experience the unspoken luxury of silence, focus, and mastery.
              </p>
            </div>
            
            <div className="mt-12">
              <div className="h-12 flex items-center">
                <span className="font-serif text-2xl italic text-primary/50 tracking-widest">WYLI</span>
              </div>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-6 lg:col-start-7 order-1 lg:order-2">
            <div
              ref={imageRef}
              role="img"
              aria-label="Interior of WYLI Glow & Grooming Studio"
              className="relative w-full aspect-[4/5] overflow-hidden bg-muted"
            >
              <div
                className="about-img-inner absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('/assets/interior2.png')` }}
              />
              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-black/5 mix-blend-multiply" />
            </div>
            
            {/* Decorative element */}
            <div className="hidden md:block absolute bottom-20 right-0 w-64 h-64 border border-primary/20 -z-10 translate-x-1/2 translate-y-1/2"></div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
