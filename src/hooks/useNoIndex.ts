import { useEffect } from 'react';
import { selfCanonical } from '@/lib/seo';

/**
 * Applies noindex,nofollow robots meta for private/non-indexable routes.
 * Canonical is set to a clean self-referential URL (pathname only, no query/hash).
 */
export function useNoIndex() {
  useEffect(() => {
    let el = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', 'robots');
      document.head.appendChild(el);
    }
    el.setAttribute('content', 'noindex, nofollow');

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', selfCanonical());

    return () => {
      if (el) el.setAttribute('content', 'index, follow');
    };
  }, []);
}
