/**
 * Centralized SEO system.
 *
 * Modules:
 *  - seo-config.ts   - brand, locale, core intents, site URL
 *  - keywords.ts      - keyword clusters per page type
 *  - canonical.ts     - URL normalization (trailing slash, query params, tracking)
 *  - open-graph.ts    - OG + Twitter Card builders
 *  - schema.ts        - JSON-LD schema.org builders
 *  - metadata.ts      - PageMetadata type, static + dynamic metadata factories
 *  - seo-utils.ts     - high-level generators for commissions, artists, categories, blog
 *
 * Usage in pages:
 *   import { useStaticSeo } from '@/hooks/useSeo';
 *   useStaticSeo('/zlecenia');
 *
 *   import { useSeo } from '@/hooks/useSeo';
 *   import { generateCommissionMetadata } from '@/lib/seo';
 *   useSeo(generateCommissionMetadata(commission));
 */

export { SEO_CONFIG, SITE_TOPIC, CORE_INTENTS } from './seo-config';
export { KEYWORDS, type KeywordGroup } from './keywords';
export { absoluteUrl, canonicalUrl, normalizePath, selfCanonical } from './canonical';
export { buildOpenGraph, buildTwitterCard, absoluteDefaultOgImage, type OpenGraphData, type TwitterCardData } from './open-graph';
export {
  organizationSchema, websiteSchema, breadcrumbSchema, commissionSchema,
  artistSchema, itemListSchema, collectionPageSchema, faqSchema,
  contactPageSchema, articleSchema, blogSchema, webPageSchema, imageObjectSchema, serviceSchema,
  type Schema,
} from './schema';
export {
  buildMetadata, buildPageMetadata, getStaticMetadata, STATIC_METADATA,
  buildCommissionMetadata, buildArtistMetadata, buildCategoryMetadata,
  buildObrazKategoriaMetadata, buildObrazyWnetrzMetadata,
  buildBlogKategoriaMetadata, buildBlogPostMetadata,
  HOMEPAGE_FAQS, OBRAZY_NA_ZAMOWIENIE_FAQS, ZLEC_OBRAZ_FAQS, ZLECENIA_DLA_ARTYSTOW_FAQS,
  type PageMetadata,
} from './metadata';
export {
  generateAltText, generateSlug,
  generateCommissionMetadata, generateArtistMetadata,
  generateCategoryMetadata, generateBlogPostMetadata,
} from './seo-utils';
export {
  portfolioAlt, commissionInspirationAlt, commissionInteriorAlt,
  artistAvatarAlt, artistCoverAlt, blogFeaturedAlt, blogInlineAlt,
  sectionImageAlt, lightboxAlt, isGeneric,
} from './alt-text';
export {
  PUBLIC_ROUTES, NOINDEX_ROUTES,
  OBRAZY_KATEGORIE, OBRAZY_WNETRZ, BLOG_KATEGORIE,
  getObrazKategoria, getObrazyWnetrz, getBlogKategoria,
  type RouteEntry, type ObrazKategoria, type ObrazyWnetrz, type BlogKategoria,
} from './seo-routes';
export { SITEMAP_ENDPOINTS, pingSearchEngines, verifySitemap } from './sitemap';
