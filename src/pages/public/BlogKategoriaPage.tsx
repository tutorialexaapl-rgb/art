import { useParams, Link, Navigate } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowRight, Clock, Image as ImageIcon } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { useBlogCategory } from '@/hooks/useBlog';
import { Reveal } from '@/components/ui/Reveal';
import { Badge } from '@/components/ui/Badge';
import {
  getBlogKategoria,
  BLOG_KATEGORIE,
  buildBlogKategoriaMetadata,
  collectionPageSchema,
  breadcrumbSchema,
  getStaticMetadata,
} from '@/lib/seo';
import type { PageMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

export function BlogKategoriaPage() {
  const { slug } = useParams<{ slug: string }>();
  const kat = slug ? getBlogKategoria(slug) : undefined;
  const { posts, loading } = useBlogCategory(slug ?? '');

  const seoData = useMemo<PageMetadata>(() => {
    if (!kat) {
      return { ...getStaticMetadata('/blog'), robots: 'noindex, nofollow' };
    }
    return buildBlogKategoriaMetadata({
      name: kat.name,
      title: kat.title,
      description: kat.description,
      slug: kat.slug,
      keywords: kat.keywords,
      schema: [
        collectionPageSchema({
          name: kat.title,
          description: kat.description,
          path: `/blog/kategoria/${kat.slug}`,
          items: posts.map((p) => ({ name: p.title, path: `/blog/${p.slug}` })),
        }),
        breadcrumbSchema([
          { name: 'Strona główna', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: kat.name, path: `/blog/kategoria/${kat.slug}` },
        ]),
      ],
    });
  }, [kat, posts]);
  useSeo(seoData);

  if (!kat) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-ivory-100 pt-20 pb-16 lg:pt-28 lg:pb-20">
        <div className="container-gallery">
          <Reveal>
            <nav className="flex items-center gap-2 text-xs text-graphite-300">
              <Link to="/" className="hover:text-graphite-500 transition-colors">Strona główna</Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-graphite-500 transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-graphite-500">{kat.name}</span>
            </nav>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-6 max-w-3xl font-display text-hero text-graphite-600 text-balance">{kat.title}</h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-8 max-w-xl text-lg text-graphite-400 text-pretty leading-relaxed">{kat.description}</p>
          </Reveal>
        </div>
      </section>

      <section className="py-22 bg-ivory-50">
        <div className="container-content">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-elegant overflow-hidden">
                  <div className="aspect-[16/10] animate-pulse bg-ivory-300" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 w-20 animate-pulse rounded bg-ivory-300" />
                    <div className="h-5 w-full animate-pulse rounded bg-ivory-300" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
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
                        <Badge color="stone" className="!px-2 !py-0.5">{kat.name}</Badge>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readingTime} min</span>
                      </div>
                      <h2 className="mt-3 font-display text-lg text-graphite-600 group-hover:text-gold-600 transition-colors text-pretty">{post.title}</h2>
                      <p className="mt-2 text-sm text-graphite-400 text-pretty line-clamp-2">{post.excerpt}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-graphite-300">{formatDate(post.publishedAt)}</span>
                        <span className="inline-flex items-center gap-1 text-xs text-gold-600">Czytaj <ArrowRight className="h-3 w-3" /></span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-graphite-400">Brak artykułów w tej kategorii. Wróć wkrótce.</p>
              <Link to="/blog" className="mt-4 inline-flex items-center gap-1 text-sm text-gold-600">
                Wszystkie artykuły <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-ivory-100">
        <div className="container-content">
          <Reveal>
            <div className="text-center">
              <p className="section-label">Inne kategorie</p>
              <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Zobacz też</h2>
            </div>
          </Reveal>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {BLOG_KATEGORIE.filter((k) => k.slug !== kat.slug).map((k) => (
              <Link key={k.slug} to={`/blog/kategoria/${k.slug}`}>
                <Badge color="stone" className="!px-4 !py-2 cursor-pointer hover:bg-ivory-300 transition-colors">{k.name}</Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
