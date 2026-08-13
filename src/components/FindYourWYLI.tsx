/**
 * FindYourWYLI — interactive recommendation flow
 *
 * 3-step flow:
 *   Step 1: What are you looking for? (Hair, Skin, Grooming, Makeup, Complete Experience)
 *   Step 2: What's the occasion? (Everyday, Event, Wedding, Party, Professional, Self-care)
 *   Step 3: What kind of result? (Natural, Bold, Polished, Relaxed, Glamorous)
 *
 * Output: recommended services with price, duration, and short explanation.
 * CTA: Build My Appointment — adds to cart and scrolls to booking.
 */

import { useState } from 'react';
import { SERVICES, type WYLI_Service } from '@/lib/services';
import { useBooking } from '@/contexts/BookingContext';
import { trackFindYourWYLIStarted, trackServiceAdded } from '@/lib/analytics';
import { gsap } from '@/animations/gsap';
import { Check, ChevronRight, Sparkles } from 'lucide-react';

const STEP_1_OPTIONS = [
  { value: 'Hair',    label: 'Hair',         icon: '✂' },
  { value: 'Skin',    label: 'Skin',         icon: '✦' },
  { value: 'Grooming',label: 'Grooming',     icon: '✦' },
  { value: 'Makeup',  label: 'Makeup',       icon: '✦' },
  { value: 'All',     label: 'Complete Experience', icon: '✦' },
];

const STEP_2_OPTIONS = [
  'Everyday', 'Event', 'Wedding', 'Party', 'Professional', 'Self-care',
];

const STEP_3_OPTIONS = [
  'Natural', 'Bold', 'Polished', 'Relaxed', 'Glamorous',
];

function getRecommendations(
  category: string,
  occasion: string,
  result: string,
): WYLI_Service[] {
  let pool = category === 'All' ? SERVICES : SERVICES.filter((s) => s.category === category);

  // occasion-based filtering
  if (occasion === 'Wedding' || occasion === 'Event') {
    pool = pool.filter((s) => s.featured);
  } else if (occasion === 'Self-care') {
    pool = pool.filter((s) => ['Skin', 'Grooming'].includes(s.category));
  }

  // result-based ranking
  if (result === 'Bold' || result === 'Glamorous') {
    pool = pool.filter((s) => ['Makeup', 'Hair Color', 'Hair Styling'].includes(s.name) || s.category === 'Makeup');
  } else if (result === 'Relaxed') {
    pool = pool.filter((s) => ['Hair Spa', 'Hair Treatment', 'Men\'s Facial', 'Basic Facial', 'Clean-Up'].includes(s.name));
  } else if (result === 'Polished') {
    pool = pool.filter((s) => ['Haircut', 'Beard Trim & Shape-Up', 'Clean Shave', 'Hair Styling'].includes(s.name));
  }

  if (pool.length === 0) pool = SERVICES.filter((s) => s.category === category || category === 'All');
  if (pool.length === 0) pool = SERVICES.slice(0, 4);

  return pool.slice(0, 3);
}

export default function FindYourWYLI() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [occasion, setOccasion] = useState('');
  const [result, setResult] = useState('');
  const [recommendations, setRecommendations] = useState<WYLI_Service[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const { addService, itemCount } = useBooking();

  const handleStart = () => {
    trackFindYourWYLIStarted();
    setStep(2);
    gsap.fromTo('.fyw-step-2', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.5 });
  };

  const handleStep2 = (val: string) => {
    setOccasion(val);
    setStep(3);
    gsap.fromTo('.fyw-step-3', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.5 });
  };

  const handleStep3 = (val: string) => {
    setResult(val);
    const recs = getRecommendations(category, occasion, val);
    setRecommendations(recs);
    setStep(4);
    gsap.fromTo('.fyw-step-4', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 });
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleAddToVisit = () => {
    const toAdd = recommendations.filter((r) => selected.includes(r.id));
    if (toAdd.length === 0) return;
    toAdd.forEach((s) => {
      addService(s);
      trackServiceAdded(s.id);
    });
    setSelected([]);
    setStep(5);
    gsap.fromTo('.fyw-step-5', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5 });
  };

  const handleReset = () => {
    setStep(1);
    setCategory('');
    setOccasion('');
    setResult('');
    setRecommendations([]);
    setSelected([]);
  };

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ''}` : `${m}m`;
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden" id="find-your-wyli">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <span className="text-primary font-sans uppercase tracking-[0.25em] text-xs font-medium block mb-4">
            Personalized Picks
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground font-light">
            Find Your <span className="italic text-primary">WYLI Experience</span>
          </h2>
          <p className="mt-4 text-sm text-muted-foreground max-w-xl mx-auto">
            Answer a few quick questions and we will recommend the perfect services for you.
          </p>
        </div>

         <div className="bg-background border border-black/5 p-8 md:p-12 relative">
          {/* Step 1 */}
          {step === 1 && (
            <div className="fyw-step-1">
              <h3 className="font-serif text-2xl text-foreground mb-6 text-center">
                What are you looking for?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {STEP_1_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setCategory(opt.value); handleStart(); }}
                    className="group flex flex-col items-center justify-center p-6 border border-black/10 hover:border-primary/50 transition-all duration-300 hover:bg-primary/5"
                  >
                    <span className="text-2xl mb-3 text-primary/70 group-hover:text-primary transition-colors">{opt.icon}</span>
                    <span className="font-sans text-xs uppercase tracking-widest text-foreground/80 group-hover:text-primary transition-colors">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="fyw-step-2">
              <h3 className="font-serif text-2xl text-foreground mb-6 text-center">
                What is the occasion?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {STEP_2_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleStep2(opt)}
                    className="p-4 border border-black/10 hover:border-primary/50 transition-all duration-300 hover:bg-primary/5 text-center"
                  >
                    <span className="font-sans text-sm uppercase tracking-widest text-foreground/80 group-hover:text-primary">{opt}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button onClick={() => setStep(1)} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="fyw-step-3">
              <h3 className="font-serif text-2xl text-foreground mb-6 text-center">
                What kind of result are you looking for?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {STEP_3_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleStep3(opt)}
                    className="p-4 border border-black/10 hover:border-primary/50 transition-all duration-300 hover:bg-primary/5 text-center"
                  >
                    <span className="font-sans text-sm uppercase tracking-widest text-foreground/80">{opt}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button onClick={() => setStep(2)} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* Step 4 — Recommendations */}
          {step === 4 && (
            <div className="fyw-step-4">
              <h3 className="font-serif text-2xl text-foreground mb-2 text-center">
                Your WYLI Recommendation
              </h3>
              <p className="text-center text-muted-foreground text-sm mb-8">
                Based on your preferences, we suggest these services.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {recommendations.map((svc) => (
                  <div
                    key={svc.id}
                    onClick={() => toggleSelect(svc.id)}
                    className={`cursor-pointer border transition-all duration-300 p-6 text-center ${
                      selected.includes(svc.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-black/10 hover:border-primary/50'
                    }`}
                  >
                    {selected.includes(svc.id) && (
                      <div className="flex justify-center mb-3 text-primary">
                        <Check size={20} />
                      </div>
                    )}
                    <h4 className="font-serif text-xl text-foreground mb-1">{svc.name}</h4>
                    <p className="text-xs text-muted-foreground mb-4">{svc.description}</p>
                    <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                      <span className="text-primary font-medium">₹{svc.price}</span>
                      <span>{formatDuration(svc.duration)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleAddToVisit}
                  disabled={selected.length === 0}
                  className="luxury-btn luxury-btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Build My Appointment ({selected.length})
                </button>
                <button onClick={handleReset} className="luxury-btn luxury-btn-outline">
                  Start Over
                </button>
              </div>
            </div>
          )}

          {/* Step 5 — Confirmation */}
          {step === 5 && (
            <div className="fyw-step-5 text-center">
              <div className="w-16 h-16 rounded-full border border-primary/50 flex items-center justify-center text-primary mb-6 mx-auto">
                <Sparkles size={26} />
              </div>
              <h3 className="font-serif text-3xl text-foreground mb-2">
                Added to Your Visit
              </h3>
              <p className="text-muted-foreground text-sm mb-8">
                {selected.length} service{selected.length !== 1 ? 's' : ''} added. Continue building your visit or head to booking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    const el = document.getElementById('build-your-visit');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="luxury-btn luxury-btn-outline"
                >
                  Build My Visit
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('book');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="luxury-btn luxury-btn-primary"
                >
                  Continue to Booking
                </button>
              </div>
              <button onClick={handleReset} className="mt-6 text-xs text-muted-foreground hover:text-primary transition-colors">
                Start Over
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
