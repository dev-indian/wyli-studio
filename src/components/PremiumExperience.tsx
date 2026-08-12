import { useEffect, useRef } from 'react';
import { gsap } from '@/animations/gsap';

const standards = [
  { title: "Premium Products",     desc: "We exclusively use top-tier, skin-friendly premium products.", icon: "flask-conical" },
  { title: "Expert Stylists",      desc: "Our team undergoes rigorous continuous training.",           icon: "award" },
  { title: "Inclusive Studio",     desc: "A welcoming space for all genders and styles.",             icon: "scissors" },
  { title: "Sanitized Equipment",  desc: "Hospital-grade sterilization for every client.",            icon: "shield-check" },
  { title: "Relaxing Ambience",    desc: "A calm, luxurious environment designed for you.",           icon: "coffee" },
  { title: "Personal Consultation", desc: "We listen first, advising tailored solutions.",             icon: "users" }
];

export default function PremiumExperience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo('.standard-card',
      { clipPath: 'inset(100% 0 0 0)', y: 50 },
      {
        clipPath: 'inset(0% 0 0 0)',
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.standards-grid',
          start: 'top 75%',
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-background relative overflow-hidden border-y border-white/5">
      {/* Decorative large text background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-serif font-bold text-white/[0.02] whitespace-nowrap pointer-events-none select-none tracking-tighter">
          WYLI
        </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <div className="mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-primary font-light">
            The WYLI Promise
          </h2>
          <p className="font-sans text-muted-foreground mt-4 max-w-xl">
            Glow, grooming, and inclusivity — these are the values that define every WYLI experience, backed by premium products and genuine care.
          </p>
        </div>

        <div className="standards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {standards.map((item, index) => (
            <div 
              key={index}
              className="standard-card bg-card/50 backdrop-blur-sm border-t border-primary/30 p-8 hover:bg-card hover:border-primary transition-all duration-500 group"
            >
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-6 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
                {/* Fallback simple icons since we can't reliably dynamic import lucide */}
                <div className="w-4 h-4 bg-primary rounded-[1px] rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>
              </div>
              <h3 className="font-sans text-lg font-medium tracking-wide text-foreground mb-3">
                {item.title}
              </h3>
              <p className="font-sans text-sm text-muted-foreground font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
