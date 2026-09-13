import { useParams, Link, Navigate } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CommissionCard } from '@/components/features/CommissionCard';
import { ArtistCard } from '@/components/features/ArtistCard';
import { LoadingSkeleton } from '@/components/ui/States';
import {
  getObrazKategoria, OBRAZY_KATEGORIE, OBRAZY_WNETRZ,
  KATEGORIA_IMAGES, KATEGORIA_COMMISSIONS,
  buildObrazKategoriaMetadata, collectionPageSchema, breadcrumbSchema,
} from '@/lib/seo';
import { usePublicCommissions } from '@/hooks/usePublicCommissions';
import { useArtists } from '@/hooks/useArtists';
import { SeoImage } from '@/components/ui/SeoImage';
import { SampleCommissionCard } from '@/components/features/SampleCommissionCard';

export function ObrazyKategoriaPage() {
  const { kategoria } = useParams<{ kategoria: string }>();
  const kat = kategoria ? getObrazKategoria(kategoria) : undefined;

  const { commissions, loading: loadingCommissions } = usePublicCommissions();
  const { artists, loading: loadingArtists } = useArtists();

  const matchingCommissions = useMemo(() => {
    if (!kat) return [];
    return commissions.filter((c) =>
      c.style.toLowerCase().includes(kat.slug) ||
      c.tags.some((t) => t.toLowerCase().includes(kat.slug)) ||
      c.title.toLowerCase().includes(kat.slug),
    ).slice(0, 6);
  }, [commissions, kat]);

  const matchingArtists = useMemo(() => {
    if (!kat) return [];
    return artists.filter((a) =>
      a.styles.some((s) => s.toLowerCase().includes(kat.slug)) ||
      a.specializations?.some((s) => s.toLowerCase().includes(kat.slug)),
    ).slice(0, 6);
  }, [artists, kat]);

  const seoData = useMemo(() => {
    if (!kat) return null;
    const items = [
      ...matchingCommissions.map((c) => ({ name: c.title, path: `/zlecenia/${c.slug}` })),
      ...matchingArtists.map((a) => ({ name: a.artistName, path: `/artysci/${a.slug}` })),
    ];
    return buildObrazKategoriaMetadata({
      name: kat.name,
      h1: kat.h1,
      description: kat.description,
      slug: kat.slug,
      keywords: kat.keywords,
      schema: [
        collectionPageSchema({
          name: kat.name,
          description: kat.description,
          path: `/obrazy/${kat.slug}`,
          items,
        }),
        breadcrumbSchema([
          { name: 'Obrazy', path: '/obrazy-na-zamowienie' },
          { name: kat.name, path: `/obrazy/${kat.slug}` },
        ]),
      ],
    });
  }, [kat, matchingCommissions, matchingArtists]);

  if (!kat || !seoData) {
    return <Navigate to="/obrazy-na-zamowienie" replace />;
  }

  useSeo(seoData);

  return (
    <div>
      <section className="relative overflow-hidden bg-ivory-100 pt-20 pb-16 lg:pt-28 lg:pb-20">
        <div className="container-gallery">
          <Reveal>
            <Badge color="gold"><ImageIcon className="h-3 w-3" /> Kategorie obrazów</Badge>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-6 max-w-3xl font-display text-hero text-graphite-600 text-balance">{kat.h1}</h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-8 max-w-2xl text-lg text-graphite-400 text-pretty leading-relaxed">{kat.intro}</p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/zamow-obraz">
                <Button variant="primary" size="lg">Zleć obraz w tym stylu <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              <Link to="/artysci">
                <Button variant="secondary" size="lg">Znajdź artystę</Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {KATEGORIA_IMAGES[kat.slug] && (
        <section className="py-22 bg-ivory-50">
          <div className="container-gallery">
            <Reveal>
              <div className="text-center">
                <p className="section-label">Przykładowe obrazy</p>
                <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Inspiracje · {kat.name.toLowerCase()}</h2>
                <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">
                  Przykładowe prace w tym stylu. Każdy obraz jest tworzony indywidualnie przez artystę malarza.
                </p>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {KATEGORIA_IMAGES[kat.slug].map((img, i) => (
                <Reveal key={img.src} delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <div className="group overflow-hidden rounded-2xl border border-graphite-400/10 bg-ivory-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="aspect-[4/5] overflow-hidden">
                      <SeoImage
                        src={img.src}
                        alt={img.alt}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={2}>
              <div className="mt-10 text-center">
                <Link to="/zamow-obraz">
                  <Button variant="primary" size="lg">Zleć obraz w tym stylu <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {KATEGORIA_COMMISSIONS[kat.slug] && (
        <section className="py-22 bg-ivory-100">
          <div className="container-gallery">
            <Reveal>
              <div className="text-center">
                <p className="section-label">Przykładowe zlecenia</p>
                <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Zlecenia w stylu {kat.name.toLowerCase()}</h2>
                <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">
                  Zobacz, jak wyglądają zlecenia w tym stylu. Każde prowadzi do artystow, ktorzy aplikuja z ofertami.
                </p>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {KATEGORIA_COMMISSIONS[kat.slug].map((c, i) => (
                <Reveal key={c.title} delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <SampleCommissionCard commission={c} />
                </Reveal>
              ))}
            </div>
            <Reveal delay={2}>
              <div className="mt-10 text-center">
                <Link to="/zamow-obraz">
                  <Button variant="primary" size="lg">Opublikuj podobne zlecenie <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {matchingCommissions.length > 0 && (
        <section className="py-22 bg-ivory-50">
          <div className="container-content">
            <Reveal>
              <div className="text-center">
                <p className="section-label">Zlecenia</p>
                <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Otwarte zlecenia - {kat.name.toLowerCase()}</h2>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loadingCommissions ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-graphite-400/10 bg-ivory-50">
                    <LoadingSkeleton className="aspect-[16/10] rounded-none" />
                    <div className="p-6 space-y-3">
                      <LoadingSkeleton className="h-5 w-3/4" />
                      <LoadingSkeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))
              ) : (
                matchingCommissions.map((c, i) => (
                  <Reveal key={c.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                    <CommissionCard commission={c} isPublicPreview />
                  </Reveal>
                ))
              )}
            </div>
            <Reveal delay={2}>
              <div className="mt-8 text-center">
                <Link to="/zlecenia" className="link-underline inline-flex items-center gap-1 text-sm text-graphite-500">
                  Wszystkie zlecenia <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {matchingArtists.length > 0 && (
        <section className="py-22 bg-ivory-100">
          <div className="container-content">
            <Reveal>
              <div className="text-center">
                <p className="section-label">Artyści</p>
                <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Artyści - {kat.name.toLowerCase()}</h2>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loadingArtists ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6">
                    <LoadingSkeleton className="h-10 w-10 rounded-full" />
                    <LoadingSkeleton className="mt-4 h-5 w-32" />
                    <LoadingSkeleton className="mt-2 h-4 w-20" />
                  </div>
                ))
              ) : (
                matchingArtists.map((a, i) => (
                  <Reveal key={a.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                    <ArtistCard artist={a} />
                  </Reveal>
                ))
              )}
            </div>
            <Reveal delay={2}>
              <div className="mt-8 text-center">
                <Link to="/artysci" className="link-underline inline-flex items-center gap-1 text-sm text-graphite-500">
                  Wszyscy artyści <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <section className="py-22 bg-ivory-100">
        <div className="container-content">
          <Reveal>
            <div className="text-center">
              <p className="section-label">Inne kategorie</p>
              <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Zobacz też</h2>
            </div>
          </Reveal>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {OBRAZY_KATEGORIE.filter((k) => k.slug !== kat.slug).map((k) => (
              <Link key={k.slug} to={`/obrazy/${k.slug}`}>
                <Badge color="stone" className="!px-4 !py-2 cursor-pointer hover:bg-ivory-300 transition-colors">{k.name}</Badge>
              </Link>
            ))}
            {OBRAZY_WNETRZ.map((w) => (
              <Link key={w.slug} to={w.path}>
                <Badge color="stone" className="!px-4 !py-2 cursor-pointer hover:bg-ivory-300 transition-colors">{w.name}</Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
