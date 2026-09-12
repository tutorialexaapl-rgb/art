import { supabase } from '@/lib/supabase';
import type { BlogPost, BlogPostSummary, BlogContentBlock } from '@/types';

interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: unknown;
  featured_image: string | null;
  author: string;
  category: string;
  tags: string[];
  published_at: string | null;
  updated_at: string;
  seo_title: string | null;
  seo_description: string | null;
  canonical: string | null;
  noindex: boolean;
  schema_type: string;
  reading_time: number;
  status: string;
}

function rowToSummary(row: BlogPostRow): BlogPostSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    featuredImage: row.featured_image ?? undefined,
    author: row.author,
    category: row.category,
    tags: row.tags ?? [],
    publishedAt: row.published_at ?? row.updated_at,
    readingTime: row.reading_time,
  };
}

function rowToPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: (row.content as BlogContentBlock[]) ?? [],
    featuredImage: row.featured_image ?? undefined,
    author: row.author,
    category: row.category,
    tags: row.tags ?? [],
    publishedAt: row.published_at ?? row.updated_at,
    updatedAt: row.updated_at,
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    canonical: row.canonical ?? undefined,
    noindex: row.noindex,
    schemaType: row.schema_type ?? 'Article',
    readingTime: row.reading_time,
    status: row.status as BlogPost['status'],
  };
}

async function getFallbackPosts(): Promise<BlogPostSummary[]> {
  const { getStaticBlogPosts } = await import('@/lib/blogFallback');
  return getStaticBlogPosts();
}

async function getFallbackPost(slug: string): Promise<BlogPost | null> {
  const { getStaticBlogPost } = await import('@/lib/blogFallback');
  return getStaticBlogPost(slug);
}

export const blogService = {
  async getPublishedPosts(limit = 12): Promise<BlogPostSummary[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, featured_image, author, category, tags, published_at, reading_time')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return getFallbackPosts();
    }
    return data.map(rowToSummary);
  },

  async getPostsByCategory(categorySlug: string): Promise<BlogPostSummary[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, featured_image, author, category, tags, published_at, reading_time')
      .eq('status', 'published')
      .eq('category', categorySlug)
      .order('published_at', { ascending: false });

    if (error || !data || data.length === 0) {
      const all = await getFallbackPosts();
      return all.filter((p) => p.category === categorySlug);
    }
    return data.map(rowToSummary);
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error || !data) {
      return getFallbackPost(slug);
    }
    return rowToPost(data as BlogPostRow);
  },

  async getRelatedPosts(currentSlug: string, category: string, tags: string[], limit = 3): Promise<BlogPostSummary[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, featured_image, author, category, tags, published_at, reading_time')
      .eq('status', 'published')
      .neq('slug', currentSlug)
      .or(`category.eq.${category},tags.cs.{${tags.join(',')}}`)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      const all = await getFallbackPosts();
      return all.filter((p) => p.slug !== currentSlug && (p.category === category || p.tags.some((t) => tags.includes(t)))).slice(0, limit);
    }
    return data.map(rowToSummary);
  },
};
