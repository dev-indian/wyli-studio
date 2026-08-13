/**
 * FloatingWhatsApp — optional floating chat button (bottom-right)
 *
 * WhatsApp is NOT part of the booking workflow.
 * It is an optional shortcut for customers who prefer chatting directly.
 * Clicks are tracked via GA4.
 */
import { useState } from 'react';
import { SiWhatsapp } from 'react-icons/si';
import { X } from 'lucide-react';
import { trackWhatsAppClick } from '@/lib/analytics';

// WYLI's WhatsApp number (international format, no +)
const WHATSAPP_NUMBER = '919696197594';
const WHATSAPP_DEFAULT_MSG = encodeURIComponent(
  'Hi! I have a query about WYLI Glow & Grooming Studio.',
);

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    trackWhatsAppClick();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_DEFAULT_MSG}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-2">
      {/* Tooltip */}
      {showTooltip && (
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-black/5 rounded-full px-4 py-2 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="text-xs font-sans text-foreground whitespace-nowrap">Chat with us on WhatsApp</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Chat with WYLI Glow & Grooming Studio on WhatsApp"
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-md active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #25D366, #128C7E)',
        }}
      >
        <SiWhatsapp size={26} color="#fff" />
      </button>
    </div>
  );
}
