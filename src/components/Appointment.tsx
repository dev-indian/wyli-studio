/**
 * Appointment — Complete WYLI native booking experience
 *
 * Multi-step flow:
 *  1. Category (All / Men / Women)
 *  2. Services (add/remove from cart)
 *  3. Selected Services (review + totals)
 *  4. Date picker
 *  5. Time picker (demo slots)
 *  6. Customer details
 *  7. Review & Confirm
 *
 * Persistence order:
 *  1. Validate
 *  2. Generate Booking ID
 *  3. POST to Google Apps Script webhook
 *  4. Verify successful response
 *  5. Send EmailJS confirmation + owner notification
 *  6. Track analytics
 *  7. Show success UI
 *
 * If Google Sheets fails: show error, keep data intact.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import emailjs from '@emailjs/browser';
import { gsap } from '@/animations/gsap';
import { revealOnScroll } from '@/animations/scrollReveal';
import { EMAILJS_CONFIG } from '@/lib/emailjs';
import { trackBookingStarted, trackBookingSubmitted, trackBookingPersisted, trackBookingFailed, trackBookingConfirmed } from '@/lib/analytics';
import { WYLI } from '@/lib/wyli';
import { SERVICES, getServicesByGender, type WYLI_Service } from '@/lib/services';
import { useBooking } from '@/contexts/BookingContext';
import { Check, ChevronRight, ChevronLeft, Calendar, Clock, User, Phone, Mail, MessageSquare, Trash2, Plus, Minus } from 'lucide-react';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const GENDER_OPTIONS = ['All', 'Men', 'Women'] as const;

const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30',
];

function fmtDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

function fmtTime(hhmm: string): string {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  const hr = h % 12 || 12;
  const period = h >= 12 ? 'PM' : 'AM';
  return `${hr}:${String(m).padStart(2, '0')} ${period}`;
}

function generateBookingId(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const suffix = String(Math.floor(Math.random() * 900) + 100);
  return `WYLI-${yyyy}${mm}${dd}-${suffix}`;
}

const sanitize = (s: string) => s.trim().replace(/<[^>]*>/g, '');

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

interface SuccessData {
  bookingId: string;
  customerName: string;
  services: string;
  date: string;
  time: string;
  totalPrice: number;
  totalDuration: number;
  customerEmail: string;
}

export default function Appointment() {
  const [step, setStep] = useState<Step>(1);
  const [gender, setGender] = useState<'All' | 'Men' | 'Women'>('All');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const isSubmitting = useRef(false);
  const {
    draft,
    addService,
    removeService,
    updateQuantity,
    setDate,
    setTime,
    setCustomerName,
    setCustomerPhone,
    setCustomerEmail,
    setNotes,
    totalPrice,
    totalDuration,
    itemCount,
    clearCart,
  } = useBooking();

  // Sync category with context when step 2 starts
  useEffect(() => {
    if (step === 2) {
      // context category will be updated via UI
    }
  }, [step]);

  // Scroll reveal
  useEffect(() => {
    const s = sectionRef.current;
    if (!s) return;
    revealOnScroll('.appt-tagline', { trigger: s, start: 'top 80%', duration: 0.8 });
    revealOnScroll('.appt-heading', { trigger: s, start: 'top 75%', duration: 1.0, y: 50 });
  }, []);

  const goNext = () => setStep((s) => Math.min(7, s + 1) as Step);
  const goBack = () => setStep((s) => Math.max(1, s - 1) as Step);

  const validateStep = (currentStep: Step): boolean => {
    const e: Record<string, string> = {};

    if (currentStep === 3 && draft.items.length === 0) {
      e.services = 'Please select at least one service.';
    }
    if (currentStep === 4 && !draft.date) {
      e.date = 'Please select a date.';
    } else if (currentStep === 4 && draft.date) {
      const chosen = new Date(draft.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (chosen < today) e.date = 'Please choose a future date.';
    }
    if (currentStep === 5 && !draft.time) {
      e.time = 'Please select a time.';
    }
    if (currentStep === 6) {
      if (!draft.customerName.trim()) e.customerName = 'Full name is required.';
      if (!draft.customerPhone.trim()) e.customerPhone = 'Phone number is required.';
      else if (!/^[+]?[\d\s\-()]{8,15}$/.test(draft.customerPhone.trim())) e.customerPhone = 'Enter a valid mobile number.';
      if (draft.customerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.customerEmail.trim())) e.customerEmail = 'Enter a valid email address.';
    }

    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) goNext();
  };

  const handleSubmit = async () => {
    if (isSubmitting.current) return;
    if (!validateStep(7)) return;

    isSubmitting.current = true;
    setSending(true);
    setErrMsg('');
    trackBookingSubmitted();

    const booking_id = generateBookingId();
    const formattedDate = fmtDate(draft.date);
    const formattedTime = fmtTime(draft.time);
    const servicesList = draft.items.map((i) => `${i.service.name} (×${i.quantity})`).join(' | ');
    const servicesJson = draft.items.map((i) => ({
      name: i.service.name,
      price: i.service.price * i.quantity,
      duration: i.service.duration * i.quantity,
    }));

    const payload = {
      booking_id,
      customer_name: sanitize(draft.customerName),
      customer_email: draft.customerEmail.trim() || '',
      phone: draft.customerPhone.trim(),
      category: draft.category,
      services: servicesJson,
      total_price: totalPrice,
      total_duration: totalDuration,
      date: formattedDate,
      time: formattedTime,
      notes: sanitize(draft.notes) || 'No additional notes.',
      status: 'Confirmed',
      source: 'WYLI Website',
    };

    try {
      // Step 1: Google Sheets persistence
      let sheetOk = false;
      if (WYLI.googleAppsScriptUrl) {
        try {
          const res = await fetch(WYLI.googleAppsScriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.success) {
            sheetOk = true;
          } else {
            throw new Error(data.error || 'Google Sheets webhook returned an error.');
          }
        } catch (err) {
          console.error('[Booking] Google Sheets error:', err);
          setErrMsg(err instanceof Error ? err.message : 'Could not save booking to our system. Please try again or contact us directly on WhatsApp.');
          trackBookingFailed('google_sheets');
          setSending(false);
          isSubmitting.current = false;
          return;
        }
      } else {
        // Demo mode — simulate success
        sheetOk = true;
      }

      trackBookingPersisted(booking_id);

      // Step 2: EmailJS
      const emailPayload = {
        customer_name: payload.customer_name,
        customer_email: payload.customer_email || draft.customerPhone.trim(),
        phone: payload.phone,
        service: servicesList,
        date: formattedDate,
        time: formattedTime,
        message: payload.notes,
        booking_id,
        total_price: totalPrice,
        total_duration: totalDuration,
        category: draft.category,
      };

      await Promise.all([
        emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.CUSTOMER_TEMPLATE_ID, emailPayload),
        emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.OWNER_TEMPLATE_ID, emailPayload),
      ]);

      trackBookingConfirmed(booking_id);

      setSuccessData({
        bookingId: booking_id,
        customerName: payload.customer_name,
        services: servicesList,
        date: formattedDate,
        time: formattedTime,
        totalPrice,
        totalDuration,
        customerEmail: payload.customer_email,
      });

      clearCart();
    } catch (err) {
      console.error('[Booking] Error:', err);
      setErrMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again or contact us directly on WhatsApp.');
      trackBookingFailed('emailjs');
    } finally {
      setSending(false);
      isSubmitting.current = false;
    }
  };

  const visibleServices = activeCategory === 'All'
    ? getServicesByGender(gender)
    : getServicesByGender(gender).filter((s) => s.category === activeCategory);

  return (
    <>
      <section ref={sectionRef} id="book" className="py-32 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border ${
                    step >= s ? 'border-primary bg-primary/10 text-primary' : 'border-black/10 text-muted-foreground'
                  }`}
                >
                  {s}
                </div>
                {s < 7 && (
                  <div
                    className={`w-8 h-px ${step > s ? 'bg-primary' : 'bg-black/10'}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1 — Category */}
          {step === 1 && (
            <div className="text-center">
              <span
                className="appt-tagline text-primary font-sans uppercase tracking-[0.2em] text-xs font-medium block mb-4"
                style={{ opacity: 0 }}
              >
                Step 1 of 7
              </span>
              <h2
                className="appt-heading font-serif text-4xl md:text-5xl text-foreground font-light mb-8"
                style={{ opacity: 0 }}
              >
                Who is this booking <span className="italic text-primary">for?</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {GENDER_OPTIONS.map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setGender(g);
                      goNext();
                    }}
                    className={`px-8 py-4 border transition-all duration-200 ${
                      gender === g ? 'border-primary bg-primary/10 text-primary' : 'border-black/10 text-foreground hover:border-primary/50'
                    }`}
                  >
                    <span className="font-sans text-sm uppercase tracking-widest">{g}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Services */}
          {step === 2 && (
            <div>
              <span className="text-primary font-sans uppercase tracking-[0.2em] text-xs font-medium block mb-4">
                Step 2 of 7
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground font-light mb-8">
                Choose Your <span className="italic text-primary">Services</span>
              </h2>

              <div className="flex flex-wrap gap-3 mb-6">
                {GENDER_OPTIONS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`px-3 py-1.5 text-[10px] uppercase tracking-widest border transition-all ${
                      gender === g ? 'border-primary text-primary' : 'border-black/10 text-muted-foreground'
                    }`}
                  >
                    {g}
                  </button>
                ))}
                {['All', 'Hair', 'Skin', 'Grooming', 'Makeup'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-[10px] uppercase tracking-widest border transition-all ${
                      activeCategory === cat ? 'border-primary text-primary' : 'border-black/10 text-muted-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {visibleServices.map((svc) => {
                  const inCart = draft.items.find((i) => i.service.id === svc.id);
                  return (
                     <div
                       key={svc.id}
                       className="border border-black/5 hover:border-primary/30 transition-all p-5 bg-background flex flex-col"
                     >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-primary/70">
                            {svc.category} · {svc.gender}
                          </span>
                          <h4 className="font-serif text-lg text-foreground">{svc.name}</h4>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground font-light mb-4 flex-1">{svc.description}</p>
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
                               className="w-7 h-7 border border-black/10 flex items-center justify-center hover:border-primary transition-colors"
                             >
                               <Minus size={12} />
                             </button>
                             <span className="text-xs w-6 text-center">{inCart.quantity}</span>
                             <button
                               onClick={() => updateQuantity(svc.id, inCart.quantity + 1)}
                               className="w-7 h-7 border border-black/10 flex items-center justify-center hover:border-primary transition-colors"
                             >
                               <Plus size={12} />
                             </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              addService(svc);
                              trackBookingStarted();
                            }}
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

              {draft.items.length > 0 && (
                <div className="border border-primary/20 bg-primary/5 p-6 mb-6">
                  <h4 className="font-sans text-xs uppercase tracking-widest text-primary mb-4">Selected Services</h4>
                  <div className="space-y-3">
                    {draft.items.map((item) => (
                      <div key={item.service.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-foreground">{item.service.name}</p>
                          <p className="text-xs text-muted-foreground">₹{item.service.price} × {item.quantity}</p>
                        </div>
                        <button
                          onClick={() => removeService(item.service.id)}
                          className="text-muted-foreground hover:text-red-400 transition-colors"
                          aria-label={`Remove ${item.service.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-between pt-3 border-t border-black/10 text-sm">
                      <span className="text-muted-foreground">Total</span>
                      <span className="text-primary font-medium">₹{totalPrice} · {formatDuration(totalDuration)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button onClick={goBack} className="luxury-btn luxury-btn-outline">
                  <ChevronLeft size={16} className="mr-2" /> Back
                </button>
                <button onClick={handleNext} className="luxury-btn luxury-btn-primary">
                  Continue <ChevronRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Confirm Services */}
          {step === 3 && (
            <div className="text-center">
              <span className="text-primary font-sans uppercase tracking-[0.2em] text-xs font-medium block mb-4">
                Step 3 of 7
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground font-light mb-8">
                Review Your <span className="italic text-primary">Services</span>
              </h2>
              <div className="max-w-md mx-auto space-y-3 mb-8">
                {draft.items.map((item) => (
                  <div key={item.service.id} className="flex items-center justify-between border-b border-black/5 pb-3">
                    <div className="text-left">
                      <p className="text-sm text-foreground">{item.service.name}</p>
                      <p className="text-xs text-muted-foreground">₹{item.service.price} × {item.quantity}</p>
                    </div>
                    <span className="text-primary text-sm">₹{item.service.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-4 text-sm">
                  <span className="text-muted-foreground">Total Duration</span>
                  <span className="text-foreground font-medium">{formatDuration(totalDuration)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Price</span>
                  <span className="text-primary font-medium">₹{totalPrice}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <button onClick={goBack} className="luxury-btn luxury-btn-outline">
                  <ChevronLeft size={16} className="mr-2" /> Back
                </button>
                <button onClick={handleNext} className="luxury-btn luxury-btn-primary">
                  Looks Good <ChevronRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4 — Date */}
          {step === 4 && (
            <div className="text-center">
              <span className="text-primary font-sans uppercase tracking-[0.2em] text-xs font-medium block mb-4">
                Step 4 of 7
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground font-light mb-8">
                Pick a <span className="italic text-primary">Date</span>
              </h2>
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <input
                    type="date"
                    value={draft.date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full bg-transparent border-b py-4 text-foreground font-sans text-center text-lg focus:outline-none transition-colors ${
                      errs.date ? 'border-red-400' : 'border-white/20 focus:border-primary'
                    }`}
                  />
                  <Calendar className="absolute right-0 top-4 text-muted-foreground" size={20} />
                </div>
                {errs.date && <p className="text-red-400 text-xs mt-3">{errs.date}</p>}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      const d = new Date();
                      setDate(d.toISOString().split('T')[0]);
                    }}
                    className="px-4 py-2 text-xs border border-black/10 hover:border-primary transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 1);
                      setDate(d.toISOString().split('T')[0]);
                    }}
                    className="px-4 py-2 text-xs border border-black/10 hover:border-primary transition-colors"
                  >
                    Tomorrow
                  </button>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={goBack} className="luxury-btn luxury-btn-outline">
                  <ChevronLeft size={16} className="mr-2" /> Back
                </button>
                <button onClick={handleNext} className="luxury-btn luxury-btn-primary">
                  Continue <ChevronRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5 — Time */}
          {step === 5 && (
            <div className="text-center">
              <span className="text-primary font-sans uppercase tracking-[0.2em] text-xs font-medium block mb-4">
                Step 5 of 7
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground font-light mb-8">
                Choose a <span className="italic text-primary">Time</span>
              </h2>
              <div className="max-w-2xl mx-auto">
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={`py-3 text-xs border transition-all ${
                        draft.time === t ? 'border-primary bg-primary/10 text-primary' : 'border-black/10 text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {fmtTime(t)}
                    </button>
                  ))}
                </div>
                {errs.time && <p className="text-red-400 text-xs mt-4">{errs.time}</p>}
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={goBack} className="luxury-btn luxury-btn-outline">
                  <ChevronLeft size={16} className="mr-2" /> Back
                </button>
                <button onClick={handleNext} className="luxury-btn luxury-btn-primary">
                  Continue <ChevronRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 6 — Customer Details */}
          {step === 6 && (
            <div>
              <span className="text-primary font-sans uppercase tracking-[0.2em] text-xs font-medium block mb-4">
                Step 6 of 7
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground font-light mb-8 text-center">
                Your <span className="italic text-primary">Details</span>
              </h2>
              <div className="max-w-lg mx-auto space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    value={draft.customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder=" "
                    className={`w-full bg-transparent border-b py-3 text-foreground focus:outline-none ${
                      errs.customerName ? 'border-red-400' : 'border-white/20 focus:border-primary'
                    }`}
                  />
                  <label className="absolute left-0 top-3 text-muted-foreground text-sm transition-all pointer-events-none">
                    Full Name *
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    value={draft.customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder=" "
                    className={`w-full bg-transparent border-b py-3 text-foreground focus:outline-none ${
                      errs.customerPhone ? 'border-red-400' : 'border-white/20 focus:border-primary'
                    }`}
                  />
                  <label className="absolute left-0 top-3 text-muted-foreground text-sm transition-all pointer-events-none">
                    Phone Number *
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    value={draft.customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder=" "
                    className={`w-full bg-transparent border-b py-3 text-foreground focus:outline-none ${
                      errs.customerEmail ? 'border-red-400' : 'border-white/20 focus:border-primary'
                    }`}
                  />
                  <label className="absolute left-0 top-3 text-muted-foreground text-sm transition-all pointer-events-none">
                    Email (for confirmation)
                  </label>
                </div>
                <div className="relative">
                  <textarea
                    value={draft.notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder=" "
                    className={`w-full bg-transparent border-b py-3 text-foreground focus:outline-none resize-none ${
                      errs.notes ? 'border-red-400' : 'border-white/20 focus:border-primary'
                    }`}
                  />
                  <label className="absolute left-0 top-3 text-muted-foreground text-sm transition-all pointer-events-none">
                    Special requests (optional)
                  </label>
                </div>
                {Object.values(errs).slice(0, 3).map((err, i) => err && <p key={i} className="text-red-400 text-xs">{err}</p>)}
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={goBack} className="luxury-btn luxury-btn-outline">
                  <ChevronLeft size={16} className="mr-2" /> Back
                </button>
                <button onClick={handleNext} className="luxury-btn luxury-btn-primary">
                  Review <ChevronRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 7 — Review */}
          {step === 7 && (
            <div className="text-center">
              <span className="text-primary font-sans uppercase tracking-[0.2em] text-xs font-medium block mb-4">
                Step 7 of 7
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground font-light mb-8">
                Review & <span className="italic text-primary">Confirm</span>
              </h2>
              <div className="max-w-lg mx-auto text-left space-y-4 mb-8">
                <div className="border-b border-black/5 pb-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Category</p>
                  <p className="text-sm text-foreground">{draft.category}</p>
                </div>
                <div className="border-b border-black/5 pb-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Services</p>
                  {draft.items.map((item) => (
                    <p key={item.service.id} className="text-sm text-foreground">
                      {item.service.name} × {item.quantity}
                    </p>
                  ))}
                </div>
                <div className="border-b border-black/5 pb-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Date & Time</p>
                  <p className="text-sm text-foreground">
                    {fmtDate(draft.date)} at {fmtTime(draft.time)}
                  </p>
                </div>
                <div className="border-b border-black/5 pb-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Customer</p>
                  <p className="text-sm text-foreground">
                    {draft.customerName} · {draft.customerPhone}
                  </p>
                  {draft.customerEmail && (
                    <p className="text-xs text-muted-foreground">{draft.customerEmail}</p>
                  )}
                </div>
                <div className="flex justify-between pt-4">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-primary font-medium text-lg">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-foreground">{formatDuration(totalDuration)}</span>
                </div>
              </div>

              {errMsg && (
                <div
                  role="alert"
                  className="mb-6 flex items-start gap-3 text-sm text-red-600 border border-red-200 rounded-none p-4 bg-red-50 max-w-lg mx-auto text-left"
                >
                  <span>{errMsg}</span>
                </div>
              )}

              <div className="flex justify-between">
                <button onClick={goBack} className="luxury-btn luxury-btn-outline">
                  <ChevronLeft size={16} className="mr-2" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  className="luxury-btn luxury-btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? 'Confirming…' : 'Confirm Appointment'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Success Modal */}
      {successData && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSuccessData(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Booking Confirmation"
        >
          <div className="w-full max-w-md bg-background border border-black/10 shadow-lg relative overflow-hidden">
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="p-8 md:p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full border border-primary/50 flex items-center justify-center text-primary mb-6">
                <Check size={26} />
              </div>
              <p className="text-primary font-sans text-[10px] uppercase tracking-[0.25em] mb-2">
                Booking Confirmed
              </p>
              <h3 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-1">
                Thank you, {successData.customerName.split(' ')[0]}
              </h3>

              <div className="mt-5 mb-7 px-6 py-3 bg-primary/8 border border-primary/20 w-full">
                <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  Booking ID
                </p>
                <p className="font-mono text-lg text-primary tracking-wider font-medium">
                  {successData.bookingId}
                </p>
              </div>

              <div className="w-full text-left space-y-3 mb-8">
                {[
                  ['Services', successData.services],
                  ['Date', successData.date],
                  ['Time', successData.time],
                  ['Total', `₹${successData.totalPrice}`],
                  ['Duration', formatDuration(successData.totalDuration)],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between border-b border-black/5 pb-3">
                    <span className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground">
                      {label}
                    </span>
                    <span className="font-sans text-sm text-foreground">{value}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs font-sans text-muted-foreground/70 leading-relaxed mb-8">
                A confirmation has been sent to{' '}
                <span className="text-primary/80">{successData.customerEmail || 'your phone'}</span>. We look
                forward to seeing you at WYLI.
              </p>

              <button
                onClick={() => setSuccessData(null)}
                className="luxury-btn luxury-btn-outline w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
