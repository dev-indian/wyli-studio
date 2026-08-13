import PageLayout from '@/components/PageLayout';
import Appointment from '@/components/Appointment';
import { useSEO } from '@/hooks/use-seo';

export default function BookPage() {
  useSEO({
    title: 'Book Appointment — WYLI Glow & Grooming Studio | Varanasi',
    description: 'Book your appointment at WYLI Glow & Grooming Studio in Varanasi. Choose from hair, skin, makeup, and grooming services.',
    canonical: 'https://wyli.in/book',
  });

  return (
    <PageLayout>
      <div className="py-20 text-center border-b border-black/5">
        <span className="text-primary font-sans uppercase tracking-[0.25em] text-xs font-medium block mb-4">
          Reserve Your Visit
        </span>
        <h1 className="font-serif text-5xl md:text-6xl text-foreground font-light">
          Book Your <span className="italic text-primary">Appointment</span>
        </h1>
      </div>
      <Appointment />
    </PageLayout>
  );
}
