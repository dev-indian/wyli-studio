/**
 * WYLI Studio — EmailJS Configuration
 *
 * HOW TO UPDATE YOUR CREDENTIALS:
 *
 * 1. PUBLIC KEY       → EMAILJS_PUBLIC_KEY below
 *    Where to find:   EmailJS Dashboard → Account → API Keys
 *
 * 2. SERVICE ID       → EMAILJS_SERVICE_ID below
 *    Where to find:   EmailJS Dashboard → Email Services → your service
 *
 * 3. CUSTOMER TEMPLATE ID → EMAILJS_CUSTOMER_TEMPLATE_ID
 *    This template sends a confirmation email TO the customer.
 *    Required template variables:
 *      {{to_name}}       — Customer's full name
 *      {{to_email}}      — Customer's email address
 *      {{service}}       — Selected service(s)
 *      {{date}}          — Appointment date
 *      {{time}}          — Appointment time
 *      {{phone}}         — Customer's phone number
 *      {{notes}}         — Additional notes
 *      {{booking_id}}    — Booking reference ID
 *      {{total_price}}   — Total price
 *      {{total_duration}}— Total duration
 *
 * 4. OWNER TEMPLATE ID → EMAILJS_OWNER_TEMPLATE_ID
 *    This template sends booking details TO the owner.
 *    Required template variables:
 *      {{customer_name}}   — Customer's full name
 *      {{customer_email}}  — Customer's email
 *      {{customer_phone}}  — Customer's phone
 *      {{service}}         — Selected service(s)
 *      {{date}}            — Appointment date
 *      {{time}}            — Appointment time
 *      {{notes}}           — Additional notes
 *      {{booking_id}}      — Booking reference ID
 *      {{total_price}}     — Total price
 *      {{total_duration}}  — Total duration
 *      {{category}}        — Service category
 *    Set the owner's email in the EmailJS template dashboard → "To Email" field.
 */

export const EMAILJS_CONFIG = {
  PUBLIC_KEY: '67G-fFdInRZEXLq2m',
  SERVICE_ID: 'service_u79xj2a',
  CUSTOMER_TEMPLATE_ID: 'template_kwhxjhi',
  OWNER_TEMPLATE_ID: 'template_m1bwp6g',
} as const;
