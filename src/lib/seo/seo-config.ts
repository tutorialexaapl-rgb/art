/**
 * Central SEO configuration for the entire application.
 * Single source of truth for brand identity, locale, and core search intents.
 */

export const SEO_CONFIG = {
  brand: 'Artiors',
  domain: 'artiors.pl',
  siteUrl: 'https://artiors.pl',
  locale: 'pl-PL',
  ogLocale: 'pl_PL',
  language: 'pl',
  country: 'PL',
  defaultOgImage: '/og-default.jpg',
  twitterHandle: '@artiors_pl',
  themeColor: '#1c1917',
} as const;

/** Primary search intent the site targets. */
export const SITE_TOPIC = 'Obrazy Ręcznie Malowane na Zamówienie';

/**
 * Core search intents (główne intencje) used across metadata generation.
 * These are the primary keywords the platform is optimized for in Polish search.
 */
export const CORE_INTENTS = [
  'obrazy ręcznie malowane na zamówienie',
  'obrazy na zamówienie',
  'zamów obraz',
  'zleć obraz',
  'zlecenia dla artystów',
  'zlecenia malarskie',
  'artyści na zamówienie',
] as const;

/** Tracking/query parameters to strip from canonical URLs. */
export const STRIPPED_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'ref', 'source', '_ga', 'mc_cid', 'mc_eid',
] as const;
