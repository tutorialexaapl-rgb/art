import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ArrowDownWideNarrow, Sparkles, BadgeCheck, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { ArtistCard } from '@/components/features/ArtistCard';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/ui/States';
import { useClientArtistCatalog } from '@/hooks/useClientArtistCatalog';
import { formatCurrency } from '@/lib/utils';
import type { ArtistProfile } from '@/types';

type SortKey = 'rating' | 'newest' | 'portfolio_most' | 'price_low' | 'price_high';

interface FilterState {
  query: string;
  style: string;
  technique: string;
  location: string;
  priceMin: string;
  priceMax: string;
  maxDeliveryDays: string;
  verifiedOnly: string;
}

const initialFilters: FilterState = {
  query: '', style: 'all', technique: 'all', location: 'all',
  priceMin: '', priceMax: '', maxDeliveryDays: '', verifiedOnly: 'all',
};

export function ClientArtysciPage() {
  const { artists, loading, error, refetch } = useClientArtistCatalog();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sort, setSort] = useState<SortKey>('rating');
  const [showFilters, setShowFilters] = useState(false);

  const allStyles = useMemo(
    () => Array.from(new Set(artists.flatMap((a) => a.styles))).sort(),
    [artists]
  );
  const allTechniques = useMemo(
    () => Array.from(new Set(artists.flatMap((a) => a.techniques))).sort(),
    [artists]
  );
  const allLocations = useMemo(
    () => Array.from(new Set(artists.map((a) => a.location))).sort(),
    [artists]
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
    let result = artists.filter((a) => {
      if (filters.query) {
        const q = filters.query.toLowerCase();
        if (!a.artistName.toLowerCase().includes(q) && !a.bio.toLowerCase().includes(q)) return false;
      }
      if (filters.style !== 'all' && !a.styles.includes(filters.style)) return false;
      if (filters.technique !== 'all' && !a.techniques.includes(filters.technique)) return false;
      if (filters.location !== 'all' && a.location !== filters.location) return false;
      if (filters.verifiedOnly === 'yes' && !a.isVerified) return false;
      if (filters.priceMin && a.priceRangeMax < parseInt(filters.priceMin)) return false;
      if (filters.priceMax && a.priceRangeMin > parseInt(filters.priceMax)) return false;
      if (filters.maxDeliveryDays && a.averageDeliveryDays > parseInt(filters.maxDeliveryDays)) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'portfolio_most': return (b.portfolio?.length ?? 0) - (a.portfolio?.length ?? 0);
        case 'price_low': return a.priceRangeMin - b.priceRangeMin;
        case 'price_high': return b.priceRangeMax - a.priceRangeMax;
        default: return b.stats.averageRating - a.stats.averageRating;
      }
    });

    return result;
  }, [artists, filters, sort]);

  const clearAll = () => { setFilters(initialFilters); setSort('rating'); };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Katalog artystów"
        description="Przeglądaj profile zatwierdzonych artystów, ich portfolio i style, aby znaleźć twórcę pasującego do Twojego zlecenia."
      />

      {/* Inspiration banner */}
      <div className="rounded-2xl border border-gold-400/20 bg-gradient-to-br from-gold-50 to-ivory-100 p-6">
        <div className="flex items-start gap-4">
          <Sparkles className="h-6 w-6 shrink-0 text-gold-500" />
          <div>
            <h3 className="font-display text-lg text-graphite-600">Znajdź artystę po stylu</h3>
            <p className="mt-1 text-sm text-graphite-400">
              Każdy artysta ma profil z portfolio, specjalizacjami i orientacyjnymi warunkami. Portfolio służy pokazaniu stylu i jakości prac - to nie jest sklep.
            </p>
          </div>
        </div>
      </div>

      {/* Search + sort + filter toggle */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
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
              <option value="newest">Najnowsi</option>
              <option value="portfolio_most">Najwięcej prac w portfolio</option>
              <option value="price_low">Najniższa cena od</option>
              <option value="price_high">Najwyższa cena do</option>
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

      {/* Filter panel */}
      {showFilters && (
        <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-sm">
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
            <Select label="Weryfikacja" value={filters.verifiedOnly} onChange={(e) => update('verifiedOnly', e.target.value)}>
              <option value="all">Wszyscy artyści</option>
              <option value="yes">Tylko zweryfikowani</option>
            </Select>
            <div>
              <label className="label-elegant">Cena od (PLN)</label>
              <Input type="number" placeholder="0" value={filters.priceMin} onChange={(e) => update('priceMin', e.target.value)} />
            </div>
            <div>
              <label className="label-elegant">Cena do (PLN)</label>
              <Input type="number" placeholder="50000" value={filters.priceMax} onChange={(e) => update('priceMax', e.target.value)} />
            </div>
            <div>
              <label className="label-elegant">Max czas realizacji (dni)</label>
              <Input type="number" placeholder="120" value={filters.maxDeliveryDays} onChange={(e) => update('maxDeliveryDays', e.target.value)} />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-graphite-300">
        <SlidersHorizontal className="h-4 w-4" />
        {loading ? 'Ładowanie...' : `${filtered.length} ${filtered.length === 1 ? 'artysta' : 'artystów'}`}
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Nie udało się pobrać artystów" description={error} onRetry={refetch} />
      ) : filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <div key={a.id} className="space-y-3">
              <ArtistCard artist={a} />
              <ClientArtistCardActions artist={a} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Brak artystów"
          description="Nie znaleziono artystów spełniających kryteria. Spróbuj zmienić filtry."
          action={activeFilterCount > 0 ? <Button variant="secondary" onClick={clearAll}>Wyczyść filtry</Button> : undefined}
        />
      )}
    </div>
  );
}

function ClientArtistCardActions({ artist }: { artist: ArtistProfile }) {
  return (
    <div className="flex gap-2">
      <Link
        to={`/dashboard/client/artysci/${artist.slug}`}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-graphite-400/10 bg-ivory-50 px-4 py-2.5 text-xs font-medium text-graphite-500 transition-colors hover:border-graphite-400/20 hover:text-graphite-600"
      >
        Zobacz profil
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
      <Link
        to="/dashboard/client/zlecenia/nowe"
        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gold-400/20 bg-gold-50 px-4 py-2.5 text-xs font-medium text-gold-600 transition-colors hover:bg-gold-100"
      >
        <Sparkles className="h-3.5 w-3.5" /> Utwórz zlecenie
      </Link>
    </div>
  );
}
