import PageLayout from '@/components/PageLayout';
import Testimonials from '@/components/Testimonials';
import { useSEO } from '@/hooks/use-seo';

export default function TestimonialsPage() {
  useSEO({
    title: 'Testimonials — WYLI Glow & Grooming Studio | Varanasi',
    description: 'Read what our clients say about their WYLI experience in Varanasi.',
    canonical: 'https://wyli.in/testimonials',
  });

  return (
    <PageLayout>
      <div className="py-20 text-center border-b border-black/5">
        <span className="text-primary font-sans uppercase tracking-[0.25em] text-xs font-medium block mb-4">
          Client Stories
        </span>
        <h1 className="font-serif text-5xl md:text-6xl text-foreground font-light">
          What Clients <span className="italic text-primary">Say</span>
        </h1>
      </div>
      <Testimonials />
    </PageLayout>
  );
}
