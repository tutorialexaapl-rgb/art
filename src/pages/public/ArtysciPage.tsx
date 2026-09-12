import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ArrowDownWideNarrow, FileText, Palette, Layers, BookOpen, ChevronDown, Wallet, Clock } from 'lucide-react';
import { useStaticSeo } from '@/hooks/useSeo';
import { ArtistCard } from '@/components/features/ArtistCard';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/ui/States';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';
import { useArtists } from '@/hooks/useArtists';
import { formatCurrency } from '@/lib/utils';
import { PAINTING_STYLES } from '@/lib/seo';

type SortKey = 'rating' | 'experience' | 'price_low' | 'price_high' | 'delivery_fast';

interface FilterState {
  query: string;
  styles: string[];
  techniques: string[];
  locations: string[];
  priceMin: string;
  priceMax: string;
  maxDeliveryDays: string;
}

const initialFilters: FilterState = {
  query: '', styles: [], techniques: [], locations: [],
  priceMin: '', priceMax: '', maxDeliveryDays: '',
};

const PRICE_PRESETS = [
  { label: 'Poniżej 1 000 zł', min: '0', max: '1000' },
  { label: '1 000 – 3 000 zł', min: '1000', max: '3000' },
  { label: '3 000 – 5 000 zł', min: '3000', max: '5000' },
  { label: '5 000 – 10 000 zł', min: '5000', max: '10000' },
  { label: 'Powyżej 10 000 zł', min: '10000', max: '' },
];

const PAINTING_TECHNIQUES = [
  'Akryl',
  'Akwarela',
  'Olej',
  'Mixed media',
  'Pasta strukturalna',
  'Płótno lniane',
  'Struktura',
  'Szpachla',
];

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-graphite-400/10 pb-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-display text-sm font-medium uppercase tracking-wide text-graphite-500">
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-graphite-300 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'mt-3 max-h-[500px] opacity-100' : 'mt-0 max-h-0 opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );
}

function CheckboxOption({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-graphite-400 transition-colors hover:text-graphite-600">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
          checked
            ? 'border-gold-400 bg-gold-400'
            : 'border-graphite-300 bg-transparent hover:border-graphite-400'
        }`}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none">
            <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-graphite-200">{count}</span>
      )}
    </label>
  );
}

function SidebarFilters({
  filters,
  setFilters,
  allStyles,
  allTechniques,
  approvedArtists,
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  allStyles: string[];
  allTechniques: string[];
  approvedArtists: ReturnType<typeof useArtists>['artists'];
}) {
  const toggleArray = (key: 'styles' | 'techniques' | 'locations', value: string) => {
    setFilters((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const activePricePreset = PRICE_PRESETS.find(
    (p) => p.min === filters.priceMin && p.max === filters.priceMax
  );

  const countArtistsByStyle = (style: string) =>
    approvedArtists.filter((a) => a.styles.includes(style)).length;
  const countArtistsByTechnique = (tech: string) =>
    approvedArtists.filter((a) => a.techniques.includes(tech)).length;

  return (
    <div className="space-y-5">
      {/* Price range */}
      <FilterSection title="Cena">
        <div className="space-y-1">
          {PRICE_PRESETS.map((p) => {
            const isActive = activePricePreset?.label === p.label;
            return (
              <label
                key={p.label}
                className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-graphite-400 transition-colors hover:text-graphite-600"
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                    isActive ? 'border-gold-400 bg-gold-400' : 'border-graphite-300 bg-transparent hover:border-graphite-400'
                  }`}
                >
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
                <input
                  type="radio"
                  name="price-preset"
                  checked={isActive}
                  onChange={() =>
                    setFilters((prev) => ({ ...prev, priceMin: p.min, priceMax: p.max }))
                  }
                  className="sr-only"
                />
                {p.label}
              </label>
            );
          })}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="od"
            value={filters.priceMin}
            onChange={(e) => setFilters((prev) => ({ ...prev, priceMin: e.target.value }))}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="do"
            value={filters.priceMax}
            onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: e.target.value }))}
            className="text-sm"
          />
        </div>
      </FilterSection>

      {/* Styles */}
      <FilterSection title="Styl artystyczny">
        <div className="space-y-0.5">
          {allStyles.map((s) => (
            <CheckboxOption
              key={s}
              label={s}
              checked={filters.styles.includes(s)}
              onChange={() => toggleArray('styles', s)}
              count={countArtistsByStyle(s)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Technika">
        <div className="space-y-0.5">
          {allTechniques.map((t) => (
            <CheckboxOption
              key={t}
              label={t}
              checked={filters.techniques.includes(t)}
              onChange={() => toggleArray('techniques', t)}
              count={countArtistsByTechnique(t)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Delivery time */}
      <FilterSection title="Czas realizacji" defaultOpen={false}>
        <div>
          <label className="text-xs text-graphite-300">Maksymalnie dni</label>
          <Input
            type="number"
            placeholder="np. 30"
            value={filters.maxDeliveryDays}
            onChange={(e) => setFilters((prev) => ({ ...prev, maxDeliveryDays: e.target.value }))}
            className="mt-1 text-sm"
          />
        </div>
      </FilterSection>
    </div>
  );
}

export function ArtysciPage() {
  useStaticSeo('/artysci');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sort, setSort] = useState<SortKey>('rating');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { artists: approvedArtists, loading, error, refetch } = useArtists();

  const allStyles = PAINTING_STYLES;
  const allTechniques = PAINTING_TECHNIQUES;

  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += filters.styles.length;
    count += filters.techniques.length;
    count += filters.locations.length;
    if (filters.priceMin) count++;
    if (filters.priceMax) count++;
    if (filters.maxDeliveryDays) count++;
    return count;
  }, [filters]);

  const filtered = useMemo(() => {
    let result = approvedArtists.filter((a) => {
      if (filters.query) {
        const q = filters.query.toLowerCase();
        if (!a.artistName.toLowerCase().includes(q) && !a.bio.toLowerCase().includes(q)) return false;
      }
      if (filters.styles.length > 0 && !filters.styles.some((s) => a.styles.includes(s))) return false;
      if (filters.techniques.length > 0 && !filters.techniques.some((t) => a.techniques.includes(t))) return false;
      if (filters.locations.length > 0 && !filters.locations.includes(a.location)) return false;
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

  const sidebarProps = {
    filters,
    setFilters,
    allStyles,
    allTechniques,
    approvedArtists,
  };

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
      </div>

      {/* Layout: sidebar + content */}
      <div className="mt-10 lg:flex lg:gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-72 shrink-0 lg:block lg:pl-12 xl:pl-20 2xl:pl-32">
            <div className="sticky top-24">
              <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-sm">
                <div className="flex items-center justify-between pb-5">
                  <h3 className="flex items-center gap-2 font-display text-lg text-graphite-600">
                    <SlidersHorizontal className="h-4 w-4 text-gold-500" />
                    Filtry
                  </h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAll}
                      className="flex items-center gap-1 text-xs text-graphite-300 transition-colors hover:text-error"
                    >
                      <X className="h-3.5 w-3.5" /> Wyczyść
                    </button>
                  )}
                </div>
                <SidebarFilters {...sidebarProps} />
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0 flex-1 px-6 sm:px-8 lg:px-0 lg:pr-12 lg:max-w-[864px]">
            {/* Search + sort + mobile filter toggle */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <Input
                  placeholder="Szukaj artystów..."
                  value={filters.query}
                  onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
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
                  onClick={() => setMobileFiltersOpen(true)}
                  className="whitespace-nowrap lg:hidden"
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

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {filters.styles.map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, styles: prev.styles.filter((v) => v !== s) }))
                    }
                    className="flex items-center gap-1.5 rounded-full border border-graphite-400/15 bg-ivory-50 px-3 py-1 text-xs text-graphite-400 transition-colors hover:border-error/30 hover:text-error"
                  >
                    {s} <X className="h-3 w-3" />
                  </button>
                ))}
                {filters.techniques.map((t) => (
                  <button
                    key={t}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, techniques: prev.techniques.filter((v) => v !== t) }))
                    }
                    className="flex items-center gap-1.5 rounded-full border border-graphite-400/15 bg-ivory-50 px-3 py-1 text-xs text-graphite-400 transition-colors hover:border-error/30 hover:text-error"
                  >
                    {t} <X className="h-3 w-3" />
                  </button>
                ))}
                {filters.locations.map((l) => (
                  <button
                    key={l}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, locations: prev.locations.filter((v) => v !== l) }))
                    }
                    className="flex items-center gap-1.5 rounded-full border border-graphite-400/15 bg-ivory-50 px-3 py-1 text-xs text-graphite-400 transition-colors hover:border-error/30 hover:text-error"
                  >
                    {l} <X className="h-3 w-3" />
                  </button>
                ))}
                {(filters.priceMin || filters.priceMax) && (
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, priceMin: '', priceMax: '' }))}
                    className="flex items-center gap-1.5 rounded-full border border-graphite-400/15 bg-ivory-50 px-3 py-1 text-xs text-graphite-400 transition-colors hover:border-error/30 hover:text-error"
                  >
                    {filters.priceMin && filters.priceMax
                      ? `${formatCurrency(parseInt(filters.priceMin))} – ${formatCurrency(parseInt(filters.priceMax))}`
                      : filters.priceMin
                        ? `od ${formatCurrency(parseInt(filters.priceMin))}`
                        : `do ${formatCurrency(parseInt(filters.priceMax))}`}
                    <X className="h-3 w-3" />
                  </button>
                )}
                {filters.maxDeliveryDays && (
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, maxDeliveryDays: '' }))}
                    className="flex items-center gap-1.5 rounded-full border border-graphite-400/15 bg-ivory-50 px-3 py-1 text-xs text-graphite-400 transition-colors hover:border-error/30 hover:text-error"
                  >
                    <Clock className="h-3 w-3" /> do {filters.maxDeliveryDays} dni <X className="h-3 w-3" />
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="text-xs text-graphite-300 underline transition-colors hover:text-error"
                >
                  Wyczyść wszystkie
                </button>
              </div>
            )}

            {/* Result count */}
            <div className="mt-6 flex items-center gap-2 text-sm text-graphite-300">
              <Wallet className="h-4 w-4" />
              {loading ? 'Ładowanie...' : `${filtered.length} ${filtered.length === 1 ? 'artysta' : 'artystów'}`}
            </div>

            {/* Grid */}
            {loading ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
        </div>

      {/* Mobile filter drawer */}
      <Drawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Filtry"
        side="left"
      >
        <div className="flex items-center justify-between pb-4">
          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs text-graphite-300 transition-colors hover:text-error"
            >
              <X className="h-3.5 w-3.5" /> Wyczyść wszystkie
            </button>
          )}
        </div>
        <SidebarFilters {...sidebarProps} />
        <div className="mt-6">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => setMobileFiltersOpen(false)}
          >
            Pokaż {filtered.length} {filtered.length === 1 ? 'artystę' : 'artystów'}
          </Button>
        </div>
      </Drawer>

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
