/**
 * WYLI Studio — Google Analytics 4
 *
 * MEASUREMENT ID: G-L3EJYL1CG0
 *
 * To change this ID later:
 * 1. Replace BOTH occurrences of "G-L3EJYL1CG0" in index.html.
 * 2. Also update any hardcoded references here if needed.
 */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
) {
  gtag('event', eventName, params ?? {});
}

export function trackAppointmentBooked(service: string) {
  trackEvent('appointment_booked', { service });
}

export function trackWhatsAppClick() {
  trackEvent('whatsapp_click');
}

export function trackGalleryVisit() {
  trackEvent('gallery_visit');
}

export function trackContactVisit() {
  trackEvent('contact_visit');
}

export function trackServicesVisit() {
  trackEvent('services_visit');
}

export function trackBookingStarted() {
  trackEvent('booking_started');
}

export function trackBookingSubmitted() {
  trackEvent('booking_submitted');
}

export function trackBookingPersisted(bookingId: string) {
  trackEvent('booking_persisted', { booking_id: bookingId });
}

export function trackBookingFailed(reason: string) {
  trackEvent('booking_failed', { reason });
}

export function trackBookingConfirmed(bookingId: string) {
  trackEvent('booking_confirmed', { booking_id: bookingId });
}

export function trackFindYourWYLIStarted() {
  trackEvent('find_your_wyli_started');
}

export function trackServiceAdded(serviceId: string) {
  trackEvent('service_added', { service_id: serviceId });
}

export function trackBuildVisitStarted() {
  trackEvent('build_visit_started');
}
