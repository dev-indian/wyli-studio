import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/animations/gsap';
import { X, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { trackGalleryVisit } from '@/lib/analytics';
import { useSEO } from '@/hooks/use-seo';

const BASE = import.meta.env.BASE_URL;

interface GalleryItem {
  src?: string;
  alt: string;
  label: string;
  span: string;
  isPlaceholder?: boolean;
}

const galleryImages: GalleryItem[] = [
  {
    src: `${BASE}assets/interior1.png`,
    alt: 'WYLI Studio Interior',
    label: 'Our Space',
    span: 'col-span-2 row-span-2',
    isPlaceholder: false,
  },
  {
    alt: 'WYLI Hair Session',
    label: 'The Cut',
    span: 'col-span-1 row-span-1',
    isPlaceholder: true,
  },
  {
    src: `${BASE}assets/interior2.png`,
    alt: 'WYLI Studio Ambiance',
    label: 'The Lounge',
    span: 'col-span-1 row-span-2',
    isPlaceholder: false,
  },
  { alt: 'Gallery image 4', label: 'Coming Soon', span: 'col-span-1 row-span-1', isPlaceholder: true },
  { alt: 'Gallery image 5', label: 'Coming Soon', span: 'col-span-1 row-span-1', isPlaceholder: true },
  { alt: 'Gallery image 6', label: 'Coming Soon', span: 'col-span-1 row-span-1', isPlaceholder: true },
];

export default function GalleryPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useSEO({
    title: 'Gallery — WYLI Glow & Grooming Studio | Varanasi',
    description: 'Browse the WYLI Studio space, services, and atmosphere in Gilat Bazar, Varanasi.',
    canonical: 'https://wyli.in/gallery',
  });

  useEffect(() => {
    trackGalleryVisit();

    gsap.fromTo(
      '.gp-card',
      { opacity: 0, scale: 0.96, y: 24 },
      {
        opacity: 1, scale: 1, y: 0,
        duration: 0.9,
        stagger: { each: 0.08, from: 'start' },
        ease: 'power3.out',
        scrollTrigger: { trigger: '.gp-grid', start: 'top 80%' },
      },
    );
  }, []);

  const realImages = galleryImages.filter((g) => !g.isPlaceholder);

  const openLightbox = (i: number) => { setLightboxIdx(i); document.body.style.overflow = 'hidden'; };
  const closeLightbox = () => { setLightboxIdx(null); document.body.style.overflow = ''; };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % realImages.length);
  };
  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + realImages.length) % realImages.length);
  };

  return (
    <PageLayout>
      <div className="py-20 text-center border-b border-white/5">
        <span className="text-primary font-sans uppercase tracking-[0.25em] text-xs font-medium block mb-4">
          The Space
        </span>
        <h1 className="font-serif text-5xl md:text-6xl text-foreground font-light">
          Visual <span className="italic text-primary">Journey</span>
        </h1>
      </div>

      <section ref={sectionRef} className="py-16 bg-card">
        <div className="container mx-auto px-4 md:px-8">
          <div className="gp-grid grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[280px] gap-4">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className={`gp-card relative overflow-hidden group ${img.span}`}
                onClick={() => {
                  if (!img.isPlaceholder && realImages.length > 0) openLightbox(realImages.indexOf(img));
                }}
              >
                {img.isPlaceholder ? (
                  <div className="absolute inset-0 bg-card border border-dashed border-white/15 flex flex-col items-center justify-center gap-3">
                    <ImageOff size={28} className="text-white/20" />
                    <span className="text-[10px] font-sans uppercase tracking-widest text-white/20">
                      Image Placeholder
                    </span>
                  </div>
                ) : (
                  <>
                    <div
                      className="absolute inset-[-10%] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                      style={{ backgroundImage: `url(${img.src})` }}
                      role="img"
                      aria-label={img.alt}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                      <span className="font-sans text-xs uppercase tracking-widest text-white">
                        {img.label}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-xs font-sans text-white/30 uppercase tracking-widest">
            More images coming soon
          </p>
        </div>
      </section>

      {lightboxIdx !== null && realImages[lightboxIdx] && (
        <div
          className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-xl flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            onClick={closeLightbox}
          >
            <X size={28} />
          </button>
          <button
            className="absolute left-6 top-1/2 -translate-x-1/2 text-white/50 hover:text-white p-3 transition-colors"
            onClick={prev}
          >
            <ChevronLeft size={40} strokeWidth={1} />
          </button>
          <div
            className="w-full max-w-4xl px-20 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={realImages[lightboxIdx].src}
              alt={realImages[lightboxIdx].alt}
              className="max-h-[80vh] max-w-full object-contain shadow-2xl"
              loading="lazy"
            />
            <p className="text-primary font-sans uppercase tracking-widest mt-5 text-sm">
              {realImages[lightboxIdx].label}
            </p>
          </div>
          <button
            className="absolute right-6 top-1/2 translate-x-1/2 text-white/50 hover:text-white p-3 transition-colors"
            onClick={next}
          >
            <ChevronRight size={40} strokeWidth={1} />
          </button>
        </div>
      )}
    </PageLayout>
  );
}
