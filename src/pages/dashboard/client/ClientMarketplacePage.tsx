import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ArrowDownWideNarrow, Sparkles, ArrowRight, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { CommissionCard } from '@/components/features/CommissionCard';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/ui/States';
import { useClientMarketplace } from '@/hooks/useClientMarketplace';

type SortKey = 'newest' | 'budget_high' | 'deadline' | 'offers' | 'comments';

interface FilterState {
  query: string;
  status: string;
  style: string;
  budgetMin: string;
  budgetMax: string;
  deadline: string;
  orientation: string;
  roomType: string;
  location: string;
}

const initialFilters: FilterState = {
  query: '', status: 'all', style: 'all',
  budgetMin: '', budgetMax: '', deadline: '',
  orientation: 'all', roomType: 'all', location: 'all',
};

export function ClientMarketplacePage() {
  const { commissions, loading, error, refetch } = useClientMarketplace();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sort, setSort] = useState<SortKey>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const allStyles = useMemo(
    () => Array.from(new Set(commissions.map((c) => c.style).filter(Boolean))).sort(),
    [commissions]
  );
  const allLocations = useMemo(
    () => Array.from(new Set(commissions.map((c) => c.location).filter(Boolean) as string[])).sort(),
    [commissions]
  );
  const allRoomTypes = useMemo(
    () => Array.from(new Set(commissions.map((c) => c.roomType).filter(Boolean) as string[])).sort(),
    [commissions]
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
    let result = commissions.filter((c) => {
      if (filters.query) {
        const q = filters.query.toLowerCase();
        if (!c.title.toLowerCase().includes(q) && !c.publicSummary.toLowerCase().includes(q)) return false;
      }
      if (filters.status !== 'all' && c.status !== filters.status) return false;
      if (filters.style !== 'all' && !c.style.toLowerCase().includes(filters.style.toLowerCase())) return false;
      if (filters.orientation !== 'all' && c.orientation !== filters.orientation) return false;
      if (filters.location !== 'all' && c.location !== filters.location) return false;
      if (filters.roomType !== 'all' && c.roomType !== filters.roomType) return false;
      if (filters.budgetMin && c.budgetMax < parseInt(filters.budgetMin)) return false;
      if (filters.budgetMax && c.budgetMin > parseInt(filters.budgetMax)) return false;
      if (filters.deadline) {
        const cutoff = new Date(filters.deadline);
        const dl = new Date(c.deadline);
        if (dl > cutoff) return false;
      }
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'budget_high':
          return b.budgetMax - a.budgetMax;
        case 'offers':
          return b.offersCount - a.offersCount;
        case 'comments':
          return b.commentsCount - a.commentsCount;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [commissions, filters, sort]);

  const clearAll = () => { setFilters(initialFilters); setSort('newest'); };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Marketplace zleceń"
        description="Zobacz, czego szukają inni zlecający. Inspiruj się przed publikacją własnego briefu."
        action={
          <Link to="/dashboard/client/zlecenia/nowe">
            <Button variant="primary"><Plus className="h-4 w-4" /> Nowe zlecenie</Button>
          </Link>
        }
      />

      {/* Inspiration banner */}
      <div className="rounded-2xl border border-gold-400/20 bg-gradient-to-br from-gold-50 to-ivory-100 p-6">
        <div className="flex items-start gap-4">
          <Sparkles className="h-6 w-6 shrink-0 text-gold-500" />
          <div>
            <h3 className="font-display text-lg text-graphite-600">Zobacz, czego szukają inni</h3>
            <p className="mt-1 text-sm text-graphite-400">
              Przeglądaj opublikowane zlecenia innych zlecających. Zainspiruj się ich briefami i opublikuj podobne zlecenie dopasowane do swoich potrzeb.
            </p>
          </div>
        </div>
      </div>

      {/* Search + sort + filter toggle */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex-1">
          <Input
            placeholder="Szukaj zleceń..."
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
              <option value="newest">Najnowsze</option>
              <option value="budget_high">Najwyższy budżet</option>
              <option value="deadline">Najbliższy termin</option>
              <option value="offers">Najwięcej ofert</option>
              <option value="comments">Najwięcej odpowiedzi</option>
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
            <Select label="Status" value={filters.status} onChange={(e) => update('status', e.target.value)}>
              <option value="all">Wszystkie statusy</option>
              <option value="published">Opublikowane</option>
              <option value="offers_open">Otwarte na oferty</option>
              <option value="in_progress">W realizacji</option>
              <option value="completed">Zakończone</option>
            </Select>
            <Select label="Orientacja" value={filters.orientation} onChange={(e) => update('orientation', e.target.value)}>
              <option value="all">Wszystkie orientacje</option>
              <option value="landscape">Pozioma</option>
              <option value="portrait">Pionowa</option>
              <option value="square">Kwadratowa</option>
            </Select>
            <Select label="Typ wnętrza" value={filters.roomType} onChange={(e) => update('roomType', e.target.value)}>
              <option value="all">Wszystkie pomieszczenia</option>
              {allRoomTypes.map((r) => <option key={r} value={r}>{r}</option>)}
            </Select>
            <Select label="Lokalizacja" value={filters.location} onChange={(e) => update('location', e.target.value)}>
              <option value="all">Wszystkie lokalizacje</option>
              {allLocations.map((l) => <option key={l} value={l}>{l}</option>)}
            </Select>
            <div>
              <label className="label-elegant">Termin do</label>
              <Input
                type="date"
                value={filters.deadline}
                onChange={(e) => update('deadline', e.target.value)}
              />
            </div>
            <div>
              <label className="label-elegant">Budżet min (PLN)</label>
              <Input
                type="number"
                placeholder="0"
                value={filters.budgetMin}
                onChange={(e) => update('budgetMin', e.target.value)}
              />
            </div>
            <div>
              <label className="label-elegant">Budżet max (PLN)</label>
              <Input
                type="number"
                placeholder="50000"
                value={filters.budgetMax}
                onChange={(e) => update('budgetMax', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-graphite-300">
        <SlidersHorizontal className="h-4 w-4" />
        {filtered.length} {filtered.length === 1 ? 'zlecenie' : 'zleceń'}
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-graphite-400/10 bg-ivory-50">
              <LoadingSkeleton className="aspect-[16/10] rounded-none" />
              <div className="p-6 space-y-3">
                <LoadingSkeleton className="h-5 w-3/4" />
                <LoadingSkeleton className="h-4 w-full" />
                <LoadingSkeleton className="h-4 w-2/3" />
                <div className="flex gap-2 pt-2">
                  <LoadingSkeleton className="h-6 w-16 rounded-full" />
                  <LoadingSkeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Nie udało się pobrać zleceń" description={error} onRetry={refetch} />
      ) : filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div key={c.id} className="space-y-3">
              <CommissionCard commission={c} isPublicPreview to={`/dashboard/client/marketplace/${c.slug}`} />
              <Link
                to="/dashboard/client/zlecenia/nowe"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-gold-400/20 bg-gold-50 px-4 py-2.5 text-xs font-medium text-gold-600 transition-colors hover:bg-gold-100"
              >
                <Sparkles className="h-3.5 w-3.5" /> Opublikuj podobne zlecenie
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Brak zleceń w marketplace"
          description="Nie ma obecnie opublikowanych zleceń innych użytkowników. Spróbuj zmienić filtry lub wróć później."
          action={activeFilterCount > 0 ? <Button variant="secondary" onClick={clearAll}>Wyczyść filtry</Button> : undefined}
        />
      )}
    </div>
  );
}
