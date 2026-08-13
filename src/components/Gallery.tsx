import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/animations/gsap';
import { X, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

interface GalleryImage {
  src?: string;
  alt: string;
  span: string;
  isPlaceholder?: boolean;
}

const images: GalleryImage[] = [
  { src: '/assets/interior1.png', alt: 'WYLI Studio Interior',    span: 'col-span-2 row-span-2' },
  { alt: 'WYLI Hair Session',        span: 'col-span-1 row-span-1', isPlaceholder: true },
  { alt: 'WYLI Premium Products',    span: 'col-span-1 row-span-1', isPlaceholder: true },
  { src: '/assets/interior2.png', alt: 'WYLI Studio Ambiance',    span: 'col-span-1 row-span-2' },
  { alt: 'WYLI Grooming Experience', span: 'col-span-1 row-span-1', isPlaceholder: true },
  { alt: 'WYLI Stylist at Work',     span: 'col-span-1 row-span-1', isPlaceholder: true },
];

const isDesktop = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [lightboxOpen, setLightboxOpen]   = useState(false);
  const [currentIndex, setCurrentIndex]   = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Section heading reveal
    gsap.fromTo('.gallery-heading',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%' },
      },
    );

    // Image grid — fade + slight scale instead of heavy clip-path
    gsap.fromTo('.gallery-img-container',
      { opacity: 0, scale: 0.96, y: 20 },
      {
        opacity: 1, scale: 1, y: 0,
        duration: 1.0,
        stagger: { each: 0.08, from: 'start' },
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.gallery-grid',
          start: 'top 75%',
        },
      },
    );

    // Gentle parallax — desktop only, no mobile (prevents lag on touch)
    if (isDesktop()) {
      document.querySelectorAll('.gallery-img-inner').forEach((el) => {
        gsap.fromTo(el,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: el.closest('.gallery-img-container') as Element,
              start:   'top bottom',
              end:     'bottom top',
              scrub:   true,
            },
          },
        );
      });
    }
  }, []);

  const realImages = images.filter((img) => !img.isPlaceholder);

  const openLightbox  = (i: number) => { setCurrentIndex(i); setLightboxOpen(true);  document.body.style.overflow = 'hidden'; };
  const closeLightbox = ()            => { setLightboxOpen(false); document.body.style.overflow = ''; };
  const nextImage     = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex((p) => (p === realImages.length - 1 ? 0 : p + 1)); };
  const prevImage     = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex((p) => (p === 0 ? realImages.length - 1 : p - 1)); };

  return (
    <section id="gallery" ref={sectionRef} className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">

        <div className="gallery-heading flex justify-between items-end mb-16 px-4" style={{ opacity: 0 }}>
          <div>
            <span className="text-primary font-sans uppercase tracking-[0.2em] text-xs font-medium block mb-2">The Space</span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground font-light">
              Visual <span className="italic">Journey</span>
            </h2>
          </div>
        </div>

        <div className="gallery-grid grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[300px] gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className={`gallery-img-container relative overflow-hidden group ${img.isPlaceholder ? '' : 'cursor-pointer'} ${img.span}`}
              onClick={() => {
                if (!img.isPlaceholder) openLightbox(realImages.indexOf(img));
              }}
            >
              {img.isPlaceholder ? (
                <div className="absolute inset-0 bg-card border border-dashed border-white/15 flex flex-col items-center justify-center gap-3">
                  <ImageOff size={24} className="text-white/20" aria-hidden="true" />
                  <span className="text-[10px] font-sans uppercase tracking-widest text-white/20">
                    Coming Soon
                  </span>
                </div>
              ) : (
                <>
                  {/* Inner wrapper for parallax — separate from the reveal element */}
                  <div
                    className="gallery-img-inner absolute inset-[-10%] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                    style={{ backgroundImage: `url(${img.src})` }}
                    role="img"
                    aria-label={img.alt}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="font-sans text-xs uppercase tracking-widest text-white border border-white/30 px-4 py-2 backdrop-blur-sm">
                      View
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && realImages[currentIndex] && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button className="absolute top-8 right-8 text-foreground/50 hover:text-foreground transition-colors" onClick={closeLightbox}>
            <X size={32} />
          </button>
          <button className="absolute left-8 top-1/2 -translate-x-1/2 text-foreground/50 hover:text-foreground p-4 transition-colors" onClick={prevImage}>
            <ChevronLeft size={48} strokeWidth={1} />
          </button>
          <div className="w-full max-w-5xl px-16 h-[80vh] flex flex-col justify-center items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={realImages[currentIndex].src}
              alt={realImages[currentIndex].alt}
              className="max-h-full max-w-full object-contain shadow-2xl"
              loading="lazy"
              decoding="async"
            />
            <p className="text-primary font-sans uppercase tracking-widest mt-6 text-sm">
              {realImages[currentIndex].alt}
            </p>
          </div>
          <button className="absolute right-8 top-1/2 translate-x-1/2 text-foreground/50 hover:text-foreground p-4 transition-colors" onClick={nextImage}>
            <ChevronRight size={48} strokeWidth={1} />
          </button>
        </div>
      )}
    </section>
  );
}
