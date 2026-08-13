import { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Services from '@/components/Services';
import { trackServicesVisit } from '@/lib/analytics';
import { useSEO } from '@/hooks/use-seo';

export default function ServicesPage() {
  useEffect(() => {
    trackServicesVisit();
  }, []);

  useSEO({
    title: 'Services — WYLI Glow & Grooming Studio | Varanasi',
    description: 'Explore WYLI services: hair, skin, grooming, and makeup. Transparent pricing, professional stylists, and a comfortable experience in Gilat Bazar, Varanasi.',
    canonical: 'https://wyli.in/services',
  });

  return (
    <PageLayout>
      <div className="py-20 text-center border-b border-black/5">
        <span className="text-primary font-sans uppercase tracking-[0.25em] text-xs font-medium block mb-4">
          What We Offer
        </span>
        <h1 className="font-serif text-5xl md:text-6xl text-foreground font-light">
          Our <span className="italic text-primary">Services</span>
        </h1>
      </div>
      <Services />
    </PageLayout>
  );
}
