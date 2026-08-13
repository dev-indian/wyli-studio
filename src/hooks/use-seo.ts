import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
}

const SITE_URL = 'https://wyli.in';

export function useSEO({
  title = 'WYLI — Glow & Grooming Studio | Gilat Bazar, Varanasi',
  description = 'WYLI Glow & Grooming Studio in Gilat Bazar, Varanasi — premium hair, skin, makeup, and grooming services for everyone.',
  canonical = SITE_URL,
}: SEOProps = {}) {
  useEffect(() => {
    document.title = title;

    const updateMeta = (selector: string, attr: string, content: string) => {
      let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
      if (!el) {
        if (selector.startsWith('link')) {
          el = document.createElement('link');
          document.head.appendChild(el);
        } else {
          el = document.createElement('meta');
          document.head.appendChild(el);
        }
      }
      el.setAttribute(attr, content);
      if (attr === 'content') {
        (el as HTMLMetaElement).content = content;
      }
    };

    updateMeta('meta[name="description"]', 'content', description);
    updateMeta('meta[property="og:title"]', 'content', title);
    updateMeta('meta[property="og:description"]', 'content', description);
    updateMeta('meta[name="twitter:title"]', 'content', title);
    updateMeta('meta[name="twitter:description"]', 'content', description);

    let canonicalLink = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;
  }, [title, description, canonical]);
}
