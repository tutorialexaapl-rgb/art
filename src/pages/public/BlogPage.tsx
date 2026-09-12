import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowRight, Clock, BookOpen, Image as ImageIcon } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Badge } from '@/components/ui/Badge';
import { useSeo } from '@/hooks/useSeo';
import { useBlogPosts } from '@/hooks/useBlog';
import { BLOG_KATEGORIE, blogSchema, breadcrumbSchema, type PageMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

export function BlogPage() {
  const { posts, loading } = useBlogPosts(12);

  const seoData = useMemo<PageMetadata>(() => ({
    title: 'Blog - porady i inspiracje o obrazach na zamówienie | Atelier',
    description: 'Poradniki, inspiracje i przewodniki o obrazach ręcznie malowanych na zamówienie. Dowiedz się, jak zlecić obraz, wybrać artystę i dobrać obraz do wnętrza.',
    canonicalPath: '/blog',
    robots: 'index, follow',
    ogType: 'website',
    keywords: ['obrazy na zamówienie blog', 'porady zlecanie obrazów', 'inspiracje wnętrza obraz', 'jak zlecić obraz', 'obraz do salonu'],
    schema: [
      blogSchema(),
      breadcrumbSchema([
        { name: 'Strona główna', path: '/' },
        { name: 'Blog', path: '/blog' },
      ]),
    ],
  }), []);
  useSeo(seoData);

  return (
    <div>
      <section className="relative overflow-hidden bg-ivory-100 pt-20 pb-16 lg:pt-28 lg:pb-20">
        <div className="container-gallery">
          <Reveal>
            <nav className="flex items-center gap-2 text-xs text-graphite-300">
              <Link to="/" className="hover:text-graphite-500 transition-colors">Strona główna</Link>
              <span>/</span>
              <span className="text-graphite-500">Blog</span>
            </nav>
          </Reveal>
          <Reveal delay={1}>
            <Badge color="gold" className="mt-6"><BookOpen className="h-3 w-3" /> Blog</Badge>
          </Reveal>
          <Reveal delay={2}>
            <h1 className="mt-6 max-w-3xl font-display text-hero text-graphite-600 text-balance">
              Porady i inspiracje <span className="italic text-gold-500">o obrazach na zamówienie</span>
            </h1>
          </Reveal>
          <Reveal delay={3}>
            <p className="mt-8 max-w-xl text-lg text-graphite-400 text-pretty leading-relaxed">
              Przewodniki, poradniki i inspiracje - jak zlecić obraz, jak wybrać artystę, jak dobrać obraz do wnętrza.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-22 bg-ivory-50">
        <div className="container-content">
          <Reveal>
            <div className="text-center">
              <p className="section-label">Kategorie</p>
              <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Tematy bloga</h2>
            </div>
          </Reveal>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {BLOG_KATEGORIE.map((kat) => (
              <Link key={kat.slug} to={`/blog/kategoria/${kat.slug}`}>
                <Badge color="stone" className="!px-4 !py-2 cursor-pointer hover:bg-ivory-300 transition-colors">{kat.name}</Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-22 bg-ivory-100">
        <div className="container-content">
          <Reveal>
            <div className="text-center">
              <p className="section-label">Artykuły</p>
              <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Najnowsze artykuły</h2>
            </div>
          </Reveal>
          {loading ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card-elegant overflow-hidden">
                  <div className="aspect-[16/10] animate-pulse bg-ivory-300" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 w-20 animate-pulse rounded bg-ivory-300" />
                    <div className="h-5 w-full animate-pulse rounded bg-ivory-300" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-ivory-300" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="mt-12 text-center py-16">
              <p className="text-graphite-400">Brak opublikowanych artykułów. Wróć wkrótce.</p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => {
                const kat = BLOG_KATEGORIE.find((k) => k.slug === post.category);
                return (
                  <Reveal key={post.slug} delay={((i % 3) + 1) as 1 | 2 | 3}>
                    <Link to={`/blog/${post.slug}`} className="card-elegant group block overflow-hidden transition-shadow hover:shadow-lg">
                      <div className="aspect-[16/10] overflow-hidden bg-ivory-300">
                        {post.featuredImage ? (
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ImageIcon className="h-10 w-10 text-graphite-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-xs text-graphite-300">
                          {kat && <Badge color="stone" className="!px-2 !py-0.5">{kat.name}</Badge>}
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readingTime} min</span>
                        </div>
                        <h3 className="mt-3 font-display text-lg text-graphite-600 group-hover:text-gold-600 transition-colors text-pretty">{post.title}</h3>
                        <p className="mt-2 text-sm text-graphite-400 text-pretty line-clamp-2">{post.excerpt}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-graphite-300">{formatDate(post.publishedAt)}</span>
                          <span className="inline-flex items-center gap-1 text-xs text-gold-600">Czytaj <ArrowRight className="h-3 w-3" /></span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
