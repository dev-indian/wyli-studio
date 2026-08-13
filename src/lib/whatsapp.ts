/**
 * WYLI Studio — WhatsApp Click-to-Chat helper
 *
 * Generates a professionally formatted appointment message and a
 * wa.me deep-link URL. Completely client-side — no backend required.
 */

const OWNER_NUMBER = '919696197594';

export interface BookingFields {
  name: string;
  mobile: string;
  email?: string;
  gender: string;
  service: string;
  date: string;
  time: string;
  stylist?: string;
  notes?: string;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

export function buildWhatsAppMessage(f: BookingFields): string {
  const lines: string[] = [
    '✨ *New Appointment Request – WYLI Studio*',
    '',
    `👤 Name: ${f.name}`,
    `📞 Mobile: ${f.mobile}`,
  ];

  if (f.email?.trim()) lines.push(`📧 Email: ${f.email.trim()}`);

  lines.push(
    `👤 Gender: ${f.gender}`,
    `💇 Service: ${f.service}`,
    `📅 Preferred Date: ${formatDate(f.date)}`,
    `🕒 Preferred Time: ${formatTime(f.time)}`,
  );

  if (f.stylist?.trim()) lines.push(`💼 Preferred Stylist: ${f.stylist.trim()}`);

  if (f.notes?.trim()) {
    lines.push('', `📝 Additional Notes:\n${f.notes.trim()}`);
  }

  lines.push('', '━━━━━━━━━━━━━━', '', 'Please confirm my appointment.\nThank you!');

  return lines.join('\n');
}

export function buildWhatsAppUrl(fields: BookingFields): string {
  const message = buildWhatsAppMessage(fields);
  return `https://wa.me/${OWNER_NUMBER}?text=${encodeURIComponent(message)}`;
}

export interface ValidationErrors {
  name?: string;
  mobile?: string;
  email?: string;
  gender?: string;
  service?: string;
  date?: string;
  time?: string;
}

export function validateBooking(f: Partial<BookingFields>): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!f.name?.trim())
    errors.name = 'Full name is required.';

  if (!f.mobile?.trim()) {
    errors.mobile = 'Mobile number is required.';
  } else if (!/^[+]?[\d\s\-()]{8,15}$/.test(f.mobile.trim())) {
    errors.mobile = 'Please enter a valid mobile number.';
  }

  if (f.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
    errors.email = 'Please enter a valid email address.';

  if (!f.gender)
    errors.gender = 'Please select your gender.';

  if (!f.service)
    errors.service = 'Please select a service.';

  if (!f.date) {
    errors.date = 'Please select a preferred date.';
  } else {
    const chosen = new Date(f.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(chosen.getTime()))
      errors.date = 'Invalid date.';
    else if (chosen < today)
      errors.date = 'Please choose a future date.';
  }

  if (!f.time)
    errors.time = 'Please select a preferred time.';

  return errors;
}

export const hasErrors = (e: ValidationErrors) => Object.keys(e).length > 0;
