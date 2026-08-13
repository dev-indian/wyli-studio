import { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Contact from '@/components/Contact';
import { trackContactVisit } from '@/lib/analytics';
import { useSEO } from '@/hooks/use-seo';

export default function ContactPage() {
  useEffect(() => {
    trackContactVisit();
  }, []);

  useSEO({
    title: 'Contact — WYLI Glow & Grooming Studio | Varanasi',
    description: 'Visit WYLI Glow & Grooming Studio in Gilat Bazar, Varanasi. Call +91 9696197594 or WhatsApp to book your appointment.',
    canonical: 'https://wyli.in/contact',
  });

  return (
    <PageLayout>
      <div className="py-20 text-center border-b border-black/5">
        <span className="text-primary font-sans uppercase tracking-[0.25em] text-xs font-medium block mb-4">
          Get In Touch
        </span>
        <h1 className="font-serif text-5xl md:text-6xl text-foreground font-light">
          Contact <span className="italic text-primary">Us</span>
        </h1>
      </div>
      <Contact />
    </PageLayout>
  );
}
