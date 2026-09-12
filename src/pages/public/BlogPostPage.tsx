import { useParams, Link, Navigate } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowRight, Clock, Calendar, User, Tag, Image as ImageIcon, FileText, Users, Palette } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { useBlogPost, useRelatedPosts } from '@/hooks/useBlog';
import { Reveal } from '@/components/ui/Reveal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/ui/States';
import { BlogContentRenderer } from '@/components/features/BlogContentRenderer';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';
import {
  generateBlogPostMetadata,
  getBlogKategoria,
  BLOG_KATEGORIE,
  getStaticMetadata,
} from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import { SeoImage } from '@/components/ui/SeoImage';
import { blogFeaturedAlt } from '@/lib/seo/alt-text';
import type { PageMetadata } from '@/lib/seo';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = useBlogPost(slug ?? '');
  const { posts: relatedPosts } = useRelatedPosts(
    post?.slug ?? '',
    post?.category ?? '',
    post?.tags ?? [],
  );

  const seoData = useMemo<PageMetadata>(() => {
    if (!post) {
      return { ...getStaticMetadata('/blog'), robots: 'noindex, nofollow' };
    }

    const keywords = [
      post.title,
      ...(BLOG_KATEGORIE.find((k) => k.slug === post.category)?.keywords ?? []),
      ...post.tags,
    ];

    return generateBlogPostMetadata({
      title: post.title,
      slug: post.slug,
      description: post.excerpt,
      image: post.featuredImage,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      authorName: post.author,
      keywords,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      canonical: post.canonical,
      noindex: post.noindex,
      schemaType: post.schemaType,
    });
  }, [post]);
  useSeo(seoData);

  if (loading) {
    return (
      <div className="py-12 lg:py-16">
        <div className="container-narrow">
          <LoadingSkeleton className="h-4 w-32" />
          <LoadingSkeleton className="mt-6 h-12 w-3/4" />
          <LoadingSkeleton className="mt-4 h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return <Navigate to="/blog" replace />;
  }

  const kat = getBlogKategoria(post.category);

  return (
    <div>
      <article className="relative overflow-hidden bg-ivory-100 pt-20 pb-16 lg:pt-28 lg:pb-20">
        <div className="container-narrow">
          <Reveal>
            <nav className="flex items-center gap-2 text-xs text-graphite-300">
              <Link to="/" className="hover:text-graphite-500 transition-colors">Strona główna</Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-graphite-500 transition-colors">Blog</Link>
              <span>/</span>
              {kat && (
                <>
                  <Link to={`/blog/kategoria/${post.category}`} className="hover:text-graphite-500 transition-colors">
                    {kat.name}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-graphite-400 truncate max-w-[200px]">{post.title}</span>
            </nav>
          </Reveal>
          <Reveal delay={1}>
            <Badge color="stone" className="mt-6">{kat?.name ?? post.category}</Badge>
          </Reveal>
          <Reveal delay={2}>
            <h1 className="mt-4 font-display text-display text-graphite-600 text-balance">{post.title}</h1>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-graphite-300">
              <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {post.author}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatDate(post.publishedAt)}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.readingTime} min czytania</span>
            </div>
          </Reveal>
          {post.featuredImage && (
            <Reveal delay={4}>
              <figure className="mt-10 overflow-hidden rounded-2xl">
                <SeoImage
                  src={post.featuredImage}
                  alt={blogFeaturedAlt(post.title, post.excerpt)}
                  className="w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              </figure>
            </Reveal>
          )}
        </div>
      </article>

      <section className="py-16 bg-ivory-50">
        <div className="container-narrow">
          <BlogContentRenderer blocks={post.content} excerpt={post.excerpt} />

          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-graphite-300" />
              {post.tags.map((tag) => (
                <Badge key={tag} color="neutral">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="py-16 bg-ivory-100">
          <div className="container-content">
            <Reveal>
              <div className="text-center">
                <p className="section-label">Podobne artykuły</p>
                <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Czytaj też</h2>
              </div>
            </Reveal>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {relatedPosts.map((rp, i) => {
                const rkat = BLOG_KATEGORIE.find((k) => k.slug === rp.category);
                return (
                  <Reveal key={rp.slug} delay={((i % 3) + 1) as 1 | 2 | 3}>
                    <Link to={`/blog/${rp.slug}`} className="card-elegant group block overflow-hidden transition-shadow hover:shadow-lg">
                      <div className="aspect-[16/10] overflow-hidden bg-ivory-300">
                        {rp.featuredImage ? (
                          <SeoImage src={rp.featuredImage} fallbackSrc="/abstract-painting-inspiration.webp" alt={blogFeaturedAlt(rp.title, rp.excerpt)} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-graphite-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        {rkat && <Badge color="stone" className="!px-2 !py-0.5 text-xs">{rkat.name}</Badge>}
                        <h3 className="mt-2 font-display text-base text-graphite-600 group-hover:text-gold-600 transition-colors text-pretty">{rp.title}</h3>
                        <span className="mt-2 inline-flex items-center gap-1 text-xs text-gold-600">Czytaj <ArrowRight className="h-3 w-3" /></span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <InternalLinksGrid
        label="Zobacz też"
        title="Zleć swój obraz"
        links={[
          { href: '/obrazy-na-zamowienie', label: 'Obrazy na zamówienie', description: 'Style, wnętrza, proces zlecania i FAQ.', icon: ImageIcon },
          { href: '/artysci', label: 'Artyści malarze', description: 'Poznaj zweryfikowanych artystów z portfolio i specjalizacjami.', icon: Users },
          { href: '/zamow-obraz', label: 'Zamów obraz', description: 'Załóż konto i opublikuj własne zlecenie na obraz.', icon: FileText },
          { href: '/zlec-obraz', label: 'Jak zlecić obraz', description: 'Przewodnik krok po kroku - od pomysłu do realizacji.', icon: Palette },
        ]}
      />

      <section className="bg-graphite-600 py-16">
        <div className="container-narrow text-center">
          <Reveal>
            <h2 className="font-display text-display text-ivory-100 text-balance">Zleć swój obraz</h2>
            <p className="mx-auto mt-4 max-w-lg text-graphite-200 text-pretty">
              Zainspiruj się i zleć obraz dopasowany do Twojego wnętrza.
            </p>
            <div className="mt-8">
              <Link to="/zamow-obraz">
                <Button variant="gold" size="lg">Zamów obraz <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
