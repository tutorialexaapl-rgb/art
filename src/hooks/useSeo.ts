import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { PageMetadata } from '@/lib/seo';
import { canonicalUrl, getStaticMetadata, SEO_CONFIG, absoluteDefaultOgImage } from '@/lib/seo';

const MANAGED_META_SELECTORS = [
  'meta[name="description"]',
  'meta[name="keywords"]',
  'meta[name="robots"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[property="og:type"]',
  'meta[property="og:url"]',
  'meta[property="og:image"]',
  'meta[property="og:site_name"]',
  'meta[property="og:locale"]',
  'meta[name="twitter:card"]',
  'meta[name="twitter:title"]',
  'meta[name="twitter:description"]',
  'meta[name="twitter:image"]',
  'meta[name="twitter:url"]',
];

const MANAGED_LINK_SELECTORS = [
  'link[rel="canonical"]',
];

const JSONLD_FLAG = 'data-seo-jsonld';

function setMeta(selector: string, attribute: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    const match = selector.match(/\[(.+?)="(.+?)"\]/);
    if (match) {
      el.setAttribute(match[1], match[2]);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attribute, content);
}

function setLinkRel(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function applyMetadata(data: PageMetadata) {
  const canonical = canonicalUrl(data.canonicalPath);
  const ogImage = data.ogImage ?? absoluteDefaultOgImage();

  document.title = data.title;

  setMeta('meta[name="description"]', 'content', data.description);
  if (data.keywords.length > 0) {
    setMeta('meta[name="keywords"]', 'content', data.keywords.join(', '));
  }
  setMeta('meta[name="robots"]', 'content', data.robots);

  setLinkRel('canonical', canonical);

  // Open Graph
  setMeta('meta[property="og:title"]', 'content', data.title);
  setMeta('meta[property="og:description"]', 'content', data.description);
  setMeta('meta[property="og:type"]', 'content', data.ogType);
  setMeta('meta[property="og:url"]', 'content', canonical);
  setMeta('meta[property="og:site_name"]', 'content', SEO_CONFIG.brand);
  setMeta('meta[property="og:locale"]', 'content', SEO_CONFIG.ogLocale);
  setMeta('meta[property="og:image"]', 'content', ogImage);

  // Twitter Card
  const cardType = ogImage ? 'summary_large_image' : 'summary';
  setMeta('meta[name="twitter:card"]', 'content', cardType);
  setMeta('meta[name="twitter:title"]', 'content', data.title);
  setMeta('meta[name="twitter:description"]', 'content', data.description);
  setMeta('meta[name="twitter:image"]', 'content', ogImage);
  setMeta('meta[name="twitter:url"]', 'content', canonical);
}

function cleanupManaged() {
  for (const selector of [...MANAGED_META_SELECTORS, ...MANAGED_LINK_SELECTORS]) {
    document.head.querySelectorAll(selector).forEach((el) => el.remove());
  }
  document.head.querySelectorAll(`script[${JSONLD_FLAG}]`).forEach((el) => el.remove());
}

function injectSchema(schemas: NonNullable<PageMetadata['schema']>) {
  for (const data of schemas) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.setAttribute(JSONLD_FLAG, 'true');
    document.head.appendChild(script);
  }
}

/**
 * Applies full SEO metadata (title, description, canonical, robots, OG, Twitter,
 * JSON-LD schema) for the current page. Call in any page component.
 */
export function useSeo(data: PageMetadata) {
  const location = useLocation();
  useEffect(() => {
    applyMetadata(data);
    if (data.schema && data.schema.length > 0) {
      injectSchema(data.schema);
    }
    return cleanupManaged;
  }, [data.title, data.description, data.canonicalPath, data.ogImage, data.robots, location.pathname, JSON.stringify(data.schema)]);
}

/** Convenience hook for static pages by path key. */
export function useStaticSeo(path: string) {
  useSeo(getStaticMetadata(path));
}
