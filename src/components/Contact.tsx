import { Phone, MapPin, Clock } from 'lucide-react';
import { SiInstagram, SiWhatsapp } from 'react-icons/si';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-background border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8">
          
          {/* Info */}
          <div className="flex flex-col space-y-12">
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-8">Visit WYLI</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="text-primary mt-1 mr-4 shrink-0" size={20} />
                  <div>
                    <h4 className="font-sans text-sm font-medium text-foreground uppercase tracking-wider mb-2">Location</h4>
                    <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                      S 1/15 CA, Gilat Bazar<br />
                      front of Shiv Mandir, near Heiwel Hospital<br />
                      Varanasi, Uttar Pradesh
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="text-primary mt-1 mr-4 shrink-0" size={20} />
                  <div>
                    <h4 className="font-sans text-sm font-medium text-foreground uppercase tracking-wider mb-2">Direct Line</h4>
                    <p className="font-sans text-sm text-muted-foreground">
                      +91 9696197594
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="text-primary mt-1 mr-4 shrink-0" size={20} />
                  <div>
                    <h4 className="font-sans text-sm font-medium text-foreground uppercase tracking-wider mb-2">Hours</h4>
                    <p className="font-sans text-sm text-muted-foreground">
                      Contact for hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Embed */}
          <div className="lg:col-span-1 h-[400px] lg:h-auto bg-card rounded-sm overflow-hidden border border-white/5 relative grayscale-[0.5] contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115408.0883204938!2d82.90870691523438!3d25.3176451!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2db76febcf4d%3A0x68131710853ff0b5!2sVaranasi%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1709664532148!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            ></iframe>
          </div>

          {/* Socials */}
          <div className="flex flex-col lg:items-end">
            <h2 className="font-serif text-3xl text-foreground mb-8">Connect</h2>
            <div className="flex flex-col space-y-6">
              <a 
                href="https://www.instagram.com/_wylistudio/" 
                className="flex items-center group"
                target="_blank"
                rel="noreferrer"
              >
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mr-4 group-hover:border-primary transition-colors">
                  <SiInstagram className="text-foreground group-hover:text-primary transition-colors" size={20} />
                </div>
                <span className="font-sans text-sm text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest">
                  Instagram
                </span>
              </a>
              
              <a 
                href="https://wa.me/919696197594?text=Hi!%20I%20have%20a%20query%20about%20WYLI." 
                className="flex items-center group"
                target="_blank"
                rel="noreferrer"
              >
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mr-4 group-hover:border-primary transition-colors">
                  <SiWhatsapp className="text-foreground group-hover:text-primary transition-colors" size={20} />
                </div>
                <span className="font-sans text-sm text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest">
                  WhatsApp
                </span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
