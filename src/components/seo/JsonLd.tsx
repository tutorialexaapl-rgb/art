import { useEffect } from 'react';
import { SEO_CONFIG } from '@/lib/seo';
import {
  organizationSchema, websiteSchema, breadcrumbSchema,
  commissionSchema, artistSchema, faqSchema, contactPageSchema,
  articleSchema, blogSchema, imageObjectSchema,
  itemListSchema, collectionPageSchema, serviceSchema, webPageSchema,
  type Schema,
} from '@/lib/seo';

interface JsonLdProps {
  data: Schema;
}

/** Injects a JSON-LD structured data script into the document head. */
export function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.setAttribute('data-seo-jsonld', 'true');
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [JSON.stringify(data)]);
  return null;
}

/** Render multiple JSON-LD blocks from an array of schema objects. */
export function JsonLdGroup({ schemas }: { schemas: Schema[] }) {
  return (
    <>
      {schemas.map((s, i) => <JsonLd key={i} data={s} />)}
    </>
  );
}

// ─── Homepage ───────────────────────────────────────────────────────────────

/** Organization + WebSite schema for the homepage. */
export function OrganizationJsonLd() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
    </>
  );
}

// ─── Breadcrumbs ────────────────────────────────────────────────────────────

export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  return <JsonLd data={breadcrumbSchema(items)} />;
}

// ─── Blog ───────────────────────────────────────────────────────────────────

export function ArticleJsonLd({
  title, slug, description, image, publishedAt, updatedAt, authorName, keywords,
}: {
  title: string;
  slug: string;
  description: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  keywords?: string[];
}) {
  return (
    <JsonLd
      data={articleSchema({ title, slug, description, image, publishedAt, updatedAt, authorName, keywords })}
    />
  );
}

export function BlogJsonLd() {
  return <JsonLd data={blogSchema()} />;
}

// ─── Artist ─────────────────────────────────────────────────────────────────

export function ArtistJsonLd({
  artistName, slug, bio, styles, techniques, specializations, location,
  avatarUrl, website, instagram, isVerified, portfolioImages,
}: {
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
}) {
  const schemas: Schema[] = [
    artistSchema({ artistName, slug, bio, styles, techniques, specializations, location, avatarUrl, website, instagram, isVerified, portfolioImages }),
    breadcrumbSchema([
      { name: 'Strona główna', path: '/' },
      { name: 'Artyści', path: '/artysci' },
      { name: artistName, path: `/artysci/${slug}` },
    ]),
  ];
  return <JsonLdGroup schemas={schemas} />;
}

// ─── Commission ─────────────────────────────────────────────────────────────

export function CommissionJsonLd({
  title, slug, publicSummary, style, medium, widthCm, heightCm,
  deadline, location, tags, datePublished, dateModified,
}: {
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
}) {
  const schemas: Schema[] = [
    commissionSchema({ title, slug, publicSummary, style, medium, widthCm, heightCm, deadline, location, tags, datePublished, dateModified }),
    breadcrumbSchema([
      { name: 'Strona główna', path: '/' },
      { name: 'Zlecenia', path: '/zlecenia' },
      { name: title, path: `/zlecenia/${slug}` },
    ]),
  ];
  return <JsonLdGroup schemas={schemas} />;
}

// ─── FAQ ────────────────────────────────────────────────────────────────────

export function FaqJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return <JsonLd data={faqSchema(faqs)} />;
}

// ─── Contact ────────────────────────────────────────────────────────────────

export function ContactJsonLd() {
  return <JsonLd data={contactPageSchema()} />;
}

// ─── Listings & categories ──────────────────────────────────────────────────

export function ItemListJsonLd({ name, path, items }: { name: string; path: string; items: { name: string; path: string }[] }) {
  return <JsonLd data={itemListSchema({ name, path, items })} />;
}

export function CollectionPageJsonLd({ name, description, path, items }: { name: string; description: string; path: string; items: { name: string; path: string }[] }) {
  return <JsonLd data={collectionPageSchema({ name, description, path, items })} />;
}

export function ServiceJsonLd({ name, description, path, serviceType }: { name: string; description: string; path: string; serviceType: string }) {
  return <JsonLd data={serviceSchema({ name, description, path, serviceType })} />;
}

export function WebPageJsonLd({ title, description, path }: { title: string; description: string; path: string }) {
  return <JsonLd data={webPageSchema({ title, description, path })} />;
}
