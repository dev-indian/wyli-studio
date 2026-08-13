/**
 * Services — WYLI Glow & Grooming Studio service cards
 * Displays Hair, Skin, Grooming, and Makeup categories with hover animations.
 * Pricing and specific service names are placeholders; update servicesList with confirmed data.
 */

import { useEffect, useRef } from 'react';
import { gsap } from '@/animations/gsap';
const servicesList = [
  { name: 'Hair Services',   category: 'Hair',    tag: 'All',    desc: 'Cuts, styling, coloring, spa & treatments',   img: '/assets/service-haircut.jpg' },
  { name: 'Skin Care',       category: 'Skin',    tag: 'All',    desc: 'Facials, de-tan, clean-ups & rejuvenation',  img: '/assets/service-facial.jpg'  },
  { name: 'Grooming',        category: 'Grooming', tag: 'Men',  desc: 'Precision cuts, beard styling & more',       img: '/assets/service-spa.jpg'     },
  { name: 'Makeup',          category: 'Makeup',  tag: 'Women', desc: 'Bridal, party & everyday glam',              img: '/assets/service-styling.jpg' },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Heading animation
    gsap.fromTo(headingRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        }
      }
    );

    // Cards staggered reveal
    gsap.fromTo('.service-card',
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 80%',
        }
      }
    );

  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  };

  return (
    <section id="services" ref={sectionRef} className="py-24 bg-background relative">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="flex flex-col items-center text-center mb-20">
          <h2 ref={headingRef} className="font-serif text-5xl md:text-6xl text-foreground relative inline-block">
            Our Services
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-primary"></span>
          </h2>
        </div>

        <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesList.map((service, index) => (
            <div 
              key={index}
              className="service-card group relative aspect-[4/5] overflow-hidden cursor-pointer bg-background"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ transformStyle: 'preserve-3d' }}
            >
               {/* Background Image */}
               <div 
                 className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-60"
                 style={{ backgroundImage: `url(${service.img})` }}
               />
               
               {/* Gradient Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
               
               {/* Border Reveal on Hover */}
               <div className="absolute inset-4 border border-black/0 group-hover:border-primary/30 transition-colors duration-500 z-10" />
               
               {/* Category Tag */}
               <div className="absolute top-6 left-6 z-20">
                 <span className="font-sans text-[10px] uppercase tracking-widest text-white/90 border border-white/20 px-3 py-1 backdrop-blur-sm">
                   {service.tag}
                 </span>
               </div>

               {/* Content */}
               <div className="absolute inset-0 p-8 flex flex-col justify-end z-20 translate-z-10">
                 <span className="font-sans text-xs text-primary uppercase tracking-widest mb-2">{service.category}</span>
                 <h3 className="font-serif text-2xl text-white mb-2 group-hover:text-primary transition-colors duration-300">
                   {service.name}
                 </h3>
                 <p className="font-sans text-sm text-white/80 font-light opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                   {service.desc}
                 </p>
               </div>
            </div>
          ))}
        </div>
        
        {/* Pricing note */}
        <p className="text-center text-muted-foreground font-sans text-sm mt-12">
          Pricing varies by service and stylist. Contact us for exact rates and personalized packages.
        </p>
        
      </div>
    </section>
  );
}
