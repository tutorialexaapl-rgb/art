import { SEO_CONFIG, SITE_TOPIC } from './seo-config';
import { absoluteUrl } from './canonical';

/**
 * Schema.org (JSON-LD) builders.
 * Each returns a plain object suitable for injection via the JsonLd component.
 *
 * Principles:
 * - Only emit data that matches the visible page content.
 * - Never fabricate ratings, reviews, prices, availability, or aggregateRating.
 * - Every object is valid JSON and safe for SSR (no DOM access).
 */

type Schema = Record<string, unknown>;

const CONTEXT = 'https://schema.org';

function compact(schema: Schema): Schema {
  const out: Schema = {};
  for (const [key, value] of Object.entries(schema)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value;
  }
  return out;
}

// ─── Homepage ───────────────────────────────────────────────────────────────

/** Organization schema for the homepage - real brand info only. */
export function organizationSchema(): Schema {
  return {
    '@context': CONTEXT,
    '@type': 'Organization',
    name: SEO_CONFIG.brand,
    url: SEO_CONFIG.siteUrl,
    description: `${SITE_TOPIC}. Platforma łącząca zlecających z artystami malarzami w Polsce.`,
    areaServed: { '@type': 'Country', name: 'Polska' },
    knowsAbout: ['malarstwo', 'obrazy na zamówienie', 'sztuka współczesna'],
  };
}

/** WebSite schema with SearchAction - the search endpoint is real. */
export function websiteSchema(): Schema {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    name: SEO_CONFIG.brand,
    url: SEO_CONFIG.siteUrl,
    description: SITE_TOPIC,
    inLanguage: SEO_CONFIG.locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SEO_CONFIG.siteUrl}/zlecenia?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ─── Breadcrumbs ────────────────────────────────────────────────────────────

/** BreadcrumbList from an ordered list of {name, path}. */
export function breadcrumbSchema(items: { name: string; path: string }[]): Schema {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

// ─── Blog ───────────────────────────────────────────────────────────────────

/** BlogPosting schema for a blog article - matches the visible content. */
export function articleSchema(opts: {
  title: string;
  slug: string;
  description: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  keywords?: string[];
}): Schema {
  return compact({
    '@context': CONTEXT,
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    image: opts.image || undefined,
    datePublished: opts.publishedAt,
    dateModified: opts.updatedAt ?? opts.publishedAt,
    author: { '@type': 'Person', name: opts.authorName },
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.brand,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/og-default.jpg') },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(`/blog/${opts.slug}`) },
    inLanguage: SEO_CONFIG.locale,
    keywords: opts.keywords && opts.keywords.length > 0 ? opts.keywords.join(', ') : undefined,
  });
}

/** Blog schema for the blog listing page. */
export function blogSchema(): Schema {
  return {
    '@context': CONTEXT,
    '@type': 'Blog',
    name: `Blog - ${SEO_CONFIG.brand}`,
    url: absoluteUrl('/blog'),
    description: `Porady, inspiracje i przewodniki o ${SITE_TOPIC.toLowerCase()}.`,
    inLanguage: SEO_CONFIG.locale,
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.brand,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/og-default.jpg') },
    },
  };
}

// ─── Artist profile ────────────────────────────────────────────────────────

/** Person + VisualArtist schema - only real, visible profile data. */
export function artistSchema(opts: {
  artistName: string;
  slug: string;
  bio: string;
  styles: string[];
  techniques: string[];
  specializations?: string[];
  location: string;
  avatarUrl?: string;
  website?: string;
  instagram?: string;
  isVerified?: boolean;
  portfolioImages?: { url: string; caption: string }[];
}): Schema {
  const sameAs: string[] = [];
  if (opts.website) sameAs.push(opts.website.startsWith('http') ? opts.website : `https://${opts.website}`);
  if (opts.instagram) {
    const handle = opts.instagram.replace('@', '');
    sameAs.push(handle.startsWith('http') ? handle : `https://instagram.com/${handle}`);
  }

  const knowsAbout = [...opts.styles, ...opts.techniques, ...opts.specializations ?? [], 'malarstwo'];

  const schema = compact({
    '@context': CONTEXT,
    '@type': ['Person', 'VisualArtist'],
    name: opts.artistName,
    description: opts.bio || undefined,
    url: absoluteUrl(`/artysci/${opts.slug}`),
    image: opts.avatarUrl || undefined,
    jobTitle: 'Artysta malarz',
    address: opts.location ? { '@type': 'PostalAddress', addressLocality: opts.location } : undefined,
    knowsAbout: knowsAbout.length > 0 ? knowsAbout : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  });

  if (opts.portfolioImages && opts.portfolioImages.length > 0) {
    schema.artwork = opts.portfolioImages.map((img) =>
      imageObjectSchema({ url: img.url, caption: img.caption }),
    );
  }

  return schema;
}

/** ImageObject schema for a portfolio artwork image. */
export function imageObjectSchema(opts: {
  url: string;
  caption: string;
  width?: number;
  height?: number;
}): Schema {
  return compact({
    '@context': CONTEXT,
    '@type': 'ImageObject',
    contentUrl: opts.url,
    url: opts.url,
    caption: opts.caption,
    inLanguage: SEO_CONFIG.locale,
    width: opts.width ? { '@type': 'QuantitativeValue', value: opts.width, unitCode: 'E37' } : undefined,
    height: opts.height ? { '@type': 'QuantitativeValue', value: opts.height, unitCode: 'E37' } : undefined,
  });
}

// ─── Commission (zlecenie) ─────────────────────────────────────────────────

/**
 * CreativeWork schema for a commission request.
 * This is a request for a custom artwork, NOT a product for sale.
 * No offers, prices, availability, or ratings - the budget is the client's
 * declared range, not a sale price, so it is not emitted as a Schema.org Offer.
 */
export function commissionSchema(opts: {
  title: string;
  slug: string;
  publicSummary: string;
  style: string;
  medium?: string;
  widthCm?: number;
  heightCm?: number;
  deadline?: string;
  location?: string;
  tags?: string[];
  datePublished?: string;
  dateModified?: string;
}): Schema {
  return compact({
    '@context': CONTEXT,
    '@type': 'CreativeWork',
    name: opts.title,
    description: opts.publicSummary || undefined,
    url: absoluteUrl(`/zlecenia/${opts.slug}`),
    genre: opts.style || undefined,
    material: opts.medium || undefined,
    size: opts.widthCm && opts.heightCm ? `${opts.widthCm}×${opts.heightCm} cm` : undefined,
    spatialCoverage: opts.location ? { '@type': 'Place', name: opts.location } : undefined,
    keywords: opts.tags && opts.tags.length > 0 ? opts.tags.join(', ') : undefined,
    datePublished: opts.datePublished || undefined,
    dateModified: opts.dateModified || undefined,
    inLanguage: SEO_CONFIG.locale,
    provider: { '@type': 'Organization', name: SEO_CONFIG.brand },
    isAccessibleForFree: true,
  });
}

// ─── FAQ ───────────────────────────────────────────────────────────────────

/**
 * FAQPage schema - only for questions and answers that are actually
 * visible on the page. Pass only the rendered FAQ items.
 */
export function faqSchema(faqs: { question: string; answer: string }[]): Schema {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

// ─── Listing & category pages ──────────────────────────────────────────────

/** ItemList schema for listing pages (artists, commissions, categories). */
export function itemListSchema(opts: {
  name: string;
  path: string;
  items: { name: string; path: string }[];
}): Schema {
  return {
    '@context': CONTEXT,
    '@type': 'ItemList',
    name: opts.name,
    url: absoluteUrl(opts.path),
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

/** CollectionPage schema for category pages. */
export function collectionPageSchema(opts: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
}): Schema {
  return {
    '@context': CONTEXT,
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    inLanguage: SEO_CONFIG.locale,
    isPartOf: { '@type': 'WebSite', name: SEO_CONFIG.brand, url: SEO_CONFIG.siteUrl },
    mainEntity: itemListSchema({ name: opts.name, path: opts.path, items: opts.items }),
  };
}

// ─── Static pages ──────────────────────────────────────────────────────────

/** Service schema for service-oriented pages (e.g. zlecenia dla artystów). */
export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}): Schema {
  return compact({
    '@context': CONTEXT,
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    serviceType: opts.serviceType,
    provider: { '@type': 'Organization', name: SEO_CONFIG.brand },
    areaServed: { '@type': 'Country', name: 'Polska' },
  });
}

/** WebPage schema for generic static pages. */
export function webPageSchema(opts: {
  title: string;
  description: string;
  path: string;
}): Schema {
  return {
    '@context': CONTEXT,
    '@type': 'WebPage',
    name: opts.title,
    description: opts.description,
    url: absoluteUrl(opts.path),
    inLanguage: SEO_CONFIG.locale,
    isPartOf: { '@type': 'WebSite', name: SEO_CONFIG.brand, url: SEO_CONFIG.siteUrl },
  };
}

/** ContactPage schema for the contact page. */
export function contactPageSchema(): Schema {
  return {
    '@context': CONTEXT,
    '@type': 'ContactPage',
    name: `Kontakt - ${SEO_CONFIG.brand}`,
    url: absoluteUrl('/kontakt'),
    inLanguage: SEO_CONFIG.locale,
  };
}
