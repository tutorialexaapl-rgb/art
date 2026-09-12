import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ArrowDownWideNarrow, FileText, Palette, Layers, BookOpen } from 'lucide-react';
import { useStaticSeo } from '@/hooks/useSeo';
import { ArtistCard } from '@/components/features/ArtistCard';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/ui/States';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';
import { useArtists } from '@/hooks/useArtists';

type SortKey = 'rating' | 'experience' | 'price_low' | 'price_high' | 'delivery_fast';

interface FilterState {
  query: string;
  style: string;
  technique: string;
  location: string;
  priceMin: string;
  priceMax: string;
  maxDeliveryDays: string;
}

const initialFilters: FilterState = {
  query: '', style: 'all', technique: 'all', location: 'all',
  priceMin: '', priceMax: '', maxDeliveryDays: '',
};

export function ArtysciPage() {
  useStaticSeo('/artysci');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sort, setSort] = useState<SortKey>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const { artists: approvedArtists, loading, error, refetch } = useArtists();

  const allStyles = useMemo(
    () => Array.from(new Set(approvedArtists.flatMap((a) => a.styles))).sort(),
    [approvedArtists]
  );
  const allTechniques = useMemo(
    () => Array.from(new Set(approvedArtists.flatMap((a) => a.techniques))).sort(),
    [approvedArtists]
  );
  const allLocations = useMemo(
    () => Array.from(new Set(approvedArtists.map((a) => a.location))).sort(),
    [approvedArtists]
  );

  const update = (key: keyof FilterState, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([k, v]) => {
      if (k === 'query') return false;
      return v !== 'all' && v !== '';
    }).length;
  }, [filters]);

  const filtered = useMemo(() => {
    let result = approvedArtists.filter((a) => {
      if (filters.query) {
        const q = filters.query.toLowerCase();
        if (!a.artistName.toLowerCase().includes(q) && !a.bio.toLowerCase().includes(q)) return false;
      }
      if (filters.style !== 'all' && !a.styles.includes(filters.style)) return false;
      if (filters.technique !== 'all' && !a.techniques.includes(filters.technique)) return false;
      if (filters.location !== 'all' && a.location !== filters.location) return false;
      if (filters.priceMin && a.priceRangeMax < parseInt(filters.priceMin)) return false;
      if (filters.priceMax && a.priceRangeMin > parseInt(filters.priceMax)) return false;
      if (filters.maxDeliveryDays && a.averageDeliveryDays > parseInt(filters.maxDeliveryDays)) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'experience': return b.yearsExperience - a.yearsExperience;
        case 'price_low': return a.priceRangeMin - b.priceRangeMin;
        case 'price_high': return b.priceRangeMax - a.priceRangeMax;
        case 'delivery_fast': return a.averageDeliveryDays - b.averageDeliveryDays;
        default: return b.stats.averageRating - a.stats.averageRating;
      }
    });

    return result;
  }, [filters, sort, approvedArtists]);

  const clearAll = () => { setFilters(initialFilters); setSort('rating'); };

  return (
    <div className="py-16 lg:py-20">
      <div className="container-content">
        <Reveal>
          <p className="section-label">Galeria artystów</p>
          <h1 className="mt-4 font-display text-display text-graphite-600">Artyści Atelier</h1>
          <p className="mt-4 max-w-xl text-graphite-400 text-pretty">
            Poznaj zweryfikowanych artystów malarzy. Każdy ma profil, portfolio i specjalizacje. Portfolio służy pokazaniu stylu i jakości prac - to nie jest sklep.
          </p>
        </Reveal>

        {/* Search + sort + filter toggle */}
        <Reveal delay={1}>
          <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex-1">
              <Input
                placeholder="Szukaj artystów..."
                value={filters.query}
                onChange={(e) => update('query', e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <ArrowDownWideNarrow className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-graphite-200" />
                <Select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="min-w-[180px]"
                >
                  <option value="rating">Najwyżej oceniani</option>
                  <option value="experience">Najbardziej doświadczeni</option>
                  <option value="price_low">Najniższa cena od</option>
                  <option value="price_high">Najwyższa cena do</option>
                  <option value="delivery_fast">Najszybsza realizacja</option>
                </Select>
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowFilters((s) => !s)}
                className="whitespace-nowrap"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtry
                {activeFilterCount > 0 && (
                  <span className="ml-1 rounded-full bg-gold-400 px-1.5 py-0.5 text-xs font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Filter panel */}
        {showFilters && (
          <Reveal delay={1}>
            <div className="mt-4 rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-graphite-600">Filtry</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1.5 text-xs text-graphite-300 hover:text-error transition-colors"
                  >
                    <X className="h-3.5 w-3.5" /> Wyczyść wszystkie
                  </button>
                )}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Select label="Styl" value={filters.style} onChange={(e) => update('style', e.target.value)}>
                  <option value="all">Wszystkie style</option>
                  {allStyles.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
                <Select label="Technika" value={filters.technique} onChange={(e) => update('technique', e.target.value)}>
                  <option value="all">Wszystkie techniki</option>
                  {allTechniques.map((t) => <option key={t} value={t}>{t}</option>)}
                </Select>
                <Select label="Lokalizacja" value={filters.location} onChange={(e) => update('location', e.target.value)}>
                  <option value="all">Wszystkie lokalizacje</option>
                  {allLocations.map((l) => <option key={l} value={l}>{l}</option>)}
                </Select>
                <div>
                  <label className="label-elegant">Cena od (PLN)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.priceMin}
                    onChange={(e) => update('priceMin', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-elegant">Cena do (PLN)</label>
                  <Input
                    type="number"
                    placeholder="50000"
                    value={filters.priceMax}
                    onChange={(e) => update('priceMax', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-elegant">Max czas realizacji (dni)</label>
                  <Input
                    type="number"
                    placeholder="120"
                    value={filters.maxDeliveryDays}
                    onChange={(e) => update('maxDeliveryDays', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* Result count */}
        <div className="mt-8 flex items-center gap-2 text-sm text-graphite-300">
          <SlidersHorizontal className="h-4 w-4" />
          {loading ? 'Ładowanie...' : `${filtered.length} ${filtered.length === 1 ? 'artysta' : 'artystów'}`}
        </div>

        {/* Grid: loading skeletons, error, empty state, or results */}
        {loading ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-graphite-400/10 bg-ivory-50">
                <div className="grid grid-cols-3 gap-px bg-graphite-400/5">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <LoadingSkeleton key={j} className="aspect-square rounded-none" />
                  ))}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <LoadingSkeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <LoadingSkeleton className="h-4 w-32" />
                      <LoadingSkeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <LoadingSkeleton className="h-6 w-16 rounded-full" />
                    <LoadingSkeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <LoadingSkeleton className="h-3 w-24" />
                    <LoadingSkeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState title="Nie udało się pobrać artystów" description={error} onRetry={refetch} />
        ) : filtered.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a, i) => (
              <Reveal key={a.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <ArtistCard artist={a} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Brak artystów"
            description="Spróbuj zmienić kryteria wyszukiwania lub wyczyść filtry."
            action={
              activeFilterCount > 0 ? (
                <Button variant="secondary" onClick={clearAll}>Wyczyść filtry</Button>
              ) : undefined
            }
          />
        )}
      </div>

      <InternalLinksGrid
        label="Powiązane strony"
        title="Zobacz też"
        links={[
          { href: '/zlecenia', label: 'Otwarte zlecenia', description: 'Przeglądaj zlecenia na obrazy od zlecających szukających artystów.', icon: FileText },
          { href: '/obrazy-na-zamowienie', label: 'Obrazy na zamówienie', description: 'Style, wnętrza, proces zlecania i FAQ.', icon: Palette },
          { href: '/zlec-obraz', label: 'Jak zlecić obraz', description: 'Przewodnik krok po kroku - jak działa zlecanie obrazu.', icon: Layers },
          { href: '/blog/kategoria/poradniki-dla-artystow', label: 'Poradniki dla artystów', description: 'Portfolio, wycena prac, komunikacja ze zlecającymi.', icon: BookOpen },
        ]}
      />
    </div>
  );
}
