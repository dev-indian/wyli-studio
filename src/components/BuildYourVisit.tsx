/**
 * BuildYourVisit — service cart and planner
 *
 * Lets customers combine multiple services and see estimated total + duration.
 * Integrates with BookingContext for shared cart state.
 */

import { useState } from 'react';
import { SERVICES, getServicesByGender, type WYLI_Service } from '@/lib/services';
import { useBooking } from '@/contexts/BookingContext';
import { trackBuildVisitStarted } from '@/lib/analytics';
import { gsap } from '@/animations/gsap';
import { Plus, Minus, Trash2, Calendar, Clock } from 'lucide-react';

const GENDER_OPTIONS = ['All', 'Men', 'Women'] as const;

function formatDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

export default function BuildYourVisit() {
  const [gender, setGender] = useState<'All' | 'Men' | 'Women'>('All');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const { draft, addService, removeService, updateQuantity, totalPrice, totalDuration, itemCount } = useBooking();

  const visibleServices = activeCategory === 'All'
    ? getServicesByGender(gender)
    : getServicesByGender(gender).filter((s) => s.category === activeCategory);

  const handleAdd = (svc: WYLI_Service) => {
    addService(svc);
    gsap.fromTo(`.bwv-toast-${svc.id}`, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
  };

  return (
    <section id="build-your-visit" className="py-24 bg-background relative overflow-hidden border-t border-white/5">
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <span className="text-primary font-sans uppercase tracking-[0.25em] text-xs font-medium block mb-4">
            Customize Your Day
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground font-light">
            Build Your <span className="italic text-primary">WYLI Visit</span>
          </h2>
          <p className="mt-4 text-sm text-muted-foreground max-w-xl mx-auto">
            Combine services that suit you. We will calculate the total time and cost.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Service selector */}
          <div className="lg:col-span-2">
            {/* Gender filter */}
            <div className="flex flex-wrap gap-3 mb-6">
              {GENDER_OPTIONS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`px-4 py-2 text-xs uppercase tracking-widest border transition-all duration-200 ${
                    gender === g
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-3 mb-8">
              {['All', 'Hair', 'Skin', 'Grooming', 'Makeup'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs uppercase tracking-widest border transition-all duration-200 ${
                    activeCategory === cat
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Service grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {visibleServices.map((svc) => {
                const inCart = draft.items.find((i) => i.service.id === svc.id);
                return (
                  <div
                    key={svc.id}
                    className="group border border-white/5 hover:border-primary/30 transition-all duration-300 p-5 bg-card/30 flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-primary/70">{svc.category}</span>
                        <h4 className="font-serif text-lg text-foreground">{svc.name}</h4>
                      </div>
                      <span className="text-xs text-muted-foreground border border-white/10 px-2 py-1">{svc.gender}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed mb-4 flex-1">{svc.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="text-primary font-medium">₹{svc.price}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {svc.duration}m
                        </span>
                      </div>
                      {inCart ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(svc.id, inCart.quantity - 1)}
                            className="w-7 h-7 border border-white/10 flex items-center justify-center hover:border-primary transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs w-6 text-center">{inCart.quantity}</span>
                          <button
                            onClick={() => updateQuantity(svc.id, inCart.quantity + 1)}
                            className="w-7 h-7 border border-white/10 flex items-center justify-center hover:border-primary transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAdd(svc)}
                          className="w-8 h-8 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Cart summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border border-white/5 bg-card/50 p-6">
              <h3 className="font-serif text-xl text-foreground mb-4">Your Visit</h3>

              {draft.items.length === 0 ? (
                <p className="text-sm text-muted-foreground mb-6">No services selected yet. Start building your visit.</p>
              ) : (
                <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
                  {draft.items.map((item) => (
                    <div key={item.service.id} className="flex items-start justify-between gap-2 border-b border-white/5 pb-3">
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{item.service.name}</p>
                        <p className="text-xs text-muted-foreground">₹{item.service.price} × {item.quantity}</p>
                      </div>
                      <button
                        onClick={() => removeService(item.service.id)}
                        className="text-muted-foreground hover:text-red-400 transition-colors mt-1"
                        aria-label={`Remove ${item.service.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {draft.items.length > 0 && (
                <div className="space-y-2 mb-6 pt-4 border-t border-white/5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Duration</span>
                    <span className="text-foreground font-medium">{formatDuration(totalDuration)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Price</span>
                    <span className="text-primary font-medium">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground pt-2">
                    <span>Services</span>
                    <span>{itemCount}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  const el = document.getElementById('book');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                disabled={draft.items.length === 0}
                className="w-full luxury-btn luxury-btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue to Booking ({itemCount})
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
