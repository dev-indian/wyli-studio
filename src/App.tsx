/**
 * App.tsx — multi-page routing for WYLI Glow & Grooming Studio
 *
 * Pages:
 *  /             → Home (hero + all sections)
 *  /services     → Services page
 *  /gallery      → Gallery page
 *  /about        → About page
 *  /testimonials → Testimonials page
 *  /contact      → Contact page
 *  /book         → Book Appointment page
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { useEffect } from 'react';
import { initLenis } from './animations/lenis';

// Pages
import Home            from '@/pages/Home';
import ServicesPage    from '@/pages/ServicesPage';
import GalleryPage     from '@/pages/GalleryPage';
import AboutPage       from '@/pages/AboutPage';
import TestimonialsPage from '@/pages/TestimonialsPage';
import ContactPage     from '@/pages/ContactPage';
import BookPage        from '@/pages/BookPage';

// Global components
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { BookingProvider } from '@/contexts/BookingContext';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/"             component={Home} />
      <Route path="/services"     component={ServicesPage} />
      <Route path="/gallery"      component={GalleryPage} />
      <Route path="/about"        component={AboutPage} />
      <Route path="/testimonials" component={TestimonialsPage} />
      <Route path="/contact"      component={ContactPage} />
      <Route path="/book"         component={BookPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    const lenis = initLenis();
    return () => { lenis.destroy(); };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BookingProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
            <FloatingWhatsApp />
          </WouterRouter>
        </BookingProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
