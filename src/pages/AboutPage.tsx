import PageLayout from '@/components/PageLayout';
import About from '@/components/About';
import { useSEO } from '@/hooks/use-seo';

export default function AboutPage() {
  useSEO({
    title: 'About — WYLI Glow & Grooming Studio | Varanasi',
    description: 'Learn about WYLI Glow & Grooming Studio — our story, values, and the experience we create in Gilat Bazar, Varanasi.',
    canonical: 'https://wyli.in/about',
  });

  return (
    <PageLayout>
      <div className="py-20 text-center border-b border-black/5">
        <span className="text-primary font-sans uppercase tracking-[0.25em] text-xs font-medium block mb-4">
          Our Story
        </span>
        <h1 className="font-serif text-5xl md:text-6xl text-foreground font-light">
          About <span className="italic text-primary">WYLI</span>
        </h1>
      </div>
      <About />
    </PageLayout>
  );
}
