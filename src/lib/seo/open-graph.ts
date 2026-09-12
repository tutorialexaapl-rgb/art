import { SEO_CONFIG } from './seo-config';
import { canonicalUrl } from './canonical';

/**
 * Open Graph + Twitter Card metadata generation.
 * Every public page receives a complete OG/Twitter set.
 */

export interface OpenGraphData {
  type: 'website' | 'article' | 'profile';
  title: string;
  description: string;
  path: string;
  image?: string;
  siteName?: string;
  locale?: string;
}

export interface TwitterCardData {
  card: 'summary' | 'summary_large_image';
  title: string;
  description: string;
  image?: string;
  handle?: string;
}

/** Build OG metadata object from page-level data. */
export function buildOpenGraph(data: OpenGraphData) {
  const image = data.image ?? absoluteDefaultOgImage();
  const type = data.type;

  return {
    'og:title': data.title,
    'og:description': data.description,
    'og:type': type,
    'og:url': canonicalUrl(data.path),
    'og:site_name': data.siteName ?? SEO_CONFIG.brand,
    'og:locale': data.locale ?? SEO_CONFIG.ogLocale,
    'og:image': image,
    ...(type === 'article' ? { 'og:image:width': '1200', 'og:image:height': '630' } : {}),
  } as Record<string, string>;
}

/** Build Twitter Card metadata from page-level data. */
export function buildTwitterCard(data: {
  title: string;
  description: string;
  image?: string;
}): TwitterCardData {
  const hasImage = Boolean(data.image);
  return {
    card: hasImage ? 'summary_large_image' : 'summary',
    title: data.title,
    description: data.description,
    image: data.image ?? absoluteDefaultOgImage(),
    handle: SEO_CONFIG.twitterHandle,
  };
}

/** Absolute URL for the default OG image. */
export function absoluteDefaultOgImage(): string {
  return `${SEO_CONFIG.siteUrl}${SEO_CONFIG.defaultOgImage}`;
}
