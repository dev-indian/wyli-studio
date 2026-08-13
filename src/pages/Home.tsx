import { useState } from 'react';
import { useSEO } from '@/hooks/use-seo';
import Navbar from '@/components/Navbar';
import About from '@/components/About';
import Services from '@/components/Services';
import PremiumExperience from '@/components/PremiumExperience';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import Appointment from '@/components/Appointment';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  useSEO({
    title: 'WYLI — Glow & Grooming Studio | Gilat Bazar, Varanasi',
    description: 'WYLI Glow & Grooming Studio in Gilat Bazar, Varanasi — premium hair, skin, makeup, and grooming services for everyone. Walk-ins welcome.',
    canonical: 'https://wyli.in/',
  });

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main>
        <About />
        <Services />
        <PremiumExperience />
        <Gallery />
        <Testimonials />
        <Appointment />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
