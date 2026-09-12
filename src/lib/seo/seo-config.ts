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
  'obrazy na zamówienie online',
  'ręcznie malowany obraz na zamówienie online',
  'zamów obraz online',
  'zamów obraz',
  'zleć obraz',
  'zlecenia dla artystów',
  'zlecenia malarskie',
  'artyści na zamówienie',
] as const;

/**
 * Stała lista stylów/kategorii malarskich używana w filtrach zleceń i artystów.
 * Gwarantuje że te opcje są zawsze dostępne w filtrach niezależnie od danych.
 */
export const PAINTING_STYLES = [
  'Portret',
  'Abstrakcja',
  'Pejzaż',
  'Botanika',
  'Figuratywne',
  'Architektura',
  'Martwa natura',
  'Zwierzęta',
  'Geometryczne',
  'Teksturowe',
] as const;

/** Tracking/query parameters to strip from canonical URLs. */
export const STRIPPED_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'ref', 'source', '_ga', 'mc_cid', 'mc_eid',
] as const;
