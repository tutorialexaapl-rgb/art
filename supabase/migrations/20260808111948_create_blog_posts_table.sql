/*
# Create blog_posts table with full SEO field system

## Purpose
Professional blog system for the Polish art commission market. Stores articles with
complete SEO metadata: per-article title, description, canonical, noindex control,
schema type, reading time, and structured content (H1/H2/H3, images with ALT, internal links).

## New Tables
- `blog_posts`
  - `id` (uuid, PK)
  - `slug` (text, unique) - URL slug, e.g. "jak-zlecic-obraz-przewodnik"
  - `title` (text) - display title (H1)
  - `excerpt` (text) - short summary for listings and OG description
  - `content` (jsonb) - structured article content: array of blocks
    each block: { type: 'heading'|'paragraph'|'image'|'list', level?, text?, items?, src?, alt?, href? }
  - `featured_image` (text) - URL to hero/featured image
  - `author` (text) - author display name
  - `category` (text) - one of 6 cluster slugs
  - `tags` (text[]) - article tags for filtering and related posts
  - `published_at` (timestamptz) - publication date (null = draft)
  - `updated_at` (timestamptz) - last modification date
  - `seo_title` (text) - custom SEO title (falls back to title)
  - `seo_description` (text) - custom meta description (falls back to excerpt)
  - `canonical` (text) - custom canonical URL override (null = auto /blog/{slug})
  - `noindex` (boolean, default false) - if true, robots = noindex,nofollow
  - `schema_type` (text, default 'Article') - schema.org type: Article, BlogPosting, NewsArticle
  - `reading_time` (integer) - reading time in minutes (auto-calculated on save or manual)
  - `status` (text, default 'draft') - draft, published, archived
  - `created_at` (timestamptz, default now())

## Indexes
- `blog_posts_slug_idx` on slug (unique)
- `blog_posts_category_idx` on category
- `blog_posts_status_published_at_idx` on (status, published_at desc) for listing queries
- `blog_posts_tags_idx` GIN index on tags for tag-based filtering

## Security
- Enable RLS on blog_posts.
- Public read access for published posts (TO anon, authenticated) - blog content is intentionally public.
- Authenticated write access (admin/content managers) for all CRUD operations.
  In a production system, writes would be restricted to admin role via auth metadata,
  but TO authenticated allows the platform's admin panel to manage posts.
*/
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL,
  content jsonb NOT NULL DEFAULT '[]'::jsonb,
  featured_image text,
  author text NOT NULL DEFAULT 'Redakcja Atelier',
  category text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}'::text[],
  published_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  seo_title text,
  seo_description text,
  canonical text,
  noindex boolean NOT NULL DEFAULT false,
  schema_type text NOT NULL DEFAULT 'Article',
  reading_time integer NOT NULL DEFAULT 5,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON blog_posts (category);
CREATE INDEX IF NOT EXISTS blog_posts_status_published_at_idx ON blog_posts (status, published_at DESC);
CREATE INDEX IF NOT EXISTS blog_posts_tags_idx ON blog_posts USING GIN (tags);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_published_blog_posts" ON blog_posts;
CREATE POLICY "anon_read_published_blog_posts"
ON blog_posts FOR SELECT
TO anon, authenticated
USING (status = 'published');

DROP POLICY IF EXISTS "auth_insert_blog_posts" ON blog_posts;
CREATE POLICY "auth_insert_blog_posts"
ON blog_posts FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_blog_posts" ON blog_posts;
CREATE POLICY "auth_update_blog_posts"
ON blog_posts FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_blog_posts" ON blog_posts;
CREATE POLICY "auth_delete_blog_posts"
ON blog_posts FOR DELETE
TO authenticated
USING (true);
