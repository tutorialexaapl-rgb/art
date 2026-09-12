import { slugify } from '@/lib/utils';
import type { ArtistProfile, ArtistPortfolioItem, CommissionRequest } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { buildCommissionMetadata, buildArtistMetadata, buildCategoryMetadata, buildBlogPostMetadata, type PageMetadata } from './metadata';
import { commissionSchema, artistSchema, breadcrumbSchema, collectionPageSchema, articleSchema, imageObjectSchema } from './schema';
import { portfolioAlt } from './alt-text';

export { slugify as generateSlug } from '@/lib/utils';

/** Generate descriptive alt text for a portfolio image. */
export function generateAltText(
  artist: Pick<ArtistProfile, 'artistName' | 'styles'>,
  item?: Pick<ArtistPortfolioItem, 'title' | 'technique'>,
): string {
  if (!item) return `Praca artysty ${artist.artistName}`;
  return portfolioAlt(artist, item);
}

/** Build full PageMetadata for a commission detail page (including schema). */
export function generateCommissionMetadata(commission: CommissionRequest): PageMetadata {
  const schema = [
    commissionSchema({
      title: commission.title,
      slug: commission.slug,
      publicSummary: commission.publicSummary,
      style: commission.style,
      medium: commission.medium,
      widthCm: commission.widthCm,
      heightCm: commission.heightCm,
      deadline: commission.deadline,
      location: commission.location,
      tags: commission.tags,
      datePublished: commission.createdAt,
      dateModified: commission.updatedAt,
    }),
    breadcrumbSchema([
      { name: 'Strona główna', path: '/' },
      { name: 'Zlecenia', path: '/zlecenia' },
      { name: commission.title, path: `/zlecenia/${commission.slug}` },
    ]),
  ];

  return buildCommissionMetadata({
    title: commission.title,
    slug: commission.slug,
    publicSummary: commission.publicSummary,
    style: commission.style,
    medium: commission.medium,
    location: commission.location,
    widthCm: commission.widthCm,
    heightCm: commission.heightCm,
    budgetMin: commission.budgetMin,
    budgetMax: commission.budgetMax,
    inspirationImages: commission.inspirationImages,
    status: commission.status,
    roomType: commission.roomType,
    mood: commission.mood,
    deadline: commission.deadline,
    preferredColors: commission.preferredColors,
    orientation: commission.orientation,
    schema,
  });
}

/** Build full PageMetadata for an artist profile page (including schema). */
export function generateArtistMetadata(artist: ArtistProfile): PageMetadata {
  const portfolioImages = (artist.portfolio ?? [])
    .filter((p) => p.isPublic)
    .map((p) => ({ url: p.imageUrl, caption: generateAltText(artist, p) }));

  const schema = [
    artistSchema({
      artistName: artist.artistName,
      slug: artist.slug,
      bio: artist.bio,
      styles: artist.styles,
      techniques: artist.techniques,
      specializations: artist.specializations,
      location: artist.location,
      avatarUrl: artist.avatarUrl,
      website: artist.website,
      instagram: artist.instagram,
      isVerified: artist.isVerified,
      portfolioImages,
    }),
    breadcrumbSchema([
      { name: 'Strona główna', path: '/' },
      { name: 'Artyści', path: '/artysci' },
      { name: artist.artistName, path: `/artysci/${artist.slug}` },
    ]),
  ];

  return buildArtistMetadata({
    artistName: artist.artistName,
    slug: artist.slug,
    bio: artist.bio,
    styles: artist.styles,
    techniques: artist.techniques,
    location: artist.location,
    avatarUrl: artist.avatarUrl,
    schema,
  });
}

/** Build full PageMetadata for a category page (including schema). */
export function generateCategoryMetadata(opts: {
  name: string;
  description: string;
  slug: string;
  items: { name: string; path: string }[];
  keywords?: string[];
}): PageMetadata {
  const schema = [
    collectionPageSchema({
      name: opts.name,
      description: opts.description,
      path: `/kategoria/${opts.slug}`,
      items: opts.items,
    }),
    breadcrumbSchema([
      { name: 'Kategorie', path: '/kategoria' },
      { name: opts.name, path: `/kategoria/${opts.slug}` },
    ]),
  ];

  return buildCategoryMetadata({
    name: opts.name,
    description: opts.description,
    slug: opts.slug,
    keywords: opts.keywords,
    schema,
  });
}

/** Build full PageMetadata for a blog post (including schema). */
export function generateBlogPostMetadata(opts: {
  title: string;
  slug: string;
  description: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  keywords?: string[];
  seoTitle?: string;
  seoDescription?: string;
  canonical?: string;
  noindex?: boolean;
  schemaType?: string;
}): PageMetadata {
  const schema = [
    articleSchema({
      title: opts.title,
      slug: opts.slug,
      description: opts.description,
      image: opts.image,
      publishedAt: opts.publishedAt,
      updatedAt: opts.updatedAt,
      authorName: opts.authorName,
      keywords: opts.keywords,
    }),
    breadcrumbSchema([
      { name: 'Strona główna', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: opts.title, path: `/blog/${opts.slug}` },
    ]),
  ];

  return buildBlogPostMetadata({
    title: opts.title,
    slug: opts.slug,
    description: opts.description,
    image: opts.image,
    publishedAt: opts.publishedAt,
    updatedAt: opts.updatedAt,
    authorName: opts.authorName,
    keywords: opts.keywords,
    seoTitle: opts.seoTitle,
    seoDescription: opts.seoDescription,
    canonical: opts.canonical,
    noindex: opts.noindex,
    schema,
  });
}

// Re-export commonly used items
export { buildMetadata, buildPageMetadata, getStaticMetadata, STATIC_METADATA, type PageMetadata } from './metadata';
export { SEO_CONFIG, SITE_TOPIC, CORE_INTENTS } from './seo-config';
export { absoluteUrl, canonicalUrl, normalizePath, selfCanonical } from './canonical';
export { KEYWORDS, type KeywordGroup } from './keywords';
export {
  organizationSchema, websiteSchema, breadcrumbSchema, commissionSchema,
  artistSchema, itemListSchema, collectionPageSchema, faqSchema,
  contactPageSchema, articleSchema, blogSchema, webPageSchema,
  imageObjectSchema, serviceSchema,
} from './schema';
export { buildOpenGraph, buildTwitterCard, absoluteDefaultOgImage } from './open-graph';
